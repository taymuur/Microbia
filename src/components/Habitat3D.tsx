import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useReducedMotion } from '../hooks/useReducedMotion';

// A living 3D depth-field behind each habitat: dozens of translucent "microbes"
// drift through space, the whole field parallaxes toward the pointer, and the gut
// gets a receding tunnel of rings. Theme-aware, and frozen under reduced motion.
type ZoneKey = 'soil' | 'cafe' | 'gut' | 'waterways';

interface ZoneLook {
  colors: string[];
  bg: string; // CSS gradient behind the canvas (uses theme-adaptive vars)
  rise: number; // vertical drift direction (+up bubbles, −down motes)
  fog: string;
}

const LOOK: Record<ZoneKey, ZoneLook> = {
  soil: {
    colors: ['#4caf6d', '#8bd45a', '#c98a3c', '#2fae8f'],
    bg: 'linear-gradient(180deg, color-mix(in srgb, var(--c-lime) 14%, var(--color-bg)), color-mix(in srgb, var(--c-amber) 20%, var(--color-bg)))',
    rise: -1,
    fog: '#6b3f16',
  },
  cafe: {
    colors: ['#f6a723', '#ef8a3a', '#ffd07a', '#e8c37a'],
    bg: 'radial-gradient(80% 70% at 60% 20%, color-mix(in srgb, var(--c-amber) 20%, var(--color-bg)), var(--color-bg))',
    rise: 1,
    fog: '#f19a1a',
  },
  gut: {
    colors: ['#ec4d97', '#ff7ac0', '#9b6fc0', '#ff9ed6'],
    bg: 'radial-gradient(70% 90% at 50% 50%, color-mix(in srgb, var(--c-magenta) 22%, var(--color-bg)), var(--color-bg))',
    rise: 0.4,
    fog: '#ec4d97',
  },
  waterways: {
    colors: ['#17a9e0', '#38c9ff', '#2fae8f', '#8fe1ff'],
    bg: 'linear-gradient(180deg, color-mix(in srgb, var(--c-cyan) 16%, var(--color-bg)), color-mix(in srgb, var(--c-cyan) 34%, var(--color-bg)))',
    rise: 1,
    fog: '#17a9e0',
  },
};

export default function Habitat3D({ zone }: { zone: string }) {
  const reduced = useReducedMotion();
  const look = LOOK[(zone as ZoneKey)] ?? LOOK.soil;

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden style={{ background: look.bg }}>
      <Canvas
        camera={{ position: [0, 0, 7], fov: 60 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        frameloop={reduced ? 'demand' : 'always'}
      >
        <ambientLight intensity={1.1} />
        <directionalLight position={[3, 4, 6]} intensity={2} />
        <Parallax reduced={reduced}>
          <Swarm look={look} reduced={reduced} />
          {zone === 'gut' && <Tunnel reduced={reduced} />}
        </Parallax>
      </Canvas>
    </div>
  );
}

/** Rotates its contents gently toward the pointer for an immersive parallax. */
function Parallax({ reduced, children }: { reduced: boolean; children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (reduced || !ref.current) return;
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, state.pointer.x * 0.35, 0.05);
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, -state.pointer.y * 0.25, 0.05);
  });
  return <group ref={ref}>{children}</group>;
}

const COUNT = 90;

function Swarm({ look, reduced }: { look: ZoneLook; reduced: boolean }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const { invalidate } = useThree();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const seeds = useMemo(
    () =>
      Array.from({ length: COUNT }, () => ({
        x: (Math.random() - 0.5) * 16,
        y: (Math.random() - 0.5) * 12,
        z: (Math.random() - 0.5) * 10 - 2,
        s: 0.12 + Math.random() * 0.5,
        speed: 0.15 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        sway: 0.3 + Math.random() * 0.8,
      })),
    [],
  );

  // Assign per-instance colours + an initial layout (also the static frame).
  useEffect(() => {
    if (!mesh.current) return;
    const c = new THREE.Color();
    seeds.forEach((p, i) => {
      dummy.position.set(p.x, p.y, p.z);
      dummy.scale.setScalar(p.s);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
      c.set(look.colors[i % look.colors.length]);
      mesh.current!.setColorAt(i, c);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true;
    invalidate();
  }, [seeds, look, dummy, invalidate]);

  useFrame((state, delta) => {
    if (reduced || !mesh.current) return;
    const t = state.clock.elapsedTime;
    seeds.forEach((p, i) => {
      p.y += delta * p.speed * look.rise;
      if (look.rise > 0 && p.y > 6) p.y = -6;
      if (look.rise < 0 && p.y < -6) p.y = 6;
      dummy.position.set(p.x + Math.sin(t * 0.4 + p.phase) * p.sway, p.y, p.z);
      dummy.rotation.set(t * 0.2 + p.phase, t * 0.15, 0);
      dummy.scale.setScalar(p.s);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, COUNT]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial transparent opacity={0.72} roughness={0.35} metalness={0.1} />
    </instancedMesh>
  );
}

/** A receding tunnel of rings — you are inside the gut. */
function Tunnel({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const rings = useMemo(() => Array.from({ length: 10 }, (_, i) => i), []);
  useFrame((state, delta) => {
    if (reduced || !ref.current) return;
    ref.current.rotation.z += delta * 0.08;
    ref.current.children.forEach((ring) => {
      ring.position.z += delta * 1.4;
      if (ring.position.z > 4) ring.position.z -= 20;
    });
    void state;
  });
  return (
    <group ref={ref}>
      {rings.map((i) => (
        <mesh key={i} position={[0, 0, -i * 2]} rotation={[0, 0, i * 0.3]}>
          <torusGeometry args={[3.4 + (i % 3) * 0.2, 0.16, 10, 40]} />
          <meshStandardMaterial color="#ff5cb8" emissive="#ec4d97" emissiveIntensity={0.5} transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}
