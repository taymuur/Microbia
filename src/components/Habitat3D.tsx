import { useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { CafeReal, GutReal, KeepersReal, MouthReal, PooReal, SoilReal, WaterReal } from './scenes/RealScenes';
import { CafeBlocks, GutBlocks, KeepersBlocks, MouthBlocks, PooBlocks, SoilBlocks, WaterBlocks } from './scenes/BlockScenes';

// Two entirely separate builds of the same journey:
//   voxel = false  the realistic look, smooth and curved, in constant motion
//   voxel = true   the Minecraft look, built only from cubes
// Each scene is designed to fill the whole viewport.

type ZoneKey = 'soil' | 'cafe' | 'mouth' | 'gut' | 'poo' | 'waterways' | 'keepers';

const BG: Record<ZoneKey, string> = {
  soil: 'linear-gradient(180deg, #9fd4f2 0%, #c9e8f7 46%, #cfe3b4 58%, #8a6234 100%)',
  cafe: 'linear-gradient(180deg, #ffe9c4 0%, #f7d29a 60%, #d9a869 100%)',
  mouth: 'radial-gradient(80% 70% at 50% 45%, #f7a8bd 0%, #e07d99 55%, #b8506e 100%)',
  gut: 'radial-gradient(75% 85% at 50% 50%, #ff9fd0 0%, #e7679f 60%, #b8437c 100%)',
  poo: 'linear-gradient(180deg, #f2fbff 0%, #e2f1fb 55%, #cadeeb 100%)',
  waterways: 'linear-gradient(180deg, #d6efff 0%, #9ed4f5 40%, #2f7ab0 100%)',
  keepers: 'linear-gradient(180deg, #ece6ff 0%, #d5c9fb 60%, #b9a9f0 100%)',
};

const DARK_BG: Record<ZoneKey, string> = {
  soil: 'linear-gradient(180deg, #16283a 0%, #1d3348 46%, #24402c 58%, #2a1c0e 100%)',
  cafe: 'linear-gradient(180deg, #3a2a14 0%, #4a3418 60%, #241806 100%)',
  mouth: 'radial-gradient(80% 70% at 50% 45%, #7a2a44 0%, #571c31 55%, #35111d 100%)',
  gut: 'radial-gradient(75% 85% at 50% 50%, #7d2f5c 0%, #5a1f41 60%, #390f27 100%)',
  poo: 'linear-gradient(180deg, #1e2f3e 0%, #16252f 55%, #0e1820 100%)',
  waterways: 'linear-gradient(180deg, #14293c 0%, #123049 40%, #071827 100%)',
  keepers: 'linear-gradient(180deg, #241d3d 0%, #1b1631 60%, #110d20 100%)',
};

export default function Habitat3D({
  zone,
  voxel,
  dark = false,
}: {
  zone: string;
  voxel: boolean;
  dark?: boolean;
}) {
  const reduced = useReducedMotion();
  const z = ((zone as ZoneKey) in BG ? zone : 'soil') as ZoneKey;

  return (
    <div className="absolute inset-0" aria-hidden style={{ background: (dark ? DARK_BG : BG)[z] }}>
      <Canvas
        camera={{ position: [0, 0.4, 11], fov: 58 }}
        gl={{ alpha: true, antialias: !voxel, powerPreference: 'high-performance' }}
        dpr={[1, voxel ? 1.25 : 1.75]}
        frameloop={reduced ? 'demand' : 'always'}
      >
        <FitCamera />
        <Lighting voxel={voxel} dark={dark} />
        <Sway reduced={reduced}>
          {voxel ? (
            <>
              {z === 'soil' && <SoilBlocks reduced={reduced} />}
              {z === 'cafe' && <CafeBlocks reduced={reduced} />}
              {z === 'mouth' && <MouthBlocks reduced={reduced} />}
              {z === 'gut' && <GutBlocks reduced={reduced} />}
              {z === 'poo' && <PooBlocks reduced={reduced} />}
              {z === 'waterways' && <WaterBlocks reduced={reduced} />}
              {z === 'keepers' && <KeepersBlocks reduced={reduced} />}
            </>
          ) : (
            <>
              {z === 'soil' && <SoilReal reduced={reduced} />}
              {z === 'cafe' && <CafeReal reduced={reduced} />}
              {z === 'mouth' && <MouthReal reduced={reduced} />}
              {z === 'gut' && <GutReal reduced={reduced} />}
              {z === 'poo' && <PooReal reduced={reduced} />}
              {z === 'waterways' && <WaterReal reduced={reduced} />}
              {z === 'keepers' && <KeepersReal reduced={reduced} />}
            </>
          )}
        </Sway>
      </Canvas>
    </div>
  );
}

/** Pulls the camera back on narrow screens so the scene still fills the frame. */
function FitCamera() {
  const { camera, size, invalidate } = useThree();
  useEffect(() => {
    const aspect = size.width / Math.max(size.height, 1);
    const pull = THREE.MathUtils.clamp(1.55 / aspect, 1, 2.1);
    camera.position.z = 11 * pull;
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, size, invalidate]);
  return null;
}

function Lighting({ voxel, dark }: { voxel: boolean; dark: boolean }) {
  return (
    <>
      <ambientLight intensity={dark ? 0.7 : voxel ? 1.25 : 0.95} />
      <hemisphereLight args={['#ffffff', '#6b5a44', dark ? 0.4 : 0.8]} />
      <directionalLight position={[6, 10, 8]} intensity={dark ? 1.2 : voxel ? 1.9 : 2.2} />
      <directionalLight position={[-8, 3, 5]} intensity={dark ? 0.3 : 0.55} color="#cfe4ff" />
    </>
  );
}

/** Gentle pointer parallax across the whole scene. */
function Sway({ reduced, children }: { reduced: boolean; children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (reduced || !ref.current) return;
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, state.pointer.x * 0.1, 0.05);
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, -state.pointer.y * 0.06, 0.05);
  });
  return <group ref={ref}>{children}</group>;
}
