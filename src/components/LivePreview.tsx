import { motion, AnimatePresence } from 'framer-motion';
import type { StyleId } from '../utils/canvasGenerator';

interface LivePreviewProps {
  photo: string | null;
  name: string;
  role: string;
  team: string;
  builderTitle: string;
  builderTitleSub: string;
  frameId: string;
  style: StyleId;
  format: 'builder-id' | 'pfp-frame';
  generating: boolean;
  generatedImage: string | null;
}

const C = { cream:'#f0e6c8', black:'#111312', pink:'#e5245e', yellow:'#eebb22', dkGreen:'#0b2e1b', footer:'#051f12' };

function PalmSvg({ color, flip, opacity=1 }: { color:string; flip?:boolean; opacity?:number }) {
  return (
    <svg width="50" height="80" viewBox="0 0 50 80" fill="none" style={{transform:flip?'scaleX(-1)':'none',opacity}}>
      <path d="M22 80 Q26 50 30 6" stroke={color} strokeWidth="2.5" fill="none"/>
      <path d="M30 6 Q46 2 55 -10" stroke={color} strokeWidth="2" fill="none"/>
      <path d="M30 6 Q14 0 6 -12" stroke={color} strokeWidth="2" fill="none"/>
      <path d="M30 6 Q34 -10 28 -28" stroke={color} strokeWidth="2" fill="none"/>
      <path d="M30 6 Q18 -12 22 -28" stroke={color} strokeWidth="2" fill="none"/>
      <path d="M30 6 Q42 -16 60 -12" stroke={color} strokeWidth="2" fill="none"/>
    </svg>
  );
}

function ChurchSvg({ color }: { color: string }) {
  return (
    <svg width="90" height="90" viewBox="0 0 90 90" fill={color}>
      <rect x="10" y="35" width="70" height="55"/>
      <polygon points="0,35 45,8 90,35"/>
      <rect x="0" y="25" width="16" height="65"/>
      <rect x="74" y="25" width="16" height="65"/>
      <polygon points="0,25 8,10 16,25"/>
      <polygon points="74,25 82,10 90,25"/>
      <rect x="35" y="52" width="20" height="38" fill="#0b2e1b"/>
      <ellipse cx="28" cy="47" rx="8" ry="10" fill="#0b2e1b"/>
      <ellipse cx="62" cy="47" rx="8" ry="10" fill="#0b2e1b"/>
    </svg>
  );
}

function ScooterSvg() {
  return (
    <svg width="110" height="80" viewBox="0 0 110 80" fill="none">
      <ellipse cx="20" cy="68" rx="11" ry="11" fill="#111312"/>
      <ellipse cx="20" cy="68" rx="5" ry="5" fill="#888"/>
      <ellipse cx="82" cy="68" rx="11" ry="11" fill="#111312"/>
      <ellipse cx="82" cy="68" rx="5" ry="5" fill="#888"/>
      <path d="M15 57 Q30 30 55 32 Q75 34 82 57" fill="#e5245e"/>
      <ellipse cx="52" cy="32" rx="18" ry="7" fill="#111312"/>
      <line x1="82" y1="45" x2="96" y2="28" stroke="#111312" strokeWidth="3"/>
      <ellipse cx="8" cy="50" rx="6" ry="28" fill="#eebb22" transform="rotate(-20 8 50)"/>
    </svg>
  );
}

function SignpostSvg() {
  return (
    <svg width="80" height="110" viewBox="0 0 80 110" fill="none">
      <rect x="36" y="0" width="8" height="110" fill="#4a3728"/>
      <polygon points="2,8 58,8 68,20 58,32 2,32" fill="#eebb22"/>
      <text x="32" y="25" textAnchor="middle" fill="#111312" fontSize="11" fontWeight="900" fontFamily="monospace">BUILD</text>
      <polygon points="2,40 58,40 68,52 58,64 2,64" fill="#e5245e"/>
      <text x="32" y="57" textAnchor="middle" fill="white" fontSize="11" fontWeight="900" fontFamily="monospace">SHIP</text>
      <polygon points="2,72 62,72 72,84 62,96 2,96" fill="#1a5c2a"/>
      <text x="32" y="89" textAnchor="middle" fill="white" fontSize="10" fontWeight="900" fontFamily="monospace">REPEAT</text>
    </svg>
  );
}

function GoaClassicCard({ photo, name, role, team, builderTitle, frameId }: Omit<LivePreviewProps,'format'|'generating'|'generatedImage'|'style'>) {
  const parts = (name || 'BUILDER').toUpperCase().split(' ');
  const first = parts[0], rest = parts.slice(1).join(' ');
  const nfs = first.length > 8 ? '12cqw' : first.length > 5 ? '14cqw' : '16cqw';

  return (
    <div style={{ width:'100%', aspectRatio:'0.75', position:'relative', overflow:'hidden', background:C.cream, fontFamily:'sans-serif', containerType:'inline-size' }}>
      {/* Top black polygon */}
      <div style={{ position:'absolute', top:0, left:0, width:'100%', height:'42%', background:C.black, clipPath:'polygon(0 0,100% 0,100% 100%,0 100%)', zIndex:1 }}/>
      {/* Ticker */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:'2.4%', background:'#1a1a1a', display:'flex', alignItems:'center', justifyContent:'center', zIndex:10 }}>
        <span style={{ color:C.cream, fontSize:'0.42rem', fontFamily:'"Barlow Condensed",sans-serif', letterSpacing:'0.15em' }}>BUILD  •  SHIP  •  REPEAT  •  BUILD  •  SHIP  •  REPEAT</span>
      </div>

      {/* Photo polygon */}
      <div style={{ position:'absolute', top:'2.4%', right:0, width:'62%', height:'40%', clipPath:'polygon(14% 0,100% 0,100% 100%,56% 100%,0 60%)', overflow:'hidden', zIndex:2 }}>
        {photo ? <img src={photo} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center 8%' }}/>
          : <div style={{ width:'100%', height:'100%', background:'#2a2a2a', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.2)', fontSize:'2rem' }}>👤</div>}
        <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.15)' }}/>
      </div>

      {/* HH GOA 2026 tab */}
      <div style={{ position:'absolute', top:'2.4%', right:0, width:'16%', padding:'2% 0', background:C.pink, zIndex:5, textAlign:'center' }}>
        <div style={{ color:C.yellow, fontFamily:'"Barlow Condensed",sans-serif', fontWeight:900, fontSize:'4.5cqw', lineHeight:1.1 }}>HH<br/>GOA<br/>2026</div>
      </div>

      {/* Building the future stamp */}
      <div style={{ position:'absolute', top:'22%', right:'20%', width:'12%', aspectRatio:'1', zIndex:5,
        border:`1.5px solid ${C.pink}`, outline:`1px solid ${C.pink}`, outlineOffset:'-4px',
        borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', transform:'rotate(-12deg)' }}>
        <span style={{ color:C.pink, fontSize:'0.32rem', fontFamily:'"Space Mono",monospace', fontWeight:700, textAlign:'center', lineHeight:1.2 }}>BUILDING<br/>THE<br/>FUTURE</span>
      </div>

      {/* Left decorative dots */}
      <div style={{ position:'absolute', left:'1%', top:'5%', zIndex:3, display:'grid', gridTemplateColumns:'repeat(3,6px)', gap:'5px' }}>
        {Array.from({length:18}).map((_,i)=><div key={i} style={{ width:3,height:3,borderRadius:'50%',background:'rgba(240,230,200,0.25)' }}/>)}
      </div>

      {/* Title type */}
      <div style={{ position:'absolute', top:'3%', left:'3%', zIndex:4, lineHeight:0.88 }}>
        <div style={{ color:C.cream, fontFamily:'"Barlow Condensed",sans-serif', fontWeight:900, fontSize:'16cqw', letterSpacing:'-0.01em' }}>HACKER</div>
        <div style={{ color:C.cream, fontFamily:'"Barlow Condensed",sans-serif', fontWeight:900, fontSize:'16cqw', letterSpacing:'-0.01em' }}>HOUSE</div>
        <div style={{ color:C.pink, fontFamily:'"Barlow Condensed",sans-serif', fontWeight:900, fontSize:'18cqw', letterSpacing:'-0.01em' }}>GOA</div>
      </div>

      {/* Year + location */}
      <div style={{ position:'absolute', top:'43%', left:'3%', zIndex:4 }}>
        <div style={{ color:C.yellow, fontFamily:'"Barlow Condensed",sans-serif', fontWeight:900, fontSize:'6cqw' }}>2026</div>
        <div style={{ color:C.cream, fontFamily:'"Barlow Condensed",sans-serif', fontWeight:600, fontSize:'2.2cqw', letterSpacing:'0.08em', lineHeight:1.6 }}>
          GOA, INDIA<br/>28—31 OCT 2026<br/><span style={{color:C.pink}}>#FRAMEINGOA</span>
        </div>
      </div>

      {/* Bottom cream zone - name + info */}
      <div style={{ position:'absolute', bottom:'6.5%', left:0, width:'58%', zIndex:4, padding:'0 3%' }}>
        <div style={{ color:C.black, fontFamily:'"Barlow Condensed",sans-serif', fontWeight:900, fontSize:nfs, lineHeight:0.9, marginBottom:'1.5%' }}>
          {first}{rest && <><br/>{rest}</>}
        </div>

        {/* Role badge */}
        <div style={{ display:'inline-block', background:C.yellow, padding:'1px 8px', marginBottom:'1.5%' }}>
          <span style={{ fontFamily:'"Space Mono",monospace', fontWeight:700, fontSize:'2.5cqw', color:C.black }}>{(role||'BUILDER').toUpperCase()}</span>
        </div>

        {/* Builder title */}
        <div style={{ border:`1.5px solid ${C.pink}`, padding:'2px 8px', marginBottom:'1.5%', display:'inline-block' }}>
          <span style={{ fontFamily:'"Playfair Display",serif', fontWeight:900, fontStyle:'italic', fontSize:'3.2cqw', color:C.pink }}>{(builderTitle||'BUILDER').toUpperCase()}</span>
        </div>

        {/* Skills */}
        {team && team.trim() && (
          <div style={{ fontFamily:'"Space Mono",monospace', fontSize:'2cqw', color:C.black }}>
            <span style={{color:C.pink}}>{'</>'}</span> {team.toUpperCase()}
          </div>
        )}
      </div>

      {/* Right side: Goa artwork panel */}
      <div style={{ position:'absolute', right:0, top:'42%', bottom:'6.5%', width:'42%', background:C.dkGreen, clipPath:'polygon(6% 0,100% 0,100% 100%,0 100%)', zIndex:3, overflow:'hidden' }}>
        {/* LESS NOISE MORE SIGNAL strip */}
        <div style={{ position:'absolute', right:0, top:0, bottom:0, width:'8%', background:C.yellow, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <span style={{ fontFamily:'"Barlow Condensed",sans-serif', fontWeight:700, fontSize:'0.3rem', color:C.black, writingMode:'vertical-rl', transform:'rotate(180deg)', letterSpacing:'0.12em', whiteSpace:'nowrap' }}>LESS NOISE,  MORE SIGNAL.</span>
        </div>

        {/* Church */}
        <div style={{ position:'absolute', top:'5%', left:'15%', opacity:0.92 }}>
          <ChurchSvg color="rgba(240,230,200,0.9)" />
        </div>

        {/* Palms */}
        <div style={{ position:'absolute', bottom:'20%', left:'2%' }}><PalmSvg color="#1a5c2a"/></div>
        <div style={{ position:'absolute', bottom:'22%', left:'40%' }}><PalmSvg color="#1a5c2a" flip/></div>

        {/* Scooter */}
        <div style={{ position:'absolute', bottom:'18%', left:'8%' }}><ScooterSvg/></div>

        {/* Signpost */}
        <div style={{ position:'absolute', bottom:'14%', left:'52%' }}><SignpostSvg/></div>

        {/* Birds */}
        {[[20,8],[28,5],[36,10],[44,7]].map(([bx,by],i)=>(
          <div key={i} style={{ position:'absolute', left:`${bx}%`, top:`${by}%` }}>
            <svg width="14" height="8" viewBox="0 0 14 8"><path d="M0 5 Q3.5 1 7 5 Q10.5 1 14 5" stroke={C.cream} strokeWidth="1.2" fill="none"/></svg>
          </div>
        ))}
      </div>

      {/* Bottom sunset strip */}
      <div style={{ position:'absolute', bottom:'6.5%', left:0, width:'58%', height:'18%', overflow:'hidden', zIndex:2 }}>
        {/* Sun */}
        <div style={{ position:'absolute', bottom:'25%', left:'20%', width:'16%', aspectRatio:'1', borderRadius:'50%', background:C.yellow }}/>
        {/* Silhouette hills */}
        <svg style={{ position:'absolute', bottom:0, left:0, width:'100%', height:'80%' }} viewBox="0 0 300 80" preserveAspectRatio="none">
          <path d="M0 80 L0 50 Q25 30 50 45 Q75 32 100 42 Q150 25 180 40 L300 80 Z" fill={C.dkGreen}/>
        </svg>
        {/* Palms silhouette */}
        <div style={{ position:'absolute', bottom:'22%', left:'8%', opacity:0.9 }}><PalmSvg color={C.dkGreen} opacity={1}/></div>
        <div style={{ position:'absolute', bottom:'22%', left:'36%', opacity:0.9 }}><PalmSvg color={C.dkGreen} flip opacity={1}/></div>
      </div>

      {/* Footer */}
      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'6.5%', background:C.footer, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 2%', zIndex:5 }}>
        <span style={{ fontFamily:'"Space Mono",monospace', fontSize:'1.6cqw', color:C.cream }}>🌿 BUILDER CLASS <span style={{color:C.pink}}>+</span> EXPERIMENTAL</span>
        <span style={{ fontFamily:'"Space Mono",monospace', fontSize:'1.6cqw', color:C.yellow }}>CURRENTLY SHIPPING</span>
        <span style={{ fontFamily:'"Space Mono",monospace', fontSize:'1.6cqw', color:C.cream }}>BUILDER ID #{frameId}</span>
      </div>
    </div>
  );
}

function PFPFramePreview({ photo, name, builderTitle }: Pick<LivePreviewProps,'photo'|'name'|'builderTitle'>) {
  return (
    <div style={{ width:'100%', aspectRatio:'1', position:'relative', overflow:'hidden', background:C.cream }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:'9.5%', background:C.black, display:'flex', alignItems:'center', justifyContent:'center', zIndex:3 }}>
        <span style={{ color:C.cream, fontFamily:'"Playfair Display",serif', fontWeight:900, fontStyle:'italic', fontSize:'clamp(0.7rem,2.5vw,1.1rem)' }}>HACKER HOUSE GOA</span>
      </div>
      <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'62%', aspectRatio:'1', borderRadius:'50%', border:`3px solid ${C.black}`, outline:`3px dashed ${C.pink}`, outlineOffset:5, overflow:'hidden', background:'#333' }}>
        {photo ? <img src={photo} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center 10%' }}/> : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.2)', fontSize:'2rem' }}>👤</div>}
      </div>
      <div style={{ position:'absolute', bottom:'35%', left:0, right:0, textAlign:'center', zIndex:3, color:C.pink, fontFamily:'"Barlow Condensed",sans-serif', fontWeight:700, fontSize:'0.55rem', letterSpacing:'0.1em' }}>★ {builderTitle} ★</div>
      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'9.5%', background:C.black, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 4%', zIndex:3 }}>
        <span style={{ color:C.yellow, fontFamily:'"Barlow Condensed",sans-serif', fontWeight:700, fontSize:'0.6rem', letterSpacing:'0.08em' }}>{(name||'BUILDER').toUpperCase()}</span>
        <span style={{ color:C.pink, fontFamily:'"Barlow Condensed",sans-serif', fontWeight:700, fontSize:'0.6rem' }}>#FRAMEINGOA</span>
      </div>
      {/* palm decorations */}
      <div style={{ position:'absolute', bottom:'9.5%', left:'1%', zIndex:2 }}><PalmSvg color={C.dkGreen} opacity={0.4}/></div>
      <div style={{ position:'absolute', bottom:'9.5%', right:'1%', zIndex:2 }}><PalmSvg color={C.dkGreen} flip opacity={0.4}/></div>
      {/* corner brackets */}
      {[{top:32,left:8},{top:32,right:8},{bottom:32,left:8},{bottom:32,right:8}].map((pos,i)=>(
        <div key={i} style={{ position:'absolute', ...pos, width:18, height:18, zIndex:4,
          borderTop:i<2?`2px solid ${C.pink}`:'none', borderBottom:i>=2?`2px solid ${C.pink}`:'none',
          borderLeft:i%2===0?`2px solid ${C.pink}`:'none', borderRight:i%2!==0?`2px solid ${C.pink}`:'none' }}/>
      ))}
    </div>
  );
}

export function LivePreview(props: LivePreviewProps) {
  const { generating, generatedImage, format, ...rest } = props;
  return (
    <div style={{ width:'100%', position:'relative' }}>
      <AnimatePresence>
        {generating && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            style={{ position:'absolute', inset:0, background:'rgba(11,46,27,0.88)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', zIndex:10 }}>
            <motion.div animate={{rotate:360}} transition={{repeat:Infinity,duration:1.2,ease:'linear'}}
              style={{ width:40, height:40, border:'3px solid rgba(238,187,34,0.2)', borderTop:`3px solid ${C.yellow}`, borderRadius:'50%', marginBottom:12 }}/>
            <div style={{ fontFamily:'"Barlow Condensed",sans-serif', fontWeight:700, fontSize:'0.75rem', letterSpacing:'0.18em', textTransform:'uppercase', color:C.yellow }}>ASSEMBLING ASSET...</div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {generatedImage && !generating && (
          <motion.div key="gen" initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} transition={{duration:0.4}}>
            <img src={generatedImage} alt="Generated HH Goa ID" style={{ width:'100%', display:'block', imageRendering:'crisp-edges' }}/>
          </motion.div>
        )}
      </AnimatePresence>
      {!generatedImage && (
        <motion.div key={format} initial={{opacity:0,scale:0.97}} animate={{opacity:1,scale:1}} transition={{duration:0.3}}>
          {format === 'builder-id'
            ? <GoaClassicCard {...rest}/>
            : <PFPFramePreview photo={rest.photo} name={rest.name} builderTitle={rest.builderTitle}/>}
        </motion.div>
      )}
    </div>
  );
}
