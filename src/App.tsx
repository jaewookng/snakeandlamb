import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { FeedbackModal } from './components/FeedbackModal'

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
  defaultTexture: THREE.Texture;
  hoverTexture: THREE.Texture;
}

interface PageData {
  title: string;
  date: string;
  preview: string;
  url: string;
  image: string;
}


import { PasswordScreen } from './components/PasswordScreen'
import Earth from './components/Earth'
import { AnkiDeckDownload } from './components/AnkiDeckDownload'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [showAnkiDownload, setShowAnkiDownload] = useState(false)
  const mountRef = useRef<HTMLDivElement>(null)

  const calculateDays = () => {
    const startDate = new Date('2024-11-07')
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - startDate.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const handleDeckDownload = () => {
    const link = document.createElement('a')
    link.href = '/Anatomy__KIN424.apkg'
    link.download = 'Anatomy__KIN424.apkg'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
    const pages: PageData[] = [
      { 
        title: 'Vday Invitation',
        date: '10.02.2025',
        preview: 'When I asked Minjoo to be my valentine',
        url: 'https://vdayinv.netlify.app',
        image: './vdayinv.png'
      },
      { 
        title: '신기했던 인생네컷',
        date: '16.01.2025',
        preview: 'I liked this one',
        url: '',
        image: './booth.jpeg'
      },
      { 
        title: 'Media Night',
        date: '14.02.2025',
        preview: 'Overcooked!',
        url: 'https://medianight.netlify.app',
        image: './medianight.png'
      },
      { 
        title: 'Itaewon',
        date: '19.01.2025',
        preview: 'Pubbing!!',
        url: '',
        image: './itaewon.JPG'
      },
      {
        title: 'e-dating',
        date: '14.02.2025',
        preview: 'chef and sous chef',
        url: '',
        image: './overcook.png'
      },
      { 
        title: "je t'aime",
        date: '23.03.2025',
        preview: 'I love you',
        url: '',
        image: './buttes_chaumont.jpg'
      },
      {
        title: 'best pizza',
        date: '23.03.2025',
        preview: 'Casa di Marco',
        url: '',
        image: './casadimarco.jpg'
      }
    ]

    // Node creation with page previews
    const nodes: Node[] = []
    const nodeGeometry = new THREE.PlaneGeometry(2, 2)
    const radius = 10
    
    // Promise array to track all texture loading
    const texturePromises = pages.map(async (pageData) => {
      const texture = await createPageTexture(pageData)
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
      
      const node = {
        position: new THREE.Vector3(x, y, z),
        mesh,
        connections: [],
        pageData,
        defaultTexture: texture,
        hoverTexture: texture
      }
      
      nodes.push(node)
      scene.add(mesh)
    })

    // Wait for all textures to load before creating connections
    Promise.all(texturePromises).then(() => {
      // Create connections
      nodes.forEach((node, i) => {
        const distances = nodes
          .map((otherNode, index) => ({
            index,
            distance: node.position.distanceTo(otherNode.position)
          }))
          .filter(d => d.index !== i)
          .sort((a, b) => a.distance - b.distance)

        node.connections = distances.slice(0, 2).map(d => d.index)
      })

      // Create connection lines
      const linesMaterial = new THREE.LineBasicMaterial({ 
        color: 0xffffff, 
        opacity: 0.3, 
        transparent: true,
        linewidth: 1
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

      updateConnections()
    })

    // Create connections
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
      const rect = mountRef.current?.getBoundingClientRect();
      if (!rect) return;
    
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodes.map(n => n.mesh));
    
      if (intersects.length > 0) {
        const clickedNode = nodes.find(n => n.mesh === intersects[0].object);
        if (clickedNode?.pageData.url) {
          window.open(clickedNode.pageData.url, '_blank');
        }
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!mountRef.current) return;
      const rect = mountRef.current.getBoundingClientRect();
    
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodes.map(n => n.mesh));
    
      if (intersects.length > 0) {
        const hoveredNode = nodes.find(n => n.mesh === intersects[0].object);
        if (hoveredNode) {
          (hoveredNode.mesh.material as THREE.MeshBasicMaterial).map = hoveredNode.hoverTexture;
          (hoveredNode.mesh.material as THREE.MeshBasicMaterial).needsUpdate = true;
          mountRef.current!.style.cursor = 'pointer';
        }
      } else {
        nodes.forEach(node => {
          (node.mesh.material as THREE.MeshBasicMaterial).map = node.defaultTexture;
          (node.mesh.material as THREE.MeshBasicMaterial).needsUpdate = true;
        });
        mountRef.current!.style.cursor = 'default';
      }
    };

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
            fontSize: '2.2rem',
            zIndex: 1000,
            display: 'flex',
            gap: '1.2rem',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04))',
            backdropFilter: 'blur(15px) saturate(150%)',
            WebkitBackdropFilter: 'blur(15px) saturate(150%)',
            padding: '12px 24px',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 3px rgba(255, 255, 255, 0.1)',
            animation: 'slideDown 0.6s ease'
          }}>
            <span role="img" aria-label="snake" style={{ filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }}>🐍</span>
            <span role="img" aria-label="lamb" style={{ filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }}>🐑</span>
          </div>
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '40px',
            transform: 'translateY(-50%)',
            zIndex: 1000,
            color: 'rgba(255, 255, 255, 0.95)',
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(255, 59, 48, 0.08), rgba(255, 59, 48, 0.04))',
            backdropFilter: 'blur(20px) saturate(150%)',
            WebkitBackdropFilter: 'blur(20px) saturate(150%)',
            padding: '25px 30px',
            borderRadius: '20px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            border: '1px solid rgba(255, 59, 48, 0.2)',
            boxShadow: '0 12px 40px rgba(255, 59, 48, 0.15), inset 0 1px 3px rgba(255, 255, 255, 0.1)',
            animation: 'slideIn 0.6s ease'
          }}>
            <div style={{
              fontSize: '3.2rem',
              marginBottom: '10px',
              fontWeight: '700',
              letterSpacing: '-0.02em',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
              animation: 'pulse 2s ease-in-out infinite'
            }}>
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
          <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            zIndex: 1000
          }}>
            <button
              onClick={() => setShowAnkiDownload(true)}
              style={{
                background: 'linear-gradient(135deg, rgba(94, 172, 255, 0.15), rgba(94, 172, 255, 0.08))',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                color: 'rgba(255, 255, 255, 0.95)',
                padding: '12px 24px',
                borderRadius: '24px',
                fontSize: '0.95rem',
                fontWeight: '600',
                letterSpacing: '0.3px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                border: '1px solid rgba(94, 172, 255, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(94, 172, 255, 0.15), inset 0 1px 3px rgba(255, 255, 255, 0.1)',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(94, 172, 255, 0.25), rgba(94, 172, 255, 0.15))';
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(94, 172, 255, 0.25), inset 0 1px 3px rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(94, 172, 255, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(94, 172, 255, 0.15), rgba(94, 172, 255, 0.08))';
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(94, 172, 255, 0.15), inset 0 1px 3px rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(94, 172, 255, 0.25)';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px) scale(0.98)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(94, 172, 255, 0.15), inset 0 1px 3px rgba(0, 0, 0, 0.2)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(94, 172, 255, 0.25), inset 0 1px 3px rgba(255, 255, 255, 0.15)';
              }}
            >
              <span role="img" aria-label="download" style={{ fontSize: '1.1rem', filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))' }}>📥</span>
              Download Anki Deck
            </button>
            <button
              onClick={() => setShowFeedback(true)}
              style={{
                background: 'linear-gradient(135deg, rgba(255, 59, 48, 0.15), rgba(255, 59, 48, 0.08))',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                color: 'rgba(255, 255, 255, 0.95)',
                padding: '12px 24px',
                borderRadius: '24px',
                fontSize: '0.95rem',
                fontWeight: '600',
                letterSpacing: '0.3px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                border: '1px solid rgba(255, 59, 48, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(255, 59, 48, 0.15), inset 0 1px 3px rgba(255, 255, 255, 0.1)',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 59, 48, 0.25), rgba(255, 59, 48, 0.15))';
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(255, 59, 48, 0.25), inset 0 1px 3px rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(255, 59, 48, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 59, 48, 0.15), rgba(255, 59, 48, 0.08))';
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 59, 48, 0.15), inset 0 1px 3px rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(255, 59, 48, 0.25)';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px) scale(0.98)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(255, 59, 48, 0.15), inset 0 1px 3px rgba(0, 0, 0, 0.2)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(255, 59, 48, 0.25), inset 0 1px 3px rgba(255, 255, 255, 0.15)';
              }}
            >
              <span role="img" aria-label="feedback" style={{ fontSize: '1.1rem', filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))' }}>💌</span>
              Requests
            </button>
          </div>
          {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} />}
          {showAnkiDownload && <AnkiDeckDownload onClose={() => setShowAnkiDownload(false)} onDownload={handleDeckDownload} />}
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

          {/* Add global animations for this component */}
          <style>{`
            @keyframes slideDown {
              from {
                opacity: 0;
                transform: translateX(-50%) translateY(-20px);
              }
              to {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
              }
            }

            @keyframes slideIn {
              from {
                opacity: 0;
                transform: translateY(-50%) translateX(-20px);
              }
              to {
                opacity: 1;
                transform: translateY(-50%) translateX(0);
              }
            }

            @keyframes pulse {
              0% {
                transform: scale(1);
              }
              50% {
                transform: scale(1.05);
              }
              100% {
                transform: scale(1);
              }
            }

            @keyframes float {
              0%, 100% {
                transform: translateY(0px);
              }
              50% {
                transform: translateY(-10px);
              }
            }
          `}</style>
        </>
      )}
    </>
  )
}

export default App

function createPageTexture(pageData: PageData): Promise<THREE.Texture> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')!

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = pageData.image

    img.onload = () => {
      // Draw background image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      
      // Add semi-transparent overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Draw text
      ctx.fillStyle = '#ffffff'
      ctx.textAlign = 'center'
      
      // Title
      ctx.font = 'bold 32px Arial'
      ctx.fillText(pageData.title, canvas.width/2, 200)
      
      // Date
      ctx.font = '24px Arial'
      ctx.fillText(pageData.date, canvas.width/2, 250)
      
      // Preview
      ctx.font = '20px Arial'
      ctx.fillText(pageData.preview, canvas.width/2, 300)

      resolve(new THREE.CanvasTexture(canvas))
    }

    // Fallback if image fails to load
    img.onerror = () => {
      ctx.fillStyle = '#333333'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      resolve(new THREE.CanvasTexture(canvas))
    }
  })
}
