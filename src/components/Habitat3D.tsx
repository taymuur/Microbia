import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useReducedMotion } from '../hooks/useReducedMotion';

// One persistent canvas for the whole tour. `zone` picks the biome; `voxel`
// picks the look: soft translucent bubbles (classic) or matte cubes (blocks).
// Each stage gets its own distinct scene: soil grains + roots, café foam,
// mouth teeth, gut tunnel, poo mound, water bubbles under a surface.
type ZoneKey = 'soil' | 'cafe' | 'mouth' | 'gut' | 'poo' | 'waterways' | 'keepers';
type Sig = 'roots' | 'cafe' | 'mouth' | 'gut' | 'poo' | 'water' | 'none';

interface Biome {
  colors: string[];
  floor: [string, string];
  bg: string;
  fog: string;
  dir: number;
  sig: Sig;
}
const BIOME: Record<ZoneKey, Biome> = {
  soil: { colors: ['#7a5230', '#6aa84f', '#8bd45a'], floor: ['#6a4a2b', '#5a8a3a'], bg: 'var(--c-lime)', fog: '#4a3320', dir: -0.5, sig: 'roots' },
  cafe: { colors: ['#f6a723', '#ef8a3a', '#ffd07a'], floor: ['#b58b52', '#8a6a3e'], bg: 'var(--c-amber)', fog: '#7a5c34', dir: 0.5, sig: 'cafe' },
  mouth: { colors: ['#ffd3dd', '#ec6a86', '#ffffff'], floor: ['#d76a86', '#e08aa0'], bg: 'var(--c-magenta)', fog: '#b8556e', dir: 0.3, sig: 'mouth' },
  gut: { colors: ['#ec4d97', '#ff7ac0', '#b57be0'], floor: ['#c94f8f', '#9b4a8f'], bg: 'var(--c-magenta)', fog: '#8f3d70', dir: 0.3, sig: 'gut' },
  poo: { colors: ['#7a5230', '#4e3520', '#8a5a2b'], floor: ['#5a3d22', '#6b4a2b'], bg: 'var(--c-amber)', fog: '#33230f', dir: 0.4, sig: 'poo' },
  waterways: { colors: ['#38c9ff', '#5a9bf0', '#8fd0ff'], floor: ['#c2a878', '#3f76e4'], bg: 'var(--c-cyan)', fog: '#2a5296', dir: 1, sig: 'water' },
  keepers: { colors: ['#7fb238', '#8fb9e8', '#caa06a'], floor: ['#6aa84f', '#7a5230'], bg: 'var(--c-violet)', fog: '#6f9fd0', dir: 0.2, sig: 'none' },
};

export default function Habitat3D({ zone, voxel }: { zone: string; voxel: boolean }) {
  const reduced = useReducedMotion();
  const z = ((zone as ZoneKey) in BIOME ? zone : 'soil') as ZoneKey;
  const b = BIOME[z];
  const bg = `radial-gradient(120% 90% at 50% 15%, color-mix(in srgb, ${b.bg} 22%, var(--color-bg)), var(--color-bg))`;

  return (
    <div className="absolute inset-0" aria-hidden style={{ background: bg }}>
      <Canvas
        camera={{ position: [0, 0.5, 8], fov: 60 }}
        gl={{ alpha: true, antialias: !voxel, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        frameloop={reduced ? 'demand' : 'always'}
      >
        {voxel && <fog attach="fog" args={[b.fog, 7, 26]} />}
        <ambientLight intensity={1.2} />
        <directionalLight position={[4, 7, 6]} intensity={2.1} />
        <Parallax reduced={reduced}>
          {voxel && <Floor colors={b.floor} />}
          <Swarm key={z + (voxel ? 'v' : 'c')} colors={b.colors} dir={b.dir} voxel={voxel} reduced={reduced} />
          <Signature sig={b.sig} voxel={voxel} reduced={reduced} />
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

const matte = (color: string, opacity = 1, flat = true) => (
  <meshStandardMaterial color={color} roughness={flat ? 0.95 : 0.35} metalness={0.05} flatShading={flat} transparent={opacity < 1} opacity={opacity} />
);

/** Drifting particles: soft spheres (classic) or matte cubes (blocks). */
function Swarm({ colors, dir, voxel, reduced }: { colors: string[]; dir: number; voxel: boolean; reduced: boolean }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const { invalidate } = useThree();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const N = voxel ? 46 : 80;
  const seeds = useMemo(
    () =>
      Array.from({ length: N }, () => ({
        x: (Math.random() - 0.5) * 16,
        y: (Math.random() - 0.5) * 11,
        z: (Math.random() - 0.5) * 12 - 3,
        s: (voxel ? 0.2 : 0.16) + Math.random() * (voxel ? 0.5 : 0.5),
        sp: 0.2 + Math.random() * 0.6,
        r: Math.random() * Math.PI,
      })),
    [N, voxel],
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
    if (reduced || !mesh.current || dir === 0) return;
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
      {voxel ? <boxGeometry args={[1, 1, 1]} /> : <sphereGeometry args={[1, 18, 18]} />}
      {matte('#ffffff', voxel ? 0.95 : 0.7, voxel)}
    </instancedMesh>
  );
}

/** Blocky ground (blocks look only). */
function Floor({ colors }: { colors: [string, string] }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const { invalidate } = useThree();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const cells = useMemo(() => {
    const out: { x: number; z: number; c: number; h: number }[] = [];
    for (let x = -8; x <= 8; x++) for (let zz = -16; zz <= 1; zz++) out.push({ x, z: zz, c: (x + zz) & 1, h: 0.5 + Math.random() * 0.3 });
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
      <boxGeometry args={[1, 1, 1]} />
      {matte('#ffffff')}
    </instancedMesh>
  );
}

function Signature({ sig, voxel, reduced }: { sig: Sig; voxel: boolean; reduced: boolean }) {
  if (sig === 'gut') return <Tunnel voxel={voxel} reduced={reduced} />;
  if (sig === 'roots') return <Roots voxel={voxel} reduced={reduced} />;
  if (sig === 'water') return <Surface voxel={voxel} reduced={reduced} />;
  if (sig === 'poo') return <Mound voxel={voxel} reduced={reduced} />;
  if (sig === 'mouth') return voxel ? <Teeth /> : null;
  if (sig === 'cafe') return !voxel ? <BigBubbles reduced={reduced} /> : null;
  return null;
}

function Tunnel({ voxel, reduced }: { voxel: boolean; reduced: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const rings = useMemo(() => Array.from({ length: voxel ? 8 : 10 }, (_, i) => i), [voxel]);
  useFrame((_, delta) => {
    if (reduced || !ref.current) return;
    if (!voxel) ref.current.rotation.z += delta * 0.08;
    ref.current.children.forEach((r) => {
      r.position.z += delta * 1.5;
      if (r.position.z > 6) r.position.z -= (voxel ? 20 : 24);
    });
  });
  const bar = (w: number, h: number, x: number, y: number) => (
    <mesh position={[x, y, 0]} scale={[w, h, 0.6]}>
      <boxGeometry args={[1, 1, 1]} />
      {matte('#e05aa0', 0.85)}
    </mesh>
  );
  return (
    <group ref={ref}>
      {rings.map((i) =>
        voxel ? (
          <group key={i} position={[0, 0, -i * 2.4]}>
            {bar(6.4, 0.6, 0, 3)}
            {bar(6.4, 0.6, 0, -3)}
            {bar(0.6, 6.4, -3, 0)}
            {bar(0.6, 6.4, 3, 0)}
          </group>
        ) : (
          <mesh key={i} position={[0, 0, -i * 2.2]} rotation={[0, 0, i * 0.3]}>
            <torusGeometry args={[3.4 + (i % 3) * 0.2, 0.16, 10, 40]} />
            <meshStandardMaterial color="#ff5cb8" emissive="#ec4d97" emissiveIntensity={0.5} transparent opacity={0.5} />
          </mesh>
        ),
      )}
    </group>
  );
}

function Roots({ voxel, reduced }: { voxel: boolean; reduced: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const cols = useMemo(() => [-6, -2, 3, 6], []);
  useFrame((state) => {
    if (reduced || !ref.current) return;
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.03;
  });
  return (
    <group ref={ref}>
      {cols.map((x, ci) =>
        voxel ? (
          Array.from({ length: 6 }, (_, i) => (
            <mesh key={`${ci}-${i}`} position={[x + (i % 2 ? 0.3 : 0), -1 - i * 1.1, -2 - ci]} scale={[0.7, 1, 0.7]}>
              <boxGeometry args={[1, 1, 1]} />
              {matte('#6b4a2b')}
            </mesh>
          ))
        ) : (
          <mesh key={ci} position={[x, -2, -2 - ci]} rotation={[0, 0, ci % 2 ? 0.15 : -0.12]}>
            <cylinderGeometry args={[0.14, 0.28, 16, 8]} />
            {matte('#6b4a2b', 1, false)}
          </mesh>
        ),
      )}
    </group>
  );
}

function Surface({ voxel, reduced }: { voxel: boolean; reduced: boolean }) {
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
  if (!voxel)
    return (
      <mesh position={[0, 5, -2]} rotation={[-Math.PI / 2.4, 0, 0]}>
        <planeGeometry args={[34, 24, 1, 1]} />
        <meshStandardMaterial color="#7fdcff" transparent opacity={0.16} side={THREE.DoubleSide} />
      </mesh>
    );
  return (
    <group ref={ref}>
      {cells.map((p, i) => (
        <mesh key={i} position={[p[0], 4.5, p[1]]} scale={[2, 0.4, 2]}>
          <boxGeometry args={[1, 1, 1]} />
          {matte('#4a90e2', 0.35)}
        </mesh>
      ))}
    </group>
  );
}

function Mound({ voxel, reduced }: { voxel: boolean; reduced: boolean }) {
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
        <mesh key={i} position={p} scale={voxel ? 0.98 : 1.1}>
          {voxel ? <boxGeometry args={[1, 1, 1]} /> : <sphereGeometry args={[0.6, 12, 12]} />}
          {matte(i % 3 === 0 ? '#4e3520' : '#6b4a2b', 1, voxel)}
        </mesh>
      ))}
    </group>
  );
}

function Teeth() {
  const cols = useMemo(() => Array.from({ length: 9 }, (_, i) => -8 + i * 2), []);
  return (
    <group position={[0, 0, -1]}>
      {cols.map((x) => (
        <mesh key={`t${x}`} position={[x, 3.4, 0]} scale={[1.3, 1.6, 1.3]}>
          <boxGeometry args={[1, 1, 1]} />
          {matte('#f6f6f6')}
        </mesh>
      ))}
      {cols.map((x) => (
        <mesh key={`b${x}`} position={[x, -3.4, 0]} scale={[1.3, 1.6, 1.3]}>
          <boxGeometry args={[1, 1, 1]} />
          {matte('#f6f6f6')}
        </mesh>
      ))}
    </group>
  );
}

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
