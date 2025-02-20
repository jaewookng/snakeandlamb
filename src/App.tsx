import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { PasswordScreen } from './components/PasswordScreen'

interface PageData {
  title: string;
  date: string;
  preview: string;
  url: string;
}

interface Node {
  position: THREE.Vector3;
  mesh: THREE.Mesh;
  connections: number[];
  pageData: PageData;
}

function createPageTexture(pageData: PageData) {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')!
  
  // Background
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, 256, 256)
  
  // Title
  ctx.fillStyle = '#000000'
  ctx.font = 'bold 24px Arial'
  ctx.fillText(pageData.title, 20, 40, 216)
  
  // Date
  ctx.font = '16px Arial'
  ctx.fillStyle = '#666666'
  ctx.fillText(pageData.date, 20, 70, 216)
  
  // Preview text
  ctx.font = '14px Arial'
  ctx.fillStyle = '#333333'
  const words = pageData.preview.split(' ')
  let line = ''
  let y = 100
  words.forEach(word => {
    const testLine = line + word + ' '
    if (ctx.measureText(testLine).width > 216) {
      ctx.fillText(line, 20, y)
      line = word + ' '
      y += 20
    } else {
      line = testLine
    }
  })
  ctx.fillText(line, 20, y)

  return new THREE.CanvasTexture(canvas)
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isAuthenticated || !mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x111111)
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0, -2, 15) // Added Y offset

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    mountRef.current.appendChild(renderer.domElement)

    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.rotateSpeed = 0.5
    controls.enableZoom = true
    controls.minDistance = 5
    controls.maxDistance = 30
    controls.target.set(0, -2, 0)

    // Sample page data with URLs
    const pages: PageData[] = [
      { 
        title: 'Vday Invitation',
        date: '10.02.2025',
        preview: 'When I asked Minjoo to be my valentine',
        url: 'https://vdayinv.netlify.app'
      },
      { 
        title: 'Coming Soon..',
        date: 'Coming Soon..',
        preview: 'Coming Soon..',
        url: ''
      },
      { 
        title: 'Media Night',
        date: '14.02.2025',
        preview: 'Overcooked!',
        url: 'https://medianight.netlify.app'
      },
    ]

    // Node creation with page previews
    const nodes: Node[] = []
    const nodeGeometry = new THREE.PlaneGeometry(2, 2) // Larger size for readability
    const radius = 10 // Define sphere radius for node positioning
    
    pages.forEach((pageData) => {
      const texture = createPageTexture(pageData)
      const nodeMaterial = new THREE.MeshBasicMaterial({ 
        map: texture,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide
      })
      
      // Random position within a sphere
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = radius * Math.cbrt(Math.random()) // Cube root for more uniform distribution
      
      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = (r * Math.sin(phi) * Math.sin(theta)) - 2 // Offset Y position
      const z = r * Math.cos(phi)
      
      const mesh = new THREE.Mesh(nodeGeometry, nodeMaterial)
      mesh.position.set(x, y, z)
      
      nodes.push({
        position: new THREE.Vector3(x, y, z),
        mesh,
        connections: [],
        pageData
      })
      scene.add(mesh)
    })

    // Connect nodes to their nearest neighbors
    nodes.forEach((node, i) => {
      // Calculate distances to all other nodes
      const distances = nodes
        .map((otherNode, index) => ({
          index,
          distance: node.position.distanceTo(otherNode.position)
        }))
        .filter(d => d.index !== i) // Remove self
        .sort((a, b) => a.distance - b.distance) // Sort by distance

      // Connect to the 3 nearest nodes
      node.connections = distances
        .slice(0, 3)
        .map(d => d.index)
    })

    // Create connections
    const connectionsGroup = new THREE.Group()
    scene.add(connectionsGroup)

    const linesMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.5, transparent: true })

    function updateConnections() {
      // Remove old connections
      while(connectionsGroup.children.length) {
        connectionsGroup.remove(connectionsGroup.children[0])
      }

      // Create new connections
      nodes.forEach((node) => {
        node.connections.forEach(connectionIndex => {
          const geometry = new THREE.BufferGeometry().setFromPoints([
            node.position,
            nodes[connectionIndex].position
          ])
          const line = new THREE.Line(geometry, linesMaterial)
          connectionsGroup.add(line)
        })
      })
    }
    updateConnections()

    // Add raycaster for click detection
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    // Click handler
    const handleClick = (event: MouseEvent) => {
      const rect = mountRef.current?.getBoundingClientRect()
      if (!rect) return

      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(nodes.map(n => n.mesh))

      if (intersects.length > 0) {
        const clickedNode = nodes.find(n => n.mesh === intersects[0].object)
        if (clickedNode?.pageData.url) {
          window.open(clickedNode.pageData.url, '_blank')
        }
      }
    }

    // Hover handler for cursor change
    const handleMouseMove = (event: MouseEvent) => {
      const rect = mountRef.current?.getBoundingClientRect()
      if (!rect) return

      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(nodes.map(n => n.mesh))

      mountRef.current!.style.cursor = intersects.length > 0 ? 'pointer' : 'default'
    }

    mountRef.current.addEventListener('click', handleClick)
    mountRef.current.addEventListener('mousemove', handleMouseMove)

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)
    const pointLight = new THREE.PointLight(0xffffff, 1)
    pointLight.position.set(10, 10, 10)
    scene.add(pointLight)

    // Animation
    function animate() {
      requestAnimationFrame(animate)

      // Update controls
      controls.update()

      // Make nodes face camera
      nodes.forEach((node) => {
        node.mesh.lookAt(camera.position)
        
        // Animate nodes with slower movement
        nodes.forEach((node, i) => {
          const time = Date.now() * 0.0005 // Reduced from 0.001
          const offset = i * 0.2 // Reduced from 0.5
          
          // Reduced movement factors from 0.01 to 0.002
          node.mesh.position.x += Math.sin(time * 0.3 + offset) * 0.002
          node.mesh.position.y += Math.cos(time * 0.4 + offset) * 0.002
          node.mesh.position.z += Math.sin(time * 0.2 + offset) * 0.002

          // Keep nodes within bounds
          const pos = node.mesh.position
          const bounds = radius * 1.2
          if (pos.length() > bounds) {
            pos.normalize().multiplyScalar(bounds)
          }

          node.position.copy(node.mesh.position)
        })
      })

      updateConnections()
      renderer.render(scene, camera)
    }
    animate()

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      controls.dispose()
      window.removeEventListener('resize', handleResize)
      mountRef.current?.removeChild(renderer.domElement)
      mountRef.current?.removeEventListener('click', handleClick)
      mountRef.current?.removeEventListener('mousemove', handleMouseMove)
    }
  }, [isAuthenticated]) // Add isAuthenticated as dependency

  return (
    <>
      {!isAuthenticated ? (
        <PasswordScreen onCorrectPassword={() => setIsAuthenticated(true)} />
      ) : (
        <div style={{
          position: 'fixed',
          top: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '2rem',
          zIndex: 1000,
          display: 'flex',
          gap: '1rem',
          background: 'rgba(0, 0, 0, 0)',
          padding: '10px 20px',
          borderRadius: '20px',
        }}>
          <span role="img" aria-label="snake">🐍</span>
          <span role="img" aria-label="lamb">🐑</span>
        </div>
      )}
      <div 
        ref={mountRef} 
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: isAuthenticated ? 'auto' : 'none',
          opacity: isAuthenticated ? 1 : 0,
        }} 
      />
    </>
  )
}

export default App
