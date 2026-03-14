import React, { useMemo } from 'react';
import { MSSlideLayout } from '@/components/slides/MSSlideLayout';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { MousePointerClick } from 'lucide-react';
import { T } from '@/components/slides/EditableText';

/**
 * Precision-machined flanged coupling – a single high-quality part
 * built from lathe-style profiles (LatheGeometry).
 */
function PrecisionPart() {
  // Outer body profile (cross-section revolved around Y axis)
  const bodyGeo = useMemo(() => {
    const pts = [
      new THREE.Vector2(0, -0.8),
      new THREE.Vector2(1.6, -0.8),
      new THREE.Vector2(1.6, -0.6),
      new THREE.Vector2(1.0, -0.6),
      new THREE.Vector2(1.0, -0.5),
      new THREE.Vector2(1.8, -0.5),   // flange outer
      new THREE.Vector2(1.8, -0.2),
      new THREE.Vector2(1.0, -0.2),
      new THREE.Vector2(1.0, 0.6),
      new THREE.Vector2(0.85, 0.6),
      new THREE.Vector2(0.85, 0.75),
      new THREE.Vector2(0.7, 0.75),
      new THREE.Vector2(0.7, 0.8),
      new THREE.Vector2(0, 0.8),
    ];
    return new THREE.LatheGeometry(pts, 64);
  }, []);

  // Center bore
  const boreGeo = useMemo(() => {
    const pts = [
      new THREE.Vector2(0, -0.85),
      new THREE.Vector2(0.45, -0.85),
      new THREE.Vector2(0.45, 0.85),
      new THREE.Vector2(0, 0.85),
    ];
    return new THREE.LatheGeometry(pts, 64);
  }, []);

  const mat = { roughness: 0.18, metalness: 0.95 };

  // Bolt holes on flange
  const boltHoles = useMemo(() => {
    const holes: THREE.Vector3[] = [];
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      holes.push(new THREE.Vector3(Math.cos(a) * 1.4, -0.35, Math.sin(a) * 1.4));
    }
    return holes;
  }, []);

  return (
    <group rotation={[Math.PI / 2 + 0.3, 0, 0.2]}>
      {/* Main body */}
      <mesh geometry={bodyGeo}>
        <meshStandardMaterial color="#b0b8c4" {...mat} />
      </mesh>
      {/* Bore (darker inside) */}
      <mesh geometry={boreGeo}>
        <meshStandardMaterial color="#556070" {...mat} side={THREE.BackSide} />
      </mesh>
      {/* Chamfer ring */}
      <mesh position={[0, -0.5, 0]}>
        <torusGeometry args={[1.0, 0.025, 8, 64]} />
        <meshStandardMaterial color="#8090a0" roughness={0.15} metalness={0.95} />
      </mesh>
      {/* Bolt holes */}
      {boltHoles.map((pos, i) => (
        <mesh key={i} position={pos} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.35, 16]} />
          <meshStandardMaterial color="#3a4555" roughness={0.3} metalness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[8, 12, 10]} intensity={1.4} />
      <directionalLight position={[-4, -2, -6]} intensity={0.2} color="#aabbdd" />
      <PrecisionPart />
      <Environment preset="studio" />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.6}
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
          <div className="pointer-events-auto" style={{ width: 1000, height: 800 }}>
            <Canvas
              camera={{ position: [0, 0, 5], fov: 40 }}
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