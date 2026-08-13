export type StyleId = 'goa-classic';
export type FormatId = 'builder-id' | 'pfp-frame';

export interface GenerateOptions {
  photo: string | null;
  name: string;
  role: string;
  team?: string;
  builderTitle: string;
  builderTitleSub: string;
  frameId: string;
  style: StyleId;
  format: FormatId;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (src.startsWith('http')) img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawPalm(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, col: string, flip = false) {
  ctx.save();
  ctx.strokeStyle = col; ctx.fillStyle = col;
  if (flip) { ctx.translate(x * 2, 0); ctx.scale(-1, 1); }
  ctx.lineWidth = Math.max(2, h * 0.04);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.bezierCurveTo(x + h * 0.1, y - h * 0.4, x - h * 0.06, y - h * 0.7, x + h * 0.12, y - h);
  ctx.stroke();
  const tx = x + h * 0.12, ty = y - h;
  const leafData = [[tx,ty,tx+h*.35,ty-h*.09,tx+h*.52,ty-h*.23],[tx,ty,tx-h*.23,ty-h*.14,tx-h*.44,ty-h*.32],[tx,ty,tx+h*.17,ty-h*.29,tx+h*.12,ty-h*.52],[tx,ty,tx-h*.06,ty-h*.35,tx-h*.21,ty-h*.56],[tx,ty,tx+h*.35,ty-h*.41,tx+h*.58,ty-h*.35]];
  ctx.lineWidth = Math.max(1.5, h * 0.025);
  for (const [x0,y0,x1,y1,x2,y2] of leafData) {
    ctx.beginPath(); ctx.moveTo(x0,y0); ctx.quadraticCurveTo(x1,y1,x2,y2); ctx.stroke();
  }
  ctx.restore();
}

function drawBird(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, col: string) {
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = s * 0.15;
  ctx.beginPath(); ctx.moveTo(x - s, y); ctx.quadraticCurveTo(x - s * 0.5, y - s * 0.5, x, y);
  ctx.quadraticCurveTo(x + s * 0.5, y - s * 0.5, x + s, y); ctx.stroke(); ctx.restore();
}

function drawChurch(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, col: string) {
  ctx.save(); ctx.fillStyle = col; ctx.strokeStyle = col;
  // main body
  ctx.fillRect(x, y, w, h);
  // facade triangular top
  ctx.beginPath(); ctx.moveTo(x - w*0.1, y); ctx.lineTo(x + w*0.5, y - h*0.28); ctx.lineTo(x + w*1.1, y); ctx.fill();
  // left tower
  ctx.fillRect(x - w*0.22, y - h*0.15, w*0.22, h*1.15);
  ctx.fillRect(x - w*0.22, y - h*0.35, w*0.22, h*0.2);
  ctx.beginPath(); ctx.moveTo(x-w*0.22,y-h*0.35); ctx.lineTo(x-w*0.11,y-h*0.55); ctx.lineTo(x,y-h*0.35); ctx.fill();
  // right tower
  ctx.fillRect(x + w*1.0, y - h*0.15, w*0.22, h*1.15);
  ctx.fillRect(x + w*1.0, y - h*0.35, w*0.22, h*0.2);
  ctx.beginPath(); ctx.moveTo(x+w,y-h*0.35); ctx.lineTo(x+w*1.11,y-h*0.55); ctx.lineTo(x+w*1.22,y-h*0.35); ctx.fill();
  // door arch
  ctx.fillStyle = '#0b2e1b';
  ctx.beginPath(); ctx.arc(x+w*0.5, y+h*0.55, w*0.15, Math.PI, 0); ctx.rect(x+w*0.35, y+h*0.55, w*0.3, h*0.45); ctx.fill();
  // windows
  ctx.fillStyle = '#0b2e1b';
  [[x+w*0.2,y+h*0.2],[x+w*0.8,y+h*0.2]].forEach(([wx,wy])=>{
    ctx.beginPath(); ctx.arc(wx,wy,w*0.09,Math.PI,0); ctx.rect(wx-w*0.09,wy,w*0.18,h*0.18); ctx.fill();
  });
  ctx.restore();
}

function drawScooter(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, col: string, surfCol: string) {
  ctx.save();
  const h = w * 0.65;
  // surfboard
  ctx.fillStyle = surfCol; ctx.strokeStyle = '#0b2e1b'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.ellipse(x - w*0.35, y - h*0.5, w*0.08, h*0.55, -0.3, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  // body
  ctx.fillStyle = col;
  ctx.beginPath(); ctx.roundRect(x, y - h*0.7, w*0.65, h*0.55, 8); ctx.fill();
  // seat
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath(); ctx.ellipse(x+w*0.25, y-h*0.7, w*0.22, h*0.1, 0, 0, Math.PI*2); ctx.fill();
  // wheels
  [x+w*0.08, x+w*0.58].forEach(wx => {
    ctx.fillStyle = '#1a1a1a'; ctx.beginPath(); ctx.arc(wx, y, w*0.14, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#888'; ctx.beginPath(); ctx.arc(wx, y, w*0.07, 0, Math.PI*2); ctx.fill();
  });
  // handlebar
  ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(x+w*0.58, y-h*0.55); ctx.lineTo(x+w*0.72, y-h*0.75); ctx.stroke();
  ctx.restore();
}

function drawSignpost(ctx: CanvasRenderingContext2D, x: number, y: number, w: number) {
  ctx.save();
  // pole
  ctx.fillStyle = '#4a3728'; ctx.fillRect(x - 4, y, 8, w * 1.2);
  const signs = [
    {label:'BUILD', bg:'#eebb22', fg:'#111312', angle: 0.08},
    {label:'SHIP',  bg:'#e5245e', fg:'#fdf8eb', angle:-0.06},
    {label:'REPEAT',bg:'#1a5c2a', fg:'#fdf8eb', angle: 0.05},
  ];
  signs.forEach(({label,bg,fg,angle}, i) => {
    const sy = y + i * (w * 0.38);
    ctx.save(); ctx.translate(x, sy + w*0.15); ctx.rotate(angle);
    ctx.fillStyle = bg;
    ctx.beginPath(); ctx.moveTo(-w*0.55, -w*0.15); ctx.lineTo(w*0.35, -w*0.15); ctx.lineTo(w*0.55, 0); ctx.lineTo(w*0.35, w*0.15); ctx.lineTo(-w*0.55, w*0.15); ctx.closePath(); ctx.fill();
    ctx.fillStyle = fg; ctx.font = `900 ${w*0.22}px "Space Mono", monospace`; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(label, -w*0.05, 0); ctx.restore();
  });
  ctx.restore();
}

function drawSunsetScene(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  // sky gradient already handled by card bg
  // sun
  ctx.save();
  ctx.fillStyle = '#eebb22';
  ctx.beginPath(); ctx.arc(x + w*0.28, y + h*0.55, h*0.18, 0, Math.PI*2); ctx.fill();
  // water reflections
  ctx.strokeStyle = 'rgba(238,187,34,0.4)'; ctx.lineWidth = 1.5;
  for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(x + w*0.1, y + h*0.72 + i*5); ctx.lineTo(x + w*0.46, y + h*0.72 + i*5); ctx.stroke(); }
  // hills silhouette
  ctx.fillStyle = '#0b2e1b';
  ctx.beginPath(); ctx.moveTo(x, y+h); ctx.lineTo(x, y+h*0.65); ctx.quadraticCurveTo(x+w*0.1, y+h*0.45, x+w*0.2, y+h*0.6); ctx.quadraticCurveTo(x+w*0.3, y+h*0.5, x+w*0.4, y+h*0.58); ctx.lineTo(x+w*0.55, y+h); ctx.closePath(); ctx.fill();
  // palm silhouettes
  drawPalm(ctx, x+w*0.12, y+h*0.62, h*0.45, '#0b2e1b');
  drawPalm(ctx, x+w*0.38, y+h*0.6, h*0.38, '#0b2e1b');
  // water
  ctx.fillStyle = 'rgba(11,46,27,0.5)';
  ctx.fillRect(x, y+h*0.72, w*0.6, h*0.28);
  // birds
  [[x+w*0.5,y+h*0.25],[x+w*0.6,y+h*0.2],[x+w*0.7,y+h*0.28]].forEach(([bx,by]) => drawBird(ctx,bx,by,7,'#0b2e1b'));
  ctx.restore();
}

async function drawGoaClassicCard(canvas: HTMLCanvasElement, opts: GenerateOptions) {
  const W = 900, H = 1200;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  const cream = '#f0e6c8', black = '#111312', pink = '#e5245e', yellow = '#eebb22', dkGreen = '#0b2e1b', footerGreen = '#051f12';

  // 1. Cream background
  ctx.fillStyle = cream; ctx.fillRect(0, 0, W, H);

  // 2. Top black polygon
  ctx.fillStyle = black;
  ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(W,0); ctx.lineTo(W,60); ctx.lineTo(620,500); ctx.lineTo(0,500); ctx.closePath(); ctx.fill();

  // 3. Ticker strip
  ctx.fillStyle = '#1a1a1a'; ctx.fillRect(0,0,W,28);
  ctx.fillStyle = cream; ctx.font = '600 11px "Barlow Condensed",sans-serif';
  ctx.textAlign='center'; ctx.fillText('BUILD  •  SHIP  •  REPEAT  •  BUILD  •  SHIP  •  REPEAT  •  BUILD  •  SHIP  •  REPEAT', W/2, 19);

  // 4. Photo polygon (upper right)
  if (opts.photo) {
    try {
      const img = await loadImage(opts.photo);
      ctx.save();
      ctx.beginPath(); ctx.moveTo(350,28); ctx.lineTo(W,28); ctx.lineTo(W,480); ctx.lineTo(560,480); ctx.lineTo(350,280); ctx.closePath(); ctx.clip();
      const asp = img.width/img.height, ta=550/480;
      let sx=0,sy=0,sw=img.width,sh=img.height;
      if(asp>ta){sw=sh*ta;sx=(img.width-sw)/2;}else{sh=sw/ta;sy=(img.height-sh)*0.08;}
      ctx.drawImage(img,sx,sy,sw,sh,350,28,550,480);
      ctx.restore();
      // slight darken overlay on photo
      ctx.save();
      ctx.beginPath(); ctx.moveTo(350,28); ctx.lineTo(W,28); ctx.lineTo(W,480); ctx.lineTo(560,480); ctx.lineTo(350,280); ctx.closePath(); ctx.clip();
      ctx.fillStyle='rgba(0,0,0,0.18)'; ctx.fillRect(350,28,550,480);
      ctx.restore();
    } catch(_) {
      ctx.fillStyle='#333'; ctx.fillRect(350,28,550,480);
    }
  } else {
    ctx.fillStyle='#2a2a2a'; ctx.fillRect(350,28,550,480);
    ctx.fillStyle='rgba(255,255,255,0.15)'; ctx.font='80px sans-serif'; ctx.textAlign='center';
    ctx.fillText('👤',625,280);
  }

  // 5. Main title type
  ctx.textAlign='left'; ctx.fillStyle=cream;
  ctx.font='900 148px "Barlow Condensed",sans-serif';
  ctx.fillText('HACKER',30,195);
  ctx.fillText('HOUSE',30,335);
  ctx.fillStyle=pink; ctx.font='900 170px "Barlow Condensed",sans-serif';
  ctx.fillText('GOA',30,490);

  // small palm inside GOA
  ctx.save(); ctx.translate(168,355); drawPalm(ctx,0,0,60,cream); ctx.restore();

  // 6. Left decorative dots grid
  ctx.fillStyle='rgba(240,230,200,0.18)';
  for(let r=0;r<8;r++) for(let c=0;c<3;c++) { ctx.beginPath(); ctx.arc(18+c*16,70+r*16,2,0,Math.PI*2); ctx.fill(); }

  // asterisks
  const asterisks=[[22,52],[22,220],[22,380]];
  ctx.fillStyle='rgba(240,230,200,0.5)'; ctx.font='20px sans-serif';
  asterisks.forEach(([ax,ay])=>{ ctx.textAlign='center'; ctx.fillText('✦',ax,ay); });

  // 7. HH GOA 2026 top-right tab
  ctx.fillStyle=pink; ctx.fillRect(768,28,132,160);
  ctx.fillStyle=yellow; ctx.font='900 36px "Barlow Condensed",sans-serif'; ctx.textAlign='center';
  ctx.fillText('HH',834,90); ctx.fillText('GOA',834,128); ctx.fillText('2026',834,162);

  // 8. Building the future stamp
  ctx.save(); ctx.translate(680,340); ctx.rotate(-0.18);
  ctx.strokeStyle=pink; ctx.lineWidth=2.5;
  ctx.beginPath(); ctx.arc(0,0,58,0,Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.arc(0,0,50,0,Math.PI*2); ctx.stroke();
  ctx.fillStyle=pink; ctx.font='700 10px "Space Mono",monospace'; ctx.textAlign='center';
  const st='BUILDING THE FUTURE · '; const sa=Math.PI*2/st.length;
  for(let i=0;i<st.length;i++){ ctx.save(); ctx.rotate(i*sa-Math.PI/2); ctx.fillText(st[i],0,-38); ctx.restore(); }
  drawPalm(ctx,0,8,30,pink);
  ctx.restore();

  // 9. Year and location info below GOA text
  ctx.fillStyle=yellow; ctx.font='900 52px "Barlow Condensed",sans-serif'; ctx.textAlign='left';
  ctx.fillText('2026',30,560);
  ctx.fillStyle=cream; ctx.font='600 18px "Barlow Condensed",sans-serif';
  ctx.fillText('GOA, INDIA',30,590);
  ctx.fillText('28—31 OCT 2026',30,612);
  ctx.fillStyle=pink; ctx.fillText('#FRAMEINGOA',30,634);

  // 10. Name
  const parts=(opts.name||'BUILDER').trim().toUpperCase().split(' ');
  const first=parts[0]||'', rest2=parts.slice(1).join(' ')||'';
  ctx.fillStyle=black;
  const nfs=first.length>8?80:first.length>6?96:110;
  ctx.font=`900 ${nfs}px "Barlow Condensed",sans-serif`;
  ctx.textAlign='left'; ctx.fillText(first,30,715);
  if(rest2){ ctx.font=`900 ${nfs}px "Barlow Condensed",sans-serif`; ctx.fillText(rest2,30,820); }

  // 11. Role badge (yellow)
  const roleText=(opts.role||'BUILDER').toUpperCase();
  ctx.font='700 20px "Space Mono",monospace';
  const rw=ctx.measureText(roleText).width+36; const ry=rest2?850:740;
  ctx.fillStyle=yellow; ctx.fillRect(30,ry,rw,36);
  ctx.fillStyle=black; ctx.fillText(roleText,48,ry+24);

  // 12. Builder title badge (pink border)
  const titleText=(opts.builderTitle||'BUILDER').toUpperCase();
  ctx.font='900 italic 28px "Playfair Display",serif';
  const tw=ctx.measureText(titleText).width+48; const ty2=ry+52;
  ctx.strokeStyle=pink; ctx.lineWidth=2; ctx.strokeRect(30,ty2,tw,46);
  ctx.fillStyle=pink; ctx.fillText(titleText,54,ty2+32);

  // 13. Skills/team line
  const skills=(opts.team||'').trim();
  if(skills){ ctx.fillStyle=black; ctx.font='600 18px "Space Mono",monospace'; ctx.fillText(`</> ${skills.toUpperCase()}`,30,ty2+78); }

  // 14. Right side - dark green panel for Goa artwork
  ctx.fillStyle=dkGreen;
  ctx.beginPath(); ctx.moveTo(560,500); ctx.lineTo(W,500); ctx.lineTo(W,1120); ctx.lineTo(520,1120); ctx.lineTo(560,500); ctx.closePath(); ctx.fill();

  // "LESS NOISE, MORE SIGNAL" vertical strip
  ctx.fillStyle=yellow; ctx.fillRect(860,500,40,620);
  ctx.save(); ctx.translate(880,810); ctx.rotate(Math.PI/2);
  ctx.fillStyle=black; ctx.font='700 12px "Barlow Condensed",sans-serif';
  ctx.textAlign='center'; ctx.fillText('LESS NOISE,  MORE SIGNAL.',0,0); ctx.restore();

  // Goa artwork in green panel
  // Church
  drawChurch(ctx, 610, 600, 130, 120, 'rgba(240,230,200,0.9)');
  // Palms around church
  drawPalm(ctx,590,780,130,'#1a5c2a');
  drawPalm(ctx,760,780,110,'#1a5c2a',true);

  // Scooter
  drawScooter(ctx, 635, 900, 160, pink, yellow);

  // BUILD/SHIP/REPEAT signpost
  drawSignpost(ctx, 800, 830, 90);

  // Birds in green panel
  [[650,530],[680,515],[710,525],[740,518]].forEach(([bx,by])=>drawBird(ctx,bx,by,8,cream));

  // 15. Bottom sunset silhouette strip
  drawSunsetScene(ctx, 0, 870, 545, 250);

  // Wave lines on cream area
  ctx.strokeStyle='rgba(11,46,27,0.15)'; ctx.lineWidth=1;
  for(let i=0;i<3;i++){ ctx.beginPath(); ctx.moveTo(30,650+i*8); ctx.lineTo(490,650+i*8); ctx.stroke(); }

  // Star decorations
  ctx.fillStyle=pink; ctx.font='16px sans-serif';
  [[500,710],[510,780],[500,840]].forEach(([ax,ay])=>{ ctx.textAlign='center'; ctx.fillText('✦',ax,ay); });

  // Plus signs
  ctx.fillStyle=cream; ctx.font='14px sans-serif';
  [[490,560],[500,625]].forEach(([ax,ay])=>{ ctx.textAlign='center'; ctx.fillText('+',ax,ay); });

  // 16. Footer
  ctx.fillStyle=footerGreen; ctx.fillRect(0,1120,W,80);

  // Left: plant + builder class
  ctx.fillStyle='#2a7a40'; ctx.font='700 13px "Space Mono",monospace'; ctx.textAlign='left';
  ctx.fillText('🌿',18,1168);
  ctx.fillStyle=cream; ctx.fillText('BUILDER',40,1155); ctx.fillStyle='#888'; ctx.fillText('CLASS',40,1172);
  ctx.fillStyle=pink; ctx.fillText('+',118,1155); ctx.fillText('+',118,1172);
  ctx.fillStyle=cream; ctx.fillText('EXPERIMENTAL',136,1155); ctx.fillText('BUILDER',136,1172);

  // Center: currently shipping
  ctx.fillStyle=yellow; ctx.textAlign='center'; ctx.fillText('CURRENTLY',370,1155);
  ctx.fillStyle=pink; ctx.fillText('◆',370,1172);
  ctx.fillStyle=cream; ctx.fillText('SHIPPING',370,1185);

  // Right of center: building the future
  ctx.fillStyle=cream; ctx.fillText('BUILDING',540,1155); ctx.fillText('THE FUTURE',540,1172);

  // Right: builder ID + barcode
  ctx.textAlign='right'; ctx.fillStyle='#888'; ctx.fillText('BUILDER ID',W-80,1150);
  ctx.fillStyle=cream; ctx.fillText('#'+opts.frameId,W-80,1166);
  // barcode bars
  const bx=W-75; let boff=0;
  const bars=[3,1,2,1,1,3,1,2,1,3,1,1,2,1,3,1,2];
  bars.forEach(bw=>{ ctx.fillStyle=cream; ctx.fillRect(bx+boff,1175,bw,22); boff+=bw+1; });
}

async function drawGoaClassicPFP(canvas: HTMLCanvasElement, opts: GenerateOptions) {
  const S=1080; canvas.width=S; canvas.height=S;
  const ctx=canvas.getContext('2d')!;
  const cream='#f0e6c8',black='#111312',pink='#e5245e',yellow='#eebb22',dkGreen='#0b2e1b';

  // Background
  ctx.fillStyle=cream; ctx.fillRect(0,0,S,S);

  // Black top + bottom band
  ctx.fillStyle=black; ctx.fillRect(0,0,S,110); ctx.fillRect(0,S-110,S,110);

  // Header text
  ctx.fillStyle=cream; ctx.font='900 italic 54px "Playfair Display",serif'; ctx.textAlign='center';
  ctx.fillText('HACKER HOUSE GOA',S/2,76);

  // Photo circle
  const cx=S/2, cy=S/2, pr=320;
  if(opts.photo){
    try{
      const img=await loadImage(opts.photo);
      ctx.save(); ctx.beginPath(); ctx.arc(cx,cy,pr,0,Math.PI*2); ctx.clip();
      const a=img.width/img.height; let sx=0,sy=0,sw=img.width,sh=img.height;
      if(a>1){sw=sh;sx=(img.width-sw)/2;}else{sh=sw;sy=(img.height-sh)*0.1;}
      ctx.drawImage(img,sx,sy,sw,sh,cx-pr,cy-pr,pr*2,pr*2); ctx.restore();
    } catch(_){ctx.fillStyle='#333';ctx.beginPath();ctx.arc(cx,cy,pr,0,Math.PI*2);ctx.fill();}
  } else {
    ctx.fillStyle='#333'; ctx.beginPath(); ctx.arc(cx,cy,pr,0,Math.PI*2); ctx.fill();
  }

  // Rings
  ctx.strokeStyle=black; ctx.lineWidth=6; ctx.beginPath(); ctx.arc(cx,cy,pr+12,0,Math.PI*2); ctx.stroke();
  ctx.strokeStyle=pink; ctx.lineWidth=3; ctx.setLineDash([18,8]);
  ctx.beginPath(); ctx.arc(cx,cy,pr+28,0,Math.PI*2); ctx.stroke(); ctx.setLineDash([]);

  // Corner brackets
  [[0,0,1,1],[S-80,0,-1,1],[0,S-80,1,-1],[S-80,S-80,-1,-1]].forEach(([ox,oy,dx,dy])=>{
    ctx.strokeStyle=black; ctx.lineWidth=4;
    ctx.beginPath(); ctx.moveTo(ox+dx*24,oy); ctx.lineTo(ox,oy); ctx.lineTo(ox,oy+dy*24); ctx.stroke();
    ctx.strokeStyle=pink; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(ox+dx*44,oy+dy*10); ctx.lineTo(ox+dx*10,oy+dy*10); ctx.lineTo(ox+dx*10,oy+dy*44); ctx.stroke();
  });

  // Side palm silhouettes
  ctx.globalAlpha=0.3;
  drawPalm(ctx,60,S-110,140,dkGreen);
  drawPalm(ctx,S-60,S-110,140,dkGreen,true);
  ctx.globalAlpha=1;

  // Sun top-right
  ctx.fillStyle=yellow; ctx.beginPath(); ctx.arc(S-120,140,40,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle=yellow; ctx.lineWidth=2;
  for(let i=0;i<8;i++){ const a=i*Math.PI/4; ctx.beginPath(); ctx.moveTo(S-120+Math.cos(a)*48,140+Math.sin(a)*48); ctx.lineTo(S-120+Math.cos(a)*60,140+Math.sin(a)*60); ctx.stroke(); }

  // Curving builder title
  const btxt=`★ ${opts.builderTitle} ★`; const br=pr+46;
  ctx.font='700 16px "Barlow Condensed",sans-serif'; ctx.fillStyle=pink; ctx.textAlign='center';
  const ta2=Math.PI*0.72, sa2=Math.PI/2+ta2/2, chars=btxt.split(''), as=ta2/(chars.length-1);
  chars.forEach((c,i)=>{ const a=sa2-i*as; ctx.save(); ctx.translate(cx+br*Math.cos(a),cy+br*Math.sin(a)); ctx.rotate(a+Math.PI/2); ctx.fillText(c,0,0); ctx.restore(); });

  // Bottom strip
  ctx.fillStyle=black; ctx.fillRect(0,S-110,S,110);
  ctx.fillStyle=yellow; ctx.font='800 32px "Barlow Condensed",sans-serif'; ctx.textAlign='left';
  ctx.fillText((opts.name||'BUILDER').toUpperCase(),40,S-58);
  ctx.textAlign='right'; ctx.fillStyle=pink; ctx.fillText('#FRAMEINGOA',S-40,S-58);
  ctx.fillStyle='#888'; ctx.font='600 14px "Space Mono",monospace'; ctx.textAlign='center';
  ctx.fillText(opts.role||'BUILDER',S/2,S-32);
}

export async function generateCard(opts: GenerateOptions): Promise<string> {
  const canvas = document.createElement('canvas');
  if (opts.format === 'pfp-frame') await drawGoaClassicPFP(canvas, opts);
  else await drawGoaClassicCard(canvas, opts);
  return canvas.toDataURL('image/png', 1.0);
}
