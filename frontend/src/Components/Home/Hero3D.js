import React, { useRef, useMemo, Suspense, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Billboard, Float, useTexture, Html } from '@react-three/drei';
import * as THREE from 'three';
import { photo, PHOTOS } from './ui';

// Round photo "satellites", each on its own tilted orbit ring around the globe
const ORBS = [
  { name: 'Music', img: PHOTOS.music, color: '#ff4d5e', r: 2.45, size: 0.5, speed: 0.5, tilt: 0.35, phase: 0 },
  { name: 'Code', img: PHOTOS.code, color: '#2f5cff', r: 2.8, size: 0.56, speed: 0.38, tilt: -0.55, phase: 2 },
  { name: 'Dance', img: PHOTOS.dance, color: '#ffe14d', r: 3.15, size: 0.48, speed: 0.3, tilt: 0.85, phase: 4 },
  { name: 'Debate', img: PHOTOS.debate, color: '#5c8dff', r: 2.6, size: 0.44, speed: 0.62, tilt: -1.0, phase: 1 },
  { name: 'Photography', img: PHOTOS.photography, color: '#ffd60a', r: 3.3, size: 0.52, speed: 0.24, tilt: 0.1, phase: 3 },
  // smaller moons on their own orbits, so no two paths line up
  { name: 'Drama', img: PHOTOS.drama, color: '#e5304a', r: 2.95, size: 0.32, speed: 0.46, tilt: -0.2, phase: 5.2 },
  { name: 'Film', img: PHOTOS.film, color: '#ffd60a', r: 3.45, size: 0.3, speed: 0.27, tilt: -0.8, phase: 0.9 },
  { name: 'Volunteering', img: PHOTOS.volunteer, color: '#0e9f9a', r: 2.35, size: 0.28, speed: 0.72, tilt: 1.15, phase: 3.6 },
  { name: 'Robotics', img: PHOTOS.robotics, color: '#2f5cff', r: 3.05, size: 0.31, speed: 0.34, tilt: 0.6, phase: 2.7 },
];

const Satellite = ({ name, img, color, r, size, speed, tilt, phase }) => {
  const ref = useRef();
  const [hovered, setHovered] = useState(false);
  const map = useTexture(photo(img, 512, 512));
  map.colorSpace = THREE.SRGBColorSpace;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + phase;
    ref.current.position.set(Math.cos(t) * r, Math.sin(t) * r * Math.sin(tilt), Math.sin(t) * r * Math.cos(tilt));
    const s = THREE.MathUtils.lerp(ref.current.scale.x, hovered ? 1.25 : 1, 0.12);
    ref.current.scale.setScalar(s);
  });

  return (
    <>
      {/* this satellite's orbit ring (plane matches the orbit maths above) */}
      <mesh rotation={[Math.PI / 2 - tilt, 0, 0]}>
        <torusGeometry args={[r, 0.01, 12, 220]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} />
      </mesh>
      <group ref={ref}>
        <Billboard>
          <group
            onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
            onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
          >
            {/* soft glow, coloured border, then the photo itself (unlit so it is always bright) */}
            <mesh position={[0, 0, -0.02]}>
              <circleGeometry args={[size * 1.45, 48]} />
              <meshBasicMaterial color={color} transparent opacity={0.22} />
            </mesh>
            <mesh position={[0, 0, -0.01]}>
              <circleGeometry args={[size * 1.1, 48]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            <mesh>
              <circleGeometry args={[size, 48]} />
              <meshBasicMaterial map={map} toneMapped={false} />
            </mesh>
          </group>
          {hovered && (
            <Html center position={[0, size * 1.5 + 0.2, 0]} style={{ pointerEvents: 'none' }}>
              <div style={{ padding: '4px 12px', borderRadius: 999, background: color, color: '#fff', fontWeight: 800, fontSize: 14, whiteSpace: 'nowrap', fontFamily: 'Figtree, sans-serif' }}>{name}</div>
            </Html>
          )}
        </Billboard>
      </group>
    </>
  );
};

// Earth-style globe: a dark sphere covered in glowing dots
const Globe = () => {
  const dots = useMemo(() => {
    const n = 1500;
    const pos = new Float32Array(n * 3);
    const col = new Float32Array(n * 3);
    const c1 = new THREE.Color('#5c8dff');
    const c2 = new THREE.Color('#c7d8ff');
    const c3 = new THREE.Color('#ffe14d');
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2;
      const rad = Math.sqrt(1 - y * y);
      const th = golden * i;
      const R = 1.5;
      pos.set([Math.cos(th) * rad * R, y * R, Math.sin(th) * rad * R], i * 3);
      const k = (y + 1) / 2;
      const c = k < 0.5 ? c1.clone().lerp(c2, k * 2) : c2.clone().lerp(c3, (k - 0.5) * 2);
      col.set([c.r, c.g, c.b], i * 3);
    }
    return { pos, col };
  }, []);

  const ref = useRef();
  useFrame((_, d) => { ref.current.rotation.y += d * 0.12; });

  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[1.46, 64, 64]} />
        <meshStandardMaterial color="#14308a" emissive="#2f5cff" emissiveIntensity={0.55} roughness={0.7} />
      </mesh>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={dots.pos.length / 3} array={dots.pos} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={dots.col.length / 3} array={dots.col} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.045} vertexColors transparent opacity={0.95} sizeAttenuation />
      </points>
      {/* atmosphere */}
      <mesh scale={1.12}>
        <sphereGeometry args={[1.46, 48, 48]} />
        <meshBasicMaterial color="#8db4ff" transparent opacity={0.14} side={THREE.BackSide} />
      </mesh>
    </group>
  );
};

const Scene = () => {
  const group = useRef();
  const placed = useRef(false);
  useFrame(({ pointer, camera, size }, d) => {
    // on wide screens park the system to the right so the headline sits on the left
    const aspect = size.width / size.height;
    const halfW = camera.position.z * Math.tan(THREE.MathUtils.degToRad(21)) * aspect;
    const wide = aspect > 1.25;
    const baseX = wide ? halfW * 0.46 : 0;
    const sc = wide ? 0.6 : 0.9;
    // first frame: start exactly where the system belongs instead of drifting in from the centre
    if (!placed.current) {
      group.current.position.set(baseX, wide ? -0.35 : 0, 0);
      group.current.scale.setScalar(sc);
      placed.current = true;
    }
    group.current.scale.setScalar(THREE.MathUtils.lerp(group.current.scale.x, sc, 0.1));
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, wide ? -0.35 : 0, 0.08);
    group.current.rotation.y += d * 0.1;
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -pointer.y * 0.35, 0.05);
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, baseX + pointer.x * 0.3, 0.05);
  });
  return (
    <group ref={group}>
      <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.5}>
        <Globe />
      </Float>
      {ORBS.map((o) => <Satellite key={o.name} {...o} />)}
    </group>
  );
};

const Stars = () => {
  const positions = useMemo(() => {
    const arr = new Float32Array(240 * 3);
    for (let i = 0; i < 240; i++) {
      const r = 5 + Math.random() * 4;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      arr.set([r * Math.sin(ph) * Math.cos(th), r * Math.sin(ph) * Math.sin(th), r * Math.cos(ph) - 2], i * 3);
    }
    return arr;
  }, []);
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#ffffff" transparent opacity={0.7} />
    </points>
  );
};

// Keep the whole system in frame: closer on wide canvases, further back on narrow ones
const CameraRig = () => {
  const { camera, size } = useThree();
  const aspect = size.width / size.height;
  camera.position.z = 7.6 / Math.min(1, aspect * 0.95);
  camera.updateProjectionMatrix();
  return null;
};

const Hero3D = () => (
  <Canvas camera={{ position: [0, 0, 7], fov: 42 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }} style={{ background: 'transparent' }}>
    <ambientLight intensity={1} />
    <directionalLight position={[4, 5, 5]} intensity={1.6} color="#ffffff" />
    <pointLight position={[-5, -2, 3]} intensity={30} color="#ff4d5e" />
    <CameraRig />
    <Stars />
    <Suspense fallback={null}>
      <Scene />
    </Suspense>
  </Canvas>
);

export default Hero3D;
