import * as THREE from 'three';

// Procedural geometry and canvas textures. Everything here is generated at
// runtime, so the realistic look needs no image assets and works offline.

/* ------------------------------- geometry ------------------------------- */

/** A box with genuinely rounded, bevelled edges (used for real-world furniture). */
export function roundedBox(w: number, h: number, d: number, r = 0.12) {
  const shape = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  shape.moveTo(x + r, y);
  shape.lineTo(x + w - r, y);
  shape.quadraticCurveTo(x + w, y, x + w, y + r);
  shape.lineTo(x + w, y + h - r);
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  shape.lineTo(x + r, y + h);
  shape.quadraticCurveTo(x, y + h, x, y + h - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);
  const g = new THREE.ExtrudeGeometry(shape, {
    depth: Math.max(d - r, 0.01),
    bevelEnabled: true,
    bevelThickness: r * 0.8,
    bevelSize: r * 0.7,
    bevelSegments: 3,
    curveSegments: 6,
  });
  g.center();
  return g;
}

/** Lathe a 2D profile into a solid of revolution (toilet bowls, cups, jars). */
export function lathe(profile: [number, number][], segments = 40) {
  const pts = profile.map(([x, y]) => new THREE.Vector2(Math.max(x, 0.0001), y));
  const g = new THREE.LatheGeometry(pts, segments);
  g.computeVertexNormals();
  return g;
}

/** A smooth tube following a curve (roots, worms, a coiled poo). */
export function tube(points: [number, number, number][], radius: number, radial = 10, taper = false) {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
  const g = new THREE.TubeGeometry(curve, Math.max(points.length * 6, 20), radius, radial, false);
  if (taper) {
    // shrink the radius toward the far end so roots and tails come to a point
    const pos = g.attributes.position as THREE.BufferAttribute;
    const segs = g.parameters.tubularSegments;
    const rad = g.parameters.radialSegments;
    const centre = new THREE.Vector3();
    for (let i = 0; i <= segs; i++) {
      const t = i / segs;
      const scale = 1 - t * 0.85;
      centre.copy(curve.getPoint(t));
      for (let j = 0; j <= rad; j++) {
        const idx = i * (rad + 1) + j;
        const v = new THREE.Vector3().fromBufferAttribute(pos, idx);
        v.sub(centre).multiplyScalar(scale).add(centre);
        pos.setXYZ(idx, v.x, v.y, v.z);
      }
    }
    pos.needsUpdate = true;
    g.computeVertexNormals();
  }
  return g;
}

/** A wedge, i.e. a slice of pizza: a triangular prism with a crust edge. */
export function wedge(radius = 1, angle = Math.PI / 4, thickness = 0.16) {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.absarc(0, 0, radius, -angle / 2, angle / 2, false);
  shape.lineTo(0, 0);
  const g = new THREE.ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: false, curveSegments: 12 });
  g.rotateX(-Math.PI / 2);
  g.center();
  return g;
}

/* ------------------------------- textures ------------------------------- */

function canvasTexture(
  w: number,
  h: number,
  draw: (ctx: CanvasRenderingContext2D) => void,
  opts: { repeat?: [number, number]; pixelated?: boolean; awaitFonts?: boolean } = {},
) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d')!;
  draw(ctx);
  const t = new THREE.CanvasTexture(c);
  // Text drawn before the webfonts land falls back to a system face, which
  // looks foreign next to the rest of the site. Redraw once they are ready.
  if (opts.awaitFonts && typeof document !== 'undefined' && 'fonts' in document) {
    document.fonts.ready.then(() => {
      ctx.clearRect(0, 0, w, h);
      draw(ctx);
      t.needsUpdate = true;
    });
  }
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  if (opts.repeat) t.repeat.set(opts.repeat[0], opts.repeat[1]);
  if (opts.pixelated) {
    t.magFilter = THREE.NearestFilter;
    t.minFilter = THREE.NearestFilter;
  }
  t.needsUpdate = true;
  return t;
}

const rnd = (a: number, b: number) => a + Math.random() * (b - a);

/** Crumbly soil: mottled browns with grit and small stones. */
export function soilTexture(pixelated = false) {
  return canvasTexture(
    256,
    256,
    (ctx) => {
      ctx.fillStyle = '#6b4423';
      ctx.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 1400; i++) {
        const s = rnd(1, 5);
        ctx.fillStyle = `hsl(${rnd(20, 34)}, ${rnd(35, 60)}%, ${rnd(14, 34)}%)`;
        ctx.fillRect(rnd(0, 256), rnd(0, 256), s, s);
      }
      for (let i = 0; i < 40; i++) {
        ctx.fillStyle = `hsl(${rnd(20, 40)}, 12%, ${rnd(40, 58)}%)`;
        ctx.beginPath();
        ctx.ellipse(rnd(0, 256), rnd(0, 256), rnd(2, 6), rnd(2, 5), rnd(0, 3), 0, 7);
        ctx.fill();
      }
    },
    { repeat: [4, 3], pixelated },
  );
}

/** Warm wood with grain lines, for the café counter and shelves. */
export function woodTexture(pixelated = false) {
  return canvasTexture(
    256,
    256,
    (ctx) => {
      ctx.fillStyle = '#a9742f';
      ctx.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 90; i++) {
        ctx.strokeStyle = `hsla(${rnd(24, 36)}, ${rnd(40, 60)}%, ${rnd(24, 46)}%, ${rnd(0.15, 0.5)})`;
        ctx.lineWidth = rnd(0.6, 2.6);
        const y = rnd(0, 256);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.bezierCurveTo(85, y + rnd(-7, 7), 170, y + rnd(-7, 7), 256, y + rnd(-4, 4));
        ctx.stroke();
      }
    },
    { repeat: [3, 1], pixelated },
  );
}

/** Glazed wall tiles with grout, for the bathroom. */
export function tileTexture(pixelated = false) {
  return canvasTexture(
    256,
    256,
    (ctx) => {
      ctx.fillStyle = '#c9d9e4';
      ctx.fillRect(0, 0, 256, 256);
      const n = 4;
      const s = 256 / n;
      for (let x = 0; x < n; x++)
        for (let y = 0; y < n; y++) {
          ctx.fillStyle = `hsl(203, ${rnd(24, 34)}%, ${rnd(88, 95)}%)`;
          ctx.fillRect(x * s + 3, y * s + 3, s - 6, s - 6);
          const g = ctx.createLinearGradient(x * s, y * s, x * s + s, y * s + s);
          g.addColorStop(0, 'rgba(255,255,255,0.55)');
          g.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.fillStyle = g;
          ctx.fillRect(x * s + 3, y * s + 3, s - 6, s - 6);
        }
    },
    { repeat: [6, 4], pixelated },
  );
}

/**
 * The café menu board. Lists the microbes behind the food rather than the food
 * itself; both entries come from the "Meet the Microbe" fact sheets. Set in the
 * site's own faces (Fredoka / Nunito Sans) so it does not look pasted in.
 */
export function menuTexture(pixelated = false) {
  return canvasTexture(
    768,
    480,
    (ctx) => {
      ctx.fillStyle = '#1f3b30';
      ctx.fillRect(0, 0, 768, 480);
      for (let i = 0; i < 700; i++) {
        ctx.fillStyle = `rgba(255,255,255,${rnd(0.01, 0.045)})`;
        ctx.fillRect(rnd(0, 768), rnd(0, 480), rnd(1, 3), rnd(1, 3));
      }
      ctx.strokeStyle = 'rgba(245,240,225,0.45)';
      ctx.lineWidth = 4;
      ctx.strokeRect(22, 22, 724, 436);

      ctx.textAlign = 'center';
      ctx.fillStyle = '#fdf6e3';
      ctx.font = '600 62px Fredoka, "Nunito Sans", sans-serif';
      ctx.fillText('MICROBE CAFÉ', 384, 96);

      ctx.font = '400 26px "Nunito Sans", sans-serif';
      ctx.fillStyle = '#b5d4ab';
      ctx.fillText("Today's cultures", 384, 136);

      ctx.strokeStyle = 'rgba(245,240,225,0.28)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(90, 160);
      ctx.lineTo(678, 160);
      ctx.stroke();

      const rows: [string, string, string][] = [
        ['Saccharomyces cerevisiae', '(yeast)', 'bread · beer · wine'],
        ['Bifidobacterium bifidum', '(bacteria)', 'yoghurt · cheese'],
      ];
      rows.forEach(([name, kind, makes], i) => {
        const y = 226 + i * 118;
        ctx.textAlign = 'left';
        ctx.fillStyle = '#fdf6e3';
        ctx.font = 'italic 600 38px Fredoka, "Nunito Sans", sans-serif';
        ctx.fillText(name, 92, y);

        ctx.font = '400 30px "Nunito Sans", sans-serif';
        ctx.fillStyle = '#9fc79a';
        ctx.textAlign = 'right';
        ctx.fillText(kind, 676, y);

        ctx.textAlign = 'left';
        ctx.font = '400 27px "Nunito Sans", sans-serif';
        ctx.fillStyle = '#d8e6d2';
        ctx.fillText(makes, 92, y + 40);
      });
    },
    { pixelated, awaitFonts: true },
  );
}

/** Mottled cured meat, so pepperoni reads as food and not as a tablet. */
export function pepperoniTexture(pixelated = false) {
  return canvasTexture(
    128,
    128,
    (ctx) => {
      ctx.fillStyle = '#b8342a';
      ctx.fillRect(0, 0, 128, 128);
      for (let i = 0; i < 90; i++) {
        ctx.fillStyle = `hsl(${rnd(0, 12)}, ${rnd(45, 70)}%, ${rnd(22, 40)}%)`;
        ctx.beginPath();
        ctx.ellipse(rnd(0, 128), rnd(0, 128), rnd(2, 7), rnd(2, 6), rnd(0, 3), 0, 7);
        ctx.fill();
      }
      for (let i = 0; i < 45; i++) {
        ctx.fillStyle = `hsla(35, 40%, ${rnd(78, 92)}%, ${rnd(0.5, 0.9)})`;
        ctx.beginPath();
        ctx.ellipse(rnd(0, 128), rnd(0, 128), rnd(1.5, 5), rnd(1.5, 4), rnd(0, 3), 0, 7);
        ctx.fill();
      }
    },
    { pixelated },
  );
}

/** Melted cheese with a few charred spots, for the pizza surface. */
export function cheeseTexture(pixelated = false) {
  return canvasTexture(
    128,
    128,
    (ctx) => {
      ctx.fillStyle = '#e8b552';
      ctx.fillRect(0, 0, 128, 128);
      for (let i = 0; i < 70; i++) {
        ctx.fillStyle = `hsla(${rnd(34, 46)}, ${rnd(55, 80)}%, ${rnd(58, 80)}%, 0.8)`;
        ctx.beginPath();
        ctx.ellipse(rnd(0, 128), rnd(0, 128), rnd(4, 14), rnd(3, 10), rnd(0, 3), 0, 7);
        ctx.fill();
      }
      for (let i = 0; i < 14; i++) {
        ctx.fillStyle = `hsla(26, 50%, ${rnd(28, 42)}%, 0.75)`;
        ctx.beginPath();
        ctx.ellipse(rnd(0, 128), rnd(0, 128), rnd(1.5, 4), rnd(1.5, 3.5), 0, 0, 7);
        ctx.fill();
      }
    },
    { pixelated },
  );
}

/** Wet, fleshy tissue for the mouth and gut walls. */
export function fleshTexture(hue = 340, pixelated = false) {
  return canvasTexture(
    256,
    256,
    (ctx) => {
      ctx.fillStyle = `hsl(${hue}, 55%, 66%)`;
      ctx.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 260; i++) {
        ctx.fillStyle = `hsla(${hue + rnd(-12, 12)}, ${rnd(45, 70)}%, ${rnd(52, 78)}%, ${rnd(0.2, 0.6)})`;
        ctx.beginPath();
        ctx.ellipse(rnd(0, 256), rnd(0, 256), rnd(4, 18), rnd(3, 12), rnd(0, 3), 0, 7);
        ctx.fill();
      }
      for (let i = 0; i < 40; i++) {
        ctx.strokeStyle = `hsla(${hue - 12}, 60%, 45%, ${rnd(0.1, 0.3)})`;
        ctx.lineWidth = rnd(0.5, 2);
        ctx.beginPath();
        ctx.moveTo(rnd(0, 256), rnd(0, 256));
        ctx.bezierCurveTo(rnd(0, 256), rnd(0, 256), rnd(0, 256), rnd(0, 256), rnd(0, 256), rnd(0, 256));
        ctx.stroke();
      }
    },
    { repeat: [2, 2], pixelated },
  );
}

/** Brick, for the sewer outfall. */
export function brickTexture(pixelated = false) {
  return canvasTexture(
    256,
    256,
    (ctx) => {
      ctx.fillStyle = '#6f7176';
      ctx.fillRect(0, 0, 256, 256);
      const bh = 32;
      for (let row = 0; row < 8; row++) {
        const off = (row % 2) * 32;
        for (let col = -1; col < 5; col++) {
          ctx.fillStyle = `hsl(${rnd(200, 220)}, ${rnd(4, 12)}%, ${rnd(38, 56)}%)`;
          ctx.fillRect(col * 64 + off + 2, row * bh + 2, 60, bh - 4);
        }
      }
    },
    { repeat: [3, 2], pixelated },
  );
}
