import React, { useRef } from 'react';
import { MSSlideLayout } from '@/components/slides/MSSlideLayout';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, MeshDistortMaterial, Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { MousePointerClick } from 'lucide-react';

/** Industrial gear/bracket assembly */
function GearAssembly() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main gear */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[1.2, 0.15, 16, 48]} />
        <meshStandardMaterial color="#e0e0e0" roughness={0.3} metalness={0.9} />
      </mesh>

      {/* Gear teeth */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i / 24) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 1.35, Math.sin(angle) * 1.35, 0]}
            rotation={[0, 0, angle]}
          >
            <boxGeometry args={[0.15, 0.25, 0.15]} />
            <meshStandardMaterial color="#d0d0d0" roughness={0.3} metalness={0.9} />
          </mesh>
        );
      })}

      {/* Hub */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.3, 32]} />
        <meshStandardMaterial color="#c8c8c8" roughness={0.2} metalness={0.95} />
      </mesh>

      {/* Center shaft */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 1.2, 16]} />
        <meshStandardMaterial color="#b0b0b0" roughness={0.2} metalness={0.95} />
      </mesh>

      {/* Mounting bracket */}
      <mesh position={[0, -1.8, 0]}>
        <boxGeometry args={[2.2, 0.2, 0.8]} />
        <meshStandardMaterial color="#d5d5d5" roughness={0.35} metalness={0.85} />
      </mesh>

      {/* Bracket supports */}
      {[-0.8, 0.8].map((x) => (
        <mesh key={x} position={[x, -1.1, 0]}>
          <boxGeometry args={[0.15, 1.2, 0.6]} />
          <meshStandardMaterial color="#c8c8c8" roughness={0.35} metalness={0.85} />
        </mesh>
      ))}

      {/* Bolts */}
      {[[-0.8, -1.85], [0.8, -1.85], [-0.8, -1.85], [0.8, -1.85]].map(([x, y], i) => (
        <mesh key={i} position={[x, y, i < 2 ? 0.25 : -0.25]}>
          <cylinderGeometry args={[0.06, 0.06, 0.15, 8]} />
          <meshStandardMaterial color="#999" roughness={0.4} metalness={0.9} />
        </mesh>
      ))}

      {/* Small secondary gear */}
      <group position={[2.0, 0.8, 0]} rotation={[0, 0, Math.PI / 24]}>
        <mesh>
          <torusGeometry args={[0.5, 0.1, 12, 32]} />
          <meshStandardMaterial color="#e0e0e0" roughness={0.3} metalness={0.9} />
        </mesh>
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i / 16) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * 0.6, Math.sin(angle) * 0.6, 0]}
              rotation={[0, 0, angle]}
            >
              <boxGeometry args={[0.08, 0.15, 0.1]} />
              <meshStandardMaterial color="#d0d0d0" roughness={0.3} metalness={0.9} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} color="#ffffff" />
      <directionalLight position={[-5, -5, -5]} intensity={0.3} color="#ffffff" />
      <pointLight position={[0, 5, 0]} intensity={0.4} />

      <GearAssembly />

      <Environment preset="studio" />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.5}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

export default function Slide13Interactive3D() {
  return (
    <MSSlideLayout variant="dark">
      <div className="relative h-full w-full overflow-hidden">
        {/* Header */}
        <div className="absolute top-16 left-20 z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-[2px] bg-white/30" />
            <span className="type-caption text-white/50 tracking-widest uppercase">
              Interaktiivinen demo
            </span>
          </div>
          <h2 className="type-h1 text-white">Teollisuuden osat 3D:nä</h2>
          <p className="type-body-lg text-white/50 mt-3 max-w-[500px]">
            Mittamuodon kautta voi tilata monimutkaisia teollisuusosia — 3D-tulostettuna tai koneistettuna.
          </p>
        </div>

        {/* 3D Canvas */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto" style={{ width: 900, height: 700 }}>
            <Canvas
              camera={{ position: [0, 1, 5], fov: 45 }}
              gl={{ antialias: true, alpha: true }}
              dpr={1}
              style={{ background: 'transparent' }}
              resize={{ scroll: false, offsetSize: true }}
            >
              <Scene />
            </Canvas>
          </div>
        </div>

        {/* Interaction hint */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-center z-10">
          <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
            <MousePointerClick className="w-5 h-5 text-white/60" />
            <span className="type-caption text-white/60">Tartu ja pyöritä</span>
          </div>
        </div>

        {/* Stats on right */}
        <div className="absolute top-1/2 right-20 -translate-y-1/2 z-10 space-y-10">
          {[
            { value: 'FDM', label: '3D-tulostus' },
            { value: 'SLA', label: 'Hartsitulostus' },
            { value: 'CNC', label: 'Koneistus' },
            { value: 'SLS', label: 'Jauhepetitulostus' },
          ].map((s) => (
            <div key={s.label} className="text-right">
              <span className="type-h3 text-white font-semibold">{s.value}</span>
              <p className="type-caption text-white/40">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </MSSlideLayout>
  );
}
