import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useReducedMotion } from '../hooks/useReducedMotion';

// One persistent canvas. Every stage tells the food's journey as a real scene:
//   soil       crops growing, roots reaching down through the earth
//   cafe       a customer buying food across a counter
//   mouth      teeth and tongue, food heading down the throat
//   gut        chewed food (pepperoni, peas, chocolate, sweetcorn) tumbling through
//   poo        a bright bathroom, the toilet, and what arrives in it
//   waterways  a sewer pipe emptying into a lake
// `voxel` swaps every rounded form for a cube, which is what makes the blocks
// (Minecraft) look. Motion freezes under reduced motion.

type ZoneKey = 'soil' | 'cafe' | 'mouth' | 'gut' | 'poo' | 'waterways' | 'keepers';
type Vec = [number, number, number];
type Shape = 'box' | 'sphere' | 'cyl' | 'cone';

/** Stage backdrops. All kept light so panel text stays readable. */
const BG: Record<ZoneKey, string> = {
  soil: 'linear-gradient(180deg, #bfe3f8 0%, #d8eec4 42%, #a8763f 42%, #7c5127 100%)',
  cafe: 'linear-gradient(180deg, #ffe9c4 0%, #ffd79a 55%, #e8b877 100%)',
  mouth: 'radial-gradient(85% 75% at 50% 45%, #ffb9cd 0%, #f2809f 60%, #d95f80 100%)',
  gut: 'radial-gradient(80% 90% at 50% 50%, #ff9fd0 0%, #ef6bab 55%, #cf4d8d 100%)',
  poo: 'linear-gradient(180deg, #eaf6ff 0%, #dcefff 55%, #cfe6f7 100%)',
  waterways: 'linear-gradient(180deg, #cfeaff 0%, #9ed4f5 45%, #4a9fd4 100%)',
  keepers: 'linear-gradient(180deg, #e6ddff 0%, #d5c9fb 60%, #c3b4f5 100%)',
};

const DARK_BG: Record<ZoneKey, string> = {
  soil: 'linear-gradient(180deg, #16283a 0%, #24402c 42%, #3d2a16 42%, #24190d 100%)',
  cafe: 'linear-gradient(180deg, #3a2a14 0%, #4a3418 55%, #2a1d0d 100%)',
  mouth: 'radial-gradient(85% 75% at 50% 45%, #7a2a44 0%, #5a1e33 60%, #3d1422 100%)',
  gut: 'radial-gradient(80% 90% at 50% 50%, #7d2f5c 0%, #5c2043 55%, #3f142d 100%)',
  poo: 'linear-gradient(180deg, #1b2c3c 0%, #16252f 55%, #101b24 100%)',
  waterways: 'linear-gradient(180deg, #14293c 0%, #123049 45%, #0a1e30 100%)',
  keepers: 'linear-gradient(180deg, #241d3d 0%, #1b1631 60%, #130f24 100%)',
};

/**
 * Diorama framing per stage. On wide screens the scene is nudged right so it
 * sits clear of the info panel; on narrow screens it stays centred.
 */
const FRAME: Record<ZoneKey, { scale: number; y: number; x: number }> = {
  soil: { scale: 0.62, y: -0.1, x: 2.3 },
  cafe: { scale: 0.5, y: -0.3, x: 2.0 },
  mouth: { scale: 0.6, y: 0.1, x: 2.2 },
  gut: { scale: 0.85, y: 0, x: 1.4 },
  poo: { scale: 0.52, y: 0.9, x: 2.5 },
  waterways: { scale: 0.6, y: 0.5, x: 2.7 },
  keepers: { scale: 0.6, y: 0.2, x: 2.2 },
};

function useIsWide() {
  const [wide, setWide] = useState(() => (typeof window === 'undefined' ? true : window.innerWidth >= 1024));
  useEffect(() => {
    const on = () => setWide(window.innerWidth >= 1024);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  return wide;
}

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
  const wide = useIsWide();
  const z = ((zone as ZoneKey) in BG ? zone : 'soil') as ZoneKey;
  const f = FRAME[z];

  return (
    <div className="absolute inset-0" aria-hidden style={{ background: (dark ? DARK_BG : BG)[z] }}>
      <Canvas
        camera={{ position: [0, 0.4, 8], fov: 58 }}
        gl={{ alpha: true, antialias: !voxel, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        frameloop={reduced ? 'demand' : 'always'}
      >
        <ambientLight intensity={dark ? 0.85 : 1.35} />
        <directionalLight position={[5, 8, 6]} intensity={dark ? 1.4 : 2.1} />
        <directionalLight position={[-6, 2, 4]} intensity={0.6} />
        <Sway reduced={reduced}>
          <group scale={f.scale} position={[wide ? f.x : 0, f.y, 0]}>
            {z === 'soil' && <SoilScene voxel={voxel} reduced={reduced} />}
            {z === 'cafe' && <CafeScene voxel={voxel} reduced={reduced} />}
            {z === 'mouth' && <MouthScene voxel={voxel} reduced={reduced} />}
            {z === 'gut' && <GutScene voxel={voxel} reduced={reduced} />}
            {z === 'poo' && <PooScene voxel={voxel} reduced={reduced} />}
            {z === 'waterways' && <WaterScene voxel={voxel} reduced={reduced} />}
            {z === 'keepers' && <KeepersScene voxel={voxel} reduced={reduced} />}
          </group>
        </Sway>
      </Canvas>
    </div>
  );
}

/** Gentle pointer parallax for the whole scene. */
function Sway({ reduced, children }: { reduced: boolean; children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (reduced || !ref.current) return;
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, state.pointer.x * 0.16, 0.05);
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, -state.pointer.y * 0.09, 0.05);
  });
  return <group ref={ref}>{children}</group>;
}

/** One solid prop. In voxel mode every shape becomes a cube. */
function S({
  voxel,
  position,
  scale = 1,
  rotation,
  color,
  shape = 'box',
  opacity = 1,
}: {
  voxel: boolean;
  position: Vec;
  scale?: number | Vec;
  rotation?: Vec;
  color: string;
  shape?: Shape;
  opacity?: number;
}) {
  const s: Vec = typeof scale === 'number' ? [scale, scale, scale] : scale;
  const use: Shape = voxel ? 'box' : shape;
  return (
    <mesh position={position} scale={s} rotation={rotation}>
      {use === 'sphere' ? (
        <sphereGeometry args={[0.5, 20, 20]} />
      ) : use === 'cyl' ? (
        <cylinderGeometry args={[0.5, 0.5, 1, 22]} />
      ) : use === 'cone' ? (
        <coneGeometry args={[0.5, 1, 20]} />
      ) : (
        <boxGeometry args={[1, 1, 1]} />
      )}
      <meshStandardMaterial
        color={color}
        flatShading={voxel}
        roughness={voxel ? 0.95 : 0.45}
        metalness={0}
        transparent={opacity < 1}
        opacity={opacity}
      />
    </mesh>
  );
}

/* ============================== SOIL ============================== */
/* Crops growing above ground; their roots reaching down through the earth. */
function SoilScene({ voxel, reduced }: { voxel: boolean; reduced: boolean }) {
  const crops = useMemo(
    () => [
      { x: -6.2, kind: 'carrot' as const },
      { x: -2.3, kind: 'leafy' as const },
      { x: 1.6, kind: 'carrot' as const },
      { x: 5.4, kind: 'wheat' as const },
    ],
    [],
  );
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (reduced || !ref.current) return;
    ref.current.children.forEach((c, i) => {
      c.rotation.z = Math.sin(state.clock.elapsedTime * 0.7 + i) * 0.045;
    });
  });

  return (
    <group>
      {/* earth wall behind, so roots read against it */}
      <S voxel={voxel} position={[0, -5.4, -4]} scale={[26, 9, 1]} color="#6b4423" />
      {/* topsoil ridge */}
      <S voxel={voxel} position={[0, -1.1, -1.2]} scale={[26, 0.7, 4]} color="#7d5230" />
      <S voxel={voxel} position={[0, -0.75, -1.2]} scale={[26, 0.28, 4]} color="#4f8f3a" />

      <group ref={ref}>
        {crops.map((c, i) => (
          <group key={i} position={[c.x, 0, 1.4]}>
            {c.kind === 'carrot' && (
              <>
                <S voxel={voxel} position={[0, -1.5, 0]} scale={[1.15, 2.4, 1.15]} rotation={[Math.PI, 0, 0]} shape="cone" color="#f07f1a" />
                <S voxel={voxel} position={[-0.35, 0.2, 0]} scale={[0.22, 1.3, 0.22]} rotation={[0, 0, 0.35]} color="#3f8f34" />
                <S voxel={voxel} position={[0, 0.45, 0]} scale={[0.22, 1.7, 0.22]} color="#4aa33d" />
                <S voxel={voxel} position={[0.35, 0.2, 0]} scale={[0.22, 1.3, 0.22]} rotation={[0, 0, -0.35]} color="#3f8f34" />
              </>
            )}
            {c.kind === 'leafy' && (
              <>
                <S voxel={voxel} position={[0, 0.1, 0]} scale={1.5} shape="sphere" color="#54ad3f" />
                <S voxel={voxel} position={[-0.7, -0.2, 0.3]} scale={1} shape="sphere" color="#4a9c37" />
                <S voxel={voxel} position={[0.7, -0.15, 0.2]} scale={1.05} shape="sphere" color="#61b84a" />
                <S voxel={voxel} position={[0, -1.1, 0]} scale={[0.3, 1, 0.3]} color="#8a6b3a" />
              </>
            )}
            {c.kind === 'wheat' && (
              <>
                {[-0.45, 0, 0.45].map((dx, k) => (
                  <group key={k}>
                    <S voxel={voxel} position={[dx, 0.1, 0]} scale={[0.16, 2.2, 0.16]} color="#8fae3e" />
                    <S voxel={voxel} position={[dx, 1.35, 0]} scale={[0.42, 0.95, 0.42]} shape="sphere" color="#e3c04a" />
                  </group>
                ))}
              </>
            )}
            {/* roots reaching down into the soil */}
            <Roots voxel={voxel} />
          </group>
        ))}
      </group>

      {/* loose soil crumbs drifting */}
      <Drift voxel={voxel} count={16} colors={['#8a5f34', '#6b4423', '#4f8f3a']} dir={-1} size={0.3} spread={[15, 7, 5]} yBase={-3} reduced={reduced} />
    </group>
  );
}

function Roots({ voxel }: { voxel: boolean }) {
  // one tapered taproot straight down, with finer branches peeling off it
  const branches = useMemo(
    () => [
      { p: [-0.75, -3.1, 0.15] as Vec, s: [0.16, 1.7, 0.16] as Vec, r: [0, 0, 0.75] as Vec },
      { p: [0.75, -3.4, -0.15] as Vec, s: [0.16, 1.8, 0.16] as Vec, r: [0, 0, -0.7] as Vec },
      { p: [-1.5, -4.4, 0.25] as Vec, s: [0.11, 1.5, 0.11] as Vec, r: [0, 0, 1.0] as Vec },
      { p: [1.5, -4.6, -0.25] as Vec, s: [0.11, 1.5, 0.11] as Vec, r: [0, 0, -0.95] as Vec },
      { p: [-0.35, -5.2, 0.1] as Vec, s: [0.1, 1.4, 0.1] as Vec, r: [0, 0, 0.25] as Vec },
      { p: [0.4, -5.4, -0.1] as Vec, s: [0.1, 1.3, 0.1] as Vec, r: [0, 0, -0.3] as Vec },
    ],
    [],
  );
  return (
    <>
      {/* the taproot, running unbroken from the plant base down into the earth */}
      <S voxel={voxel} position={[0, -3.6, 0]} scale={[0.3, 4.6, 0.3]} color="#b98d55" />
      <S voxel={voxel} position={[0, -6.1, 0]} scale={[0.18, 1.4, 0.18]} color="#a87d48" />
      {branches.map((b, i) => (
        <S key={i} voxel={voxel} position={b.p} scale={b.s} rotation={b.r} color="#c9a06a" />
      ))}
    </>
  );
}

/* ============================== CAFÉ ============================== */
/* A customer buying food across the counter. */
function CafeScene({ voxel, reduced }: { voxel: boolean; reduced: boolean }) {
  const coin = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (reduced || !coin.current) return;
    const t = state.clock.elapsedTime % 3;
    coin.current.position.x = -1.4 + Math.min(t / 3, 1) * 1.8;
    coin.current.position.y = -0.15 + Math.sin(Math.min(t / 3, 1) * Math.PI) * 0.7;
    coin.current.rotation.z = state.clock.elapsedTime * 3;
  });

  return (
    <group>
      {/* back wall and shelf */}
      <S voxel={voxel} position={[0, 1.5, -5]} scale={[26, 12, 1]} color="#d8a765" />
      <S voxel={voxel} position={[0, 1.2, -4.2]} scale={[12, 0.35, 0.8]} color="#a8763f" />
      {/* jars on the shelf */}
      {[-3.6, -2.4, -1.2, 3.4].map((x, i) => (
        <S key={i} voxel={voxel} position={[x, 1.85, -4.2]} scale={[0.7, 0.95, 0.7]} shape="cyl" color={['#e8b877', '#c98f4a', '#efd9a5', '#d9a05b'][i]} />
      ))}

      {/* counter */}
      <S voxel={voxel} position={[0, -1.9, 0]} scale={[13, 1.6, 3]} color="#9c6b38" />
      <S voxel={voxel} position={[0, -1.05, 0]} scale={[13.4, 0.28, 3.4]} color="#c08c4e" />

      {/* server behind the counter */}
      <Person voxel={voxel} x={-3.1} z={-2.2} skin="#e8b98f" shirt="#4aa3c4" />
      {/* customer in front, reaching over */}
      <Person voxel={voxel} x={2.9} z={1.4} skin="#c98b5e" shirt="#e2653f" />

      {/* food on the counter: pizza, bread, cup */}
      <group position={[-0.2, -0.75, 0.6]}>
        <S voxel={voxel} position={[0, 0, 0]} scale={[2.3, 0.22, 2.3]} shape="cyl" color="#e8c07a" />
        <S voxel={voxel} position={[0, 0.14, 0]} scale={[2, 0.14, 2]} shape="cyl" color="#d94f34" />
        {[[-0.55, 0.35], [0.5, 0.15], [0.05, -0.5], [-0.3, -0.15]].map((p, i) => (
          <S key={i} voxel={voxel} position={[p[0], 0.24, p[1]]} scale={[0.45, 0.1, 0.45]} shape="cyl" color="#a83226" />
        ))}
      </group>
      <S voxel={voxel} position={[-3.3, -0.62, 0.8]} scale={[1.5, 0.7, 0.8]} shape="sphere" color="#c98f4a" />
      <S voxel={voxel} position={[3.2, -0.55, 0.9]} scale={[0.75, 0.85, 0.75]} shape="cyl" color="#f2f2f2" />

      {/* the coin changing hands */}
      <group ref={coin} position={[-1.4, -0.15, 1.6]}>
        <S voxel={voxel} position={[0, 0, 0]} scale={[0.38, 0.38, 0.09]} shape="cyl" rotation={[Math.PI / 2, 0, 0]} color="#f0c419" />
      </group>
    </group>
  );
}

function Person({ voxel, x, z, skin, shirt }: { voxel: boolean; x: number; z: number; skin: string; shirt: string }) {
  return (
    <group position={[x, 0, z]}>
      <S voxel={voxel} position={[0, -1.55, 0]} scale={[1.35, 2.1, 0.9]} color={shirt} />
      <S voxel={voxel} position={[0, 0.15, 0]} scale={[1.05, 1.15, 1]} shape="sphere" color={skin} />
      <S voxel={voxel} position={[0, 0.5, 0]} scale={[1.12, 0.45, 1.06]} color="#4a3526" />
      <S voxel={voxel} position={[0.85, -1.35, 0.25]} scale={[0.32, 1.3, 0.32]} rotation={[0, 0, 0.5]} color={skin} />
      <S voxel={voxel} position={[-0.85, -1.35, 0.25]} scale={[0.32, 1.3, 0.32]} rotation={[0, 0, -0.5]} color={skin} />
    </group>
  );
}

/* ============================== MOUTH ============================== */
/* Teeth, tongue, and a mouthful heading down the throat. */
function MouthScene({ voxel, reduced }: { voxel: boolean; reduced: boolean }) {
  const food = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (reduced || !food.current) return;
    const t = (state.clock.elapsedTime % 3.4) / 3.4;
    food.current.position.z = 3.5 - t * 9;
    food.current.position.y = 0.4 - t * 1.1;
    food.current.rotation.x = t * 3;
    const s = 1 - t * 0.45;
    food.current.scale.setScalar(s);
  });

  const teeth = useMemo(() => Array.from({ length: 9 }, (_, i) => -6.4 + i * 1.6), []);

  return (
    <group>
      {/* throat opening */}
      <S voxel={voxel} position={[0, -0.4, -6]} scale={[7, 5.5, 1]} shape="cyl" rotation={[Math.PI / 2, 0, 0]} color="#8f2f4a" />
      <S voxel={voxel} position={[0, -0.4, -5.2]} scale={[4.6, 3.6, 1]} shape="cyl" rotation={[Math.PI / 2, 0, 0]} color="#6d1f36" />

      {/* upper and lower teeth */}
      {teeth.map((x, i) => (
        <S key={`u${i}`} voxel={voxel} position={[x, 3.5 + (i % 2) * 0.12, 0.4]} scale={[1.25, 1.5, 1.1]} color="#fdfdf7" />
      ))}
      {teeth.map((x, i) => (
        <S key={`l${i}`} voxel={voxel} position={[x, -2.9 - (i % 2) * 0.12, 0.4]} scale={[1.25, 1.5, 1.1]} color="#fdfdf7" />
      ))}
      {/* gums */}
      <S voxel={voxel} position={[0, 4.5, 0.4]} scale={[16, 1.4, 1.3]} color="#e0708c" />
      <S voxel={voxel} position={[0, -3.9, 0.4]} scale={[16, 1.4, 1.3]} color="#e0708c" />

      {/* tongue */}
      <S voxel={voxel} position={[0, -2.5, 1.6]} scale={[5.2, 0.9, 4.4]} shape="sphere" color="#e2607f" />

      {/* the mouthful being swallowed */}
      <group ref={food} position={[0, 0.4, 3.5]}>
        <S voxel={voxel} position={[0, 0, 0]} scale={[1.5, 0.28, 1.5]} shape="cyl" color="#e8c07a" />
        <S voxel={voxel} position={[0, 0.18, 0]} scale={[1.25, 0.16, 1.25]} shape="cyl" color="#d94f34" />
        <S voxel={voxel} position={[0.35, 0.32, 0.2]} scale={[0.36, 0.12, 0.36]} shape="cyl" color="#a83226" />
        <S voxel={voxel} position={[-0.3, 0.32, -0.25]} scale={[0.32, 0.12, 0.32]} shape="cyl" color="#a83226" />
        <S voxel={voxel} position={[0.75, 0.05, -0.5]} scale={0.42} shape="sphere" color="#66b13f" />
      </group>
    </group>
  );
}

/* ============================== GUT ============================== */
/* Chewed food tumbling down a living tunnel. */
function GutScene({ voxel, reduced }: { voxel: boolean; reduced: boolean }) {
  const rings = useMemo(() => Array.from({ length: 9 }, (_, i) => i), []);
  const ringRef = useRef<THREE.Group>(null);
  const foodRef = useRef<THREE.Group>(null);

  const bits = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => {
        const kinds = ['pepperoni', 'pea', 'choc', 'corn', 'crust'] as const;
        const kind = kinds[i % kinds.length];
        const a = Math.random() * Math.PI * 2;
        const r = 0.6 + Math.random() * 1.9;
        return {
          kind,
          x: Math.cos(a) * r,
          y: Math.sin(a) * r,
          z: -Math.random() * 20,
          spin: Math.random() * Math.PI,
          sp: 1.4 + Math.random() * 1.4,
        };
      }),
    [],
  );

  useFrame((state, delta) => {
    if (reduced) return;
    if (ringRef.current) {
      ringRef.current.children.forEach((r) => {
        r.position.z += delta * 1.6;
        if (r.position.z > 6) r.position.z -= 21.6;
        r.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 1.4 + r.position.z * 0.3) * 0.05);
      });
    }
    if (foodRef.current) {
      foodRef.current.children.forEach((c, i) => {
        const b = bits[i];
        c.position.z += delta * b.sp;
        if (c.position.z > 7) c.position.z = -20;
        c.rotation.x += delta * 1.1;
        c.rotation.y += delta * 0.7;
      });
    }
  });

  const ringBar = (w: number, h: number, x: number, y: number, c: string) => (
    <S voxel={voxel} position={[x, y, 0]} scale={[w, h, 0.7]} color={c} />
  );

  return (
    <group>
      {/* gut wall: soft folds receding */}
      <group ref={ringRef}>
        {rings.map((i) => (
          <group key={i} position={[0, 0, -i * 2.4]}>
            {voxel ? (
              <>
                {ringBar(8.4, 0.9, 0, 3.8, '#e05aa0')}
                {ringBar(8.4, 0.9, 0, -3.8, '#d64f95')}
                {ringBar(0.9, 8.4, -3.8, 0, '#e05aa0')}
                {ringBar(0.9, 8.4, 3.8, 0, '#d64f95')}
              </>
            ) : (
              <mesh rotation={[0, 0, i * 0.4]}>
                <torusGeometry args={[4.1, 0.62, 12, 26]} />
                <meshStandardMaterial color={i % 2 ? '#ef6bab' : '#e05499'} roughness={0.5} />
              </mesh>
            )}
          </group>
        ))}
      </group>

      {/* the chewed food itself */}
      <group ref={foodRef}>
        {bits.map((b, i) => (
          <group key={i} position={[b.x, b.y, b.z]} rotation={[b.spin, b.spin, 0]}>
            {b.kind === 'pepperoni' && <S voxel={voxel} position={[0, 0, 0]} scale={[0.62, 0.16, 0.62]} shape="cyl" color="#c0392b" />}
            {b.kind === 'pea' && <S voxel={voxel} position={[0, 0, 0]} scale={0.42} shape="sphere" color="#6ab04c" />}
            {b.kind === 'choc' && <S voxel={voxel} position={[0, 0, 0]} scale={[0.44, 0.4, 0.44]} color="#5b3a1e" />}
            {b.kind === 'corn' && <S voxel={voxel} position={[0, 0, 0]} scale={[0.3, 0.38, 0.3]} shape="sphere" color="#f2c14e" />}
            {b.kind === 'crust' && <S voxel={voxel} position={[0, 0, 0]} scale={[0.75, 0.3, 0.5]} color="#d9a465" />}
          </group>
        ))}
      </group>
    </group>
  );
}

/* ============================== POO ============================== */
/* A bright bathroom: tiles, the toilet, and what arrives in it. */
function PooScene({ voxel, reduced }: { voxel: boolean; reduced: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (reduced || !ref.current) return;
    ref.current.position.y = -0.35 + Math.sin(state.clock.elapsedTime * 1.1) * 0.09;
  });

  const tiles = useMemo(() => {
    const out: { x: number; y: number }[] = [];
    for (let x = -7; x <= 7; x += 2.1) for (let y = -1; y <= 5; y += 2.1) out.push({ x, y });
    return out;
  }, []);

  return (
    <group>
      {/* tiled wall */}
      <S voxel={voxel} position={[0, 1.5, -6]} scale={[26, 14, 1]} color="#cfe3ef" />
      {tiles.map((t, i) => (
        <S key={i} voxel={voxel} position={[t.x, t.y, -5.4]} scale={[1.9, 1.9, 0.2]} color={(i % 2 ? '#eaf4fb' : '#dceaf4')} />
      ))}
      {/* floor */}
      <S voxel={voxel} position={[0, -4.6, -1]} scale={[26, 0.8, 12]} color="#b9cedb" />

      {/* toilet: cistern, bowl, seat, water */}
      <group position={[2.4, 0, -1]}>
        <S voxel={voxel} position={[0, 0.9, -1.5]} scale={[3.4, 2.6, 1.2]} color="#f7fbfd" />
        <S voxel={voxel} position={[0, 2.35, -1.5]} scale={[3.6, 0.35, 1.4]} color="#eaf1f6" />
        <S voxel={voxel} position={[1.2, 2.1, -0.85]} scale={[0.4, 0.28, 0.4]} shape="cyl" color="#c7d4dd" />
        {/* bowl */}
        <S voxel={voxel} position={[0, -1.8, 0.2]} scale={[3, 2.6, 3]} shape="cyl" color="#f7fbfd" />
        <S voxel={voxel} position={[0, -0.45, 0.2]} scale={[3.5, 0.45, 3.5]} shape="cyl" color="#ffffff" />
        {/* pedestal */}
        <S voxel={voxel} position={[0, -3.6, 0.2]} scale={[1.7, 1.6, 1.7]} color="#eef4f8" />
        {/* water */}
        <S voxel={voxel} position={[0, -0.85, 0.2]} scale={[2.6, 0.25, 2.6]} shape="cyl" color="#9fd6f2" opacity={0.9} />

        {/* the poo, stacked in the bowl */}
        <group ref={ref} position={[0, -0.35, 0.2]}>
          <S voxel={voxel} position={[0, 0, 0]} scale={[1.85, 0.85, 1.85]} shape="sphere" color="#6b4423" />
          <S voxel={voxel} position={[0.12, 0.6, -0.05]} scale={[1.35, 0.75, 1.35]} shape="sphere" color="#7a5230" />
          <S voxel={voxel} position={[-0.05, 1.15, 0.05]} scale={[0.85, 0.65, 0.85]} shape="sphere" color="#6b4423" />
          <S voxel={voxel} position={[0.05, 1.6, 0]} scale={[0.38, 0.45, 0.38]} shape="cone" color="#7a5230" />
        </group>
      </group>

      {/* a roll of paper, for the bathroom to read as a bathroom */}
      <S voxel={voxel} position={[-4.6, -0.6, -3]} scale={[1, 0.9, 1]} shape="cyl" rotation={[0, 0, Math.PI / 2]} color="#ffffff" />
      <S voxel={voxel} position={[-4.6, -0.6, -3]} scale={[0.35, 1.05, 0.35]} shape="cyl" rotation={[0, 0, Math.PI / 2]} color="#d8e3ea" />
    </group>
  );
}

/* ============================== WATERWAYS ============================== */
/* A sewer pipe emptying out into the lake. */
function WaterScene({ voxel, reduced }: { voxel: boolean; reduced: boolean }) {
  const flow = useRef<THREE.Group>(null);
  const surf = useRef<THREE.Group>(null);

  const drops = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        t: i / 16,
        s: 0.3 + Math.random() * 0.35,
      })),
    [],
  );

  useFrame((state, delta) => {
    if (reduced) return;
    if (flow.current) {
      flow.current.children.forEach((c) => {
        c.position.x += delta * 3.2;
        c.position.y -= delta * 1.5;
        if (c.position.x > 1.5) {
          c.position.x = -5.4;
          c.position.y = 0.6;
        }
      });
    }
    if (surf.current) {
      const t = state.clock.elapsedTime;
      surf.current.children.forEach((c, i) => {
        c.position.y = -2.4 + Math.sin(t * 1.3 + i * 0.6) * 0.18;
      });
    }
  });

  const slabs = useMemo(() => {
    const out: Vec[] = [];
    for (let x = -9; x <= 9; x += 2.4) for (let z = -8; z <= 3; z += 2.4) out.push([x, -2.4, z]);
    return out;
  }, []);

  return (
    <group>
      {/* bank and outfall pipe */}
      <S voxel={voxel} position={[-7.5, -0.6, -2]} scale={[6, 5, 6]} color="#8a9a6b" />
      <S voxel={voxel} position={[-5.2, 0.4, 0]} scale={[2.6, 2.2, 2.2]} shape="cyl" rotation={[0, 0, Math.PI / 2]} color="#9aa5ab" />
      <S voxel={voxel} position={[-4.1, 0.4, 0]} scale={[2.2, 0.4, 1.9]} shape="cyl" rotation={[0, 0, Math.PI / 2]} color="#5d6a70" />

      {/* the discharge arcing into the lake */}
      <group ref={flow}>
        {drops.map((d, i) => (
          <S key={i} voxel={voxel} position={[-5.4 + d.t * 6.9, 0.6 - d.t * 3.2, 0]} scale={d.s} shape="sphere" color="#7cc4e8" opacity={0.85} />
        ))}
      </group>

      {/* lake surface */}
      <group ref={surf}>
        {slabs.map((p, i) => (
          <S key={i} voxel={voxel} position={p} scale={[2.3, 0.35, 2.3]} color={i % 2 ? '#4a9fd4' : '#3f8fc4'} opacity={0.92} />
        ))}
      </group>
      {/* deeper water below */}
      <S voxel={voxel} position={[0, -5, -2]} scale={[26, 5, 14]} color="#2a6f9e" />

      {/* reeds on the far bank */}
      {[-2.4, -1.6, 5.4, 6.2, 6.9].map((x, i) => (
        <S key={i} voxel={voxel} position={[x, -1.1, -4]} scale={[0.22, 3, 0.22]} rotation={[0, 0, (i % 2 ? 1 : -1) * 0.12]} color="#4f8f3a" />
      ))}
      {/* lily pads */}
      {[[3, -1.5], [4.2, 1], [-0.6, 0.4]].map((p, i) => (
        <S key={i} voxel={voxel} position={[p[0], -2.2, p[1]]} scale={[1.5, 0.16, 1.5]} shape="cyl" color="#5aa83f" />
      ))}
    </group>
  );
}

/* ============================== KEEPERS ============================== */
function KeepersScene({ voxel, reduced }: { voxel: boolean; reduced: boolean }) {
  return (
    <group>
      <S voxel={voxel} position={[0, -4.6, -2]} scale={[26, 1, 12]} color="#8f7fd0" />
      {[-5.5, -2, 1.6, 5].map((x, i) => (
        <group key={i} position={[x, -1.6, -1]}>
          <S voxel={voxel} position={[0, 0, 0]} scale={[1.5, 2.4, 1]} color="#f2f4f8" />
          <S voxel={voxel} position={[0, 1.9, 0]} scale={[1.1, 1.2, 1]} shape="sphere" color={['#e8b98f', '#c98b5e', '#a5714a', '#e0c3a0'][i]} />
          <S voxel={voxel} position={[0, 0.35, 0.55]} scale={[0.75, 0.55, 0.15]} color="#7a5bd0" />
        </group>
      ))}
      <Drift voxel={voxel} count={18} colors={['#c3b4f5', '#a98bff', '#d5c9fb']} dir={1} size={0.34} spread={[15, 8, 5]} yBase={0} reduced={reduced} />
    </group>
  );
}

/* ============================== shared drift ============================== */
function Drift({
  voxel,
  count,
  colors,
  dir,
  size,
  spread,
  yBase,
  reduced,
}: {
  voxel: boolean;
  count: number;
  colors: string[];
  dir: number;
  size: number;
  spread: [number, number, number];
  yBase: number;
  reduced: boolean;
}) {
  const ref = useRef<THREE.Group>(null);
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: (Math.random() - 0.5) * spread[0],
        y: yBase + (Math.random() - 0.5) * spread[1],
        z: (Math.random() - 0.5) * spread[2] - 1,
        sp: 0.2 + Math.random() * 0.5,
        s: size * (0.6 + Math.random() * 0.8),
      })),
    [count, spread, yBase, size],
  );
  useFrame((_, delta) => {
    if (reduced || !ref.current) return;
    ref.current.children.forEach((c, i) => {
      c.position.y += delta * seeds[i].sp * dir;
      const top = yBase + spread[1] / 2;
      const bot = yBase - spread[1] / 2;
      if (dir > 0 && c.position.y > top) c.position.y = bot;
      if (dir < 0 && c.position.y < bot) c.position.y = top;
      c.rotation.x += delta * 0.5;
    });
  });
  return (
    <group ref={ref}>
      {seeds.map((s, i) => (
        <S key={i} voxel={voxel} position={[s.x, s.y, s.z]} scale={s.s} shape={voxel ? 'box' : 'sphere'} color={colors[i % colors.length]} opacity={0.75} />
      ))}
    </group>
  );
}
