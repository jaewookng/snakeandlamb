import { Line, Html } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense, useMemo } from "react";
import * as THREE from "three";

const LOCATIONS = {
  DALLAS: { lat: 32.7767, lon: -96.7970, name: "Dallas" },
  ZURICH: { lat: 47.3769, lon: 8.5417, name: "Zurich" }
};

function LatLonToVector3(lat: number, lon: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  
  return new THREE.Vector3(x, y, z);
}

function ConnectionLine() {
  const radius = 1.55;
  const start = LatLonToVector3(LOCATIONS.DALLAS.lat, LOCATIONS.DALLAS.lon, radius);
  const end = LatLonToVector3(LOCATIONS.ZURICH.lat, LOCATIONS.ZURICH.lon, radius);
  
  const curve = useMemo(() => {
    const midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    
    // Reduce the height of control points for flatter curve
    const startControl = start.clone().add(midPoint.clone().sub(start).multiplyScalar(0.4));
    const endControl = end.clone().add(midPoint.clone().sub(end).multiplyScalar(0.4));
    
    // Lift control points up less
    startControl.normalize().multiplyScalar(radius * 1.2);
    endControl.normalize().multiplyScalar(radius * 1.2);
    
    return new THREE.CubicBezierCurve3(start, startControl, endControl, end);
  }, []);

  const points = useMemo(() => curve.getPoints(50), [curve]);
  const midPoint = points[Math.floor(points.length / 2)];

  return (
    <group>
      <Html position={[midPoint.x, midPoint.y + 0.3, midPoint.z]} center>
        <div style={{
          color: '#ff6b6b',
          background: 'rgba(0,0,0,0)',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontFamily: 'Arial',
          whiteSpace: 'nowrap'
        }}>
          8,407 km
        </div>
      </Html>
      <Line 
        points={points} 
        color="#ff6b6b"
        lineWidth={2}
        transparent
        opacity={0.4}
      />
      <mesh position={start}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color="#ff6b6b" transparent opacity={0.8} />
      </mesh>
      <mesh position={end}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color="#ff6b6b" transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

function Model() {
  return (
    <mesh>
      <sphereGeometry args={[1.5, 64, 64]} />
      <meshPhongMaterial 
        color="#4488ff" 
        opacity={.9}
        shininess={25}
      />
    </mesh>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.1} />
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={1} 
        castShadow
      />
      <pointLight 
        position={[-10, -10, -10]} 
        intensity={0.5} 
        color="#2196f3"
      />
      <spotLight
        position={[10, 10, 10]}
        angle={0.3}
        penumbra={1}
        intensity={1}
        castShadow
      />
      <hemisphereLight
        color="#ffffff"
        groundColor="#000000"
        intensity={0.3}
      />
    </>
  );
}

export default function Earth() {
  return (
    <div style={{ width: "200px", height: "200px" }}>
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Lights />
          <Model />
          <ConnectionLine />
          <OrbitControls 
            enablePan={false}
            enableZoom={false}
            autoRotate
            autoRotateSpeed={1}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}