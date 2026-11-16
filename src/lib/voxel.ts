// Voxel characters and props for the CSS-3D scenes (Farmer DB, Buyers, Results). Everything is built from
// boxes rendered as absolutely positioned faces; pages put the faces inside a `transform-style: preserve-3d` layer.

export interface Face { css: string }

export const CROP_C: Record<string, string> = {
  Mango: "#F5B83D", Tomato: "#E4584B", Chilli: "#C95FB0", Banana: "#B6E36B", Rice: "#6CC4F0", Groundnut: "#D49A66", Broiler: "#C9A0DC",
};
export const SKIN = ["#D9A47A", "#C98F63", "#8D5A3B", "#E8B98A"];
export const SHIRT = ["#E4A04B", "#4F9BD9", "#E4584B", "#8E7CC3", "#4FB3A9", "#C95FB0"];
export const CAP = ["#DCE96C", "#E8F1EA", "#F2A65A", "#6CC4F0"];

/** Darken (m < 1) or lighten (m > 1) a #rrggbb colour; always returns #rrggbb. */
export const shade = (hex: string, m: number) => {
  const n = parseInt(hex.slice(1), 16);
  return "#" + [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.max(0, Math.min(255, Math.round(v * m))).toString(16).padStart(2, "0")).join("");
};

export interface BoxSpec { x: number; y: number; z?: number; w: number; d: number; h: number; c: string; pat?: string }
export type VFn = (x: number, y: number, z: number, w: number, d: number, h: number, c: string, pat?: string) => void;

/** A box writer (pixel units) and a V() helper in character units around (ox, oy); +y faces the viewer, z is height. */
export function voxels(faces: Face[], ox = 200, oy = 200, oz = 5, u = 3.7) {
  const box = (o: BoxSpec) => {
    const z = o.z || 0;
    const bg = (m: number) => (o.pat ? `linear-gradient(rgba(0,0,0,${(1 - m).toFixed(2)}),rgba(0,0,0,${(1 - m).toFixed(2)})),${o.pat}` : shade(o.c, m));
    faces.push({ css: `left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.d}px;background:${bg(1)};transform:translateZ(${z + o.h}px);` });
    if (o.h <= 0) return;
    faces.push({ css: `left:${o.x}px;top:${o.y + o.d}px;width:${o.w}px;height:${o.h}px;background:${bg(.8)};transform-origin:0 0;transform:translateZ(${z}px) rotateX(90deg);` });
    faces.push({ css: `left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px;background:${bg(.62)};transform-origin:0 0;transform:translateZ(${z}px) rotateX(90deg);` });
    faces.push({ css: `left:${o.x + o.w}px;top:${o.y}px;width:${o.h}px;height:${o.d}px;background:${bg(.58)};transform-origin:0 0;transform:translateZ(${z}px) rotateY(-90deg);` });
    faces.push({ css: `left:${o.x}px;top:${o.y}px;width:${o.h}px;height:${o.d}px;background:${bg(.7)};transform-origin:0 0;transform:translateZ(${z}px) rotateY(-90deg);` });
  };
  const V: VFn = (x, y, z, w, d, h, c, pat) => box({ x: ox + x * u, y: oy + y * u, z: oz + z * u, w: w * u, d: d * u, h: h * u, c, pat });
  return { box, V };
}

function face(V: VFn, skin: string) {
  const skD = shade(skin, .82);
  V(-4, 6, 36.4, 2, 0.4, 2.2, "#1a1a1a"); V(2, 6, 36.4, 2, 0.4, 2.2, "#1a1a1a");
  V(-3.6, 6.3, 37.8, 0.7, 0.2, 0.7, "#ffffff"); V(2.4, 6.3, 37.8, 0.7, 0.2, 0.7, "#ffffff");
  V(-4.4, 6, 39.3, 2.8, 0.3, 0.6, "#2a1f18"); V(1.6, 6, 39.3, 2.8, 0.3, 0.6, "#2a1f18");
  V(-1, 6, 34.4, 2, 1, 1.8, skD);
  V(-2.2, 6, 32.6, 4.4, 0.3, 0.7, "#5a2e22"); V(-2.8, 6, 33.1, 0.8, 0.3, 0.6, "#5a2e22"); V(2, 6, 33.1, 0.8, 0.3, 0.6, "#5a2e22");
  V(-5.4, 6, 33.6, 1.8, 0.2, 1.1, "#E58A7A"); V(3.6, 6, 33.6, 1.8, 0.2, 1.1, "#E58A7A");
}

/** A farmer: kurta, gamcha, dhoti, sandals, hoe, a basket of `crop`, and a straw hat / pagri / topi (varies by id). */
export function farmer(V: VFn, id: number, crop?: string, opts: { tool?: boolean; basket?: boolean } = {}) {
  const sk = SKIN[id % 4], st = SHIRT[id % 6];
  const dhoti = ["#EFE8D6", "#E3D6B8", "#5E6E8F"][(id >> 1) % 3];
  const towelC = ["#E4584B", "#4F9BD9", "#F5B83D", "#4FB3A9"][(id >> 2) % 4];
  const towel = `repeating-linear-gradient(45deg,${towelC} 0 6px,#F4F1E8 6px 9px)`;
  V(-6, -2, 0, 5, 7, 1.4, "#6b4428"); V(1, -2, 0, 5, 7, 1.4, "#6b4428");
  V(-5.5, -1.5, 1.4, 4.5, 4.5, 2.6, sk); V(1, -1.5, 1.4, 4.5, 4.5, 2.6, sk);
  V(-5.8, -1.8, 4, 5, 5, 6, dhoti); V(0.8, -1.8, 4, 5, 5, 6, dhoti);
  V(-7, -3.6, 9, 14, 7.6, 5.5, dhoti, `repeating-linear-gradient(90deg,${dhoti} 0 10px,${shade(dhoti, .9)} 10px 12px)`);
  V(-7, -3.5, 14.5, 14, 7, 14.5, st);
  V(-1.4, 3.5, 25, 2.8, 0.3, 3.5, sk);
  V(-0.5, 3.5, 22.5, 1, 0.4, 1, shade(st, 1.25)); V(-0.5, 3.5, 19.5, 1, 0.4, 1, shade(st, 1.25));
  V(-7.6, -4.1, 18, 4.2, 8.2, 11.5, towelC, towel); V(-7.3, 3.7, 13, 3.2, 0.8, 7, towelC, towel);
  V(-11, -2, 16, 4, 4, 13, st); V(-11, -2, 13, 4, 4, 3, sk);
  V(7, -2, 16, 4, 4, 13, st); V(7, -2, 13, 4, 4, 3, sk);
  V(-2.5, -2, 29, 5, 4, 2, shade(sk, .82));
  V(-6, -5, 31, 12, 11, 11, sk);
  V(-6.3, -5.4, 34, 12.6, 3.6, 7, "#1f1a17");
  face(V, sk);
  const hat = id % 3;
  if (hat === 0) {
    const straw = "repeating-linear-gradient(45deg,#E6C67E 0 4px,#D4AE5F 4px 6px)";
    V(-11.5, -10.5, 42, 23, 23, 1.2, "#E6C67E", straw);
    V(-5.5, -5, 43.2, 11, 11, 5.5, "#DDB967", straw);
    V(-5.7, -5.2, 43.2, 11.4, 11.4, 1.5, "#8B4A2B");
  } else if (hat === 1) {
    const pc = ["#F28C28", "#E4584B", "#F4F1E8", "#E8C547"][(id >> 3) % 4];
    const pagri = `repeating-linear-gradient(160deg,${pc} 0 7px,${shade(pc, .85)} 7px 10px)`;
    V(-6.6, -5.6, 40.5, 13.2, 12.2, 6.5, pc, pagri);
    V(-4, -3, 47, 8, 7, 2, pc, pagri);
    V(-1.5, -6.6, 31, 3, 1, 10, pc, pagri);
  } else {
    V(-6.2, -3.8, 41.2, 12.4, 9, 4, "#F4F1E8");
    V(-6.2, -0.3, 45.2, 12.4, 2, 1, "#E3DFD3");
  }
  if (opts.tool !== false) { V(8.2, -0.8, 2, 1.6, 1.6, 36, "#8B5A2B"); V(7.8, 0.8, 34, 2.4, 7, 3.5, "#A9B4B7"); }
  if (opts.basket !== false && crop) {
    const pc2 = CROP_C[crop] || "#DCE96C";
    V(-19, -4, 9, 8.5, 8, 5, "#B07A3E", "repeating-linear-gradient(0deg,#B07A3E 0 5px,#8E5E2C 5px 7px)");
    V(-18, -3, 14, 3, 3, 3, pc2); V(-14.5, -3, 14, 3, 3, 3, shade(pc2, .9)); V(-16.3, 0.3, 14, 3, 3, 3, shade(pc2, 1.08)); V(-16.2, -1.4, 17, 3, 3, 3, pc2);
  }
}

/** A buyer from an export house: suit, tie, trousers, shoes, neat hair, glasses (varies by seed), and a clipboard. */
export function buyer(V: VFn, seed: number) {
  const sk = SKIN[(seed + 1) % 4];
  const suit = ["#2E3A55", "#3B3F46", "#4A3B5C", "#24474A"][seed % 4], tie = ["#E4584B", "#DCE96C", "#6CC4F0", "#F2A65A"][(seed >> 1) % 4];
  V(-6, -2, 0, 5, 7, 1.6, "#1b1b1f"); V(1, -2, 0, 5, 7, 1.6, "#1b1b1f");
  V(-5.6, -1.6, 1.6, 4.8, 4.8, 13, shade(suit, .85)); V(0.8, -1.6, 1.6, 4.8, 4.8, 13, shade(suit, .85));
  V(-7, -3.5, 14.5, 14, 7, 14.5, suit);
  V(-2.2, 3.5, 21, 4.4, 0.3, 8, "#F4F1E8");
  V(-0.8, 3.7, 19, 1.6, 0.4, 9.5, tie);
  V(-0.6, 3.6, 16, 1.2, 0.3, 1, shade(suit, 1.3));
  V(-11, -2, 16, 4, 4, 13, suit); V(-11, -2, 13, 4, 4, 3, sk);
  V(7, -2, 16, 4, 4, 13, suit); V(7, -2, 13, 4, 4, 3, sk);
  V(7.4, 2, 12, 6, 0.8, 8, "#C9A36B"); V(8, 2.7, 13, 4.8, 0.2, 6.5, "#F4F1E8");
  V(-2.5, -2, 29, 5, 4, 2, shade(sk, .82));
  V(-6, -5, 31, 12, 11, 11, sk);
  const hair = ["#1f1a17", "#3a2a1e", "#151515", "#5a4632"][(seed >> 2) % 4];
  V(-6.3, -5.4, 34, 12.6, 3.6, 8, hair); V(-6.3, -5.4, 41, 12.6, 11.4, 2.2, hair);
  face(V, sk);
  if (seed % 2 === 0) { V(-4.6, 6.4, 36, 3.2, 0.2, 3, "#1a1a1a"); V(1.4, 6.4, 36, 3.2, 0.2, 3, "#1a1a1a"); V(-1.4, 6.4, 37.4, 2.8, 0.2, 0.5, "#1a1a1a"); }
}
