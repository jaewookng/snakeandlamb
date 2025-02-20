import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

interface Node {
  position: THREE.Vector3;
  mesh: THREE.Mesh;
  connections: number[];
  pageData: {
    title: string;
    date: string;
    preview: string;
    url: string;
  };
}
import { PasswordScreen } from './components/PasswordScreen'
import Earth from './components/Earth'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const mountRef = useRef<HTMLDivElement>(null)

  const calculateDays = () => {
    const startDate = new Date('2024-11-07')
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - startDate.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  useEffect(() => {
    if (!isAuthenticated || !mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x111111)
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0, -2, 15)

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

    // Sample page data
    const pages = [
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
    const nodeGeometry = new THREE.PlaneGeometry(2, 2)
    const radius = 10
    
    pages.forEach((pageData) => {
      const texture = createPageTexture(pageData)
      const nodeMaterial = new THREE.MeshBasicMaterial({ 
        map: texture,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide
      })
      
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = radius * Math.cbrt(Math.random())
      
      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = (r * Math.sin(phi) * Math.sin(theta)) - 2
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

    // Connect nodes
    nodes.forEach((node, i) => {
      const distances = nodes
        .map((otherNode, index) => ({
          index,
          distance: node.position.distanceTo(otherNode.position)
        }))
        .filter(d => d.index !== i)
        .sort((a, b) => a.distance - b.distance)

      node.connections = distances.slice(0, 3).map(d => d.index)
    })

    // Create connections
    const connectionsGroup = new THREE.Group()
    scene.add(connectionsGroup)
    const linesMaterial = new THREE.LineBasicMaterial({ 
      color: 0xffffff, 
      opacity: 0.5, 
      transparent: true 
    })

    function updateConnections() {
      while(connectionsGroup.children.length) {
        connectionsGroup.remove(connectionsGroup.children[0])
      }

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

    // Animation
    function animate() {
      requestAnimationFrame(animate)
      controls.update()

      nodes.forEach((node) => {
        node.mesh.lookAt(camera.position)
        
        nodes.forEach((node, i) => {
          const time = Date.now() * 0.0005
          const offset = i * 0.2
          
          node.mesh.position.x += Math.sin(time * 0.3 + offset) * 0.002
          node.mesh.position.y += Math.cos(time * 0.4 + offset) * 0.002
          node.mesh.position.z += Math.sin(time * 0.2 + offset) * 0.002

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

    // Add raycaster for interaction
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

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
    }
  }, [isAuthenticated])

  return (
    <>
      {!isAuthenticated ? (
        <PasswordScreen onCorrectPassword={() => setIsAuthenticated(true)} />
      ) : (
        <>
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
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '40px',
            transform: 'translateY(-50%)',
            zIndex: 1000,
            color: 'white',
            textAlign: 'center',
            background: 'rgba(0, 0, 0, 0)',
            padding: '20px',
            borderRadius: '10px',
            fontFamily: 'Arial, sans-serif'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>
              +{calculateDays()} ❤️
            </div>
          </div>
          <div style={{
            position: 'fixed',
            top: '50%',
            right: '20px',
            transform: 'translateY(-50%)',
            zIndex: 1000,
            background: 'transparent',
            width: '200px',
            height: '200px',
            marginRight: '10px'
          }}>
            <Earth />
          </div>
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
      )}
    </>
  )
}

export default App

function createPageTexture(pageData: { title: string; date: string; preview: string; url: string; }): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext('2d')!;

  // Set background
  context.fillStyle = '#2a2a2a';
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Set text properties
  context.fillStyle = 'white';
  context.textAlign = 'center';

  // Draw title
  context.font = 'bold 48px Arial';
  context.fillText(pageData.title, canvas.width/2, 160);

  // Draw date
  context.font = '32px Arial';
  context.fillText(pageData.date, canvas.width/2, 220);

  // Draw preview
  context.font = '24px Arial';
  context.fillText(pageData.preview, canvas.width/2, 280);

  return new THREE.CanvasTexture(canvas);
}

