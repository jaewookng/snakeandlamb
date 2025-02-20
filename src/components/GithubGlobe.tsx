import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface Props {
  size?: number;
}

export function GithubGlobe({ size = 150 }: Props) {
  const globeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!globeRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    
    renderer.setSize(size, size)
    globeRef.current.appendChild(renderer.domElement)

    // Constants
    const GLOBE_RADIUS = 30
    const DEG2RAD = Math.PI / 180
    const rows = 36
    const dotDensity = 0.1 // Dots per pixel at equator
    const dotSize = 0.4
    const dotColor = new THREE.Color(0xf4cccc)

    // Create dot geometry and material
    const dotGeometry = new THREE.CircleGeometry(dotSize, 8)
    const dotMaterial = new THREE.MeshBasicMaterial({
      color: dotColor,
      side: THREE.DoubleSide
    })

    // Create dots on globe surface
    const dotsGroup = new THREE.Group()
    
    for (let lat = -90; lat <= 90; lat += 180/rows) {
      const radius = Math.cos(Math.abs(lat) * DEG2RAD) * GLOBE_RADIUS
      const circumference = radius * Math.PI * 2
      const dotsForLat = Math.round(circumference * dotDensity)
      
      for (let x = 0; x < dotsForLat; x++) {
        const longitude: number = -180 + x * 360/dotsForLat

        // Convert to Cartesian coordinates
        const phi: number = longitude * DEG2RAD
        const theta: number = lat * DEG2RAD
        
        const X: number = radius * Math.cos(phi) * Math.cos(theta)
        const y = GLOBE_RADIUS * Math.sin(theta)
        const z = radius * Math.sin(phi) * Math.cos(theta)

        const dot = new THREE.Mesh(dotGeometry, dotMaterial)
        dot.position.set(X, y, z)
        
        // Make dot face outward
        dot.lookAt(0, 0, 0)
        dot.rotateY(Math.PI)
        
        dotsGroup.add(dot)
      }
    }

    scene.add(dotsGroup)

    // Add subtle ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    scene.add(ambientLight)

    camera.position.z = 100

    // Handle mouse interaction
    let isMouseDown = false
    let lastMouseX = 0
    let rotationSpeed = 0
    const dampingFactor = 0.95

    const handleMouseDown = (e: MouseEvent) => {
      isMouseDown = true
      lastMouseX = e.clientX
    }

    const handleMouseUp = () => {
      isMouseDown = false
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isMouseDown) return
      const deltaX = e.clientX - lastMouseX
      rotationSpeed = deltaX * 0.001
      lastMouseX = e.clientX
    }

    globeRef.current.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mousemove', handleMouseMove)

    // Animation
    function animate() {
      requestAnimationFrame(animate)

      if (!isMouseDown) {
        rotationSpeed *= dampingFactor
      }
      
      dotsGroup.rotation.y += rotationSpeed + 0.001 // Base rotation + interaction
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      globeRef.current?.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mousemove', handleMouseMove)
      globeRef.current?.removeChild(renderer.domElement)
    }
  }, [size])

  return <div ref={globeRef} style={{ cursor: 'grab' }} />
}
