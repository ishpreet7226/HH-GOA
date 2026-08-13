// Canvas generator — HH GOA magazine-poster card
// Matches the second reference design exactly

export type StyleId = 'goa-classic';
export type FormatId = 'builder-id';

export interface GenerateOptions {
  photo: string | null;
  name: string;
  role: string;
  team?: string;
  builderTitle: string;
  builderTitleSub: string;
  frameId: string;
  style?: StyleId;
  format?: FormatId;
}

// Palette
const C = {
  dark:   '#0e1810',
  cream:  '#f5f0df',
  yellow: '#f5e842',
  pink:   '#f52d7e',
  white:  '#faf5e8',
  black:  '#0a0e0a',
  green:  '#1a5c2a',
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (!src.startsWith('data:')) img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// Draw halftone dot grid
function drawHalftone(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.save();
  ctx.fillStyle = '#faf5e8';
  ctx.globalAlpha = 0.055;
  const spacing = 16;
  for (let cx = x + spacing / 2; cx < x + w; cx += spacing) {
    for (let cy = y + spacing / 2; cy < y + h; cy += spacing) {
      ctx.beginPath();
      ctx.arc(cx, cy, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}

// Draw palm tree
function drawPalm(ctx: CanvasRenderingContext2D, baseX: number, baseY: number, height: number, flip: boolean) {
  ctx.save();
  if (flip) { ctx.translate(baseX * 2, 0); ctx.scale(-1, 1); }
  ctx.strokeStyle = '#1a3a20';
  ctx.globalAlpha = 0.55;
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  // trunk
  ctx.beginPath();
  ctx.moveTo(baseX, baseY);
  ctx.bezierCurveTo(baseX + 12, baseY - height * 0.4, baseX - 10, baseY - height * 0.65, baseX + 16, baseY - height);
  ctx.stroke();
  // leaves
  const lx = baseX + 16, ly = baseY - height;
  const leaves: [number, number, number, number, number, number][] = [
    [lx, ly, lx + 60, ly - 18, lx + 90, ly - 38],
    [lx, ly, lx - 44, ly - 22, lx - 80, ly - 50],
    [lx, ly, lx + 26, ly - 55, lx + 22, ly - 90],
    [lx, ly, lx - 14, ly - 60, lx - 36, ly - 96],
    [lx, ly, lx + 80, ly - 65, lx + 116, ly - 58],
  ];
  ctx.lineWidth = 4;
  for (const [x0, y0, x1, y1, x2, y2] of leaves) {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.quadraticCurveTo(x1, y1, x2, y2);
    ctx.stroke();
  }
  ctx.restore();
}

// Draw sunset scene (lower right section)
function drawSunsetScene(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.save();
  // sky
  ctx.fillStyle = '#0e1810';
  ctx.fillRect(x, y, w, h);
  // sun
  ctx.fillStyle = C.yellow;
  ctx.globalAlpha = 0.9;
  ctx.beginPath();
  ctx.arc(x + w * 0.5, y + h * 0.7, Math.min(w, h) * 0.18, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
  // water
  ctx.fillStyle = '#0e2818';
  ctx.fillRect(x, y + h * 0.75, w, h * 0.25);
  // wave lines
  ctx.strokeStyle = '#1a4a28';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 3; i++) {
    const wy = y + h * 0.78 + i * 8;
    ctx.beginPath();
    for (let wx = x; wx < x + w; wx += 30) {
      ctx.quadraticCurveTo(wx + 7, wy - 4, wx + 15, wy);
      ctx.quadraticCurveTo(wx + 22, wy + 4, wx + 30, wy);
    }
    ctx.stroke();
  }
  // palm silhouettes
  ctx.strokeStyle = '#08100a';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.globalAlpha = 0.9;
  function miniPalm(px: number, py: number, ph: number) {
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + 8, py - ph); ctx.stroke();
    [[px + 8, py - ph, px + 28, py - ph - 12, px + 44, py - ph - 26],
     [px + 8, py - ph, px - 16, py - ph - 14, px - 30, py - ph - 30],
     [px + 8, py - ph, px + 10, py - ph - 26, px + 6, py - ph - 48]].forEach(([x0,y0,x1,y1,x2,y2]) => {
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo(x1, y1, x2, y2); ctx.stroke();
    });
  }
  miniPalm(x + 28, y + h, h * 0.65);
  miniPalm(x + w - 28, y + h, h * 0.55);
  // birds
  ctx.strokeStyle = '#aaa';
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.4;
  [[x + w * 0.3, y + h * 0.22],[x + w * 0.4, y + h * 0.16],[x + w * 0.65, y + h * 0.25]].forEach(([bx, by]) => {
    ctx.beginPath(); ctx.moveTo(bx, by); ctx.quadraticCurveTo(bx + 6, by - 5, bx + 12, by); ctx.stroke();
  });
  ctx.globalAlpha = 1;
  ctx.restore();
}

// Build/Ship/Repeat signs
function drawBSRSigns(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const labels = ['BUILD', 'SHIP', 'REPEAT'];
  const colors = [C.yellow, C.pink, C.green];
  const textColors = [C.dark, C.white, C.yellow];
  labels.forEach((lbl, i) => {
    const sy = y + i * 34;
    const sw = 90;
    const sh = 26;
    ctx.fillStyle = colors[i];
    ctx.beginPath();
    ctx.moveTo(x, sy);
    ctx.lineTo(x + sw - 10, sy);
    ctx.lineTo(x + sw, sy + sh / 2);
    ctx.lineTo(x + sw - 10, sy + sh);
    ctx.lineTo(x, sy + sh);
    ctx.closePath();
    ctx.fill();
    ctx.font = `800 14px "Barlow Condensed", sans-serif`;
    ctx.fillStyle = textColors[i];
    ctx.textAlign = 'center';
    ctx.fillText(lbl, x + sw / 2 - 5, sy + 18);
  });
}

// Barcode
function drawBarcode(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  const bars = [2,3,1,4,2,1,3,2,4,1,2,3,1,2,4,1,3,2,2,1,4,3,1,2,3];
  const totalW = bars.reduce((s, b) => s + b, 0) * 2;
  const scale = w / totalW;
  let bx = x;
  ctx.fillStyle = C.white;
  ctx.globalAlpha = 0.75;
  for (const bar of bars) {
    const bw = bar * 2 * scale;
    ctx.fillRect(bx, y, bw * 0.55, h);
    bx += bw;
  }
  ctx.globalAlpha = 1;
}

async function drawCard(canvas: HTMLCanvasElement, opts: GenerateOptions): Promise<void> {
  const W = 900, H = 1170;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // ── SECTION HEIGHTS ──
  const topH = Math.round(H * 0.57);   // dark photo/title section
  const midH = Math.round(H * 0.32);   // cream name section
  const botH = H - topH - midH;         // dark bottom strip

  // ═══════════════════════════════════════
  // TOP DARK SECTION
  // ═══════════════════════════════════════
  ctx.fillStyle = C.dark;
  ctx.fillRect(0, 0, W, topH);
  drawHalftone(ctx, 0, 0, W, topH);

  // Grid lines (subtle)
  ctx.strokeStyle = 'rgba(250,245,232,0.1)';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath(); ctx.moveTo(0, topH * 0.16); ctx.lineTo(W, topH * 0.16); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W * 0.56, 0); ctx.lineTo(W * 0.56, topH * 0.65); ctx.stroke();
  ctx.setLineDash([]);

  // Top bar: BUILD · SHIP · REPEAT
  ctx.font = '700 18px "Barlow Condensed", sans-serif';
  ctx.fillStyle = 'rgba(250,245,232,0.38)';
  ctx.textAlign = 'left';
  ctx.letterSpacing = '0.18em';
  ctx.fillText('BUILD  ·  SHIP  ·  REPEAT', 28, 38);
  ctx.font = '400 16px "Space Mono", monospace';
  ctx.fillStyle = 'rgba(250,245,232,0.16)';
  ctx.textAlign = 'right';
  ctx.fillText('8001', W - 28, 38);

  // ── PHOTO — right side, diagonal clip ──
  const photoAreaX = Math.round(W * 0.36);
  const photoAreaW = W - photoAreaX;

  if (opts.photo) {
    try {
      const img = await loadImage(opts.photo);
      ctx.save();
      // diagonal clip: left edge is angled
      ctx.beginPath();
      ctx.moveTo(photoAreaX + Math.round(photoAreaW * 0.22), 0);
      ctx.lineTo(W, 0);
      ctx.lineTo(W, topH);
      ctx.lineTo(photoAreaX, topH);
      ctx.closePath();
      ctx.clip();

      // Draw photo filling the clipped area
      const imgAspect = img.width / img.height;
      const frameAspect = photoAreaW / topH;
      let sx = 0, sy = 0, sw = img.width, sh = img.height;
      if (imgAspect > frameAspect) { sw = img.height * frameAspect; sx = (img.width - sw) / 2; }
      else { sh = img.width / frameAspect; sy = (img.height - sh) / 5; }
      ctx.drawImage(img, sx, sy, sw, sh, photoAreaX, 0, photoAreaW, topH);

      // grayscale-ish overlay
      ctx.fillStyle = 'rgba(14,24,16,0.22)';
      ctx.fillRect(photoAreaX, 0, photoAreaW, topH);
      // fade-in edge from left
      const grad = ctx.createLinearGradient(photoAreaX, 0, photoAreaX + photoAreaW * 0.38, 0);
      grad.addColorStop(0, 'rgba(14,24,16,0.95)');
      grad.addColorStop(1, 'rgba(14,24,16,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(photoAreaX, 0, photoAreaW, topH);
      ctx.restore();
    } catch {
      // no photo
    }
  }

  // ── HH GOA badge — top right corner ──
  const badgeW = 130, badgeH = 100;
  ctx.fillStyle = C.pink;
  ctx.fillRect(W - badgeW, 0, badgeW, badgeH);
  ctx.strokeStyle = C.dark; ctx.lineWidth = 3;
  ctx.strokeRect(W - badgeW, 0, badgeW, badgeH);

  ctx.font = '900 44px "Barlow Condensed", sans-serif';
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.fillText('HH', W - badgeW / 2, 46);
  ctx.fillText('GOA', W - badgeW / 2, 82);
  ctx.font = '700 20px "Barlow Condensed", sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.fillText('2026', W - badgeW / 2, 98);

  // ── Stacked title (left side) ──
  const titleX = 28;
  let ty = 90;

  // decorative asterisk row
  ctx.font = '400 20px "Barlow Condensed"';
  ctx.fillStyle = 'rgba(250,245,232,0.2)';
  ctx.textAlign = 'left';
  ctx.fillText('✦                ✦', titleX, ty); ty += 12;

  // HACKER
  ctx.font = '900 138px "Barlow Condensed", sans-serif';
  ctx.fillStyle = C.white;
  ctx.fillText('HACKER', titleX, ty + 110); ty += 118;

  // HOUSE
  ctx.fillText('HOUSE', titleX, ty + 110); ty += 118;

  // GOA
  ctx.fillStyle = C.pink;
  ctx.fillText('GOA', titleX, ty + 110); ty += 106;

  // 2026
  ctx.font = '700 52px "Barlow Condensed", sans-serif';
  ctx.fillStyle = C.yellow;
  ctx.fillText('2026', titleX, ty + 44); ty += 52;

  // location/date/hashtag
  ctx.font = '600 22px "Barlow Condensed", sans-serif';
  ctx.fillStyle = 'rgba(250,245,232,0.55)';
  ctx.fillText('GOA, INDIA', titleX, ty + 26); ty += 28;
  ctx.fillText('28—31 OCT 2026', titleX, ty + 26); ty += 28;
  ctx.fillText('#FRAMEINGOA', titleX, ty + 26); ty += 40;

  // small decorative marks
  ctx.font = '400 18px "Space Mono"';
  ctx.fillStyle = 'rgba(250,245,232,0.16)';
  ctx.fillText('▤  ✕  +  ─ ─', titleX, ty);

  // ── "BUILDING THE FUTURE" stamp ──
  const stampCX = Math.round(W * 0.78), stampCY = Math.round(topH * 0.52), stampR = 64;
  ctx.save();
  ctx.strokeStyle = C.pink;
  ctx.lineWidth = 2.5;
  ctx.setLineDash([5, 3]);
  ctx.beginPath(); ctx.arc(stampCX, stampCY, stampR, 0, Math.PI * 2); ctx.stroke();
  ctx.setLineDash([]);
  ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.arc(stampCX, stampCY, stampR - 10, 0, Math.PI * 2); ctx.stroke();
  // palm icon inside stamp
  ctx.strokeStyle = C.pink;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(stampCX, stampCY + 24);
  ctx.quadraticCurveTo(stampCX + 4, stampCY, stampCX + 8, stampCY - 26);
  ctx.stroke();
  [[stampCX + 8, stampCY - 26, stampCX + 24, stampCY - 32, stampCX + 36, stampCY - 42],
   [stampCX + 8, stampCY - 26, stampCX - 12, stampCY - 30, stampCX - 24, stampCY - 40],
   [stampCX + 8, stampCY - 26, stampCX + 10, stampCY - 42, stampCX + 6, stampCY - 56]].forEach(([x0,y0,x1,y1,x2,y2]) => {
    ctx.beginPath(); ctx.moveTo(x0,y0); ctx.quadraticCurveTo(x1,y1,x2,y2); ctx.stroke();
  });
  // curved text
  ctx.fillStyle = C.pink;
  ctx.font = '700 11px "Barlow Condensed", sans-serif';
  const arcText = 'BUILDING THE FUTURE';
  const arcR = stampR - 4;
  const totalAngle = Math.PI * 1.2;
  const startAngle = Math.PI + Math.PI / 2 - totalAngle / 2;
  arcText.split('').forEach((ch, i) => {
    const angle = startAngle + (i / (arcText.length - 1)) * totalAngle;
    ctx.save();
    ctx.translate(stampCX + arcR * Math.cos(angle), stampCY + arcR * Math.sin(angle));
    ctx.rotate(angle + Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText(ch, 0, 0);
    ctx.restore();
  });
  ctx.restore();

  // Plus/asterisk decorations
  ctx.font = '300 28px sans-serif';
  ctx.fillStyle = 'rgba(250,245,232,0.2)';
  ctx.textAlign = 'left';
  ctx.fillText('+', Math.round(W * 0.54), Math.round(topH * 0.3));
  ctx.fillText('✦', Math.round(W * 0.48), Math.round(topH * 0.72));

  // ═══════════════════════════════════════
  // CREAM MIDDLE SECTION
  // ═══════════════════════════════════════
  ctx.fillStyle = C.cream;
  ctx.fillRect(0, topH, W, midH);

  // Section divider line
  ctx.strokeStyle = 'rgba(14,24,16,0.15)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, topH); ctx.lineTo(W, topH); ctx.stroke();

  // Left column width
  const leftW = Math.round(W * 0.58);
  const leftPad = 28;

  // Name
  const nameParts = (opts.name || 'YOUR NAME').toUpperCase().trim().split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ');

  const nameFS = opts.name.length > 12 ? 88 : 108;
  ctx.font = `900 ${nameFS}px "Barlow Condensed", sans-serif`;
  ctx.fillStyle = C.dark;
  ctx.textAlign = 'left';

  let ny = topH + nameFS + 8;
  ctx.fillText(firstName, leftPad, ny);
  if (lastName) { ny += nameFS * 0.92; ctx.fillText(lastName, leftPad, ny); }

  // Role — yellow bar
  const roleText = (opts.role || 'BUILDER').toUpperCase();
  ctx.font = '700 26px "Barlow Condensed", sans-serif';
  const roleW = ctx.measureText(roleText).width + 28;
  ny += 22;
  ctx.fillStyle = C.yellow;
  ctx.fillRect(leftPad, ny, roleW, 36);
  ctx.fillStyle = C.dark;
  ctx.fillText(roleText, leftPad + 14, ny + 26);
  ny += 50;

  // Builder title — pink outlined box
  const titleText = opts.builderTitle || 'THE GOA BUILDER';
  ctx.font = `italic 900 36px "Playfair Display", serif`;
  const titleW = ctx.measureText(titleText).width + 32;
  ctx.strokeStyle = C.pink;
  ctx.lineWidth = 2.5;
  ctx.strokeRect(leftPad, ny, Math.min(titleW, leftW - leftPad - 10), 50);
  ctx.fillStyle = C.pink;
  ctx.fillText(titleText, leftPad + 14, ny + 36);
  ny += 66;

  // Stack tags
  if (opts.builderTitleSub) {
    ctx.font = '700 20px "Barlow Condensed", sans-serif';
    ctx.fillStyle = 'rgba(14,24,16,0.6)';
    ctx.fillText(`</> ${opts.builderTitleSub.toUpperCase()}`, leftPad, ny);
  }

  // Right column — Goa scene
  const rightX = leftW;
  const rightW = W - leftW;
  drawSunsetScene(ctx, rightX, topH, rightW, midH);

  // Palms on scene
  ctx.save();
  ctx.globalAlpha = 0.75;
  drawPalm(ctx, rightX + 30, topH + midH, 120, false);
  drawPalm(ctx, rightX + rightW - 30, topH + midH, 100, true);
  ctx.restore();

  // BUILD/SHIP/REPEAT signs
  drawBSRSigns(ctx, rightX + rightW - 110, topH + midH - 110);

  // Vertical "LESS NOISE, MORE SIGNAL" label
  ctx.save();
  ctx.fillStyle = C.yellow;
  ctx.fillRect(W - 22, topH, 22, midH);
  ctx.translate(W - 11, topH + midH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.font = '800 11px "Barlow Condensed", sans-serif';
  ctx.fillStyle = C.dark;
  ctx.textAlign = 'center';
  ctx.fillText('LESS NOISE, MORE SIGNAL', 0, 4);
  ctx.restore();

  // Left/right divider line
  ctx.strokeStyle = 'rgba(14,24,16,0.18)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(leftW, topH); ctx.lineTo(leftW, topH + midH); ctx.stroke();

  // ═══════════════════════════════════════
  // BOTTOM DARK STRIP
  // ═══════════════════════════════════════
  const botY = topH + midH;
  ctx.fillStyle = C.dark;
  ctx.fillRect(0, botY, W, botH);
  ctx.strokeStyle = C.black;
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(0, botY); ctx.lineTo(W, botY); ctx.stroke();

  const centerY = botY + botH / 2 + 6;
  const col1 = 24, col2 = 240, col3 = 480, col4 = 680;

  // Leaf icon placeholder
  ctx.font = '26px sans-serif';
  ctx.fillText('🌿', col1 - 4, centerY + 8);

  // Builder Class
  ctx.font = '700 16px "Barlow Condensed", sans-serif';
  ctx.fillStyle = 'rgba(250,245,232,0.4)';
  ctx.textAlign = 'left';
  ctx.fillText('BUILDER CLASS', col2, centerY - 16);
  ctx.font = '700 18px "Barlow Condensed", sans-serif';
  ctx.fillStyle = C.white;
  ctx.fillText('+ EXPERIMENTAL BUILDER', col2, centerY + 10);

  // Divider
  ctx.strokeStyle = 'rgba(250,245,232,0.15)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(col3 - 14, botY + 12); ctx.lineTo(col3 - 14, botY + botH - 12); ctx.stroke();

  // Currently Shipping
  ctx.font = '700 16px "Barlow Condensed", sans-serif';
  ctx.fillStyle = 'rgba(250,245,232,0.4)';
  ctx.fillText('CURRENTLY SHIPPING', col3, centerY - 16);
  ctx.font = '700 18px "Barlow Condensed", sans-serif';
  ctx.fillStyle = C.white;
  ctx.fillText(`+ ${(opts.team || 'BUILDING THE FUTURE').toUpperCase()}`, col3, centerY + 10);

  // Divider
  ctx.beginPath(); ctx.moveTo(col4 - 14, botY + 12); ctx.lineTo(col4 - 14, botY + botH - 12); ctx.stroke();

  // Builder ID
  ctx.font = '700 16px "Barlow Condensed", sans-serif';
  ctx.fillStyle = 'rgba(250,245,232,0.4)';
  ctx.fillText('BUILDER ID', col4, centerY - 16);
  ctx.font = '700 18px "Space Mono", monospace';
  ctx.fillStyle = C.white;
  ctx.fillText(opts.frameId, col4, centerY + 10);

  // Barcode
  drawBarcode(ctx, col4, centerY + 16, 180, 28);
}

export async function generateCard(opts: GenerateOptions): Promise<string> {
  const canvas = document.createElement('canvas');
  await drawCard(canvas, opts);
  return canvas.toDataURL('image/png', 1.0);
}
