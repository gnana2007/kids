import Phaser from 'phaser';
import type { ZoneDef } from '../world';
import { ZONES } from '../world';
import { characterSheet } from './sprites';

const OUT = '#23305a';

function canvasTex(scene: Phaser.Scene, key: string, w: number, h: number, draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void) {
  if (scene.textures.exists(key)) return;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  draw(ctx, w, h);
  scene.textures.addCanvas(key, canvas);
}

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, fill: string, stroke = OUT, lw = 2) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.lineWidth = lw;
    ctx.strokeStyle = stroke;
    ctx.stroke();
  }
}

function ell(ctx: CanvasRenderingContext2D, x: number, y: number, rx: number, ry: number, fill: string, stroke = '', lw = 2) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lw;
    ctx.stroke();
  }
}

/* ───────────────────────────── backgrounds ───────────────────────────── */

function hills(ctx: CanvasRenderingContext2D, w: number, h: number, baseY: number, color: string, amp: number, step: number) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, h);
  ctx.lineTo(0, baseY);
  for (let x = 0; x <= w; x += step) {
    ctx.quadraticCurveTo(x + step / 2, baseY - amp, x + step, baseY);
  }
  ctx.lineTo(w, h);
  ctx.closePath();
  ctx.fill();
}

function cloud(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  ctx.beginPath();
  ctx.arc(x, y, 22 * s, 0, Math.PI * 2);
  ctx.arc(x + 24 * s, y - 10 * s, 26 * s, 0, Math.PI * 2);
  ctx.arc(x + 52 * s, y, 20 * s, 0, Math.PI * 2);
  ctx.arc(x + 26 * s, y + 10 * s, 22 * s, 0, Math.PI * 2);
  ctx.fill();
}

function pine(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, snow: boolean) {
  ctx.fillStyle = '#5a4632';
  ctx.fillRect(x - 4 * s, y - 16 * s, 8 * s, 20 * s);
  for (let i = 0; i < 3; i++) {
    const w = (44 - i * 10) * s;
    const yy = y - (30 + i * 26) * s;
    ctx.fillStyle = snow ? '#e8f6ff' : i % 2 ? '#2f7a5e' : '#3d8f6b';
    ctx.beginPath();
    ctx.moveTo(x, yy - 34 * s);
    ctx.lineTo(x + w, yy);
    ctx.lineTo(x - w, yy);
    ctx.closePath();
    ctx.fill();
  }
}

function drawBackground(ctx: CanvasRenderingContext2D, w: number, h: number, zone: ZoneDef) {
  const p = zone.palette;
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, p.skyTop);
  g.addColorStop(1, p.skyBottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // sun / moon + glow
  const sunX = w * 0.78;
  const sunY = h * 0.22;
  const glow = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, zone.id === 'frozen' ? 130 : 180);
  glow.addColorStop(0, zone.id === 'frozen' ? 'rgba(220,245,255,0.95)' : 'rgba(255,246,190,0.95)');
  glow.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(sunX - 200, sunY - 200, 400, 400);
  ell(ctx, sunX, sunY, zone.id === 'frozen' ? 34 : 42, zone.id === 'frozen' ? 34 : 42, zone.id === 'frozen' ? '#f4fbff' : '#fff2a8');

  if (zone.id === 'village') {
    cloud(ctx, w * 0.08, h * 0.16, 1.2);
    cloud(ctx, w * 0.42, h * 0.1, 0.9);
    cloud(ctx, w * 0.62, h * 0.24, 1.05);
    hills(ctx, w, h, h * 0.62, '#bfeec6', 60, 220);
    hills(ctx, w, h, h * 0.7, p.far, 70, 260);
    // far windmill silhouette
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(w * 0.15, h * 0.5, 16, 60);
    ctx.beginPath();
    ctx.arc(w * 0.15 + 8, h * 0.5, 28, 0, Math.PI * 2);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.globalAlpha = 1;
  } else if (zone.id === 'forest') {
    // aurora-ish glow bands
    ['rgba(180,140,255,0.28)', 'rgba(120,255,214,0.28)'].forEach((col, i) => {
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.moveTo(0, h * (0.18 + i * 0.1));
      for (let x = 0; x <= w; x += 120) {
        ctx.quadraticCurveTo(x + 60, h * (0.1 + i * 0.09 + Math.sin(x / 180) * 0.03), x + 120, h * (0.2 + i * 0.1));
      }
      ctx.lineTo(w, 0);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fill();
    });
    cloud(ctx, w * 0.2, h * 0.14, 0.8);
    cloud(ctx, w * 0.7, h * 0.1, 0.6);
    hills(ctx, w, h, h * 0.6, '#3f9a7a', 80, 200);
    // giant distant trees
    for (let i = 0; i < 5; i++) {
      const x = 120 + i * 210;
      ctx.fillStyle = 'rgba(30,90,70,0.55)';
      ctx.fillRect(x, h * 0.45, 18, h * 0.2);
      ell(ctx, x + 9, h * 0.44, 62, 50, 'rgba(38,110,84,0.45)');
    }
  } else {
    // frozen: aurora + mountains
    ['rgba(150,255,220,0.25)', 'rgba(150,200,255,0.3)'].forEach((col, i) => {
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.moveTo(0, h * (0.12 + i * 0.1));
      for (let x = 0; x <= w; x += 140) {
        ctx.quadraticCurveTo(x + 70, h * (0.04 + i * 0.08), x + 140, h * (0.16 + i * 0.1));
      }
      ctx.lineTo(w, 0);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fill();
    });
    for (let i = 0; i < 6; i++) {
      const bx = 60 + i * 190;
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.beginPath();
      ctx.moveTo(bx, h * 0.62);
      ctx.lineTo(bx + 90, h * 0.26);
      ctx.lineTo(bx + 130, h * 0.42);
      ctx.lineTo(bx + 180, h * 0.2);
      ctx.lineTo(bx + 250, h * 0.62);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = 'rgba(180,215,240,0.8)';
      ctx.beginPath();
      ctx.moveTo(bx + 90, h * 0.26);
      ctx.lineTo(bx + 130, h * 0.42);
      ctx.lineTo(bx + 100, h * 0.42);
      ctx.closePath();
      ctx.fill();
    }
    for (let i = 0; i < 8; i++) pine(ctx, 60 + i * 140, h * 0.68, 0.7, true);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.72, w * 0.6, 40, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // soft haze at the horizon
  const haze = ctx.createLinearGradient(0, h * 0.5, 0, h * 0.78);
  haze.addColorStop(0, 'rgba(255,255,255,0)');
  haze.addColorStop(1, 'rgba(255,255,255,0.35)');
  ctx.fillStyle = haze;
  ctx.fillRect(0, h * 0.5, w, h * 0.3);
}

function drawMid(ctx: CanvasRenderingContext2D, w: number, h: number, zone: ZoneDef) {
  if (zone.id === 'village') {
    [120, 400, 700, 900].forEach((x, i) => {
      ctx.fillStyle = i % 2 ? '#4c9c74' : '#3f8a66';
      ell(ctx, x, h * 0.6, 58, 46, i % 2 ? '#4c9c74' : '#3f8a66');
      ctx.fillStyle = '#6b4a2f';
      ctx.fillRect(x - 7, h * 0.6, 14, 90);
    });
    // distant cottages
    [220, 600, 830].forEach((x) => {
      ctx.fillStyle = '#f6e3c5';
      ctx.fillRect(x, h * 0.58, 90, 60);
      ctx.fillStyle = '#d96b5a';
      ctx.beginPath();
      ctx.moveTo(x - 10, h * 0.58);
      ctx.lineTo(x + 45, h * 0.5);
      ctx.lineTo(x + 100, h * 0.58);
      ctx.closePath();
      ctx.fill();
    });
  } else if (zone.id === 'forest') {
    for (let i = 0; i < 6; i++) {
      const x = 80 + i * 180;
      ctx.fillStyle = '#1f5c46';
      ctx.fillRect(x - 8, h * 0.52, 16, 120);
      ell(ctx, x, h * 0.5, 78, 60, 'rgba(40,120,92,0.9)');
      ell(ctx, x - 30, h * 0.56, 40, 30, 'rgba(30,95,74,0.9)');
    }
    for (let i = 0; i < 12; i++) {
      ctx.fillStyle = 'rgba(190,255,170,0.5)';
      ctx.beginPath();
      ctx.arc(30 + i * 84, h * 0.68 + Math.sin(i) * 20, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    for (let i = 0; i < 7; i++) pine(ctx, 90 + i * 160, h * 0.66, 0.85, true);
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.beginPath();
    ctx.ellipse(w * 0.3, h * 0.7, 220, 26, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

/* ───────────────────────────── world objects ───────────────────────────── */

function drawHouse(ctx: CanvasRenderingContext2D, variant: number) {
  const roofs = ['#e8695b', '#6f8fe8', '#e2a13f'];
  const walls = ['#fff1d6', '#f4efe0', '#ffe8c9'];
  ctx.fillStyle = walls[variant];
  ctx.strokeStyle = OUT;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(22, 74, 116, 74, 8);
  ctx.fill();
  ctx.stroke();
  // roof
  ctx.fillStyle = roofs[variant];
  ctx.beginPath();
  ctx.moveTo(8, 78);
  ctx.lineTo(80, 18);
  ctx.lineTo(152, 78);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // chimney
  ctx.fillStyle = '#b9705a';
  ctx.fillRect(110, 26, 18, 26);
  ctx.strokeRect(110, 26, 18, 26);
  // door + window
  ctx.fillStyle = '#8a5a34';
  rr(ctx, 64, 106, 32, 42, 6, '#8a5a34');
  ctx.fillStyle = '#ffe9a8';
  rr(ctx, 34, 92, 22, 22, 4, '#ffe9a8');
  rr(ctx, 104, 92, 22, 22, 4, '#ffe9a8');
  ctx.strokeStyle = OUT;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(45, 92);
  ctx.lineTo(45, 114);
  ctx.moveTo(34, 103);
  ctx.lineTo(56, 103);
  ctx.moveTo(115, 92);
  ctx.lineTo(115, 114);
  ctx.moveTo(104, 103);
  ctx.lineTo(126, 103);
  ctx.stroke();
}

function drawTree(ctx: CanvasRenderingContext2D, variant: number) {
  const w = 160;
  const h = 210;
  if (variant === 2) {
    pine(ctx, w / 2, h - 10, 1.05, true);
    return;
  }
  ctx.fillStyle = '#7a5232';
  ctx.strokeStyle = OUT;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(w / 2 - 12, h - 80, 24, 74, 6);
  ctx.fill();
  ctx.stroke();
  const greens = variant === 1 ? ['#5fd18f', '#3fae74', '#2c8a5c'] : ['#7fe0a0', '#4fc07f', '#2f9a62'];
  ell(ctx, w / 2, h - 95, 66, 54, greens[2], OUT, 3);
  ell(ctx, w / 2 - 26, h - 112, 44, 38, greens[1], '', 0);
  ell(ctx, w / 2 + 26, h - 106, 40, 34, greens[0], '', 0);
  ell(ctx, w / 2, h - 128, 38, 30, greens[1], '', 0);
}

function drawWindmill(ctx: CanvasRenderingContext2D) {
  // tower 150 x 250
  ctx.fillStyle = '#f5e6c8';
  ctx.strokeStyle = OUT;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(48, 250);
  ctx.lineTo(58, 70);
  ctx.lineTo(96, 70);
  ctx.lineTo(106, 250);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // beam texture
  ctx.strokeStyle = 'rgba(120,80,50,0.35)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(48, 110 + i * 28);
    ctx.lineTo(106, 110 + i * 28);
    ctx.stroke();
  }
  // roof
  ctx.fillStyle = '#d96b5a';
  ctx.beginPath();
  ctx.moveTo(46, 74);
  ctx.lineTo(77, 34);
  ctx.lineTo(108, 74);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // door
  rr(ctx, 66, 200, 30, 50, 8, '#8a5a34');
  // windows
  rr(ctx, 68, 120, 20, 22, 4, '#ffe9a8');
  // hub
  ctx.fillStyle = '#8a5a34';
  ctx.beginPath();
  ctx.arc(77, 92, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

function drawBlades(ctx: CanvasRenderingContext2D) {
  // 210 x 210, hub centred
  const cx = 105;
  const cy = 105;
  ctx.translate(cx, cy);
  for (let i = 0; i < 4; i++) {
    ctx.save();
    ctx.rotate((i * Math.PI) / 2);
    ctx.fillStyle = '#f8f0dd';
    ctx.strokeStyle = OUT;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.rect(-8, 14, 16, 78);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = 'rgba(120,80,50,0.4)';
    ctx.lineWidth = 2;
    for (let j = 0; j < 4; j++) {
      ctx.beginPath();
      ctx.moveTo(-8, 26 + j * 16);
      ctx.lineTo(8, 26 + j * 16);
      ctx.stroke();
    }
    ctx.restore();
  }
  ctx.fillStyle = '#c98a5a';
  ctx.strokeStyle = OUT;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

function drawLamp(ctx: CanvasRenderingContext2D, on: boolean) {
  // 60 x 170
  ctx.strokeStyle = OUT;
  ctx.fillStyle = '#4b5a86';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(27, 40, 7, 128, 3);
  ctx.fill();
  ctx.stroke();
  rr(ctx, 18, 160, 26, 10, 4, '#4b5a86');
  // lantern
  ctx.fillStyle = on ? '#ffe27a' : '#9fb0c9';
  ctx.beginPath();
  ctx.roundRect(15, 14, 30, 32, 8);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = on ? '#fff7cf' : '#c3d0e0';
  ctx.beginPath();
  ctx.roundRect(20, 19, 20, 22, 5);
  ctx.fill();
  // cap
  ctx.fillStyle = '#4b5a86';
  ctx.beginPath();
  ctx.moveTo(12, 16);
  ctx.lineTo(30, 2);
  ctx.lineTo(48, 16);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

function drawGear(ctx: CanvasRenderingContext2D) {
  const cx = 24;
  const cy = 24;
  ctx.translate(cx, cy);
  ctx.fillStyle = '#c9d6e8';
  ctx.strokeStyle = OUT;
  ctx.lineWidth = 2.5;
  for (let i = 0; i < 8; i++) {
    ctx.save();
    ctx.rotate((i * Math.PI) / 4);
    ctx.beginPath();
    ctx.roundRect(-4, -22, 8, 12, 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
  ctx.beginPath();
  ctx.arc(0, 0, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#8fa2bd';
  ctx.beginPath();
  ctx.arc(0, 0, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

function drawCrate(ctx: CanvasRenderingContext2D) {
  rr(ctx, 4, 6, 44, 40, 5, '#c98a4f');
  ctx.strokeStyle = '#8a5a34';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(8, 10);
  ctx.lineTo(44, 42);
  ctx.moveTo(44, 10);
  ctx.lineTo(8, 42);
  ctx.stroke();
  ctx.strokeStyle = OUT;
  ctx.lineWidth = 2.5;
  ctx.strokeRect(4, 6, 44, 40);
}

function drawToy(ctx: CanvasRenderingContext2D) {
  // teddy bear
  ell(ctx, 18, 30, 12, 11, '#d9a05a', OUT, 2);
  ell(ctx, 18, 16, 9, 8, '#e6b273', OUT, 2);
  ell(ctx, 8, 8, 4.5, 4.5, '#e6b273', OUT, 2);
  ell(ctx, 28, 8, 4.5, 4.5, '#e6b273', OUT, 2);
  ctx.fillStyle = OUT;
  ctx.beginPath();
  ctx.arc(15, 15, 1.4, 0, Math.PI * 2);
  ctx.arc(21, 15, 1.4, 0, Math.PI * 2);
  ctx.fill();
  ell(ctx, 18, 19, 2.4, 1.8, '#8a5a34');
  ell(ctx, 18, 33, 6, 5, '#f0d3a0');
}

function drawFlowerBed(ctx: CanvasRenderingContext2D, bloom: boolean) {
  // wooden planter box so the empty beds read clearly
  rr(ctx, 6, 26, 68, 34, 7, '#b5763c', OUT, 3);
  rr(ctx, 12, 20, 56, 14, 5, '#6b4428', OUT, 2.5);
  ctx.strokeStyle = 'rgba(90,55,30,0.5)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(14 + i * 20, 29);
    ctx.lineTo(14 + i * 20, 52);
    ctx.stroke();
  }
  if (!bloom) {
    // empty planting holes + a little tag
    [-16, 0, 16].forEach((dx) => {
      ell(ctx, 40 + dx, 26, 5, 3, '#3d2a1c');
    });
    rr(ctx, 62, 4, 18, 14, 3, '#fff3b0', OUT, 2);
    ctx.strokeStyle = '#8a5a34';
    ctx.beginPath();
    ctx.moveTo(71, 18);
    ctx.lineTo(71, 24);
    ctx.stroke();
    return;
  }
  const stems = [-16, 0, 16];
  stems.forEach((dx, i) => {
    ctx.strokeStyle = '#3fae74';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(40 + dx, 27);
    ctx.quadraticCurveTo(40 + dx + 5, 14, 40 + dx, 6 - i * 2);
    ctx.stroke();
    const colors = ['#ff8ad1', '#ffd166', '#b48cff'];
    for (let k = 0; k < 5; k++) {
      const a = (k / 5) * Math.PI * 2;
      ell(ctx, 40 + dx + Math.cos(a) * 5, 6 - i * 2 + Math.sin(a) * 5, 4.2, 4.2, colors[i]);
    }
    ell(ctx, 40 + dx, 6 - i * 2, 3, 3, '#fff3b0');
  });
}

function drawHearth(ctx: CanvasRenderingContext2D) {
  rr(ctx, 6, 40, 96, 44, 8, '#9aa7bd');
  ctx.fillStyle = '#7d8aa3';
  [12, 34, 56, 78].forEach((x) => {
    ctx.beginPath();
    ctx.roundRect(x, 46, 18, 12, 3);
    ctx.fill();
  });
  // logs
  ctx.fillStyle = '#8a5a34';
  ctx.beginPath();
  ctx.roundRect(24, 32, 60, 14, 6);
  ctx.fill();
  ctx.strokeStyle = OUT;
  ctx.lineWidth = 2;
  ctx.stroke();
  // flame
  const g = ctx.createLinearGradient(0, 8, 0, 34);
  g.addColorStop(0, '#ffe27a');
  g.addColorStop(1, '#ff7a3c');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(54, 4);
  ctx.quadraticCurveTo(76, 22, 68, 34);
  ctx.quadraticCurveTo(54, 44, 40, 34);
  ctx.quadraticCurveTo(32, 22, 54, 4);
  ctx.fill();
}

function drawCastle(ctx: CanvasRenderingContext2D) {
  // 460 x 340 icy castle
  const base = 330;
  ctx.fillStyle = '#dcefff';
  ctx.strokeStyle = '#7fa5c8';
  ctx.lineWidth = 4;
  // main keep
  rr(ctx, 130, 120, 200, base - 120, 8, '#e8f6ff', '#7fa5c8', 4);
  // towers
  [
    [60, 180, 70, base - 180],
    [330, 150, 80, base - 150],
  ].forEach(([x, y, w, h]) => {
    rr(ctx, x, y, w, h, 8, '#f2fbff', '#7fa5c8', 4);
  });
  // conical roofs
  const roof = (x: number, y: number, w: number) => {
    ctx.fillStyle = '#8fd0ff';
    ctx.strokeStyle = '#5d87b5';
    ctx.beginPath();
    ctx.moveTo(x - 8, y);
    ctx.lineTo(x + w / 2, y - 62);
    ctx.lineTo(x + w + 8, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = '#5d87b5';
    ctx.beginPath();
    ctx.moveTo(x + w / 2, y - 62);
    ctx.lineTo(x + w / 2, y - 80);
    ctx.stroke();
    ctx.fillStyle = '#ffd166';
    ctx.beginPath();
    ctx.arc(x + w / 2, y - 82, 5, 0, Math.PI * 2);
    ctx.fill();
  };
  roof(60, 180, 70);
  roof(330, 150, 80);
  roof(130, 120, 200);
  // gate
  ctx.fillStyle = '#5d87b5';
  ctx.beginPath();
  ctx.moveTo(210, base);
  ctx.lineTo(210, 240);
  ctx.quadraticCurveTo(230, 214, 250, 240);
  ctx.lineTo(250, base);
  ctx.closePath();
  ctx.fill();
  // windows
  ctx.fillStyle = '#ffe9a8';
  [
    [95, 210],
    [360, 190],
    [170, 170],
    [280, 170],
  ].forEach(([x, y]) => {
    ctx.beginPath();
    ctx.roundRect(x, y, 14, 22, 6);
    ctx.fill();
  });
}

function drawGenerator(ctx: CanvasRenderingContext2D) {
  // 130 x 120
  rr(ctx, 12, 40, 106, 78, 10, '#6d7fa6');
  rr(ctx, 26, 16, 78, 34, 8, '#8fa2c4');
  // dial
  ell(ctx, 46, 60, 14, 14, '#dff8ff', OUT, 2);
  ell(ctx, 46, 60, 8, 8, '#8fe8ff');
  // lights
  ['#ff7a7a', '#ffd166', '#7affa1'].forEach((col, i) => {
    ell(ctx, 78 + i * 13, 56, 4, 4, col);
  });
  // pipes
  ctx.strokeStyle = '#4b5a86';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(22, 112);
  ctx.lineTo(22, 128);
  ctx.moveTo(106, 112);
  ctx.lineTo(106, 128);
  ctx.stroke();
  // crack
  ctx.strokeStyle = '#2a3350';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(84, 84);
  ctx.lineTo(94, 96);
  ctx.lineTo(88, 104);
  ctx.stroke();
}

function drawPart(ctx: CanvasRenderingContext2D) {
  ctx.translate(22, 22);
  ctx.fillStyle = '#ffd166';
  ctx.strokeStyle = OUT;
  ctx.lineWidth = 2.4;
  for (let i = 0; i < 6; i++) {
    ctx.save();
    ctx.rotate((i * Math.PI) / 3);
    ctx.beginPath();
    ctx.roundRect(-3, -17, 6, 8, 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
  ell(ctx, 0, 0, 11, 11, '#ffe9a8', OUT, 2.4);
  ell(ctx, 0, 0, 4, 4, '#8fa2bd');
}

function drawVillager(ctx: CanvasRenderingContext2D, color: string) {
  ell(ctx, 24, 56, 15, 5, 'rgba(0,0,0,0.15)');
  // body
  rr(ctx, 15, 26, 18, 26, 7, color);
  // head
  ell(ctx, 24, 18, 10, 10, '#ffdcbd', OUT, 2);
  // hat
  ctx.fillStyle = '#e8695b';
  ctx.beginPath();
  ctx.arc(24, 14, 10, Math.PI, Math.PI * 2);
  ctx.fill();
  // eyes + smile
  ctx.fillStyle = OUT;
  ctx.beginPath();
  ctx.arc(21, 19, 1.4, 0, Math.PI * 2);
  ctx.arc(27, 19, 1.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#8a4b2f';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.arc(24, 22, 3, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();
  // legs
  ctx.strokeStyle = '#3b4a6b';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(20, 52);
  ctx.lineTo(19, 60);
  ctx.moveTo(28, 52);
  ctx.lineTo(29, 60);
  ctx.stroke();
}

function drawIcePlatform(ctx: CanvasRenderingContext2D) {
  // thick, bright ice slab with icicles so a built bridge is unmistakable
  ctx.fillStyle = 'rgba(120,200,245,0.55)';
  ctx.strokeStyle = '#6cb8e8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(0, 2, 128, 38, 7);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#e9f9ff';
  ctx.beginPath();
  ctx.roundRect(2, 4, 124, 30, 6);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(4, 4, 120, 12, 5);
  ctx.fill();
  // icicles
  ctx.fillStyle = '#d7f2ff';
  ctx.strokeStyle = '#8fd0ff';
  [16, 42, 70, 96, 118].forEach((x, i) => {
    const h = 6 + (i % 3) * 5;
    ctx.beginPath();
    ctx.moveTo(x - 4, 32);
    ctx.lineTo(x, 32 + h);
    ctx.lineTo(x + 4, 32);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  });
  ctx.strokeStyle = 'rgba(110,180,230,0.8)';
  ctx.beginPath();
  ctx.moveTo(22, 10);
  ctx.lineTo(36, 26);
  ctx.moveTo(78, 8);
  ctx.lineTo(94, 24);
  ctx.stroke();
}

/* ───────────────────────────── entry point ───────────────────────────── */

export function createScenery(scene: Phaser.Scene) {
  // character sheets
  ['doraemon', 'pikachu', 'elsa', 'spiderman', 'ironman', 'shinchan', 'barbie', 'bheem'].forEach((id) => {
    const key = `hero-${id}`;
    if (scene.textures.exists(key)) return;
    const sheet = characterSheet(id);
    scene.textures.addSpriteSheet(key, sheet as unknown as HTMLImageElement, {
      frameWidth: 64,
      frameHeight: 64,
    });
  });

  ZONES.forEach((zone) => {
    canvasTex(scene, `bg-${zone.id}`, 1024, 720, (ctx, w, h) => drawBackground(ctx, w, h, zone));
    canvasTex(scene, `mid-${zone.id}`, 1024, 720, (ctx, w, h) => drawMid(ctx, w, h, zone));

    // ground tile
    canvasTex(scene, `ground-${zone.id}`, 64, 64, (ctx) => {
      ctx.fillStyle = zone.palette.groundBody;
      ctx.fillRect(0, 0, 64, 64);
      ctx.fillStyle = 'rgba(0,0,0,0.10)';
      for (let i = 0; i < 7; i++) {
        ctx.beginPath();
        ctx.arc(8 + ((i * 13) % 48), 24 + ((i * 7) % 34), 3 + (i % 3), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = zone.palette.groundTop;
      ctx.fillRect(0, 0, 64, 14);
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.fillRect(0, 0, 64, 4);
      if (zone.id === 'village') {
        ctx.fillStyle = '#4db85c';
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.moveTo(10 + i * 20, 14);
          ctx.lineTo(14 + i * 20, 4);
          ctx.lineTo(18 + i * 20, 14);
          ctx.fill();
        }
      }
      if (zone.id === 'frozen') {
        ctx.strokeStyle = 'rgba(150,190,220,0.6)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(6, 28);
        ctx.lineTo(22, 44);
        ctx.lineTo(38, 32);
        ctx.moveTo(44, 50);
        ctx.lineTo(58, 60);
        ctx.stroke();
      }
    });

    canvasTex(scene, `platform-${zone.id}`, 128, 28, (ctx) => {
      ctx.fillStyle = zone.id === 'frozen' ? '#e8f6ff' : '#c98a4f';
      ctx.strokeStyle = OUT;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(1, 3, 126, 22, 8);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = zone.palette.groundTop;
      ctx.beginPath();
      ctx.roundRect(3, 4, 122, 8, 6);
      ctx.fill();
      ctx.strokeStyle = 'rgba(90,60,40,0.25)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(24, 18);
      ctx.lineTo(104, 18);
      ctx.moveTo(56, 10);
      ctx.lineTo(56, 22);
      ctx.stroke();
    });

    canvasTex(scene, `water-${zone.id}`, 128, 48, (ctx) => {
      const g = ctx.createLinearGradient(0, 0, 0, 48);
      g.addColorStop(0, zone.id === 'frozen' ? '#7fc7ee' : '#4bb8e8');
      g.addColorStop(1, zone.id === 'frozen' ? '#2c6b9a' : '#1f6f9e');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 128, 48);
      ctx.strokeStyle = 'rgba(255,255,255,0.55)';
      ctx.lineWidth = 3;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 10 + i * 12);
        for (let x = 0; x <= 128; x += 16) {
          ctx.quadraticCurveTo(x + 8, 6 + i * 12, x + 16, 10 + i * 12);
        }
        ctx.stroke();
      }
    });
  });

  canvasTex(scene, 'house-0', 160, 156, (ctx) => drawHouse(ctx, 0));
  canvasTex(scene, 'house-1', 160, 156, (ctx) => drawHouse(ctx, 1));
  canvasTex(scene, 'house-2', 160, 156, (ctx) => drawHouse(ctx, 2));
  canvasTex(scene, 'tree-0', 160, 210, (ctx) => drawTree(ctx, 0));
  canvasTex(scene, 'tree-1', 160, 210, (ctx) => drawTree(ctx, 1));
  canvasTex(scene, 'tree-2', 160, 210, (ctx) => drawTree(ctx, 2));
  canvasTex(scene, 'windmill-tower', 150, 250, (ctx) => drawWindmill(ctx));
  canvasTex(scene, 'windmill-blades', 210, 210, (ctx) => drawBlades(ctx));
  canvasTex(scene, 'lamp-off', 60, 170, (ctx) => drawLamp(ctx, false));
  canvasTex(scene, 'lamp-on', 60, 170, (ctx) => drawLamp(ctx, true));
  canvasTex(scene, 'gear', 48, 48, (ctx) => drawGear(ctx));
  canvasTex(scene, 'crate', 52, 52, (ctx) => drawCrate(ctx));
  canvasTex(scene, 'toy', 36, 44, (ctx) => drawToy(ctx));
  canvasTex(scene, 'flower-empty', 60, 44, (ctx) => drawFlowerBed(ctx, false));
  canvasTex(scene, 'flower-bloom', 60, 44, (ctx) => drawFlowerBed(ctx, true));
  canvasTex(scene, 'hearth', 110, 90, (ctx) => drawHearth(ctx));
  canvasTex(scene, 'castle', 460, 340, (ctx) => drawCastle(ctx));
  canvasTex(scene, 'generator', 130, 130, (ctx) => drawGenerator(ctx));
  canvasTex(scene, 'part', 44, 44, (ctx) => drawPart(ctx));
  canvasTex(scene, 'villager', 48, 64, (ctx) => drawVillager(ctx, '#7fb0ff'));
  canvasTex(scene, 'villager-warm', 48, 64, (ctx) => drawVillager(ctx, '#ffb3a7'));
  canvasTex(scene, 'anchor', 48, 48, (ctx) => {
    ctx.strokeStyle = '#ffd166';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(24, 24, 15, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = '#a97a2f';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(24, 24, 15, 0, Math.PI * 2);
    ctx.stroke();
    ell(ctx, 24, 24, 4, 4, '#ffd166', OUT, 2);
  });
  canvasTex(scene, 'sign', 74, 96, (ctx) => {
    ctx.fillStyle = '#8a5a34';
    ctx.strokeStyle = OUT;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(31, 30, 12, 66, 4);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#d9a05a';
    ctx.beginPath();
    ctx.roundRect(4, 6, 66, 40, 8);
    ctx.fill();
    ctx.stroke();
  });
  canvasTex(scene, 'mushroom', 80, 80, (ctx) => {
    ctx.fillStyle = '#f5e6c8';
    ctx.strokeStyle = OUT;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(32, 42, 16, 32, 6);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#b48cff';
    ctx.beginPath();
    ctx.arc(40, 42, 32, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#ffe9a8';
    [
      [26, 26],
      [46, 20],
      [56, 32],
    ].forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
  });
  canvasTex(scene, 'bush', 100, 60, (ctx) => {
    ell(ctx, 26, 44, 24, 16, '#3fae74');
    ell(ctx, 52, 38, 28, 20, '#4fc07f');
    ell(ctx, 76, 46, 20, 13, '#2f9a62');
  });
  canvasTex(scene, 'rock', 100, 70, (ctx) => {
    ctx.fillStyle = '#9aa7bd';
    ctx.strokeStyle = OUT;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(8, 66);
    ctx.lineTo(18, 26);
    ctx.lineTo(44, 10);
    ctx.lineTo(76, 20);
    ctx.lineTo(92, 66);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.beginPath();
    ctx.moveTo(30, 52);
    ctx.lineTo(52, 28);
    ctx.stroke();
  });
  canvasTex(scene, 'haystack', 100, 80, (ctx) => {
    ctx.fillStyle = '#ffd166';
    ctx.strokeStyle = '#c98a2b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(4, 76);
    ctx.quadraticCurveTo(50, -8, 96, 76);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = 'rgba(201,138,43,0.8)';
    for (let i = 1; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(6 + i * 4, 76 - i * 6);
      ctx.lineTo(94 - i * 4, 58 - i * 4);
      ctx.stroke();
    }
  });
  canvasTex(scene, 'ice-platform', 128, 28, (ctx) => drawIcePlatform(ctx));

  canvasTex(scene, 'cloud', 220, 90, (ctx) => {
    const puff = (x: number, y: number, r: number) => {
      const g = ctx.createRadialGradient(x, y, 1, x, y, r);
      g.addColorStop(0, 'rgba(255,255,255,0.95)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    };
    puff(60, 55, 42);
    puff(105, 42, 50);
    puff(155, 58, 38);
    puff(110, 64, 34);
  });

  canvasTex(scene, 'mist', 380, 720, (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, w, 0);
    g.addColorStop(0, 'rgba(255,255,255,0)');
    g.addColorStop(0.38, 'rgba(255,255,255,0.55)');
    g.addColorStop(0.5, 'rgba(255,255,255,0.9)');
    g.addColorStop(0.62, 'rgba(255,255,255,0.55)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 16; i++) {
      const x = 40 + ((i * 71) % (w - 80));
      const y = 30 + ((i * 137) % (h - 60));
      const r = 50 + (i % 4) * 26;
      const rg = ctx.createRadialGradient(x, y, 0, x, y, r);
      rg.addColorStop(0, 'rgba(255,255,255,0.55)');
      rg.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = rg;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    }
  });

  canvasTex(scene, 'marker', 44, 56, (ctx) => {
    // floating objective pin
    ctx.fillStyle = '#ffd166';
    ctx.strokeStyle = OUT;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(22, 20, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(12, 32);
    ctx.lineTo(22, 50);
    ctx.lineTo(32, 32);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // star
    ctx.fillStyle = '#fffdf2';
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const r = i % 2 === 0 ? 9 : 4;
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      const x = 22 + Math.cos(a) * r;
      const y = 20 + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  });

  canvasTex(scene, 'copter', 64, 40, (ctx) => {
    // bamboo copter gadget
    ctx.fillStyle = '#8a5a34';
    ctx.strokeStyle = OUT;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(29, 12, 6, 24, 3);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#ffd166';
    ctx.beginPath();
    ctx.arc(32, 12, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#9be3ff';
    ctx.beginPath();
    ctx.ellipse(32, 8, 28, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = 'rgba(35,48,90,0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(32, 3);
    ctx.lineTo(32, 13);
    ctx.stroke();
  });

  // particles + fx
  canvasTex(scene, 'spark', 12, 12, (ctx) => {
    const g = ctx.createRadialGradient(6, 6, 0, 6, 6, 6);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 12, 12);
  });
  canvasTex(scene, 'snow', 7, 7, (ctx) => {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(3.5, 3.5, 3, 0, Math.PI * 2);
    ctx.fill();
  });
  canvasTex(scene, 'soft-shadow', 72, 24, (ctx) => {
    const g = ctx.createRadialGradient(36, 12, 2, 36, 12, 36);
    g.addColorStop(0, 'rgba(20,30,60,0.35)');
    g.addColorStop(1, 'rgba(20,30,60,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(36, 12, 36, 12, 0, 0, Math.PI * 2);
    ctx.fill();
  });
  canvasTex(scene, 'glow', 120, 120, (ctx) => {
    const g = ctx.createRadialGradient(60, 60, 2, 60, 60, 60);
    g.addColorStop(0, 'rgba(255,236,160,0.85)');
    g.addColorStop(0.5, 'rgba(255,220,120,0.25)');
    g.addColorStop(1, 'rgba(255,220,120,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 120, 120);
  });
}
