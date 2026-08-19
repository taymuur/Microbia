import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  brickTexture,
  menuTexture,
  soilTexture,
  tileTexture,
  woodTexture,
} from '../../lib/three-helpers';

// The Minecraft look: everything is a cube or a stack of cubes, flat-shaded,
// with nearest-neighbour (pixelated) textures and blocky terrain.

type P = { reduced: boolean };
type Vec = [number, number, number];
const V = (x: number, y: number, z: number): Vec => [x, y, z];
const rnd = (a: number, b: number) => a + Math.random() * (b - a);

/** A single block. The only building material in this look. */
function B({
  p,
  s = 1,
  c,
  map,
  o = 1,
  r,
}: {
  p: Vec;
  s?: number | Vec;
  c?: string;
  map?: THREE.Texture;
  o?: number;
  r?: Vec;
}) {
  const sc: Vec = typeof s === 'number' ? [s, s, s] : s;
  return (
    <mesh position={p} scale={sc} rotation={r}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={c}
        map={map}
        flatShading
        roughness={1}
        metalness={0}
        transparent={o < 1}
        opacity={o}
      />
    </mesh>
  );
}

/** Blocky terrain: a grid of cubes with a grass cap. */
function Terrain({
  top,
  soil,
  y = -3,
  width = 17,
  depth = 9,
}: {
  top: string;
  soil: string;
  y?: number;
  width?: number;
  depth?: number;
}) {
  const cells = useMemo(() => {
    const out: { x: number; z: number; h: number; alt: boolean }[] = [];
    const hw = Math.floor(width / 2);
    for (let x = -hw; x <= hw; x++)
      for (let z = -depth; z <= -1; z++) out.push({ x, z, h: Math.random() < 0.12 ? 0.25 : 0, alt: (x + z) % 2 === 0 });
    return out;
  }, [width, depth]);
  return (
    <group>
      {cells.map((c, i) => (
        <group key={i}>
          <B p={V(c.x * 2, y + c.h, c.z * 2)} s={[2, 1, 2]} c={c.alt ? top : shade(top)} />
          <B p={V(c.x * 2, y - 1.6, c.z * 2)} s={[2, 2.2, 2]} c={c.alt ? soil : shade(soil)} />
        </group>
      ))}
    </group>
  );
}

function shade(hex: string) {
  const c = new THREE.Color(hex);
  c.multiplyScalar(0.88);
  return `#${c.getHexString()}`;
}

/* ================================ SOIL ================================ */
export function SoilBlocks({ reduced }: P) {
  const soil = useMemo(() => soilTexture(true), []);
  const crops = useRef<THREE.Group>(null);
  const crumbs = useRef<THREE.Group>(null);
  const plants = useMemo(
    () => [
      { x: -13, k: 'wheat' as const },
      { x: -9, k: 'carrot' as const },
      { x: -5, k: 'lettuce' as const },
      { x: -1, k: 'carrot' as const },
      { x: 3, k: 'wheat' as const },
      { x: 7, k: 'carrot' as const },
      { x: 11, k: 'lettuce' as const },
    ],
    [],
  );
  const seeds = useMemo(
    () => Array.from({ length: 20 }, () => ({ x: rnd(-15, 15), y: rnd(-7, -1.5), s: rnd(0.14, 0.34), sp: rnd(0.15, 0.5) })),
    [],
  );

  useFrame((state, delta) => {
    if (reduced) return;
    const t = state.clock.elapsedTime;
    crops.current?.children.forEach((c, i) => {
      c.rotation.z = Math.round(Math.sin(t * 0.8 + i) * 3) * 0.016;
    });
    crumbs.current?.children.forEach((c, i) => {
      c.position.y -= delta * seeds[i].sp;
      if (c.position.y < -7) c.position.y = -1.5;
    });
  });

  return (
    <group>
      {/* blocky sun and cloud */}
      <B p={V(10, 6, -14)} s={2.4} c="#fff09a" />
      {[[-9, 6.4], [-7.4, 6.4], [-8.2, 7.2], [6, 7]].map((q, i) => (
        <B key={i} p={V(q[0], q[1], -13)} s={[2, 1.2, 1]} c="#ffffff" />
      ))}

      {/* soil wall behind, textured with pixelated dirt */}
      <mesh position={V(0, -5.5, -5)}>
        <boxGeometry args={[44, 10, 1]} />
        <meshStandardMaterial map={soil} flatShading roughness={1} />
      </mesh>
      <Terrain top="#5da83f" soil="#7d5230" y={-1.4} width={17} depth={6} />
      {/* cross-section slab in front, so the roots are visible against the dirt */}
      <mesh position={V(0, -5.2, 3)}>
        <boxGeometry args={[44, 8, 2]} />
        <meshStandardMaterial map={soil} flatShading roughness={1} />
      </mesh>
      <B p={V(0, -1.05, 3)} s={[44, 0.9, 2.1]} c="#7d5230" />
      <B p={V(0, -0.55, 3)} s={[44, 0.4, 2.2]} c="#5da83f" />

      <group ref={crops}>
        {plants.map((p, i) => (
          <group key={i} position={V(p.x * 0.92, -0.35, 4.1)} scale={0.72}>
            {p.k === 'carrot' && (
              <>
                <B p={V(0, -1.4, 0)} s={[1, 1, 1]} c="#f07f1a" />
                <B p={V(0, -2.3, 0)} s={[0.7, 0.9, 0.7]} c="#d96a10" />
                <B p={V(0, -3, 0)} s={[0.4, 0.6, 0.4]} c="#c25c0c" />
                <B p={V(-0.5, 0, 0)} s={[0.35, 1.6, 0.35]} c="#3f8f34" />
                <B p={V(0, 0.3, 0)} s={[0.35, 2, 0.35]} c="#4fa63e" />
                <B p={V(0.5, 0, 0)} s={[0.35, 1.6, 0.35]} c="#3f8f34" />
              </>
            )}
            {p.k === 'lettuce' && (
              <>
                <B p={V(0, -0.2, 0)} s={1.9} c="#57ab38" />
                <B p={V(-1, -0.4, 0.3)} s={1.1} c="#69bf46" />
                <B p={V(1, -0.35, -0.3)} s={1.2} c="#4f9f32" />
                <B p={V(0, -1.4, 0)} s={[0.5, 1, 0.5]} c="#c8d98a" />
              </>
            )}
            {p.k === 'wheat' && (
              <>
                {[-0.6, 0, 0.6].map((dx, k) => (
                  <group key={k}>
                    <B p={V(dx, 0.4, 0)} s={[0.24, 2.6, 0.24]} c="#9dbb4e" />
                    <B p={V(dx, 2, 0)} s={[0.6, 1.1, 0.6]} c="#e0bf4e" />
                  </group>
                ))}
              </>
            )}
            {/* blocky roots stepping down */}
            <B p={V(0, -3.9, 0)} s={[0.4, 1.6, 0.4]} c="#c9a06a" />
            <B p={V(-0.7, -4.9, 0)} s={[0.34, 1.3, 0.34]} c="#d8b483" r={V(0, 0, 0.5)} />
            <B p={V(0.7, -5.1, 0)} s={[0.34, 1.3, 0.34]} c="#d8b483" r={V(0, 0, -0.5)} />
            <B p={V(0, -5.6, 0)} s={[0.3, 1.4, 0.3]} c="#c9a06a" />
          </group>
        ))}
      </group>

      <group ref={crumbs}>
        {seeds.map((c, i) => (
          <B key={i} p={V(c.x, c.y, 3)} s={c.s} c={i % 3 ? '#5a3a1e' : '#4f8f3a'} />
        ))}
      </group>
    </group>
  );
}

/* ================================ CAFÉ ================================ */
export function CafeBlocks({ reduced }: P) {
  const wood = useMemo(() => woodTexture(true), []);
  const menu = useMemo(() => menuTexture(true), []);
  const coin = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (reduced || !coin.current) return;
    const t = state.clock.elapsedTime;
    const k = (t % 3) / 3;
    coin.current.position.x = 1.2 + k * 3.4;
    coin.current.position.y = -0.2 + Math.sin(k * Math.PI) * 1.5;
    coin.current.rotation.z = Math.round(t * 4) * 0.4;
  });

  return (
    <group>
      {/* wall and wainscot */}
      <B p={V(0, 1, -7)} s={[46, 22, 1]} c="#e8c48d" />
      <B p={V(0, -4.6, -6.6)} s={[46, 4, 0.5]} c="#b8813f" />

      {/* menu board */}
      <group position={V(4.8, 2.4, -6.2)}>
        <B p={V(0, 0, 0)} s={[7.8, 5, 0.4]} c="#3a2a1c" />
        <mesh position={V(0, 0, 0.24)}>
          <planeGeometry args={[7, 4.3]} />
          <meshStandardMaterial map={menu} flatShading roughness={1} />
        </mesh>
      </group>

      {/* hanging wooden sign */}
      <group position={V(-6.8, 3.6, -6)}>
        <mesh position={V(0, 0, 0)}>
          <boxGeometry args={[5.6, 1.6, 0.3]} />
          <meshStandardMaterial map={wood} flatShading roughness={1} />
        </mesh>
        <B p={V(0, 0, 0.2)} s={[5, 1.1, 0.06]} c="#f6e2b6" />
        {[-1.7, -0.6, 0.5, 1.6].map((x, i) => (
          <B key={i} p={V(x, 0, 0.26)} s={[0.72, 0.18, 0.04]} c="#7a4a1c" />
        ))}
        <B p={V(-2.4, 1.2, 0)} s={[0.14, 1.4, 0.14]} c="#5a4632" />
        <B p={V(2.4, 1.2, 0)} s={[0.14, 1.4, 0.14]} c="#5a4632" />
      </group>

      {/* blocky lanterns */}
      {[-9, -3, 3.4, 9.6].map((x, i) => (
        <group key={i} position={V(x, 4.4, -3)}>
          <B p={V(0, 1.4, 0)} s={[0.12, 2.4, 0.12]} c="#5a4632" />
          <B p={V(0, 0, 0)} s={[1, 1, 1]} c="#ffd98a" />
          <pointLight position={V(0, 0, 0)} intensity={9} distance={11} color="#ffd89a" />
        </group>
      ))}

      {/* shelf and jars */}
      <B p={V(-4, 0.9, -6.3)} s={[12, 0.4, 1]} c="#a8763f" />
      {[-8.6, -7.2, -5.8, -4.4, -1.6, -0.2].map((x, i) => (
        <B key={i} p={V(x, 1.6, -6.3)} s={[0.8, 1.1, 0.8]} c={['#e8c07a', '#c98f4a', '#efd9a5', '#d9a05b', '#e0b27a', '#caa06a'][i]} />
      ))}

      {/* counter */}
      <mesh position={V(0, -3.4, 0)}>
        <boxGeometry args={[34, 2.8, 3.4]} />
        <meshStandardMaterial map={wood} flatShading roughness={1} />
      </mesh>
      <B p={V(0, -1.9, 0.2)} s={[34.6, 0.4, 4]} c="#d3a05a" />

      <BlockPerson x={-3.4} z={-2.6} skin="#e6b184" shirt="#3f9dc4" />
      <BlockPerson x={5.6} z={2.2} skin="#c07a4c" shirt="#e2653f" />

      {/* pizza, bread, cup */}
      <group position={V(0.4, -1.5, 1)}>
        <B p={V(0, 0, 0)} s={[3, 0.24, 3]} c="#d9a465" />
        <B p={V(0, 0.18, 0)} s={[2.6, 0.16, 2.6]} c="#e8b552" />
        {[[-0.7, 0.5], [0.6, 0.2], [0.1, -0.7], [-0.4, -0.2]].map((q, i) => (
          <B key={i} p={V(q[0], 0.3, q[1])} s={[0.6, 0.12, 0.6]} c="#b8342a" />
        ))}
      </group>
      <B p={V(-6.6, -1.4, 1)} s={[2, 0.9, 1.2]} c="#c98f4a" />
      <B p={V(-8.6, -1.35, 1.2)} s={[0.9, 1.1, 0.9]} c="#fbfbf7" />

      <group ref={coin} position={V(1.2, -0.2, 2.4)}>
        <B p={V(0, 0, 0)} s={[0.44, 0.44, 0.1]} c="#e8c04a" />
      </group>
    </group>
  );
}

function BlockPerson({ x, z, skin, shirt }: { x: number; z: number; skin: string; shirt: string }) {
  return (
    <group position={V(x, -2.1, z)}>
      <B p={V(0, -0.7, 0)} s={[1.7, 2.6, 1]} c={shirt} />
      <B p={V(0, 1.2, 0)} s={[1.4, 1.4, 1.4]} c={skin} />
      <B p={V(0, 1.85, 0)} s={[1.5, 0.4, 1.5]} c="#3d2b1d" />
      <B p={V(-0.42, 1.25, 0.72)} s={[0.22, 0.22, 0.06]} c="#20202a" />
      <B p={V(0.42, 1.25, 0.72)} s={[0.22, 0.22, 0.06]} c="#20202a" />
      <B p={V(1.15, -0.6, 0.3)} s={[0.5, 1.7, 0.5]} c={skin} r={V(0, 0, 0.45)} />
      <B p={V(-1.15, -0.6, 0.3)} s={[0.5, 1.7, 0.5]} c={skin} r={V(0, 0, -0.45)} />
    </group>
  );
}

/* ================================ MOUTH ================================ */
export function MouthBlocks({ reduced }: P) {
  const food = useRef<THREE.Group>(null);
  const tongue = useRef<THREE.Group>(null);
  const arch = useMemo(
    () =>
      Array.from({ length: 11 }, (_, i) => {
        const t = -1 + (i / 10) * 2;
        return { x: t * 8, z: 2.4 - t * t * 3 };
      }),
    [],
  );

  useFrame((state) => {
    if (reduced) return;
    const t = state.clock.elapsedTime;
    const k = (t % 4) / 4;
    if (food.current) {
      food.current.position.z = 5 - k * 12;
      food.current.position.y = -2 + k * 1.2;
      food.current.rotation.x = Math.round(k * 6) * 0.5;
      const s = k < 0.72 ? 1 : Math.max(0, 1 - (k - 0.72) / 0.28);
      food.current.scale.setScalar(1.2 * s);
      food.current.visible = s > 0.03;
    }
    if (tongue.current) tongue.current.position.z = 1.4 - Math.sin(k * Math.PI) * 1.4;
  });

  return (
    <group>
      {/* palate, jaw and cheeks, all blocks */}
      <B p={V(0, 6.2, -1)} s={[30, 5, 16]} c="#f0899f" />
      <B p={V(0, -6.2, -1)} s={[30, 5, 16]} c="#e2778f" />
      <B p={V(-14, 0, -1)} s={[4, 14, 16]} c="#e88ba0" />
      <B p={V(14, 0, -1)} s={[4, 14, 16]} c="#e88ba0" />

      {/* gums */}
      <B p={V(0, 3.9, 0.4)} s={[22, 1.4, 2]} c="#d9647f" />
      <B p={V(0, -3.8, 0.4)} s={[22, 1.4, 2]} c="#d9647f" />

      {/* teeth along a stepped arch */}
      {arch.map((a, i) => (
        <B key={`u${i}`} p={V(a.x, 2.7, a.z)} s={[1.3, 1.7, 1.2]} c="#fdfcf6" />
      ))}
      {arch.map((a, i) => (
        <B key={`l${i}`} p={V(a.x, -2.6, a.z)} s={[1.3, 1.7, 1.2]} c="#fdfcf6" />
      ))}

      {/* the throat: a square tunnel of blocks receding away */}
      <group position={V(0, -0.6, -7)}>
        {[0, 1, 2, 3, 4].map((i) => {
          const w = 7 - i * 0.85;
          const dark = `hsl(345, 45%, ${42 - i * 6}%)`;
          return (
            <group key={i} position={V(0, 0, -i * 1.7)}>
              <B p={V(0, w / 2, 0)} s={[w, 0.7, 1.6]} c={dark} />
              <B p={V(0, -w / 2, 0)} s={[w, 0.7, 1.6]} c={dark} />
              <B p={V(-w / 2, 0, 0)} s={[0.7, w, 1.6]} c={dark} />
              <B p={V(w / 2, 0, 0)} s={[0.7, w, 1.6]} c={dark} />
            </group>
          );
        })}
        <B p={V(0, 0, -9)} s={[3.4, 3.4, 0.4]} c="#2a0a14" />
      </group>
      {/* uvula */}
      <B p={V(0, 2.4, -6.4)} s={[0.6, 1.2, 0.6]} c="#d9647f" />

      {/* tongue */}
      <group ref={tongue} position={V(0, -2.9, 1.4)}>
        <B p={V(0, 0, 0)} s={[8, 1.2, 10]} c="#e0687f" />
      </group>

      {/* the mouthful */}
      <group ref={food} position={V(0, -2, 5)}>
        <BlockSlice />
      </group>
    </group>
  );
}

/** A blocky wedge of pizza: stepped rows of blocks forming a triangle. */
function BlockSlice() {
  const rows = useMemo(() => [1, 2, 3, 4], []);
  return (
    <group>
      {rows.map((r) => (
        <group key={r}>
          <B p={V(0, 0, -r * 0.42)} s={[r * 0.42, 0.24, 0.42]} c="#d9a465" />
          <B p={V(0, 0.18, -r * 0.42)} s={[r * 0.38, 0.14, 0.38]} c="#e8b552" />
        </group>
      ))}
      <B p={V(0, 0, 0.28)} s={[0.5, 0.36, 0.5]} c="#cf9a55" />
      <B p={V(0.28, 0.3, -1)} s={[0.34, 0.1, 0.34]} c="#b8342a" />
      <B p={V(-0.3, 0.3, -1.4)} s={[0.34, 0.1, 0.34]} c="#b8342a" />
    </group>
  );
}

/* ================================= GUT ================================= */
export function GutBlocks({ reduced }: P) {
  const wall = useRef<THREE.Group>(null);
  const bits = useRef<THREE.Group>(null);
  const foods = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => {
        const kinds = ['slice', 'pea', 'choc', 'corn', 'crust'] as const;
        const a = Math.random() * Math.PI * 2;
        const r = 0.6 + Math.random() * 2.6;
        return {
          kind: kinds[i % kinds.length],
          x: Math.cos(a) * r,
          y: Math.sin(a) * r,
          z: -Math.random() * 26,
          sp: 1.8 + Math.random() * 1.8,
        };
      }),
    [],
  );

  useFrame((state, delta) => {
    if (reduced) return;
    const t = state.clock.elapsedTime;
    wall.current?.children.forEach((seg) => {
      const s = 1 + Math.sin(t * 1.5 + seg.position.z * 0.4) * 0.05;
      seg.scale.set(s, s, 1);
    });
    bits.current?.children.forEach((c, i) => {
      c.position.z += delta * foods[i].sp;
      if (c.position.z > 8) c.position.z = -26;
      c.rotation.x += delta * 0.7;
      c.rotation.y += delta * 0.5;
    });
  });

  return (
    <group>
      <group ref={wall}>
        {Array.from({ length: 12 }, (_, i) => {
          const w = 11;
          const c = i % 2 ? '#ef7fb4' : '#e05aa0';
          return (
            <group key={i} position={V(0, 0, -i * 2.4 + 4)}>
              <B p={V(0, w / 2, 0)} s={[w + 1, 1, 2.3]} c={c} />
              <B p={V(0, -w / 2, 0)} s={[w + 1, 1, 2.3]} c={c} />
              <B p={V(-w / 2, 0, 0)} s={[1, w, 2.3]} c={c} />
              <B p={V(w / 2, 0, 0)} s={[1, w, 2.3]} c={c} />
              {/* blocky villi bumps */}
              <B p={V(-2.4, w / 2 - 0.9, 0)} s={[0.6, 0.8, 0.6]} c="#f79ac8" />
              <B p={V(2.6, -w / 2 + 0.9, 0)} s={[0.6, 0.8, 0.6]} c="#f79ac8" />
            </group>
          );
        })}
      </group>

      <group ref={bits}>
        {foods.map((f, i) => (
          <group key={i} position={V(f.x, f.y, f.z)}>
            {f.kind === 'slice' && <group scale={0.7}><BlockSlice /></group>}
            {f.kind === 'pea' && <B p={V(0, 0, 0)} s={0.5} c="#66b13f" />}
            {f.kind === 'choc' && <B p={V(0, 0, 0)} s={[0.5, 0.44, 0.46]} c="#4a2c14" />}
            {f.kind === 'corn' && <B p={V(0, 0, 0)} s={[0.36, 0.46, 0.36]} c="#f2c14e" />}
            {f.kind === 'crust' && <B p={V(0, 0, 0)} s={[0.82, 0.34, 0.5]} c="#cf9a55" />}
          </group>
        ))}
      </group>
    </group>
  );
}

/* ================================= POO ================================= */
export function PooBlocks({ reduced }: P) {
  const tiles = useMemo(() => tileTexture(true), []);
  const poo = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (reduced || !poo.current) return;
    poo.current.position.y = 1.2 + Math.round(Math.sin(state.clock.elapsedTime * 1.2) * 3) * 0.03;
  });

  return (
    <group>
      <mesh position={V(0, 2, -8)}>
        <boxGeometry args={[52, 26, 1]} />
        <meshStandardMaterial map={tiles} flatShading roughness={1} />
      </mesh>
      <mesh position={V(0, -6.6, -2)}>
        <boxGeometry args={[52, 1, 16]} />
        <meshStandardMaterial map={tiles} color="#b9cedb" flatShading roughness={1} />
      </mesh>

      {/* blocky toilet */}
      <group position={V(4.2, -3.4, -1)}>
        <B p={V(0, 2.4, -2.4)} s={[4.4, 3.4, 1.6]} c="#fdfefe" />
        <B p={V(0, 4.25, -2.4)} s={[4.6, 0.4, 1.9]} c="#f0f4f7" />
        <B p={V(1.4, 3.9, -1.5)} s={[0.5, 0.4, 0.4]} c="#c3cdd4" />
        {/* bowl as a ring of blocks */}
        <B p={V(0, 0, 0)} s={[4.4, 2.6, 4.4]} c="#fdfefe" />
        <B p={V(0, 1.45, 0)} s={[4.9, 0.5, 4.9]} c="#f4f7f9" />
        <B p={V(0, -2.2, 0)} s={[2.4, 2, 2.4]} c="#eef4f8" />
        <B p={V(0, 1.05, 0)} s={[3.6, 0.3, 3.6]} c="#a5daf2" o={0.9} />
        {/* stepped poo */}
        <group ref={poo} position={V(0, 1.2, 0)}>
          <B p={V(0, 0, 0)} s={[2.4, 0.7, 2.4]} c="#6b4423" />
          <B p={V(0.2, 0.65, -0.1)} s={[1.8, 0.6, 1.8]} c="#7a5230" />
          <B p={V(-0.1, 1.2, 0.1)} s={[1.2, 0.55, 1.2]} c="#6b4423" />
          <B p={V(0.1, 1.65, 0)} s={[0.6, 0.5, 0.6]} c="#7a5230" />
        </group>
      </group>

      {/* toilet roll */}
      <group position={V(-5.6, -1.2, -6)}>
        <B p={V(0, 0, 0)} s={[1.3, 1.3, 1.2]} c="#ffffff" />
        <B p={V(0, 0, 0)} s={[0.45, 0.45, 1.3]} c="#c9b79c" />
        <B p={V(0.75, -1.1, 0)} s={[0.1, 1.9, 1]} c="#fbfbfb" />
      </group>
    </group>
  );
}

/* ============================== WATERWAYS ============================== */
export function WaterBlocks({ reduced }: P) {
  const brick = useMemo(() => brickTexture(true), []);
  const surf = useRef<THREE.Group>(null);
  const flow = useRef<THREE.Group>(null);
  const reeds = useRef<THREE.Group>(null);

  const slabs = useMemo(() => {
    const out: Vec[] = [];
    for (let x = -9; x <= 9; x++) for (let z = -6; z <= 2; z++) out.push(V(x * 2, -2.6, z * 2));
    return out;
  }, []);
  const drops = useMemo(() => Array.from({ length: 18 }, (_, i) => ({ t: i / 18, s: rnd(0.3, 0.6) })), []);

  useFrame((state, delta) => {
    if (reduced) return;
    const t = state.clock.elapsedTime;
    surf.current?.children.forEach((c, i) => {
      c.position.y = -2.6 + Math.round(Math.sin(t * 1.3 + i * 0.5) * 3) * 0.08;
    });
    flow.current?.children.forEach((c) => {
      c.position.x += delta * 4;
      c.position.y -= delta * 2.3;
      if (c.position.x > -1.5) {
        c.position.x = -8.8;
        c.position.y = 1.4;
      }
    });
    reeds.current?.children.forEach((r, i) => {
      r.rotation.z = Math.round(Math.sin(t + i) * 3) * 0.03;
    });
  });

  return (
    <group>
      <B p={V(0, -0.4, -16)} s={[70, 5, 6]} c="#7fa356" />

      {/* sewer outfall, blocky */}
      <group position={V(-11.5, 1.6, -3)}>
        <mesh position={V(0, 0, 0)}>
          <boxGeometry args={[6, 4.4, 4.4]} />
          <meshStandardMaterial map={brick} flatShading roughness={1} />
        </mesh>
        <B p={V(3.1, 0, 0)} s={[0.4, 3.4, 3.4]} c="#5d6a70" />
        <B p={V(3.3, 0, 0)} s={[0.2, 2.8, 2.8]} c="#22303a" />
      </group>

      <group ref={flow}>
        {drops.map((d, i) => (
          <B key={i} p={V(-8.8 + d.t * 7.3, 1.4 - d.t * d.t * 5, -3)} s={d.s} c="#8fd0ee" o={0.85} />
        ))}
      </group>

      {/* blocky lake */}
      <group ref={surf}>
        {slabs.map((p, i) => (
          <B key={i} p={p} s={[2, 0.5, 2]} c={i % 2 ? '#3f93cc' : '#3787bd'} o={0.95} />
        ))}
      </group>
      <B p={V(0, -5.6, -2)} s={[70, 6, 26]} c="#1f5e88" />

      <group ref={reeds}>
        {[-7.5, -6.6, 6.4, 7.3, 12.5].map((x, i) => (
          <B key={i} p={V(x, -1, -7)} s={[0.3, 4.4, 0.3]} c="#4f8f3a" />
        ))}
      </group>
      {[[3.2, -1], [5.4, 2.2], [-3.6, 1.4]].map((p, i) => (
        <B key={i} p={V(p[0], -2.3, p[1])} s={[1.9, 0.24, 1.9]} c="#54a83c" />
      ))}
    </group>
  );
}

/* ============================== SCIENTISTS ============================== */
export function KeepersBlocks({ reduced }: P) {
  const wood = useMemo(() => woodTexture(true), []);
  const g = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (reduced || !g.current) return;
    g.current.children.forEach((c, i) => {
      c.position.y = -1.4 + Math.round(Math.sin(state.clock.elapsedTime * 0.8 + i) * 3) * 0.03;
    });
  });
  return (
    <group>
      <B p={V(0, 2, -8)} s={[54, 24, 1]} c="#d9d2f2" />
      <mesh position={V(0, -3.6, 0)}>
        <boxGeometry args={[30, 1.6, 4]} />
        <meshStandardMaterial map={wood} color="#cfd6e0" flatShading roughness={1} />
      </mesh>
      <group ref={g}>
        {[-9.5, -3.4, 3, 9.2].map((x, i) => (
          <group key={i} position={V(x, -1.4, -1.5)}>
            <B p={V(0, -0.7, 0)} s={[1.7, 2.6, 1]} c="#f4f6fa" />
            <B p={V(0, 1.2, 0)} s={[1.4, 1.4, 1.4]} c={['#e8b98f', '#c98b5e', '#a5714a', '#e0c3a0'][i]} />
            <B p={V(0, 1.85, 0)} s={[1.5, 0.4, 1.5]} c="#3d2b1d" />
            <B p={V(-0.42, 1.25, 0.72)} s={[0.22, 0.22, 0.06]} c="#20202a" />
            <B p={V(0.42, 1.25, 0.72)} s={[0.22, 0.22, 0.06]} c="#20202a" />
          </group>
        ))}
      </group>
      {[-6.4, 0.4, 6.6].map((x, i) => (
        <group key={i} position={V(x, -2.4, 1)}>
          <B p={V(0, 0, 0)} s={[1.4, 0.4, 1.4]} c="#39404d" />
          <B p={V(-0.2, 0.9, 0)} s={[0.4, 1.6, 0.4]} c="#4c5563" />
        </group>
      ))}
    </group>
  );
}
