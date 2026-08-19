import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  brickTexture,
  cheeseTexture,
  fleshTexture,
  lathe,
  menuTexture,
  pepperoniTexture,
  roundedBox,
  soilTexture,
  tileTexture,
  tube,
  wedge,
  woodTexture,
} from '../../lib/three-helpers';

// The realistic look: smooth, curved, textured and constantly moving. Each
// scene is built to fill the whole viewport rather than sit in a corner.

type P = { reduced: boolean };
const V = (x: number, y: number, z: number): [number, number, number] => [x, y, z];

/* ================================ SOIL ================================ */
export function SoilReal({ reduced }: P) {
  const soil = useMemo(() => soilTexture(), []);
  const crops = useRef<THREE.Group>(null);
  const worm = useRef<THREE.Mesh>(null);
  const crumbs = useRef<THREE.Group>(null);

  const plants = useMemo(
    () => [
      { x: -12, kind: 'wheat' as const },
      { x: -8.4, kind: 'carrot' as const },
      { x: -4.6, kind: 'lettuce' as const },
      { x: -0.6, kind: 'carrot' as const },
      { x: 3.4, kind: 'wheat' as const },
      { x: 7.2, kind: 'carrot' as const },
      { x: 11.4, kind: 'lettuce' as const },
    ],
    [],
  );

  const wormGeo = useMemo(
    () =>
      tube(
        [
          [-2.4, -4.4, 1.2],
          [-1.4, -3.9, 1.4],
          [-0.4, -4.5, 1.2],
          [0.7, -4.0, 1.4],
          [1.7, -4.6, 1.2],
        ],
        0.17,
        10,
      ),
    [],
  );

  const crumbSeeds = useMemo(
    () => Array.from({ length: 26 }, () => ({ x: rnd(-15, 15), y: rnd(-7, -1.4), s: rnd(0.06, 0.17), sp: rnd(0.1, 0.4) })),
    [],
  );

  useFrame((state, delta) => {
    if (reduced) return;
    const t = state.clock.elapsedTime;
    crops.current?.children.forEach((c, i) => {
      c.rotation.z = Math.sin(t * 0.9 + i * 1.3) * 0.05;
    });
    if (worm.current) {
      worm.current.position.x = Math.sin(t * 0.35) * 1.6;
      worm.current.rotation.z = Math.sin(t * 0.7) * 0.12;
    }
    crumbs.current?.children.forEach((c, i) => {
      c.position.y -= delta * crumbSeeds[i].sp;
      if (c.position.y < -7) c.position.y = -1.4;
      c.rotation.x += delta;
    });
  });

  return (
    <group>
      {/* sun and distant hills */}
      <mesh position={V(9, 5.6, -14)}>
        <sphereGeometry args={[1.5, 28, 28]} />
        <meshBasicMaterial color="#fff3b0" />
      </mesh>
      {[-11, -2, 8, 16].map((x, i) => (
        <mesh key={i} position={V(x, -1.9, -11 - i)} scale={[7 + i, 3.4, 3]}>
          <sphereGeometry args={[1, 26, 18]} />
          <meshStandardMaterial color={i % 2 ? '#77b352' : '#6aa84a'} roughness={1} />
        </mesh>
      ))}

      {/* soil cross-section filling the lower screen */}
      <mesh position={V(0, -5.4, -2)}>
        <boxGeometry args={[40, 9, 6]} />
        <meshStandardMaterial map={soil} roughness={1} />
      </mesh>
      {/* grass surface */}
      <mesh position={V(0, -1.02, 1.1)} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[40, 4]} />
        <meshStandardMaterial color="#5da83f" roughness={1} />
      </mesh>
      <mesh position={V(0, -0.86, 3.1)}>
        <boxGeometry args={[40, 0.36, 0.5]} />
        <meshStandardMaterial color="#67ba46" roughness={1} />
      </mesh>

      <group ref={crops}>
        {plants.map((p, i) => (
          <group key={i} position={V(p.x, 0, 1.2)}>
            {p.kind === 'carrot' && <Carrot />}
            {p.kind === 'lettuce' && <Lettuce />}
            {p.kind === 'wheat' && <Wheat />}
            <RootSystem />
          </group>
        ))}
      </group>

      <mesh ref={worm} geometry={wormGeo}>
        <meshStandardMaterial color="#d98a92" roughness={0.6} />
      </mesh>

      <group ref={crumbs}>
        {crumbSeeds.map((c, i) => (
          <mesh key={i} position={V(c.x, c.y, 2.6)} scale={c.s}>
            <dodecahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color="#5a3a1e" roughness={1} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

const rnd = (a: number, b: number) => a + Math.random() * (b - a);

function Carrot() {
  const leaves = useMemo(() => [-0.5, -0.22, 0, 0.24, 0.5], []);
  return (
    <group>
      <mesh position={V(0, -1.75, 0)} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.52, 2.5, 22]} />
        <meshStandardMaterial color="#ef7c15" roughness={0.55} />
      </mesh>
      <mesh position={V(0, -0.52, 0)}>
        <sphereGeometry args={[0.52, 20, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#f4881c" roughness={0.55} />
      </mesh>
      {leaves.map((a, i) => (
        <mesh key={i} position={V(a * 0.8, 0.65, (i % 2) * 0.18)} rotation={[0, 0, a * 0.75]}>
          <coneGeometry args={[0.1, 2.1, 14]} />
          <meshStandardMaterial color={i % 2 ? '#3f8f34' : '#4fa63e'} roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function Lettuce() {
  const leaves = useMemo(
    () => Array.from({ length: 7 }, (_, i) => ({ a: (i / 7) * Math.PI * 2, s: 0.62 + (i % 3) * 0.12 })),
    [],
  );
  return (
    <group>
      <mesh position={V(0, -1.1, 0)}>
        <cylinderGeometry args={[0.16, 0.22, 1.1, 12]} />
        <meshStandardMaterial color="#c8d98a" roughness={0.9} />
      </mesh>
      {leaves.map((l, i) => (
        <mesh
          key={i}
          position={V(Math.cos(l.a) * 0.5, -0.15 + (i % 3) * 0.16, Math.sin(l.a) * 0.5)}
          scale={[l.s, l.s * 0.6, l.s]}
          rotation={[Math.sin(l.a) * 0.4, l.a, Math.cos(l.a) * 0.4]}
        >
          <sphereGeometry args={[1, 18, 12]} />
          <meshStandardMaterial color={i % 2 ? '#69bf46' : '#57ab38'} roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

function Wheat() {
  const stalks = useMemo(() => [-0.45, -0.15, 0.18, 0.48], []);
  return (
    <group>
      {stalks.map((x, i) => (
        <group key={i} position={V(x, 0, (i % 2) * 0.2)} rotation={[0, 0, x * 0.18]}>
          <mesh position={V(0, 0.35, 0)}>
            <cylinderGeometry args={[0.045, 0.07, 2.6, 8]} />
            <meshStandardMaterial color="#9dbb4e" roughness={0.9} />
          </mesh>
          <mesh position={V(0, 1.9, 0)} scale={[0.9, 1.5, 0.9]}>
            <sphereGeometry args={[0.24, 14, 12]} />
            <meshStandardMaterial color="#e0bf4e" roughness={0.85} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** A curved taproot with fine branching tendrils, drawn as smooth tubes. */
function RootSystem() {
  const geos = useMemo(() => {
    const main = tube(
      [
        [0, -1.6, 0],
        [0.1, -3, 0.1],
        [-0.15, -4.4, 0],
        [0.1, -5.8, -0.1],
      ],
      0.13,
      8,
      true,
    );
    const branches = [
      tube(
        [
          [0, -2.6, 0],
          [-0.9, -3.3, 0.2],
          [-1.7, -4.4, 0.3],
        ],
        0.075,
        7,
        true,
      ),
      tube(
        [
          [0, -3.2, 0],
          [1, -3.8, -0.2],
          [1.9, -4.9, -0.3],
        ],
        0.075,
        7,
        true,
      ),
      tube(
        [
          [0, -4.4, 0],
          [-0.7, -5.2, 0.2],
          [-1.2, -6.3, 0.1],
        ],
        0.055,
        6,
        true,
      ),
      tube(
        [
          [0, -4.8, 0],
          [0.8, -5.5, -0.1],
          [1.3, -6.5, -0.2],
        ],
        0.055,
        6,
        true,
      ),
    ];
    return { main, branches };
  }, []);

  return (
    <group>
      <mesh geometry={geos.main}>
        <meshStandardMaterial color="#cba36c" roughness={0.9} />
      </mesh>
      {geos.branches.map((g, i) => (
        <mesh key={i} geometry={g}>
          <meshStandardMaterial color="#d8b483" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

/* ================================ CAFÉ ================================ */
export function CafeReal({ reduced }: P) {
  const wood = useMemo(() => woodTexture(), []);
  const menu = useMemo(() => menuTexture(), []);
  const counterGeo = useMemo(() => roundedBox(34, 2.6, 3.4, 0.18), []);
  const topGeo = useMemo(() => roundedBox(34.6, 0.34, 4, 0.14), []);
  const boardGeo = useMemo(() => roundedBox(7.4, 4.6, 0.3, 0.12), []);
  const coin = useRef<THREE.Group>(null);
  const steam = useRef<THREE.Group>(null);
  const lamps = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (reduced) return;
    const t = state.clock.elapsedTime;
    if (coin.current) {
      const k = (t % 3) / 3;
      coin.current.position.x = 1.2 + k * 3.2;
      coin.current.position.y = -1.35 + Math.sin(k * Math.PI) * 1.1;
      coin.current.rotation.y = t * 6;
    }
    steam.current?.children.forEach((c, i) => {
      const k = ((t * 0.4 + i * 0.33) % 1);
      c.position.y = 0.3 + k * 1.8;
      c.scale.setScalar(0.1 + k * 0.3);
      (c as THREE.Mesh & { material: THREE.Material & { opacity: number } }).material.opacity = 0.45 * (1 - k);
    });
    lamps.current?.children.forEach((l, i) => {
      l.rotation.z = Math.sin(t * 0.7 + i) * 0.05;
    });
  });

  return (
    <group>
      {/* back wall */}
      <mesh position={V(0, 1, -7)}>
        <planeGeometry args={[46, 22]} />
        <meshStandardMaterial color="#e8c48d" roughness={1} />
      </mesh>
      <mesh position={V(0, -4.6, -6.9)}>
        <planeGeometry args={[46, 4]} />
        <meshStandardMaterial color="#b8813f" roughness={1} />
      </mesh>

      {/* the menu board */}
      <group position={V(4.6, 2.4, -6.6)}>
        <mesh geometry={boardGeo}>
          <meshStandardMaterial color="#3a2a1c" roughness={0.8} />
        </mesh>
        <mesh position={V(0, 0, 0.42)}>
          <planeGeometry args={[6.9, 4.2]} />
          <meshBasicMaterial map={menu} toneMapped={false} />
        </mesh>
      </group>

      {/* a hanging sign */}
      <group position={V(-6.6, 3.4, -6.4)}>
        <mesh>
          <boxGeometry args={[5.4, 1.5, 0.22]} />
          <meshStandardMaterial map={wood} roughness={0.8} />
        </mesh>
        <mesh position={V(0, 0, 0.14)}>
          <planeGeometry args={[5, 1.1]} />
          <meshStandardMaterial color="#f6e2b6" roughness={0.9} />
        </mesh>
        {[-1.6, -0.6, 0.5, 1.5].map((x, i) => (
          <mesh key={i} position={V(x, 0, 0.2)}>
            <boxGeometry args={[0.7, 0.16, 0.02]} />
            <meshStandardMaterial color="#7a4a1c" />
          </mesh>
        ))}
      </group>

      {/* pendant lamps */}
      <group ref={lamps}>
        {[-9, -3, 3.2, 9.4].map((x, i) => (
          <group key={i} position={V(x, 6.4, -3)}>
            <mesh position={V(0, -0.9, 0)}>
              <cylinderGeometry args={[0.03, 0.03, 1.8, 6]} />
              <meshStandardMaterial color="#5a4632" />
            </mesh>
            <mesh position={V(0, -2.1, 0)} rotation={[Math.PI, 0, 0]}>
              <coneGeometry args={[0.8, 0.9, 22, 1, true]} />
              <meshStandardMaterial color="#c8792c" side={THREE.DoubleSide} roughness={0.6} />
            </mesh>
            <mesh position={V(0, -2.4, 0)}>
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshBasicMaterial color="#ffe9a8" />
            </mesh>
            <pointLight position={V(0, -2.4, 0)} intensity={12} distance={12} color="#ffd89a" />
          </group>
        ))}
      </group>

      {/* shelf with jars */}
      <mesh position={V(-4, 0.9, -6.3)}>
        <boxGeometry args={[12, 0.3, 1]} />
        <meshStandardMaterial map={wood} roughness={0.85} />
      </mesh>
      {[-8.6, -7.2, -5.8, -4.4, -1.6, -0.2].map((x, i) => (
        <Jar key={i} x={x} y={1.75} i={i} />
      ))}

      {/* counter */}
      <mesh geometry={counterGeo} position={V(0, -3.4, 0)}>
        <meshStandardMaterial map={wood} roughness={0.75} />
      </mesh>
      <mesh geometry={topGeo} position={V(0, -2.0, 0.2)}>
        <meshStandardMaterial color="#d3a05a" roughness={0.4} metalness={0.05} />
      </mesh>

      <Person x={-3.2} z={-2.6} skin="#e6b184" shirt="#3f9dc4" apron />
      <Person x={6.2} z={0.8} skin="#c07a4c" shirt="#e2653f" />

      <Pizza position={V(0.4, -1.5, 0.9)} scale={1.25} />
      <mesh position={V(-6.4, -1.42, 1)} scale={[1.5, 0.85, 1]} rotation={[0, 0.4, 0.1]}>
        <sphereGeometry args={[0.85, 20, 14]} />
        <meshStandardMaterial color="#c98f4a" roughness={0.95} />
      </mesh>
      <mesh position={V(-8.2, -1.5, 1.2)} geometry={useMemo(() => lathe([[0, 0], [0.42, 0], [0.46, 0.1], [0.4, 0.85], [0.42, 0.9], [0.36, 0.92], [0.34, 0.06], [0, 0.04]], 28), [])}>
        <meshStandardMaterial color="#fbfbf7" roughness={0.35} />
      </mesh>
      <group ref={steam} position={V(-8.2, -0.6, 1.2)}>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={V(rnd(-0.1, 0.1), 0.3, 0)}>
            <sphereGeometry args={[1, 12, 10]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
          </mesh>
        ))}
      </group>

      <group ref={coin} position={V(1.2, -0.2, 2.4)}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 0.06, 20]} />
          <meshStandardMaterial color="#e8c04a" metalness={0.85} roughness={0.25} />
        </mesh>
      </group>
    </group>
  );
}

function Jar({ x, y, i }: { x: number; y: number; i: number }) {
  const geo = useMemo(
    () => lathe([[0, 0], [0.3, 0], [0.34, 0.12], [0.32, 0.68], [0.24, 0.78], [0.26, 0.86], [0.2, 0.88], [0, 0.86]], 22),
    [],
  );
  return (
    <mesh geometry={geo} position={V(x, y, -6.3)} scale={1.05}>
      <meshStandardMaterial
        color={['#e8c07a', '#c98f4a', '#efd9a5', '#d9a05b', '#e0b27a', '#caa06a'][i % 6]}
        roughness={0.3}
        metalness={0.05}
        transparent
        opacity={0.92}
      />
    </mesh>
  );
}

function Person({ x, z, skin, shirt, apron }: { x: number; z: number; skin: string; shirt: string; apron?: boolean }) {
  const body = useMemo(() => roundedBox(1.9, 2.9, 1.15, 0.4), []);
  return (
    <group position={V(x, -1.5, z)}>
      <mesh geometry={body} position={V(0, -0.6, 0)}>
        <meshStandardMaterial color={shirt} roughness={0.85} />
      </mesh>
      {apron && (
        <mesh position={V(0, -1, 0.6)}>
          <planeGeometry args={[1.4, 2]} />
          <meshStandardMaterial color="#f3ece0" roughness={0.95} />
        </mesh>
      )}
      <mesh position={V(0, 1.35, 0)} scale={[0.78, 0.9, 0.8]}>
        <sphereGeometry args={[1, 26, 22]} />
        <meshStandardMaterial color={skin} roughness={0.75} />
      </mesh>
      <mesh position={V(0, 1.72, -0.05)} scale={[0.8, 0.62, 0.84]}>
        <sphereGeometry args={[1, 24, 18, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#3d2b1d" roughness={0.9} />
      </mesh>
      <mesh position={V(-0.26, 1.4, 0.66)}>
        <sphereGeometry args={[0.09, 12, 12]} />
        <meshStandardMaterial color="#20202a" />
      </mesh>
      <mesh position={V(0.26, 1.4, 0.66)}>
        <sphereGeometry args={[0.09, 12, 12]} />
        <meshStandardMaterial color="#20202a" />
      </mesh>
      <mesh position={V(1.15, -0.5, 0.35)} rotation={[0, 0, -0.7]}>
        <capsuleGeometry args={[0.2, 1.5, 6, 12]} />
        <meshStandardMaterial color={skin} roughness={0.8} />
      </mesh>
      <mesh position={V(-1.15, -0.5, 0.35)} rotation={[0, 0, 0.7]}>
        <capsuleGeometry args={[0.2, 1.5, 6, 12]} />
        <meshStandardMaterial color={skin} roughness={0.8} />
      </mesh>
    </group>
  );
}

/** A round pizza with real crust, cheese and mottled pepperoni. */
function Pizza({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const cheese = useMemo(() => cheeseTexture(), []);
  const pep = useMemo(() => pepperoniTexture(), []);
  const tops = useMemo(
    () => Array.from({ length: 7 }, (_, i) => ({ a: (i / 7) * Math.PI * 2 + 0.4, r: 0.45 + (i % 3) * 0.32 })),
    [],
  );
  return (
    <group position={position} scale={scale}>
      <mesh>
        <cylinderGeometry args={[1.55, 1.45, 0.2, 40]} />
        <meshStandardMaterial color="#d9a465" roughness={0.95} />
      </mesh>
      <mesh position={V(0, 0.11, 0)}>
        <cylinderGeometry args={[1.36, 1.36, 0.06, 40]} />
        <meshStandardMaterial map={cheese} roughness={0.6} />
      </mesh>
      {tops.map((t, i) => (
        <mesh key={i} position={V(Math.cos(t.a) * t.r, 0.16, Math.sin(t.a) * t.r)} scale={[1, 0.55, 1]}>
          <sphereGeometry args={[0.22, 16, 12]} />
          <meshStandardMaterial map={pep} roughness={0.65} />
        </mesh>
      ))}
    </group>
  );
}

/* ================================ MOUTH ================================ */
/* We are inside the mouth. The throat is a real receding tunnel, and the
   mouthful travels back into it and disappears. */
export function MouthReal({ reduced }: P) {
  const flesh = useMemo(() => fleshTexture(345), []);
  const food = useRef<THREE.Group>(null);
  const tongue = useRef<THREE.Mesh>(null);
  const throat = useRef<THREE.Group>(null);

  // teeth follow an elliptical arch, like a real jaw
  const arch = useMemo(
    () =>
      Array.from({ length: 13 }, (_, i) => {
        const t = -1 + (i / 12) * 2;
        return { x: t * 8.2, z: 2.6 - t * t * 3.4, s: 1 - Math.abs(t) * 0.25 };
      }),
    [],
  );

  useFrame((state) => {
    if (reduced) return;
    const t = state.clock.elapsedTime;
    const k = (t % 4) / 4;
    if (food.current) {
      // travel back along the tongue, then shrink into the throat and vanish
      food.current.position.z = 5 - k * 12;
      food.current.position.y = -2.1 + k * 1.2;
      food.current.rotation.x = 0.3 + k * 1.6;
      const s = k < 0.72 ? 1 : Math.max(0, 1 - (k - 0.72) / 0.28);
      food.current.scale.setScalar(1.1 * s);
      food.current.visible = s > 0.02;
    }
    if (tongue.current) {
      // the tongue pushes the food backward
      tongue.current.position.z = 1.4 - Math.sin(k * Math.PI) * 1.4;
      tongue.current.rotation.x = -0.12 + Math.sin(k * Math.PI) * 0.16;
    }
    if (throat.current) {
      const squeeze = 1 - Math.max(0, Math.sin((k - 0.72) / 0.28 * Math.PI)) * 0.22;
      throat.current.scale.set(squeeze, squeeze, 1);
    }
  });

  return (
    <group>
      {/* soft palate above and jaw below, filling the frame */}
      <mesh position={V(0, 6.6, -1)} scale={[16, 4.4, 9]}>
        <sphereGeometry args={[1, 34, 22]} />
        <meshStandardMaterial map={flesh} color="#f0899f" roughness={0.55} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={V(0, -6.4, -1)} scale={[16, 4.2, 9]}>
        <sphereGeometry args={[1, 34, 22]} />
        <meshStandardMaterial map={flesh} color="#e2778f" roughness={0.55} />
      </mesh>
      {/* cheeks left and right */}
      <mesh position={V(-13.5, 0, -1)} scale={[4, 9, 9]}>
        <sphereGeometry args={[1, 26, 20]} />
        <meshStandardMaterial map={flesh} color="#e88ba0" roughness={0.6} />
      </mesh>
      <mesh position={V(13.5, 0, -1)} scale={[4, 9, 9]}>
        <sphereGeometry args={[1, 26, 20]} />
        <meshStandardMaterial map={flesh} color="#e88ba0" roughness={0.6} />
      </mesh>

      {/* gums */}
      <mesh position={V(0, 3.5, 0)} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[8.6, 0.9, 14, 40, Math.PI]} />
        <meshStandardMaterial color="#d9647f" roughness={0.6} />
      </mesh>
      <mesh position={V(0, -3.4, 0)} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[8.6, 0.9, 14, 40, Math.PI]} />
        <meshStandardMaterial color="#d9647f" roughness={0.6} />
      </mesh>

      {/* teeth along the arch */}
      {arch.map((a, i) => (
        <Tooth key={`u${i}`} x={a.x} y={2.5} z={a.z} s={a.s} flip />
      ))}
      {arch.map((a, i) => (
        <Tooth key={`l${i}`} x={a.x} y={-2.4} z={a.z} s={a.s} />
      ))}

      {/* the throat: an actual passage receding away, not a flat hole */}
      <group ref={throat} position={V(0, -0.6, -7)}>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i} position={V(0, 0, -i * 1.6)} scale={1 - i * 0.13} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[3.4, 3.1, 1.7, 30, 1, true]} />
            <meshStandardMaterial
              map={flesh}
              color={`hsl(345, 45%, ${44 - i * 6}%)`}
              side={THREE.BackSide}
              roughness={0.55}
            />
          </mesh>
        ))}
        <mesh position={V(0, 0, -8.4)}>
          <circleGeometry args={[1.9, 26]} />
          <meshBasicMaterial color="#2a0a14" />
        </mesh>
      </group>
      {/* uvula */}
      <mesh position={V(0, 2.5, -6.4)} scale={[0.55, 1.1, 0.55]}>
        <sphereGeometry args={[0.5, 18, 16]} />
        <meshStandardMaterial color="#d9647f" roughness={0.5} />
      </mesh>

      {/* tongue */}
      <mesh ref={tongue} position={V(0, -2.9, 1.4)} rotation={[-0.12, 0, 0]} scale={[4.6, 1.1, 6.4]}>
        <sphereGeometry args={[1, 34, 24]} />
        <meshStandardMaterial color="#e0687f" roughness={0.35} />
      </mesh>

      {/* the mouthful being swallowed */}
      <group ref={food} position={V(0, -2.1, 5)}>
        <PizzaSlice />
      </group>
    </group>
  );
}

function Tooth({ x, y, z, s, flip }: { x: number; y: number; z: number; s: number; flip?: boolean }) {
  const geo = useMemo(() => roundedBox(1.15, 1.5, 1.05, 0.3), []);
  return (
    <group position={V(x, y, z)} scale={s} rotation={[flip ? Math.PI : 0, 0, 0]}>
      <mesh geometry={geo}>
        <meshStandardMaterial color="#fdfcf6" roughness={0.25} metalness={0.02} />
      </mesh>
    </group>
  );
}

/** A wedge of pizza: crust, cheese and pepperoni, used as the travelling food. */
function PizzaSlice() {
  const base = useMemo(() => wedge(1.5, Math.PI / 3.4, 0.16), []);
  const top = useMemo(() => wedge(1.34, Math.PI / 3.6, 0.07), []);
  const cheese = useMemo(() => cheeseTexture(), []);
  const pep = useMemo(() => pepperoniTexture(), []);
  return (
    <group>
      <mesh geometry={base}>
        <meshStandardMaterial color="#d9a465" roughness={0.95} />
      </mesh>
      <mesh geometry={top} position={V(0, 0.12, 0)}>
        <meshStandardMaterial map={cheese} roughness={0.6} />
      </mesh>
      {[[0.35, 0.15], [-0.15, -0.3], [0.6, -0.15]].map((p, i) => (
        <mesh key={i} position={V(p[0], 0.19, p[1])} scale={[1, 0.5, 1]}>
          <sphereGeometry args={[0.2, 14, 10]} />
          <meshStandardMaterial map={pep} roughness={0.65} />
        </mesh>
      ))}
    </group>
  );
}

/* ================================= GUT ================================= */
export function GutReal({ reduced }: P) {
  const flesh = useMemo(() => fleshTexture(330), []);
  const wall = useRef<THREE.Group>(null);
  const bits = useRef<THREE.Group>(null);
  const villi = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const VILLI = 420;
  const villiSeeds = useMemo(
    () =>
      Array.from({ length: VILLI }, () => ({
        a: Math.random() * Math.PI * 2,
        z: -Math.random() * 26,
        s: 0.7 + Math.random() * 0.7,
        p: Math.random() * Math.PI * 2,
      })),
    [],
  );

  const foods = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => {
        const kinds = ['slice', 'pea', 'choc', 'corn', 'crust'] as const;
        const a = Math.random() * Math.PI * 2;
        const r = 0.5 + Math.random() * 2.6;
        return {
          kind: kinds[i % kinds.length],
          x: Math.cos(a) * r,
          y: Math.sin(a) * r,
          z: -Math.random() * 26,
          sp: 1.8 + Math.random() * 1.8,
          rx: Math.random() * Math.PI,
          ry: Math.random() * Math.PI,
        };
      }),
    [],
  );

  useFrame((state, delta) => {
    if (reduced) return;
    const t = state.clock.elapsedTime;
    // peristalsis: waves squeezing along the tube
    wall.current?.children.forEach((seg) => {
      const s = 1 + Math.sin(t * 1.6 + seg.position.z * 0.45) * 0.07;
      seg.scale.set(s, s, 1);
    });
    if (villi.current) {
      villiSeeds.forEach((v, i) => {
        const sway = Math.sin(t * 2 + v.p) * 0.16;
        const rr = 5.05;
        dummy.position.set(Math.cos(v.a + sway) * rr, Math.sin(v.a + sway) * rr, v.z);
        dummy.rotation.set(0, 0, v.a + sway + Math.PI / 2);
        dummy.scale.setScalar(v.s);
        dummy.updateMatrix();
        villi.current!.setMatrixAt(i, dummy.matrix);
      });
      villi.current.instanceMatrix.needsUpdate = true;
    }
    bits.current?.children.forEach((c, i) => {
      const f = foods[i];
      c.position.z += delta * f.sp;
      if (c.position.z > 8) c.position.z = -26;
      c.rotation.x += delta * 0.9;
      c.rotation.y += delta * 0.6;
    });
  });

  return (
    <group>
      {/* the intestinal tube around the viewer */}
      <group ref={wall}>
        {Array.from({ length: 12 }, (_, i) => (
          <mesh key={i} position={V(0, 0, -i * 2.6 + 4)} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[5.4, 5.4, 2.7, 34, 1, true]} />
            <meshStandardMaterial map={flesh} color="#ef7fb4" side={THREE.BackSide} roughness={0.5} />
          </mesh>
        ))}
      </group>
      <instancedMesh ref={villi} args={[undefined, undefined, VILLI]}>
        <coneGeometry args={[0.085, 0.46, 7]} />
        <meshStandardMaterial color="#f79ac8" roughness={0.5} />
      </instancedMesh>

      <group ref={bits}>
        {foods.map((f, i) => (
          <group key={i} position={V(f.x, f.y, f.z)} rotation={[f.rx, f.ry, 0]}>
            {f.kind === 'slice' && <group scale={0.5}><PizzaSlice /></group>}
            {f.kind === 'pea' && <Pea />}
            {f.kind === 'choc' && <Choc />}
            {f.kind === 'corn' && <Corn />}
            {f.kind === 'crust' && <Crust />}
          </group>
        ))}
      </group>
    </group>
  );
}

function Pea() {
  return (
    <mesh scale={[1, 0.92, 1]}>
      <sphereGeometry args={[0.3, 18, 14]} />
      <meshStandardMaterial color="#66b13f" roughness={0.35} />
    </mesh>
  );
}
function Choc() {
  const geo = useMemo(() => roundedBox(0.5, 0.42, 0.44, 0.08), []);
  return (
    <mesh geometry={geo}>
      <meshStandardMaterial color="#4a2c14" roughness={0.45} />
    </mesh>
  );
}
function Corn() {
  return (
    <mesh scale={[0.7, 1, 0.7]}>
      <sphereGeometry args={[0.26, 14, 12]} />
      <meshStandardMaterial color="#f2c14e" roughness={0.5} />
    </mesh>
  );
}
function Crust() {
  const geo = useMemo(() => roundedBox(0.8, 0.34, 0.5, 0.14), []);
  return (
    <mesh geometry={geo}>
      <meshStandardMaterial color="#cf9a55" roughness={0.95} />
    </mesh>
  );
}

/* ================================= POO ================================= */
export function PooReal({ reduced }: P) {
  const tiles = useMemo(() => tileTexture(), []);
  const bowl = useMemo(
    () =>
      lathe(
        [
          [0, 0], [1.5, 0], [1.55, 0.25], [1.35, 0.9], [1.5, 1.7], [1.9, 2.5],
          [2.05, 2.9], [1.95, 3.0], [1.6, 2.55], [1.2, 1.8], [1.05, 1.0], [1.2, 0.3], [1.15, 0.05], [0, 0.05],
        ],
        44,
      ),
    [],
  );
  const seat = useMemo(() => lathe([[1.2, 0], [2.05, 0], [2.1, 0.14], [1.9, 0.2], [1.25, 0.18], [1.2, 0.04]], 44), []);
  const pooGeo = useMemo(() => {
    // a coiled swirl, tapering as it rises
    const pts: [number, number, number][] = [];
    for (let i = 0; i <= 42; i++) {
      const t = i / 42;
      const a = t * Math.PI * 4.2;
      const r = 0.95 * (1 - t * 0.78);
      pts.push([Math.cos(a) * r, t * 1.5, Math.sin(a) * r]);
    }
    return tube(pts, 0.42, 14, true);
  }, []);
  const poo = useRef<THREE.Mesh>(null);
  const water = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (reduced) return;
    const t = state.clock.elapsedTime;
    if (poo.current) {
      poo.current.position.y = 2.35 + Math.sin(t * 1.2) * 0.06;
      poo.current.rotation.y = t * 0.28;
    }
    if (water.current) {
      const s = 1 + Math.sin(t * 2.2) * 0.02;
      water.current.scale.set(s, 1, s);
    }
  });

  return (
    <group>
      {/* tiled bathroom filling the frame */}
      <mesh position={V(0, 2, -8)}>
        <planeGeometry args={[52, 26]} />
        <meshStandardMaterial map={tiles} roughness={0.25} metalness={0.02} />
      </mesh>
      <mesh position={V(0, -6.4, -2)} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[52, 16]} />
        <meshStandardMaterial map={tiles} color="#b9cedb" roughness={0.35} />
      </mesh>

      {/* toilet */}
      <group position={V(4.2, -5.2, -1)} scale={0.88} rotation={[0.3, -0.32, 0]}>
        <mesh geometry={bowl}>
          <meshStandardMaterial color="#fdfefe" roughness={0.12} metalness={0.04} />
        </mesh>
        <mesh geometry={seat} position={V(0, 3.0, 0)}>
          <meshStandardMaterial color="#f4f7f9" roughness={0.2} />
        </mesh>
        {/* cistern */}
        <mesh position={V(0, 3.5, -2.1)} geometry={useMemo(() => roundedBox(3, 2.2, 1.1, 0.14), [])}>
          <meshStandardMaterial color="#fbfdfe" roughness={0.15} />
        </mesh>
        <mesh position={V(0.9, 4.68, -2.1)}>
          <cylinderGeometry args={[0.22, 0.22, 0.14, 20]} />
          <meshStandardMaterial color="#c3cdd4" metalness={0.6} roughness={0.3} />
        </mesh>
        {/* water */}
        <mesh ref={water} position={V(0, 1.05, 0)}>
          <cylinderGeometry args={[1.12, 1.05, 0.12, 34]} />
          <meshStandardMaterial color="#a5daf2" transparent opacity={0.85} roughness={0.05} metalness={0.15} />
        </mesh>
        {/* the poo itself */}
        <mesh ref={poo} geometry={pooGeo} position={V(0, 2.35, 0)} scale={0.95}>
          <meshStandardMaterial color="#6b4423" roughness={0.55} />
        </mesh>
      </group>

      {/* toilet roll on the wall */}
      <group position={V(-5.6, -1.2, -6)}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.62, 0.62, 1.1, 26]} />
          <meshStandardMaterial color="#ffffff" roughness={0.95} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.2, 0.2, 1.16, 18]} />
          <meshStandardMaterial color="#c9b79c" roughness={0.9} />
        </mesh>
        <mesh position={V(0.62, -0.9, 0)}>
          <planeGeometry args={[0.95, 1.7]} />
          <meshStandardMaterial color="#fbfbfb" side={THREE.DoubleSide} roughness={0.95} />
        </mesh>
      </group>
    </group>
  );
}

/* ============================== WATERWAYS ============================== */
export function WaterReal({ reduced }: P) {
  const brick = useMemo(() => brickTexture(), []);
  const surfGeo = useMemo(() => new THREE.PlaneGeometry(60, 34, 60, 34), []);
  const surf = useRef<THREE.Mesh>(null);
  const flow = useRef<THREE.Group>(null);
  const rings = useRef<THREE.Group>(null);
  const reeds = useRef<THREE.Group>(null);
  const base = useMemo(() => Float32Array.from(surfGeo.attributes.position.array), [surfGeo]);

  const drops = useMemo(() => Array.from({ length: 22 }, (_, i) => ({ t: i / 22, s: rnd(0.16, 0.34) })), []);

  useFrame((state, delta) => {
    if (reduced) return;
    const t = state.clock.elapsedTime;
    // real waves by displacing the water surface vertices
    if (surf.current) {
      const pos = surfGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < pos.count; i++) {
        const x = base[i * 3];
        const y = base[i * 3 + 1];
        pos.setZ(i, Math.sin(x * 0.35 + t * 1.4) * 0.22 + Math.cos(y * 0.42 + t * 1.05) * 0.18);
      }
      pos.needsUpdate = true;
      surfGeo.computeVertexNormals();
    }
    flow.current?.children.forEach((c) => {
      c.position.x += delta * 4.2;
      c.position.y -= delta * 2.4;
      if (c.position.x > 6.6) {
        c.position.x = -0.7;
        c.position.y = 1.6;
      }
    });
    rings.current?.children.forEach((r, i) => {
      const k = ((t * 0.55 + i * 0.34) % 1);
      r.scale.setScalar(0.4 + k * 3.4);
      (r as THREE.Mesh & { material: THREE.Material & { opacity: number } }).material.opacity = 0.5 * (1 - k);
    });
    reeds.current?.children.forEach((r, i) => {
      r.rotation.z = Math.sin(t * 1.1 + i) * 0.12;
    });
  });

  return (
    <group>
      {/* far bank */}
      <mesh position={V(0, -0.4, -16)}>
        <boxGeometry args={[70, 5, 6]} />
        <meshStandardMaterial color="#7fa356" roughness={1} />
      </mesh>

      {/* the sewer outfall */}
      <group position={V(-3.4, 1.8, -3)}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[2.1, 2.1, 6, 30, 1, true]} />
          <meshStandardMaterial map={brick} side={THREE.DoubleSide} roughness={0.95} />
        </mesh>
        <mesh position={V(3, 0, 0)} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[2.1, 0.24, 12, 30]} />
          <meshStandardMaterial color="#5d6a70" roughness={0.8} />
        </mesh>
        <mesh position={V(3.05, 0, 0)} rotation={[0, Math.PI / 2, 0]}>
          <circleGeometry args={[1.95, 28]} />
          <meshBasicMaterial color="#22303a" />
        </mesh>
      </group>

      {/* discharge arcing down into the lake */}
      <group ref={flow}>
        {drops.map((d, i) => (
          <mesh key={i} position={V(-0.7 + d.t * 7.3, 1.6 - d.t * d.t * 5, -3)} scale={d.s}>
            <sphereGeometry args={[1, 14, 12]} />
            <meshStandardMaterial color="#8fd0ee" transparent opacity={0.8} roughness={0.1} />
          </mesh>
        ))}
      </group>

      {/* lake surface with live waves */}
      <mesh ref={surf} geometry={surfGeo} position={V(0, -2.6, -2)} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#3f93cc" transparent opacity={0.9} roughness={0.12} metalness={0.25} />
      </mesh>
      <mesh position={V(0, -5.6, -2)}>
        <boxGeometry args={[70, 6, 34]} />
        <meshStandardMaterial color="#1f5e88" roughness={0.9} />
      </mesh>

      {/* ripple rings where the discharge lands */}
      <group ref={rings} position={V(6.4, -2.5, -3)} rotation={[-Math.PI / 2, 0, 0]}>
        {[0, 1, 2].map((i) => (
          <mesh key={i}>
            <ringGeometry args={[0.85, 1, 34]} />
            <meshBasicMaterial color="#dff2ff" transparent opacity={0.4} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>

      {/* reeds and lily pads */}
      <group ref={reeds}>
        {[-7.5, -6.8, -6.2, 6.4, 7.1, 7.9, 12.5, 13.2].map((x, i) => (
          <mesh key={i} position={V(x, -1.2, -7)}>
            <cylinderGeometry args={[0.05, 0.11, 4.4, 8]} />
            <meshStandardMaterial color="#4f8f3a" roughness={0.9} />
          </mesh>
        ))}
      </group>
      {[[3.2, -1], [5.4, 2.2], [-3.6, 1.4], [9.5, -0.5]].map((p, i) => (
        <mesh key={i} position={V(p[0], -2.42, p[1])} rotation={[-Math.PI / 2, 0, i]}>
          <circleGeometry args={[0.95, 22, 0.35, Math.PI * 1.86]} />
          <meshStandardMaterial color="#54a83c" roughness={0.85} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

/* ============================== SCIENTISTS ============================== */
export function KeepersReal({ reduced }: P) {
  const wood = useMemo(() => woodTexture(), []);
  const bench = useMemo(() => roundedBox(30, 1.4, 4, 0.2), []);
  const g = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (reduced || !g.current) return;
    g.current.children.forEach((c, i) => {
      c.position.y = -1.4 + Math.sin(state.clock.elapsedTime * 0.9 + i) * 0.06;
    });
  });
  return (
    <group>
      <mesh position={V(0, 2, -8)}>
        <planeGeometry args={[54, 24]} />
        <meshStandardMaterial color="#d9d2f2" roughness={1} />
      </mesh>
      <mesh geometry={bench} position={V(0, -3.6, 0)}>
        <meshStandardMaterial map={wood} color="#cfd6e0" roughness={0.5} />
      </mesh>
      <group ref={g}>
        {[-9.5, -3.4, 3, 9.2].map((x, i) => (
          <group key={i} position={V(x, -1.4, -1.5)}>
            <mesh position={V(0, -0.7, 0)} geometry={useMemo(() => roundedBox(1.9, 2.7, 1.1, 0.4), [])}>
              <meshStandardMaterial color="#f4f6fa" roughness={0.85} />
            </mesh>
            <mesh position={V(0, 1.3, 0)} scale={[0.75, 0.88, 0.78]}>
              <sphereGeometry args={[1, 24, 20]} />
              <meshStandardMaterial color={['#e8b98f', '#c98b5e', '#a5714a', '#e0c3a0'][i]} roughness={0.75} />
            </mesh>
            <mesh position={V(0, 1.66, -0.05)} scale={[0.78, 0.6, 0.82]}>
              <sphereGeometry args={[1, 22, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#3d2b1d" roughness={0.9} />
            </mesh>
          </group>
        ))}
      </group>
      {/* microscopes on the bench */}
      {[-6.4, 0.4, 6.6].map((x, i) => (
        <group key={i} position={V(x, -2.6, 1)}>
          <mesh position={V(0, 0, 0)}>
            <cylinderGeometry args={[0.55, 0.7, 0.24, 20]} />
            <meshStandardMaterial color="#39404d" metalness={0.5} roughness={0.4} />
          </mesh>
          <mesh position={V(-0.12, 0.72, 0)} rotation={[0, 0, 0.22]}>
            <cylinderGeometry args={[0.16, 0.16, 1.5, 16]} />
            <meshStandardMaterial color="#4c5563" metalness={0.6} roughness={0.35} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
