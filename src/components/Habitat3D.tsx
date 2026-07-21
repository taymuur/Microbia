import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useReducedMotion } from '../hooks/useReducedMotion';

// A distinct, living 3D scene for each habitat — not just a recolour:
//  · Soil  — earthy grains fall past receding roots (underground)
//  · Gut   — a receding tunnel of rings you travel through
//  · Water — bubbles rise toward a rippling surface (underwater)
//  · Café  — warm foam drifts up past big soft bubbles
// Theme-aware background, pointer parallax, frozen under reduced motion.
type ZoneKey = 'soil' | 'cafe' | 'gut' | 'waterways';

const BG: Record<ZoneKey, string> = {
  soil: 'linear-gradient(180deg, color-mix(in srgb, var(--c-lime) 16%, var(--color-bg)) 0%, color-mix(in srgb, var(--c-amber) 24%, var(--color-bg)) 55%, color-mix(in srgb, #6b3f16 30%, var(--color-bg)) 100%)',
  cafe: 'radial-gradient(90% 80% at 60% 15%, color-mix(in srgb, var(--c-amber) 22%, var(--color-bg)), var(--color-bg))',
  gut: 'radial-gradient(70% 95% at 50% 50%, color-mix(in srgb, var(--c-magenta) 24%, var(--color-bg)), var(--color-bg))',
  waterways: 'linear-gradient(180deg, color-mix(in srgb, var(--c-cyan) 30%, var(--color-bg)) 0%, color-mix(in srgb, var(--c-cyan) 16%, var(--color-bg)) 40%, color-mix(in srgb, #06263a 30%, var(--color-bg)) 100%)',
};
const PALETTE: Record<ZoneKey, string[]> = {
  soil: ['#6b3f16', '#4caf6d', '#8bd45a', '#a9762f'],
  cafe: ['#f6a723', '#ef8a3a', '#ffd07a', '#e8c37a'],
  gut: ['#ec4d97', '#ff7ac0', '#9b6fc0', '#ff9ed6'],
  waterways: ['#17a9e0', '#38c9ff', '#8fe1ff', '#bff0ff'],
};

export default function Habitat3D({ zone }: { zone: string }) {
  const reduced = useReducedMotion();
  const z = (zone as ZoneKey) in BG ? (zone as ZoneKey) : 'soil';

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden style={{ background: BG[z] }}>
      <Canvas
        camera={{ position: [0, 0, 7], fov: 60 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        frameloop={reduced ? 'demand' : 'always'}
      >
        <ambientLight intensity={1.15} />
        <directionalLight position={[3, 5, 6]} intensity={2} />
        <Parallax reduced={reduced}>
          {z === 'soil' && (
            <>
              <Swarm colors={PALETTE.soil} count={70} dir={-1} shape="box" reduced={reduced} />
              <Roots reduced={reduced} />
            </>
          )}
          {z === 'gut' && (
            <>
              <Tunnel reduced={reduced} />
              <Swarm colors={PALETTE.gut} count={45} dir={0.4} shape="sphere" reduced={reduced} />
            </>
          )}
          {z === 'waterways' && (
            <>
              <Swarm colors={PALETTE.waterways} count={90} dir={1} shape="sphere" reduced={reduced} />
              <Surface reduced={reduced} />
            </>
          )}
          {z === 'cafe' && (
            <>
              <Swarm colors={PALETTE.cafe} count={55} dir={1} shape="sphere" reduced={reduced} />
              <BigBubbles reduced={reduced} />
            </>
          )}
        </Parallax>
      </Canvas>
    </div>
  );
}

function Parallax({ reduced, children }: { reduced: boolean; children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (reduced || !ref.current) return;
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, state.pointer.x * 0.35, 0.05);
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, -state.pointer.y * 0.25, 0.05);
  });
  return <group ref={ref}>{children}</group>;
}

/** Instanced drifting particles: spheres (cells/bubbles) or boxes (soil grains). */
function Swarm({
  colors,
  count,
  dir,
  shape,
  reduced,
}: {
  colors: string[];
  count: number;
  dir: number;
  shape: 'sphere' | 'box';
  reduced: boolean;
}) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const { invalidate } = useThree();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: (Math.random() - 0.5) * 16,
        y: (Math.random() - 0.5) * 12,
        z: (Math.random() - 0.5) * 10 - 2,
        s: (shape === 'box' ? 0.1 : 0.14) + Math.random() * (shape === 'box' ? 0.24 : 0.5),
        speed: 0.15 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
        sway: 0.3 + Math.random() * 0.9,
      })),
    [count, shape],
  );

  useEffect(() => {
    if (!mesh.current) return;
    const c = new THREE.Color();
    seeds.forEach((p, i) => {
      dummy.position.set(p.x, p.y, p.z);
      dummy.scale.setScalar(p.s);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
      c.set(colors[i % colors.length]);
      mesh.current!.setColorAt(i, c);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true;
    invalidate();
  }, [seeds, colors, dummy, invalidate]);

  useFrame((state, delta) => {
    if (reduced || !mesh.current || dir === 0) return;
    const t = state.clock.elapsedTime;
    seeds.forEach((p, i) => {
      p.y += delta * p.speed * dir;
      if (dir > 0 && p.y > 6) p.y = -6;
      if (dir < 0 && p.y < -6) p.y = 6;
      dummy.position.set(p.x + Math.sin(t * 0.4 + p.phase) * p.sway, p.y, p.z);
      dummy.rotation.set(t * 0.2 + p.phase, t * 0.15, 0);
      dummy.scale.setScalar(p.s);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      {shape === 'box' ? <boxGeometry args={[1, 1, 1]} /> : <sphereGeometry args={[1, 16, 16]} />}
      <meshStandardMaterial transparent opacity={shape === 'box' ? 0.85 : 0.7} roughness={0.4} metalness={0.1} />
    </instancedMesh>
  );
}

/** Soil: thick roots descending into the earth, receding in depth. */
function Roots({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const roots = useMemo(
    () => [
      { x: -5, z: -3, rot: 0.15, len: 16 },
      { x: -1.5, z: -6, rot: -0.1, len: 20 },
      { x: 2.5, z: -2, rot: 0.2, len: 14 },
      { x: 5.5, z: -7, rot: -0.18, len: 22 },
    ],
    [],
  );
  useFrame((state) => {
    if (reduced || !ref.current) return;
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.03;
  });
  return (
    <group ref={ref}>
      {roots.map((r, i) => (
        <mesh key={i} position={[r.x, -2, r.z]} rotation={[0, 0, r.rot]}>
          <cylinderGeometry args={[0.14, 0.28, r.len, 8]} />
          <meshStandardMaterial color="#6b3f16" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

/** Gut: a receding tunnel of glowing rings. */
function Tunnel({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const rings = useMemo(() => Array.from({ length: 10 }, (_, i) => i), []);
  useFrame((_, delta) => {
    if (reduced || !ref.current) return;
    ref.current.rotation.z += delta * 0.08;
    ref.current.children.forEach((ring) => {
      ring.position.z += delta * 1.4;
      if (ring.position.z > 4) ring.position.z -= 20;
    });
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

/** Water: a rippling translucent surface above you. */
function Surface({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (reduced || !ref.current) return;
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.15) * 0.06;
    ref.current.position.y = 5 + Math.sin(state.clock.elapsedTime * 0.4) * 0.15;
  });
  return (
    <mesh ref={ref} position={[0, 5, -2]} rotation={[-Math.PI / 2.4, 0, 0]}>
      <planeGeometry args={[34, 24, 1, 1]} />
      <meshStandardMaterial color="#7fdcff" transparent opacity={0.16} side={THREE.DoubleSide} />
    </mesh>
  );
}

/** Café: a few big soft bubbles bobbing warmly. */
function BigBubbles({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const blobs = useMemo(() => [{ x: -4, y: -1, s: 1.4 }, { x: 3.5, y: 1.5, s: 1.9 }, { x: 5, y: -2.5, s: 1.1 }], []);
  useFrame((state) => {
    if (reduced || !ref.current) return;
    ref.current.children.forEach((b, i) => {
      b.position.y = blobs[i].y + Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.5;
    });
  });
  return (
    <group ref={ref}>
      {blobs.map((b, i) => (
        <mesh key={i} position={[b.x, b.y, -3]}>
          <sphereGeometry args={[b.s, 24, 24]} />
          <meshStandardMaterial color="#ffce85" transparent opacity={0.22} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
}
