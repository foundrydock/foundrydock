import React, { useMemo, useRef } from 'react';
import { MSSlideLayout } from '@/components/slides/MSSlideLayout';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { MousePointerClick } from 'lucide-react';
import { T } from '@/components/slides/EditableText';

function createGearShape(outerRadius: number, innerRadius: number, teeth: number, toothDepth: number) {
  const shape = new THREE.Shape();
  const anglePerTooth = (Math.PI * 2) / teeth;

  for (let i = 0; i < teeth; i++) {
    const a0 = i * anglePerTooth;
    const a1 = a0 + anglePerTooth * 0.15;
    const a2 = a0 + anglePerTooth * 0.35;
    const a3 = a0 + anglePerTooth * 0.65;
    const a4 = a0 + anglePerTooth * 0.85;

    const r1 = outerRadius - toothDepth;
    const r2 = outerRadius;

    if (i === 0) {
      shape.moveTo(Math.cos(a0) * r1, Math.sin(a0) * r1);
    }
    shape.lineTo(Math.cos(a1) * r1, Math.sin(a1) * r1);
    shape.lineTo(Math.cos(a2) * r2, Math.sin(a2) * r2);
    shape.lineTo(Math.cos(a3) * r2, Math.sin(a3) * r2);
    shape.lineTo(Math.cos(a4) * r1, Math.sin(a4) * r1);
  }
  shape.closePath();

  // Center hole
  const hole = new THREE.Path();
  const holeSegments = 32;
  for (let i = 0; i <= holeSegments; i++) {
    const angle = (i / holeSegments) * Math.PI * 2;
    const x = Math.cos(angle) * innerRadius;
    const y = Math.sin(angle) * innerRadius;
    if (i === 0) hole.moveTo(x, y);
    else hole.lineTo(x, y);
  }
  shape.holes.push(hole);

  return shape;
}

function MechanicalAssembly() {
  const groupRef = useRef<THREE.Group>(null);
  const gear1Ref = useRef<THREE.Mesh>(null);
  const gear2Ref = useRef<THREE.Mesh>(null);

  const gearGeo1 = useMemo(() => {
    const shape = createGearShape(1.8, 0.4, 16, 0.35);
    const extrudeSettings = { depth: 0.4, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.03, bevelSegments: 2 };
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  const gearGeo2 = useMemo(() => {
    const shape = createGearShape(1.1, 0.25, 10, 0.25);
    const extrudeSettings = { depth: 0.3, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.02, bevelSegments: 2 };
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  const bracketGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.3, -2.5);
    shape.lineTo(0.3, -2.5);
    shape.lineTo(0.3, 2.5);
    shape.lineTo(-0.3, 2.5);
    shape.closePath();
    return new THREE.ExtrudeGeometry(shape, { depth: 0.15, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02 });
  }, []);

  useFrame((_, delta) => {
    if (gear1Ref.current) gear1Ref.current.rotation.z += delta * 0.3;
    if (gear2Ref.current) gear2Ref.current.rotation.z -= delta * 0.3 * (16 / 10);
  });

  const metalMat = { color: '#8899aa', roughness: 0.25, metalness: 0.9 };
  const darkMetal = { color: '#556677', roughness: 0.3, metalness: 0.95 };
  const accentMat = { color: '#3b82f6', roughness: 0.4, metalness: 0.7 };

  return (
    <group ref={groupRef}>
      {/* Main gear */}
      <mesh ref={gear1Ref} position={[0, 0, 0]} geometry={gearGeo1}>
        <meshStandardMaterial {...metalMat} />
      </mesh>

      {/* Secondary gear meshed with main */}
      <mesh ref={gear2Ref} position={[2.55, 1.2, 0.05]} geometry={gearGeo2}>
        <meshStandardMaterial {...accentMat} />
      </mesh>

      {/* Axle 1 */}
      <mesh position={[0, 0, 0.2]}>
        <cylinderGeometry args={[0.15, 0.15, 0.8, 16]} />
        <meshStandardMaterial {...darkMetal} />
      </mesh>

      {/* Axle 2 */}
      <mesh position={[2.55, 1.2, 0.2]}>
        <cylinderGeometry args={[0.1, 0.1, 0.6, 16]} />
        <meshStandardMaterial {...darkMetal} />
      </mesh>

      {/* Support bracket */}
      <mesh position={[1.3, -0.3, -0.3]} rotation={[0, 0, Math.PI / 6]} geometry={bracketGeo}>
        <meshStandardMaterial color="#445566" roughness={0.35} metalness={0.85} />
      </mesh>

      {/* Base plate */}
      <mesh position={[1, -2.2, -0.1]}>
        <boxGeometry args={[5, 0.2, 1.2]} />
        <meshStandardMaterial {...darkMetal} />
      </mesh>

      {/* Decorative bolts */}
      {[[0, 0], [2.55, 1.2]].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.45]}>
          <cylinderGeometry args={[0.2, 0.2, 0.1, 6]} />
          <meshStandardMaterial color="#667788" roughness={0.2} metalness={0.95} />
        </mesh>
      ))}
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 8]} intensity={1.2} color="#ffffff" />
      <directionalLight position={[-5, -3, -5]} intensity={0.3} color="#aaccff" />
      <pointLight position={[3, 3, 5]} intensity={0.5} color="#3b82f6" />
      <MechanicalAssembly />
      <Environment preset="studio" />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.8}
      />
    </>
  );
}

export default function Slide13Interactive3D() {
  return (
    <MSSlideLayout variant="dark">
      <div className="relative h-full w-full overflow-hidden">
        <div className="absolute top-16 left-20 z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-[2px] bg-white/30" />
            <T k="3d.section" className="type-caption text-white/60 tracking-widest uppercase" />
          </div>
          <T k="3d.title" as="h2" className="type-h1 text-white" />
          <T k="3d.desc" as="p" className="type-body-lg text-white/60 mt-3 max-w-[500px]" />
        </div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto" style={{ width: 1100, height: 850 }}>
            <Canvas
              camera={{ position: [0, 0, 7], fov: 45 }}
              gl={{ antialias: true, alpha: true }}
              dpr={1}
              style={{ background: 'transparent' }}
              resize={{ scroll: false, offsetSize: true }}
            >
              <Scene />
            </Canvas>
          </div>
        </div>

        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-center z-10">
          <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
            <MousePointerClick className="w-5 h-5 text-white/70" />
            <T k="3d.hint" className="type-caption text-white/70" />
          </div>
        </div>

        <div className="absolute top-1/2 right-20 -translate-y-1/2 z-10 space-y-10">
          {[
            { value: 'FDM', key: '3d.fdm' },
            { value: 'SLA', key: '3d.sla' },
            { value: 'CNC', key: '3d.cnc' },
            { value: 'SLS', key: '3d.sls' },
          ].map((s) => (
            <div key={s.key} className="text-right">
              <span className="type-h3 text-white font-semibold">{s.value}</span>
              <T k={s.key} as="p" className="type-caption text-white/60" />
            </div>
          ))}
        </div>
      </div>
    </MSSlideLayout>
  );
}