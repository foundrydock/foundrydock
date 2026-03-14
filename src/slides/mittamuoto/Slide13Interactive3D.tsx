import React, { useMemo } from 'react';
import { MSSlideLayout } from '@/components/slides/MSSlideLayout';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { MousePointerClick } from 'lucide-react';
import { T } from '@/components/slides/EditableText';
import designImage from '@/assets/3d-design-industrial.jpg';

function ImagePanel() {
  const texture = useLoader(THREE.TextureLoader, designImage);

  const aspect = useMemo(() => {
    if (texture.image) return texture.image.width / texture.image.height;
    return 16 / 9;
  }, [texture]);

  const width = 4;
  const height = width / aspect;

  return (
    <group>
      {/* Main image panel */}
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial map={texture} side={THREE.DoubleSide} roughness={0.3} metalness={0.1} />
      </mesh>
      {/* Subtle frame */}
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[width + 0.08, height + 0.08]} />
        <meshStandardMaterial color="#333333" roughness={0.5} metalness={0.8} side={THREE.DoubleSide} />
      </mesh>
      {/* Depth/thickness */}
      <mesh position={[0, 0, -0.03]}>
        <boxGeometry args={[width + 0.08, height + 0.08, 0.04]} />
        <meshStandardMaterial color="#222222" roughness={0.5} metalness={0.8} />
      </mesh>
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1.0} color="#ffffff" />
      <directionalLight position={[-5, -5, -5]} intensity={0.3} color="#ffffff" />
      <ImagePanel />
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
              camera={{ position: [0, 0, 4], fov: 45 }}
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
