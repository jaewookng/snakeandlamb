import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface Node {
  position: THREE.Vector3;
  mesh: THREE.Mesh;
  connections: number[];
}

function App() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x111111)
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 15

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    mountRef.current.appendChild(renderer.domElement)

    // Node creation with random positions
    const nodes: Node[] = []
    const nodeGeometry = new THREE.SphereGeometry(0.3, 32, 32)
    const nodeMaterial = new THREE.MeshPhongMaterial({ color: 0xf4cccc })
    const linesMaterial = new THREE.LineBasicMaterial({ 
      color: 0xf4cccc, 
      opacity: 0.3, 
      transparent: true 
    })

    // Create nodes with random positions within a sphere
    const nodeCount = 20
    const radius = 8
    for (let i = 0; i < nodeCount; i++) {
      // Random position within a sphere
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = radius * Math.cbrt(Math.random()) // Cube root for more uniform distribution
      
      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = r * Math.sin(phi) * Math.sin(theta)
      const z = r * Math.cos(phi)
      
      const mesh = new THREE.Mesh(nodeGeometry, nodeMaterial)
      mesh.position.set(x, y, z)
      
      nodes.push({
        position: new THREE.Vector3(x, y, z),
        mesh,
        connections: []
      })
      scene.add(mesh)
    }

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

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)
    const pointLight = new THREE.PointLight(0xffffff, 1)
    pointLight.position.set(10, 10, 10)
    scene.add(pointLight)

    // Animation
    function animate() {
      requestAnimationFrame(animate)

      // Animate nodes with more random movement
      nodes.forEach((node, i) => {
        const time = Date.now() * 0.001
        const offset = i * 0.5 // Different offset for each node
        
        // Apply subtle random movement in all directions
        node.mesh.position.x += Math.sin(time * 0.5 + offset) * 0.01
        node.mesh.position.y += Math.cos(time * 0.7 + offset) * 0.01
        node.mesh.position.z += Math.sin(time * 0.3 + offset) * 0.01

        // Keep nodes within bounds
        const pos = node.mesh.position
        const bounds = radius * 1.2
        if (pos.length() > bounds) {
          pos.normalize().multiplyScalar(bounds)
        }

        node.position.copy(node.mesh.position)
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
      window.removeEventListener('resize', handleResize)
      mountRef.current?.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <>
      <div style={{
        position: 'fixed',
        top: '20px',
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
      <div ref={mountRef}></div>
    </>
  )
}

export default App
