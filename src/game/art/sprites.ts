/**
 * Procedural character art.
 *
 * These are ORIGINAL hand-drawn placeholder sprites (canvas shapes), created for this
 * prototype — they are not official licensed artwork. Each character is built from its
 * recognisable silhouette and colour palette so it reads as that character during play.
 */

export const FRAME_W = 64;
export const FRAME_H = 64;
const OUT = '#232a4d';

export interface Pose {
  bob: number;
  leg: number;
  arm: number;
  jump: boolean;
  power: boolean;
}

export const FRAMES = 8;
export const ANIM = {
  idle: [0, 1],
  walk: [2, 3, 4, 5],
  jump: [6],
  power: [7],
};

function c(w: number, h: number) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  return canvas;
}

function ellipse(ctx: CanvasRenderingContext2D, x: number, y: number, rx: number, ry: number, fill: string, stroke = OUT, lw = 2) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.lineWidth = lw;
    ctx.strokeStyle = stroke;
    ctx.stroke();
  }
}

function circle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, fill: string, stroke = OUT, lw = 2) {
  ellipse(ctx, x, y, r, r, fill, stroke, lw);
}

function limb(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, width: number, color: string, outline = OUT) {
  ctx.lineCap = 'round';
  ctx.strokeStyle = outline;
  ctx.lineWidth = width + 3;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function eyes(ctx: CanvasRenderingContext2D, lx: number, rx: number, y: number, r = 2.2, white = true) {
  if (white) {
    circle(ctx, lx, y, r + 1.4, '#ffffff', OUT, 1.4);
    circle(ctx, rx, y, r + 1.4, '#ffffff', OUT, 1.4);
  }
  circle(ctx, lx, y, r, OUT, null as unknown as string, 0);
  circle(ctx, rx, y, r, OUT, null as unknown as string, 0);
}

/* ───────────────────────────── characters ───────────────────────────── */

function doraemon(ctx: CanvasRenderingContext2D, p: Pose) {
  const y = p.bob;
  const step = p.leg;
  // tail
  circle(ctx, 13, 40 + y, 4, '#e2464f', OUT, 1.6);
  // legs / feet
  ctx.save();
  const fl = p.jump ? -4 : 0;
  ellipse(ctx, 26, 56 + y + fl + (step > 0 ? -2 : 0), 6.5, 4.4, '#ffffff');
  ellipse(ctx, 38, 56 + y + fl + (step < 0 ? -2 : 0), 6.5, 4.4, '#ffffff');
  ctx.restore();
  // body
  ellipse(ctx, 32, 38 + y, 17.5, 19, '#3aa0ea');
  // belly
  ellipse(ctx, 32, 43 + y, 11, 11.5, '#ffffff');
  // arms
  const armSwing = p.power ? -8 : p.arm * 6;
  limb(ctx, 20, 34 + y, 12, 42 + y + armSwing * 0.5, 6, '#3aa0ea');
  limb(ctx, 44, 34 + y, 52, 42 + y - armSwing * 0.5, 6, '#3aa0ea');
  circle(ctx, 12, 42 + y + armSwing * 0.5, 5, '#ffffff', OUT, 1.8);
  circle(ctx, 52, 42 + y - armSwing * 0.5, 5, '#ffffff', OUT, 1.8);
  // head
  circle(ctx, 32, 21 + y, 15.5, '#3aa0ea');
  ellipse(ctx, 32, 24 + y, 11.5, 10.5, '#ffffff');
  // eyes
  circle(ctx, 27.5, 19 + y, 4.2, '#ffffff', OUT, 1.6);
  circle(ctx, 36.5, 19 + y, 4.2, '#ffffff', OUT, 1.6);
  circle(ctx, 28.5, 19.6 + y, 1.9, OUT, null as unknown as string, 0);
  circle(ctx, 35.5, 19.6 + y, 1.9, OUT, null as unknown as string, 0);
  // nose + mouth
  circle(ctx, 32, 24.5 + y, 2.8, '#e2464f', OUT, 1.4);
  ctx.strokeStyle = OUT;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(32, 27.5 + y);
  ctx.lineTo(32, 30 + y);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(32, 28.5 + y, 5, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();
  // whiskers
  ctx.lineWidth = 1.2;
  [-1, 1].forEach((s) => {
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(32 + s * 12, 22 + i * 3 + y);
      ctx.lineTo(32 + s * 20, 19 + i * 4 + y);
      ctx.stroke();
    }
  });
  // collar + bell
  ctx.strokeStyle = '#e2464f';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(21, 32 + y);
  ctx.quadraticCurveTo(32, 36 + y, 43, 32 + y);
  ctx.stroke();
  circle(ctx, 32, 35 + y, 3.4, '#ffd166', OUT, 1.4);
  ctx.strokeStyle = OUT;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(32, 33 + y);
  ctx.lineTo(32, 38 + y);
  ctx.stroke();
}

function pikachu(ctx: CanvasRenderingContext2D, p: Pose) {
  const y = p.bob;
  const step = p.leg;
  // tail (lightning bolt)
  ctx.save();
  ctx.strokeStyle = OUT;
  ctx.lineWidth = 6;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  const tx = 48;
  ctx.moveTo(tx, 44 + y);
  ctx.lineTo(tx + 7, 36 + y);
  ctx.lineTo(tx + 2, 34 + y);
  ctx.lineTo(tx + 11, 24 + y);
  ctx.lineTo(tx + 6, 23 + y);
  ctx.lineTo(tx + 10, 14 + y);
  ctx.stroke();
  ctx.strokeStyle = '#ffd21f';
  ctx.lineWidth = 3.4;
  ctx.stroke();
  ctx.restore();
  // feet
  ellipse(ctx, 26, 56 + y + (step > 0 ? -3 : 0), 7, 4.2, '#ffd21f');
  ellipse(ctx, 38, 56 + y + (step < 0 ? -3 : 0), 7, 4.2, '#ffd21f');
  // body
  ellipse(ctx, 32, 40 + y, 16, 15, '#ffd21f');
  // brown back stripes
  ctx.strokeStyle = '#c98a2b';
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(20, 32 + y);
  ctx.lineTo(26, 35 + y);
  ctx.moveTo(22, 26 + y);
  ctx.lineTo(27, 29 + y);
  ctx.stroke();
  // belly
  ellipse(ctx, 32, 45 + y, 9, 8, '#fff3b0', null as unknown as string, 0);
  // arms
  const swing = p.power ? -9 : p.arm * 6;
  limb(ctx, 20, 36 + y, 14, 44 + y + swing * 0.4, 5, '#ffd21f');
  limb(ctx, 44, 36 + y, 50, 44 + y - swing * 0.4, 5, '#ffd21f');
  // ears
  ctx.fillStyle = '#ffd21f';
  ctx.strokeStyle = OUT;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(23, 13 + y);
  ctx.quadraticCurveTo(15, -1 + y, 21, -2 + y);
  ctx.quadraticCurveTo(27, 4 + y, 29, 12 + y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(41, 13 + y);
  ctx.quadraticCurveTo(49, -1 + y, 43, -2 + y);
  ctx.quadraticCurveTo(37, 4 + y, 35, 12 + y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = OUT;
  ctx.beginPath();
  ctx.moveTo(20, 1 + y);
  ctx.quadraticCurveTo(15, -1 + y, 21, -2 + y);
  ctx.quadraticCurveTo(25, 1 + y, 24, 4 + y);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(44, 1 + y);
  ctx.quadraticCurveTo(49, -1 + y, 43, -2 + y);
  ctx.quadraticCurveTo(39, 1 + y, 40, 4 + y);
  ctx.closePath();
  ctx.fill();
  // head
  circle(ctx, 32, 21 + y, 13.5, '#ffd21f');
  // cheeks
  circle(ctx, 21.5, 26 + y, 3.4, '#f2544b', null as unknown as string, 0);
  circle(ctx, 42.5, 26 + y, 3.4, '#f2544b', null as unknown as string, 0);
  // eyes
  eyes(ctx, 27, 37, 19 + y, 2.6);
  // nose + mouth
  ctx.fillStyle = OUT;
  ctx.beginPath();
  ctx.moveTo(32, 23.5 + y);
  ctx.lineTo(30.6, 25.5 + y);
  ctx.lineTo(33.4, 25.5 + y);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = OUT;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(28, 27.5 + y);
  ctx.quadraticCurveTo(30, 30.5 + y, 32, 27.5 + y);
  ctx.quadraticCurveTo(34, 30.5 + y, 36, 27.5 + y);
  ctx.stroke();
  if (p.power) {
    circle(ctx, 14, 40 + y, 4, '#fff9c4', '#ffd21f', 2);
  }
}

function humanoid(ctx: CanvasRenderingContext2D, p: Pose, cfg: {
  skin: string;
  hair: string;
  top: string;
  topAccent?: string;
  legs: string;
  shoes: string;
  dress?: string;
  cape?: string;
  hairStyle: 'braid' | 'long' | 'bowl' | 'short' | 'topknot' | 'spiky';
  glow?: string;
}) {
  const y = p.bob;
  const swing = p.jump ? 0 : p.leg;
  const hipY = 40 + y;
  const footY = 56 + y;
  const headY = 20 + y;

  const footAX = 27 + swing * 3;
  const footBX = 37 - swing * 3;
  const liftA = p.jump ? -6 : Math.max(0, swing) * -2.5;
  const liftB = p.jump ? -6 : Math.max(0, -swing) * -2.5;

  // cape behind
  if (cfg.cape) {
    ctx.fillStyle = cfg.cape;
    ctx.strokeStyle = OUT;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(24, 28 + y);
    ctx.quadraticCurveTo(12, 42 + y, 18, 56 + y);
    ctx.lineTo(34, 52 + y);
    ctx.quadraticCurveTo(30, 38 + y, 34, 28 + y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  // legs
  limb(ctx, 28, hipY, footAX, footY + liftA, 6, cfg.legs);
  limb(ctx, 36, hipY, footBX, footY + liftB, 6, cfg.legs);
  ellipse(ctx, footAX, footY + liftA + 1.5, 5.2, 3, cfg.shoes);
  ellipse(ctx, footBX, footY + liftB + 1.5, 5.2, 3, cfg.shoes);

  // dress / torso
  if (cfg.dress) {
    ctx.fillStyle = cfg.dress;
    ctx.strokeStyle = OUT;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(25, 30 + y);
    ctx.lineTo(39, 30 + y);
    ctx.lineTo(48, 54 + y);
    ctx.quadraticCurveTo(32, 58 + y, 16, 54 + y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.beginPath();
    ctx.moveTo(25, 30 + y);
    ctx.lineTo(32, 30 + y);
    ctx.lineTo(30, 55 + y);
    ctx.quadraticCurveTo(23, 54 + y, 16, 54 + y);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.fillStyle = cfg.top;
    ctx.strokeStyle = OUT;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(23, 28 + y, 18, 15, 4);
    ctx.fill();
    ctx.stroke();
    // shorts
    ctx.fillStyle = cfg.topAccent ?? cfg.top;
    ctx.beginPath();
    ctx.roundRect(24, 40 + y, 16, 7, 3);
    ctx.fill();
    ctx.stroke();
  }

  // arms
  const armSwing = p.power ? -13 : swing * 4;
  const armAX = 18 + (p.power ? -2 : 0);
  const armAY = 34 + y + armSwing;
  const armBX = 46 + (p.power ? 2 : 0);
  const armBY = 34 + y - armSwing;
  limb(ctx, 25, 31 + y, armAX, armAY, 5, cfg.skin);
  limb(ctx, 39, 31 + y, armBX, armBY, 5, cfg.skin);
  // sleeves
  if (!cfg.dress) {
    ctx.strokeStyle = cfg.top;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(25, 31 + y);
    ctx.lineTo(22, 36 + y);
    ctx.moveTo(39, 31 + y);
    ctx.lineTo(42, 36 + y);
    ctx.stroke();
  }
  circle(ctx, armAX, armAY, 2.6, cfg.skin);
  circle(ctx, armBX, armBY, 2.6, cfg.skin);

  // neck + head
  ctx.fillStyle = cfg.skin;
  ctx.strokeStyle = OUT;
  ctx.lineWidth = 2;
  ctx.fillRect(29, 24 + y, 6, 5);
  ctx.strokeRect(29, 24 + y, 6, 5);
  circle(ctx, 32, headY, 10, cfg.skin);

  // hair back
  if (cfg.hairStyle === 'long') {
    ctx.fillStyle = cfg.hair;
    ctx.beginPath();
    ctx.moveTo(22, 16 + y);
    ctx.quadraticCurveTo(14, 34 + y, 20, 44 + y);
    ctx.lineTo(44, 44 + y);
    ctx.quadraticCurveTo(50, 34 + y, 42, 16 + y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  if (cfg.hairStyle === 'topknot') {
    circle(ctx, 32, 8 + y, 4.6, cfg.hair);
    ctx.fillStyle = cfg.hair;
    ctx.beginPath();
    ctx.arc(32, headY - 2 + y, 10, Math.PI * 1.02, Math.PI * 1.98);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = '#ffcf6b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(28, 12 + y);
    ctx.lineTo(36, 12 + y);
    ctx.stroke();
  }
  if (cfg.hairStyle === 'bowl') {
    ctx.fillStyle = cfg.hair;
    ctx.beginPath();
    ctx.arc(32, headY - 1 + y, 10.5, Math.PI * 0.98, Math.PI * 2.02);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillRect(21.5, headY - 2 + y, 21, 4);
    ctx.strokeRect(21.5, headY - 2 + y, 21, 4);
  }
  if (cfg.hairStyle === 'short' || cfg.hairStyle === 'braid') {
    ctx.fillStyle = cfg.hair;
    ctx.beginPath();
    ctx.arc(32, headY - 1 + y, 10.4, Math.PI, Math.PI * 2);
    ctx.quadraticCurveTo(40, headY + 2 + y, 38, headY + 3 + y);
    ctx.quadraticCurveTo(32, headY - 2 + y, 24, headY + 2 + y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  if (cfg.hairStyle === 'braid') {
    ctx.fillStyle = cfg.hair;
    [0, 1, 2].forEach((i) => circle(ctx, 41.5, 24 + i * 5 + y, 3.4 - i * 0.45, cfg.hair, OUT, 1.4));
  }
  if (cfg.hairStyle === 'spiky') {
    ctx.fillStyle = cfg.hair;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = Math.PI + (i / 4) * Math.PI;
      ctx.lineTo(32 + Math.cos(a) * 10.5, headY + Math.sin(a) * 10.5);
      ctx.lineTo(32 + Math.cos(a + 0.28) * 14, headY + Math.sin(a + 0.28) * 14);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
}

function elsa(ctx: CanvasRenderingContext2D, p: Pose) {
  if (p.power) {
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      ctx.strokeStyle = '#cdefff';
      ctx.lineWidth = 1.6;
      const cx = 32 + Math.cos(a) * 20;
      const cy = 36 + Math.sin(a) * 18;
      ctx.beginPath();
      ctx.moveTo(cx - 3, cy);
      ctx.lineTo(cx + 3, cy);
      ctx.moveTo(cx, cy - 3);
      ctx.lineTo(cx, cy + 3);
      ctx.stroke();
    }
  }
  humanoid(ctx, p, {
    skin: '#ffe0c8',
    hair: '#f2e9ff',
    top: '#a8dcff',
    legs: '#ffe0c8',
    shoes: '#bfe8ff',
    dress: '#8fd0ff',
    cape: 'rgba(205,239,255,0.85)',
    hairStyle: 'braid',
  });
  const y = p.bob;
  // bodice + ice collar
  ctx.strokeStyle = '#dff4ff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(27, 30 + y);
  ctx.lineTo(37, 30 + y);
  ctx.stroke();
  // tiara
  ctx.strokeStyle = '#ffd166';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(26, 12 + y);
  ctx.lineTo(30, 8.5 + y);
  ctx.lineTo(32, 11 + y);
  ctx.lineTo(34, 8.5 + y);
  ctx.lineTo(38, 12 + y);
  ctx.stroke();
  // face
  circle(ctx, 28.5, 20 + y, 1.5, OUT, null as unknown as string, 0);
  circle(ctx, 35.5, 20 + y, 1.5, OUT, null as unknown as string, 0);
  ctx.strokeStyle = '#c96b7b';
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.arc(32, 24 + y, 3, 0.2 * Math.PI, 0.8 * Math.PI);
  ctx.stroke();
}

function spiderman(ctx: CanvasRenderingContext2D, p: Pose) {
  humanoid(ctx, p, {
    skin: '#e23636',
    hair: '#e23636',
    top: '#e23636',
    topAccent: '#2b4fa8',
    legs: '#2b4fa8',
    shoes: '#c22020',
    hairStyle: 'short',
  });
  const y = p.bob;
  // web lines on torso
  ctx.strokeStyle = 'rgba(60,20,30,0.75)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(24, 32 + y + i * 4);
    ctx.quadraticCurveTo(32, 34 + y + i * 4, 40, 32 + y + i * 4);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(32, 29 + y);
  ctx.lineTo(32, 42 + y);
  ctx.stroke();
  // spider emblem
  ctx.fillStyle = '#1b1b2f';
  ellipse(ctx, 32, 35 + y, 2.6, 1.8, '#1b1b2f', null as unknown as string, 0);
  // mask + eyes
  ctx.fillStyle = '#e23636';
  ctx.strokeStyle = OUT;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(32, 20 + y, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = 'rgba(60,20,30,0.7)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(22, 16 + y + i * 4);
    ctx.quadraticCurveTo(32, 19 + y + i * 4, 42, 16 + y + i * 4);
    ctx.stroke();
  }
  // white eye lenses
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = OUT;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.ellipse(27.5, 19.5 + y, 4.2, 3.2, -0.25, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(36.5, 19.5 + y, 4.2, 3.2, 0.25, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  if (p.power) {
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(46, 30 + y);
    ctx.lineTo(58, 18 + y);
    ctx.stroke();
  }
}

function ironman(ctx: CanvasRenderingContext2D, p: Pose) {
  const y = p.bob;
  if (p.power) {
    // thruster flame
    const g = ctx.createLinearGradient(0, 55 + y, 0, 64);
    g.addColorStop(0, 'rgba(140,220,255,0.95)');
    g.addColorStop(1, 'rgba(140,220,255,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(26, 54 + y);
    ctx.lineTo(32, 64);
    ctx.lineTo(38, 54 + y);
    ctx.closePath();
    ctx.fill();
  }
  humanoid(ctx, p, {
    skin: '#d93a2b',
    hair: '#ffc94b',
    top: '#d93a2b',
    topAccent: '#ffc94b',
    legs: '#c22f22',
    shoes: '#ffc94b',
    hairStyle: 'short',
  });
  // gold chest plate
  ctx.fillStyle = '#ffc94b';
  ctx.strokeStyle = OUT;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.roundRect(25, 30 + y, 14, 9, 3);
  ctx.fill();
  ctx.stroke();
  // arc reactor
  circle(ctx, 32, 34.5 + y, 3.4, '#dff8ff', OUT, 1.2);
  circle(ctx, 32, 34.5 + y, 2, '#8fe8ff', null as unknown as string, 0);
  // helmet
  ctx.fillStyle = '#d93a2b';
  ctx.beginPath();
  ctx.arc(32, 20 + y, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // gold faceplate
  ctx.fillStyle = '#ffc94b';
  ctx.beginPath();
  ctx.moveTo(24, 16 + y);
  ctx.quadraticCurveTo(32, 10 + y, 40, 16 + y);
  ctx.lineTo(39, 25 + y);
  ctx.quadraticCurveTo(32, 30 + y, 25, 25 + y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // eye slits
  ctx.fillStyle = '#bff3ff';
  ctx.beginPath();
  ctx.roundRect(26.5, 18.5 + y, 4.6, 2.6, 1.2);
  ctx.roundRect(32.9, 18.5 + y, 4.6, 2.6, 1.2);
  ctx.fill();
  // mouth grille
  ctx.strokeStyle = '#8a5a34';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(29, 25 + y);
  ctx.lineTo(35, 25 + y);
  ctx.stroke();
}

function shinchan(ctx: CanvasRenderingContext2D, p: Pose) {
  humanoid(ctx, p, {
    skin: '#ffdcbd',
    hair: '#2b1d16',
    top: '#ff5a5a',
    topAccent: '#ffd166',
    legs: '#ffdcbd',
    shoes: '#3a2a52',
    hairStyle: 'bowl',
  });
  const y = p.bob;
  // thick brows
  ctx.strokeStyle = '#2b1d16';
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  ctx.moveTo(24.5, 16.5 + y);
  ctx.lineTo(29.5, 17.5 + y);
  ctx.moveTo(39.5, 16.5 + y);
  ctx.lineTo(34.5, 17.5 + y);
  ctx.stroke();
  // eyes + grin
  circle(ctx, 28, 20.5 + y, 1.7, OUT, null as unknown as string, 0);
  circle(ctx, 36, 20.5 + y, 1.7, OUT, null as unknown as string, 0);
  ctx.strokeStyle = '#b3593f';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(32, 23 + y, 4.2, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();
  // red cheeks
  circle(ctx, 23.5, 23 + y, 2.2, 'rgba(255,140,140,0.65)', null as unknown as string, 0);
  circle(ctx, 40.5, 23 + y, 2.2, 'rgba(255,140,140,0.65)', null as unknown as string, 0);
  if (p.power) {
    ctx.font = '10px sans-serif';
    ctx.fillStyle = '#ff8ad1';
    ctx.fillText('♪', 44, 12 + y);
    ctx.fillText('♫', 14, 20 + y);
  }
}

function barbie(ctx: CanvasRenderingContext2D, p: Pose) {
  humanoid(ctx, p, {
    skin: '#ffdcbd',
    hair: '#ffd98a',
    top: '#ff85c0',
    legs: '#ffdcbd',
    shoes: '#ff9ed2',
    dress: '#ff85c0',
    hairStyle: 'long',
  });
  const y = p.bob;
  // fringe + tiara
  ctx.fillStyle = '#ffd98a';
  ctx.strokeStyle = OUT;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(32, 18 + y, 10, Math.PI * 1.05, Math.PI * 1.95);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = '#ffd166';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(28, 10 + y);
  ctx.lineTo(32, 6.5 + y);
  ctx.lineTo(36, 10 + y);
  ctx.stroke();
  // face
  circle(ctx, 28.5, 19.5 + y, 1.5, OUT, null as unknown as string, 0);
  circle(ctx, 35.5, 19.5 + y, 1.5, OUT, null as unknown as string, 0);
  ctx.strokeStyle = '#c96b7b';
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.arc(32, 23 + y, 3, 0.2 * Math.PI, 0.8 * Math.PI);
  ctx.stroke();
  if (p.power) {
    ctx.fillStyle = '#ffe08a';
    ['✦', '✧'].forEach((s, i) => {
      ctx.font = '9px sans-serif';
      ctx.fillText(s, 12 + i * 40, 14 + i * 22 + y);
    });
  }
}

function bheem(ctx: CanvasRenderingContext2D, p: Pose) {
  humanoid(ctx, p, {
    skin: '#d19a63',
    hair: '#241a17',
    top: '#d19a63',
    topAccent: '#ff9a3c',
    legs: '#d19a63',
    shoes: '#c98a5a',
    hairStyle: 'topknot',
  });
  const y = p.bob;
  // bare chest + dhoti
  ctx.fillStyle = '#ff9a3c';
  ctx.strokeStyle = OUT;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(23, 38 + y);
  ctx.lineTo(41, 38 + y);
  ctx.lineTo(45, 50 + y);
  ctx.lineTo(19, 50 + y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // gold belt
  ctx.fillStyle = '#ffd166';
  ctx.beginPath();
  ctx.roundRect(23, 38 + y, 18, 3.4, 1.4);
  ctx.fill();
  // bangles
  circle(ctx, 17, 36 + y - p.arm * 4, 2.6, '#ffd166', OUT, 1.2);
  circle(ctx, 47, 36 + y + p.arm * 4, 2.6, '#ffd166', OUT, 1.2);
  // face
  circle(ctx, 28.5, 20 + y, 1.6, OUT, null as unknown as string, 0);
  circle(ctx, 35.5, 20 + y, 1.6, OUT, null as unknown as string, 0);
  ctx.strokeStyle = '#8a4b2f';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(32, 24 + y, 3.6, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();
  if (p.power) {
    circle(ctx, 46, 32 + y, 4, 'rgba(255,209,102,0.5)', '#ffd166', 1.5);
  }
}

const painters: Record<string, (ctx: CanvasRenderingContext2D, p: Pose) => void> = {
  doraemon,
  pikachu,
  elsa,
  spiderman,
  ironman,
  shinchan,
  barbie,
  bheem,
};

export function drawFrame(ctx: CanvasRenderingContext2D, id: string, frame: number, scale = 1) {
  const painter = painters[id] ?? doraemon;
  // walk phases for frames 2..5: [1, 0, -1, 0]
  const walkPhase = [1, 0, -1, 0][Math.max(0, frame - 2)] ?? 0;
  const pose: Pose = {
    bob: frame === 1 || frame === 3 || frame === 5 ? 1 : 0,
    leg: walkPhase,
    arm: walkPhase,
    jump: frame === 6,
    power: frame === 7,
  };
  ctx.save();
  ctx.scale(scale, scale);
  ctx.translate(0, 0);
  ctx.lineJoin = 'round';
  painter(ctx, pose);
  ctx.restore();
}

/** Build the 8-frame sheet used by Phaser as sprite-sheet frames. */
export function characterSheet(id: string): HTMLCanvasElement {
  const sheet = c(FRAME_W * FRAMES, FRAME_H);
  const ctx = sheet.getContext('2d')!;
  for (let f = 0; f < FRAMES; f++) {
    ctx.save();
    ctx.translate(f * FRAME_W, 0);
    drawFrame(ctx, id, f);
    ctx.restore();
  }
  return sheet;
}

const portraits = new Map<string, string>();

/** Render a character portrait as a data URL for the React character select screen. */
export function portrait(id: string, size = 168): string {
  const key = `${id}-${size}`;
  const cached = portraits.get(key);
  if (cached) return cached;
  const canvas = c(size, size);
  const ctx = canvas.getContext('2d')!;
  // soft backdrop
  const g = ctx.createRadialGradient(size * 0.5, size * 0.42, size * 0.1, size * 0.5, size * 0.5, size * 0.55);
  g.addColorStop(0, 'rgba(255,255,255,0.22)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const scale = size / 62;
  ctx.save();
  ctx.translate(size * 0.02, size * 0.02);
  drawFrame(ctx, id, 0, scale);
  ctx.restore();
  const url = canvas.toDataURL();
  portraits.set(key, url);
  return url;
}
