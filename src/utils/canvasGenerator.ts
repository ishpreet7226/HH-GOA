// Canvas-based image generation for HH Goa Builder ID cards and PFP Frames
// Renders to an off-screen canvas and returns a dataURL

export type StyleId = 'goa-classic' | 'night-shift' | 'sunset-builder';
export type FormatId = 'builder-id' | 'pfp-frame';

export interface GenerateOptions {
  photo: string | null;   // data URL
  name: string;
  role: string;
  team?: string;
  builderTitle: string;
  builderTitleSub: string;
  frameId: string;
  style: StyleId;
  format: FormatId;
}

interface StyleTokens {
  bg: string;
  fg: string;
  accent1: string;
  accent2: string;
  border: string;
  bgPattern: string;
  label: string;
  nameColor: string;
  titleColor: string;
  subColor: string;
  infoColor: string;
  stripeBg: string;
  stripeText: string;
  bgTemplateUrl: string;
}

const STYLES: Record<StyleId, StyleTokens> = {
  'goa-classic': {
    bg: '#faf5e8',
    fg: '#1a5c2a',
    accent1: '#f5e842',
    accent2: '#f52d7e',
    border: '#1a5c2a',
    bgPattern: '#f0e8d0',
    label: '#1a5c2a',
    nameColor: '#1a5c2a',
    titleColor: '#f52d7e',
    subColor: '#1a5c2a',
    infoColor: '#2a7a40',
    stripeBg: '#1a5c2a',
    stripeText: '#f5e842',
    bgTemplateUrl: '/templates/goa-classic.png',
  },
  'night-shift': {
    bg: '#0f2a16',
    fg: '#faf5e8',
    accent1: '#f5e842',
    accent2: '#f52d7e',
    border: '#f5e842',
    bgPattern: '#1a3d22',
    label: '#f5e842',
    nameColor: '#faf5e8',
    titleColor: '#f5e842',
    subColor: '#f52d7e',
    infoColor: '#c8f0d2',
    stripeBg: '#f5e842',
    stripeText: '#0f2a16',
    bgTemplateUrl: '/templates/night-shift.png',
  },
  'sunset-builder': {
    bg: '#faf5e8',
    fg: '#1a5c2a',
    accent1: '#f52d7e',
    accent2: '#f5e842',
    border: '#f52d7e',
    bgPattern: '#fce8d0',
    label: '#f52d7e',
    nameColor: '#1a5c2a',
    titleColor: '#f52d7e',
    subColor: '#1a5c2a',
    infoColor: '#2a7a40',
    stripeBg: '#f52d7e',
    stripeText: '#faf5e8',
    bgTemplateUrl: '/templates/sunset-builder.png',
  },
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (src.startsWith('http')) {
      img.crossOrigin = 'anonymous';
    }
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

function drawHalftone(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string, size = 12) {
  ctx.save();
  ctx.fillStyle = color;
  for (let cx = x; cx < x + w; cx += size) {
    for (let cy = y; cy < y + h; cy += size) {
      const r = size * 0.22;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

function drawSun(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, color: string, rayColor: string) {
  ctx.save();
  // Rays
  const numRays = 12;
  ctx.strokeStyle = rayColor;
  ctx.lineWidth = 2;
  for (let i = 0; i < numRays; i++) {
    const angle = (i / numRays) * Math.PI * 2;
    const x1 = cx + Math.cos(angle) * (r + 6);
    const y1 = cy + Math.sin(angle) * (r + 6);
    const x2 = cx + Math.cos(angle) * (r + 16);
    const y2 = cy + Math.sin(angle) * (r + 16);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
  // Circle
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawPalmTree(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, color: string, flip = false) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2.5;
  if (flip) ctx.scale(-1, 1);
  const fx = flip ? -x : x;

  // Trunk
  ctx.beginPath();
  ctx.moveTo(fx, y);
  ctx.bezierCurveTo(fx + 8, y - h * 0.4, fx - 5, y - h * 0.7, fx + 10, y - h);
  ctx.stroke();

  // Leaves
  const lx = fx + 10;
  const ly = y - h;
  const leaves = [
    [lx, ly, lx + 30, ly - 8, lx + 45, ly - 20],
    [lx, ly, lx - 20, ly - 12, lx - 38, ly - 28],
    [lx, ly, lx + 15, ly - 25, lx + 10, ly - 45],
    [lx, ly, lx - 5, ly - 30, lx - 18, ly - 48],
    [lx, ly, lx + 30, ly - 35, lx + 50, ly - 30],
  ];
  ctx.lineWidth = 3;
  for (const [x0, y0, x1, y1, x2, y2] of leaves) {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.quadraticCurveTo(x1, y1, x2, y2);
    ctx.stroke();
  }
  ctx.restore();
}

function drawWave(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, color: string) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x, y);
  for (let i = 0; i < w; i += 20) {
    ctx.quadraticCurveTo(x + i + 5, y - 5, x + i + 10, y);
    ctx.quadraticCurveTo(x + i + 15, y + 5, x + i + 20, y);
  }
  ctx.stroke();
  ctx.restore();
}


async function generateBuilderIdCard(
  canvas: HTMLCanvasElement,
  opts: GenerateOptions,
  s: StyleTokens
): Promise<void> {
  const W = 900;
  const H = 1200;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // 1. Draw Template Background
  try {
    const bgImg = await loadImage(s.bgTemplateUrl);
    ctx.drawImage(bgImg, 0, 0, W, H);
  } catch (err) {
    console.error("Failed to load background template", err);
    ctx.fillStyle = s.bg;
    ctx.fillRect(0, 0, W, H);
  }

  // --- TOP HEADER ---
  ctx.font = '700 13px "Barlow Condensed", sans-serif';
  ctx.letterSpacing = '0.18em';
  ctx.fillStyle = s.fg;
  ctx.textAlign = 'left';
  ctx.fillText('HACKER HOUSE GOA', 40, 44);
  ctx.textAlign = 'right';
  ctx.fillText('OCT 28–31 · 2026', W - 40, 44);

  // "BUILDER ID" large label
  ctx.textAlign = 'center';
  ctx.font = 'italic 900 74px "Playfair Display", serif';
  ctx.fillStyle = s.fg;
  ctx.fillText('BUILDER ID', W / 2, 130);

  // 2. Photo Area (Centered)
  const photoW = 380;
  const photoH = 380;
  const photoX = W / 2 - photoW / 2;
  const photoY = 220; // Adjusted for template empty center

  // Photo border/glow for depth
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.3)';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 10;
  ctx.fillStyle = '#fff';
  // A nice rounded rect for the photo
  ctx.beginPath();
  ctx.roundRect(photoX, photoY, photoW, photoH, 20);
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = s.accent1;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.roundRect(photoX, photoY, photoW, photoH, 20);
  ctx.stroke();
  
  if (opts.photo) {
    try {
      const img = await loadImage(opts.photo);
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(photoX, photoY, photoW, photoH, 20);
      ctx.clip();
      // Center-crop
      const imgAspect = img.width / img.height;
      const frameAspect = photoW / photoH;
      let sx = 0, sy = 0, sw = img.width, sh = img.height;
      if (imgAspect > frameAspect) {
        sw = img.height * frameAspect;
        sx = (img.width - sw) / 2;
      } else {
        sh = img.width / frameAspect;
        sy = (img.height - sh) / 2;
      }
      ctx.drawImage(img, sx, sy, sw, sh, photoX, photoY, photoW, photoH);
      ctx.restore();
    } catch {
      // Placeholder silhouette
      ctx.fillStyle = s.bgPattern;
      ctx.beginPath();
      ctx.roundRect(photoX, photoY, photoW, photoH, 20);
      ctx.fill();
      ctx.font = '100px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = s.fg;
      ctx.fillText('👤', W / 2, photoY + photoH / 2 + 35);
    }
  }

  // 3. INFO SECTION (below photo)
  const infoY = photoY + photoH + 50;
  
  // Semi-transparent panel behind text for readability over complex backgrounds
  ctx.save();
  ctx.fillStyle = s.bg === '#0f2a16' ? 'rgba(15,42,22,0.85)' : 'rgba(250,245,232,0.85)';
  ctx.shadowColor = 'rgba(0,0,0,0.1)';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.roundRect(W/2 - 320, infoY - 20, 640, 320, 20);
  ctx.fill();
  ctx.restore();

  // Name
  ctx.font = '900 54px "Playfair Display", serif';
  ctx.fillStyle = s.nameColor;
  ctx.textAlign = 'center';
  const nameFontSize = opts.name.length > 14 ? 40 : opts.name.length > 10 ? 48 : 54;
  ctx.font = `900 ${nameFontSize}px "Playfair Display", serif`;
  ctx.fillText(opts.name.toUpperCase() || 'YOUR NAME', W / 2, infoY + 40);

  // Divider
  ctx.strokeStyle = s.accent2;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(W/2 - 150, infoY + 60);
  ctx.lineTo(W/2 + 150, infoY + 60);
  ctx.stroke();

  // Role
  ctx.font = '700 14px "Barlow Condensed", sans-serif';
  ctx.letterSpacing = '0.2em';
  ctx.fillStyle = s.label;
  ctx.fillText('ROLE', W / 2, infoY + 90);

  ctx.font = '400 20px "Space Mono", monospace';
  ctx.fillStyle = s.fg;
  ctx.fillText(opts.role || 'Builder', W / 2, infoY + 118);

  // Team
  let titleStartY = infoY + 160;
  if (opts.team) {
    ctx.font = '700 14px "Barlow Condensed", sans-serif';
    ctx.fillStyle = s.label;
    ctx.fillText('TEAM', W / 2, infoY + 150);
    ctx.font = '400 20px "Space Mono", monospace';
    ctx.fillStyle = s.fg;
    ctx.fillText(opts.team, W / 2, infoY + 178);
    titleStartY = infoY + 220;
  }

  // Builder Class/Title badge
  const badgeW = 340;
  ctx.fillStyle = s.accent1;
  ctx.beginPath();
  ctx.roundRect(W / 2 - badgeW / 2, titleStartY, badgeW, 60, 10);
  ctx.fill();

  ctx.font = '900 italic 28px "Playfair Display", serif';
  ctx.fillStyle = s.nameColor === '#faf5e8' ? s.fg : '#0f2a16';
  ctx.fillText(opts.builderTitle, W / 2, titleStartY + 38);
  
  // Frame ID Pill
  ctx.fillStyle = s.accent2;
  ctx.beginPath();
  ctx.roundRect(W/2 - 80, H - 60, 160, 30, 15);
  ctx.fill();
  
  ctx.font = '700 12px "Space Mono", monospace';
  ctx.fillStyle = '#fff';
  ctx.fillText(opts.frameId, W / 2, H - 40);
}

async function generatePFPFrame(
  canvas: HTMLCanvasElement,
  opts: GenerateOptions,
  s: StyleTokens
): Promise<void> {
  const SIZE = 1080;
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d')!;

  // Background
  ctx.fillStyle = s.bg;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Photo in center circle
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const photoR = 340;

  if (opts.photo) {
    try {
      const img = await loadImage(opts.photo);
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, photoR, 0, Math.PI * 2);
      ctx.clip();
      const imgAspect = img.width / img.height;
      let sx = 0, sy = 0, sw = img.width, sh = img.height;
      if (imgAspect > 1) { sw = sh; sx = (img.width - sw) / 2; }
      else { sh = sw; sy = (img.height - sh) / 2; }
      ctx.drawImage(img, sx, sy, sw, sh, cx - photoR, cy - photoR, photoR * 2, photoR * 2);
      ctx.restore();
    } catch { /* empty photo fallback */ }
  } else {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, photoR, 0, Math.PI * 2);
    ctx.fillStyle = s.bgPattern;
    ctx.fill();
    ctx.restore();
  }

  // Outer rings
  ctx.strokeStyle = s.border;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(cx, cy, photoR + 10, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = s.accent1;
  ctx.lineWidth = 3;
  ctx.setLineDash([20, 8]);
  ctx.beginPath();
  ctx.arc(cx, cy, photoR + 26, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Decorative corners
  const frameSize = 160;
  const corners2: [number, number, number, number][] = [
    [0, 0, 1, 1], [SIZE - frameSize, 0, -1, 1],
    [0, SIZE - frameSize, 1, -1], [SIZE - frameSize, SIZE - frameSize, -1, -1]
  ];
  ctx.strokeStyle = s.border;
  ctx.lineWidth = 4;
  for (const [ox, oy, dx, dy] of corners2) {
    ctx.beginPath();
    ctx.moveTo(ox + dx * 20, oy);
    ctx.lineTo(ox, oy);
    ctx.lineTo(ox, oy + dy * 20);
    ctx.stroke();
    ctx.strokeStyle = s.accent1;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ox + dx * 40, oy + dy * 8);
    ctx.lineTo(ox + dx * 8, oy + dy * 8);
    ctx.lineTo(ox + dx * 8, oy + dy * 40);
    ctx.stroke();
    ctx.strokeStyle = s.border;
    ctx.lineWidth = 4;
  }

  // Top label
  ctx.fillStyle = s.stripeBg;
  ctx.fillRect(0, 0, SIZE, 90);
  ctx.font = '900 italic 52px "Playfair Display", serif';
  ctx.fillStyle = s.stripeText;
  ctx.textAlign = 'center';
  ctx.fillText('HACKER HOUSE GOA', SIZE / 2, 64);

  // Bottom label
  ctx.fillStyle = s.stripeBg;
  ctx.fillRect(0, SIZE - 90, SIZE, 90);

  ctx.font = '800 28px "Barlow Condensed", sans-serif';
  ctx.letterSpacing = '0.12em';
  ctx.fillStyle = s.stripeText;
  ctx.textAlign = 'left';
  ctx.fillText(opts.name.toUpperCase() || 'BUILDER', 40, SIZE - 36);

  ctx.textAlign = 'right';
  ctx.fillStyle = s.accent2 === s.stripeText ? '#fff' : s.accent2;
  ctx.fillText('#FRAMEINGOA', SIZE - 40, SIZE - 36);

  // Sun motif
  drawSun(ctx, SIZE - 90, SIZE - 180, 44, s.accent1, s.accent1);
  // Palm motif
  ctx.globalAlpha = 0.2;
  drawPalmTree(ctx, 60, SIZE - 90, 100, s.fg, false);
  drawPalmTree(ctx, SIZE - 60, SIZE - 90, 100, s.fg, true);
  ctx.globalAlpha = 1;

  // Halftone corners
  drawHalftone(ctx, 0, 90, 120, SIZE - 180, s.bgPattern, 14);
  drawHalftone(ctx, SIZE - 120, 90, 120, SIZE - 180, s.bgPattern, 14);

  // Side labels
  ctx.save();
  ctx.translate(28, SIZE / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.font = '700 11px "Barlow Condensed", sans-serif';
  ctx.letterSpacing = '0.18em';
  ctx.fillStyle = s.label;
  ctx.textAlign = 'center';
  ctx.fillText('GOA · INDIA · OCT 2026', 0, 0);
  ctx.restore();

  ctx.save();
  ctx.translate(SIZE - 28, SIZE / 2);
  ctx.rotate(Math.PI / 2);
  ctx.font = '700 11px "Barlow Condensed", sans-serif';
  ctx.letterSpacing = '0.18em';
  ctx.fillStyle = s.label;
  ctx.textAlign = 'center';
  ctx.fillText('2:47 PM STUDIO · HHGOA.COM', 0, 0);
  ctx.restore();

  // Builder title arc on bottom of photo ring
  const builderTitle = opts.builderTitle;
  const R = photoR + 42;
  ctx.save();
  ctx.font = '700 14px "Barlow Condensed", sans-serif';
  ctx.fillStyle = s.accent2;
  ctx.textAlign = 'center';
  const arcText = `★ ${builderTitle} ★`;
  const totalAngle = Math.PI * 0.7;
  const startAngle = Math.PI / 2 + totalAngle / 2;
  const chars = arcText.split('');
  const angleStep = totalAngle / (chars.length - 1);
  chars.forEach((ch, i) => {
    const angle = startAngle - i * angleStep;
    ctx.save();
    ctx.translate(cx + R * Math.cos(angle), cy + R * Math.sin(angle));
    ctx.rotate(angle + Math.PI / 2);
    ctx.fillText(ch, 0, 0);
    ctx.restore();
  });
  ctx.restore();
}

export async function generateCard(opts: GenerateOptions): Promise<string> {
  const canvas = document.createElement('canvas');
  const s = STYLES[opts.style];

  if (opts.format === 'pfp-frame') {
    await generatePFPFrame(canvas, opts, s);
  } else {
    await generateBuilderIdCard(canvas, opts, s);
  }

  return canvas.toDataURL('image/png', 1.0);
}
