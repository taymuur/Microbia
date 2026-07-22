import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useReducedMotion } from '../hooks/useReducedMotion';

// A blocky, Minecraft-style world behind every stage. One persistent canvas
// (mounted once by the Tour) swaps its biome by `zone`, so each stage renders
// its own distinct voxel scene: falling grains + roots (soil), wood + food
// (café), teeth (mouth), a pink tunnel (gut), a poo mound (poo), and rising
// bubbles under a surface (water). Frozen under reduced motion.
type ZoneKey = 'soil' | 'cafe' | 'mouth' | 'gut' | 'poo' | 'waterways' | 'keepers';
type Sig = 'roots' | 'teeth' | 'tunnel' | 'poo' | 'water' | 'none';

interface Biome {
  floor: [string, string];
  motes: string[];
  fog: string;
  dir: number;
  sig: Sig;
}
const BIOME: Record<ZoneKey, Biome> = {
  soil: { floor: ['#6a4a2b', '#5a8a3a'], motes: ['#7a5230', '#6aa84f', '#8b8b8b'], fog: '#4a3320', dir: -0.5, sig: 'roots' },
  cafe: { floor: ['#b58b52', '#8a6a3e'], motes: ['#caa06a', '#e0b57a', '#d98a2b'], fog: '#7a5c34', dir: 0.5, sig: 'none' },
  mouth: { floor: ['#d76a86', '#c0392b'], motes: ['#f4f4f4', '#e08aa0'], fog: '#b8556e', dir: 0.3, sig: 'teeth' },
  gut: { floor: ['#c94f8f', '#9b4a8f'], motes: ['#e05aa0', '#b0407e', '#7a5bd0'], fog: '#8f3d70', dir: 0.3, sig: 'tunnel' },
  poo: { floor: ['#5a3d22', '#6b4a2b'], motes: ['#6b4a2b', '#4e3520', '#7a5230'], fog: '#33230f', dir: 0.4, sig: 'poo' },
  waterways: { floor: ['#c2a878', '#3f76e4'], motes: ['#3f76e4', '#5a9bf0', '#8fd0ff'], fog: '#2a5296', dir: 1, sig: 'water' },
  keepers: { floor: ['#6aa84f', '#7a5230'], motes: ['#7fb238', '#8fb9e8', '#caa06a'], fog: '#6f9fd0', dir: 0.2, sig: 'none' },
};

export default function Habitat3D({ zone }: { zone: string }) {
  const reduced = useReducedMotion();
  const z = ((zone as ZoneKey) in BIOME ? zone : 'soil') as ZoneKey;
  const b = BIOME[z];

  return (
    <div className="absolute inset-0" aria-hidden>
      <Canvas
        camera={{ position: [0, 0.5, 8], fov: 60 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        frameloop={reduced ? 'demand' : 'always'}
      >
        <fog attach="fog" args={[b.fog, 6, 24]} />
        <ambientLight intensity={1.25} />
        <directionalLight position={[4, 8, 5]} intensity={2.2} />
        <Parallax reduced={reduced}>
          <Floor colors={b.floor} />
          <CubeField key={z} colors={b.motes} dir={b.dir} reduced={reduced} />
          <Signature sig={b.sig} reduced={reduced} />
        </Parallax>
      </Canvas>
    </div>
  );
}

function Parallax({ reduced, children }: { reduced: boolean; children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (reduced || !ref.current) return;
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, state.pointer.x * 0.3, 0.05);
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, -state.pointer.y * 0.18, 0.05);
  });
  return <group ref={ref}>{children}</group>;
}

const box = <boxGeometry args={[1, 1, 1]} />;
const matte = (color: string, opacity = 1) => (
  <meshStandardMaterial color={color} roughness={0.95} metalness={0} flatShading transparent={opacity < 1} opacity={opacity} />
);

/** A receding blocky ground made of cubes. */
function Floor({ colors }: { colors: [string, string] }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const { invalidate } = useThree();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const cells = useMemo(() => {
    const out: { x: number; z: number; c: number; h: number }[] = [];
    for (let x = -8; x <= 8; x++)
      for (let zz = -16; zz <= 1; zz++) out.push({ x, z: zz, c: (x + zz) & 1, h: 0.5 + Math.random() * 0.3 });
    return out;
  }, []);
  useEffect(() => {
    if (!mesh.current) return;
    const col = new THREE.Color();
    cells.forEach((p, i) => {
      dummy.position.set(p.x * 1.02, -3 - (1 - p.h), p.z * 1.02);
      dummy.scale.set(1, p.h * 2, 1);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
      col.set(colors[p.c]);
      mesh.current!.setColorAt(i, col);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true;
    invalidate();
  }, [cells, colors, dummy, invalidate]);
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, cells.length]}>
      {box}
      {matte('#ffffff')}
    </instancedMesh>
  );
}

/** Drifting cube particles (grains / food / bubbles). */
function CubeField({ colors, dir, reduced }: { colors: string[]; dir: number; reduced: boolean }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const { invalidate } = useThree();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const N = 46;
  const seeds = useMemo(
    () =>
      Array.from({ length: N }, () => ({
        x: (Math.random() - 0.5) * 16,
        y: (Math.random() - 0.5) * 10,
        z: (Math.random() - 0.5) * 12 - 3,
        s: 0.2 + Math.random() * 0.5,
        sp: 0.3 + Math.random() * 0.7,
        r: Math.random() * Math.PI,
      })),
    [],
  );
  useEffect(() => {
    if (!mesh.current) return;
    const col = new THREE.Color();
    seeds.forEach((p, i) => {
      dummy.position.set(p.x, p.y, p.z);
      dummy.scale.setScalar(p.s);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
      col.set(colors[i % colors.length]);
      mesh.current!.setColorAt(i, col);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true;
    invalidate();
  }, [seeds, colors, dummy, invalidate]);
  useFrame((state, delta) => {
    if (reduced || !mesh.current) return;
    const t = state.clock.elapsedTime;
    seeds.forEach((p, i) => {
      p.y += delta * p.sp * dir;
      if (dir > 0 && p.y > 5.5) p.y = -5.5;
      if (dir < 0 && p.y < -5.5) p.y = 5.5;
      dummy.position.set(p.x + Math.sin(t * 0.5 + p.r) * 0.5, p.y, p.z);
      dummy.rotation.set(t * 0.3 + p.r, t * 0.2, 0);
      dummy.scale.setScalar(p.s);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, N]}>
      {box}
      {matte('#ffffff', 0.92)}
    </instancedMesh>
  );
}

function Signature({ sig, reduced }: { sig: Sig; reduced: boolean }) {
  if (sig === 'tunnel') return <Tunnel reduced={reduced} />;
  if (sig === 'teeth') return <Teeth />;
  if (sig === 'poo') return <PooMound reduced={reduced} />;
  if (sig === 'roots') return <Roots reduced={reduced} />;
  if (sig === 'water') return <WaterSurface reduced={reduced} />;
  return null;
}

/** Gut: square cube frames receding toward you. */
function Tunnel({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const rings = useMemo(() => Array.from({ length: 8 }, (_, i) => i), []);
  useFrame((_, delta) => {
    if (reduced || !ref.current) return;
    ref.current.children.forEach((r) => {
      r.position.z += delta * 1.6;
      if (r.position.z > 6) r.position.z -= 20;
    });
  });
  const bar = (w: number, h: number, x: number, y: number) => (
    <mesh position={[x, y, 0]} scale={[w, h, 0.6]}>
      {box}
      {matte('#e05aa0', 0.85)}
    </mesh>
  );
  return (
    <group ref={ref}>
      {rings.map((i) => (
        <group key={i} position={[0, 0, -i * 2.4]}>
          {bar(6.4, 0.6, 0, 3)}
          {bar(6.4, 0.6, 0, -3)}
          {bar(0.6, 6.4, -3, 0)}
          {bar(0.6, 6.4, 3, 0)}
        </group>
      ))}
    </group>
  );
}

/** Mouth: two rows of teeth. */
function Teeth() {
  const cols = useMemo(() => Array.from({ length: 9 }, (_, i) => -8 + i * 2), []);
  return (
    <group position={[0, 0, -1]}>
      {cols.map((x) => (
        <mesh key={`t${x}`} position={[x, 3.4, 0]} scale={[1.3, 1.6, 1.3]}>
          {box}
          {matte('#f6f6f6')}
        </mesh>
      ))}
      {cols.map((x) => (
        <mesh key={`b${x}`} position={[x, -3.4, 0]} scale={[1.3, 1.6, 1.3]}>
          {box}
          {matte('#f6f6f6')}
        </mesh>
      ))}
    </group>
  );
}

/** Poo: a stepped brown mound. */
function PooMound({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const blocks = useMemo(() => {
    const out: [number, number, number][] = [];
    const layers = [{ y: -2.2, r: 3 }, { y: -1, r: 2 }, { y: 0.2, r: 1 }];
    layers.forEach((l) => {
      for (let x = -l.r; x <= l.r; x++) for (let z = -l.r; z <= l.r; z++) out.push([x, l.y, z - 2]);
    });
    return out;
  }, []);
  useFrame((state) => {
    if (reduced || !ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.15;
  });
  return (
    <group ref={ref}>
      {blocks.map((p, i) => (
        <mesh key={i} position={p} scale={0.98}>
          {box}
          {matte(i % 3 === 0 ? '#4e3520' : '#6b4a2b')}
        </mesh>
      ))}
    </group>
  );
}

/** Soil: root columns descending. */
function Roots({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const cols = useMemo(() => [-6, -2, 3, 6], []);
  useFrame((state) => {
    if (reduced || !ref.current) return;
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.03;
  });
  return (
    <group ref={ref}>
      {cols.map((x, ci) =>
        Array.from({ length: 6 }, (_, i) => (
          <mesh key={`${ci}-${i}`} position={[x + (i % 2 ? 0.3 : 0), -1 - i * 1.1, -2 - ci]} scale={[0.7, 1, 0.7]}>
            {box}
            {matte('#6b4a2b')}
          </mesh>
        )),
      )}
    </group>
  );
}

/** Water: a rippling surface of translucent cubes above you. */
function WaterSurface({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const cells = useMemo(() => {
    const out: [number, number][] = [];
    for (let x = -8; x <= 8; x += 2) for (let z = -14; z <= 2; z += 2) out.push([x, z]);
    return out;
  }, []);
  useFrame((state) => {
    if (reduced || !ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.children.forEach((c, i) => {
      c.position.y = 4.5 + Math.sin(t + i) * 0.25;
    });
  });
  return (
    <group ref={ref}>
      {cells.map((p, i) => (
        <mesh key={i} position={[p[0], 4.5, p[1]]} scale={[2, 0.4, 2]}>
          {box}
          {matte('#4a90e2', 0.35)}
        </mesh>
      ))}
    </group>
  );
}
