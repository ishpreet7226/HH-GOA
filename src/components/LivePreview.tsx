import { motion, AnimatePresence } from 'framer-motion';

interface LivePreviewProps {
  photo: string | null;
  name: string;
  role: string;
  team: string;
  builderTitle: string;
  builderTitleSub: string;
  frameId: string;
  generating: boolean;
  generatedImage: string | null;
}

// ── Decorative SVGs ───────────────────────────────────────────────────────────

function PalmLeft() {
  return (
    <svg width="70" height="130" viewBox="0 0 70 130" fill="none">
      <path d="M30 130 Q36 90 44 20" stroke="#2a6b3a" strokeWidth="3" strokeLinecap="round"/>
      <path d="M44 20 Q62 10 72 -6" stroke="#2a6b3a" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M44 20 Q26 8 14 -8" stroke="#2a6b3a" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M44 20 Q50 4 44 -16" stroke="#2a6b3a" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M44 20 Q34 2 36 -18" stroke="#2a6b3a" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M44 20 Q64 -4 76 -18" stroke="#2a6b3a" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function PalmRight() {
  return (
    <svg width="70" height="130" viewBox="0 0 70 130" fill="none" style={{ transform: 'scaleX(-1)' }}>
      <path d="M30 130 Q36 90 44 20" stroke="#2a6b3a" strokeWidth="3" strokeLinecap="round"/>
      <path d="M44 20 Q62 10 72 -6" stroke="#2a6b3a" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M44 20 Q26 8 14 -8" stroke="#2a6b3a" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M44 20 Q50 4 44 -16" stroke="#2a6b3a" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M44 20 Q34 2 36 -18" stroke="#2a6b3a" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M44 20 Q64 -4 76 -18" stroke="#2a6b3a" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function SunsetScene() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 220 120" fill="none" preserveAspectRatio="xMidYMid slice">
      {/* Sky gradient */}
      <rect width="220" height="120" fill="#0e1810"/>
      {/* Sun */}
      <circle cx="110" cy="82" r="22" fill="#f5e842" opacity="0.9"/>
      {/* Water */}
      <rect y="90" width="220" height="30" fill="#0e3020"/>
      {/* Wave lines */}
      {[0,1,2].map(i => (
        <path key={i} d={`M${i*30} ${95+i*4} Q${15+i*30} ${93+i*4} ${30+i*30} ${95+i*4} Q${45+i*30} ${97+i*4} ${60+i*30} ${95+i*4}`} stroke="#1a5c2a" strokeWidth="1" opacity="0.6"/>
      ))}
      {/* Palm silhouettes */}
      <path d="M20 120 Q24 85 30 45" stroke="#0a1008" strokeWidth="3" strokeLinecap="round"/>
      <path d="M30 45 Q46 36 54 22" stroke="#0a1008" strokeWidth="2" strokeLinecap="round"/>
      <path d="M30 45 Q16 34 8 20" stroke="#0a1008" strokeWidth="2" strokeLinecap="round"/>
      <path d="M30 45 Q32 28 28 12" stroke="#0a1008" strokeWidth="2" strokeLinecap="round"/>
      <path d="M185 120 Q189 82 196 38" stroke="#0a1008" strokeWidth="3" strokeLinecap="round"/>
      <path d="M196 38 Q212 28 220 14" stroke="#0a1008" strokeWidth="2" strokeLinecap="round"/>
      <path d="M196 38 Q180 28 172 14" stroke="#0a1008" strokeWidth="2" strokeLinecap="round"/>
      <path d="M196 38 Q198 20 194 4" stroke="#0a1008" strokeWidth="2" strokeLinecap="round"/>
      {/* Birds */}
      <path d="M70 30 Q74 26 78 30" stroke="#ccc" strokeWidth="1" fill="none" opacity="0.5"/>
      <path d="M88 22 Q92 18 96 22" stroke="#ccc" strokeWidth="1" fill="none" opacity="0.4"/>
      <path d="M142 28 Q146 24 150 28" stroke="#ccc" strokeWidth="1" fill="none" opacity="0.4"/>
    </svg>
  );
}

function BuildShipRepeatSign() {
  const signs = ['BUILD', 'SHIP', 'REPEAT'];
  const colors = ['#f5e842', '#f52d7e', '#1a5c2a'];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'flex-start' }}>
      {signs.map((s, i) => (
        <div key={s} style={{
          background: colors[i],
          padding: '2px 10px 2px 6px',
          fontFamily: 'Barlow Condensed, sans-serif',
          fontWeight: 800,
          fontSize: 'clamp(0.42rem, 1.2vw, 0.58rem)',
          letterSpacing: '0.08em',
          color: i === 2 ? '#f5e842' : '#0e1810',
          clipPath: 'polygon(0 0, 100% 0, 92% 50%, 100% 100%, 0 100%)',
          whiteSpace: 'nowrap',
        }}>{s}</div>
      ))}
    </div>
  );
}

function HalftoneGrid() {
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06, pointerEvents: 'none' }}>
      <defs>
        <pattern id="hg" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
          <circle cx="5" cy="5" r="1.2" fill="#faf5e8"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hg)"/>
    </svg>
  );
}

function GridLines() {
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.1, pointerEvents: 'none' }}>
      <line x1="0" y1="14%" x2="100%" y2="14%" stroke="#faf5e8" strokeWidth="0.5" strokeDasharray="3,3"/>
      <line x1="55%" y1="0" x2="55%" y2="60%" stroke="#faf5e8" strokeWidth="0.5" strokeDasharray="3,3"/>
    </svg>
  );
}

function BuildingTheFutureStamp() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
      <defs>
        <path id="topArc" d="M 10,36 A 26,26 0 0,1 62,36"/>
        <path id="botArc" d="M 12,42 A 26,26 0 0,0 60,42"/>
      </defs>
      {/* Rings */}
      <circle cx="36" cy="36" r="33" stroke="#f52d7e" strokeWidth="2" strokeDasharray="3,2.5"/>
      <circle cx="36" cy="36" r="27" stroke="#f52d7e" strokeWidth="0.8"/>
      {/* Palm silhouette */}
      <path d="M36 54 Q37 44 39 30" stroke="#f52d7e" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M39 30 Q47 25 52 18" stroke="#f52d7e" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M39 30 Q30 24 25 17" stroke="#f52d7e" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M39 30 Q41 20 38 10" stroke="#f52d7e" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M33 57 Q36 54 39 57" stroke="#f52d7e" strokeWidth="1.2" fill="none"/>
      {/* Curved top text */}
      <text fill="#f52d7e" fontSize="6.5" fontFamily="Barlow Condensed, sans-serif" fontWeight="800" letterSpacing="1.5">
        <textPath href="#topArc" startOffset="8%">BUILDING THE FUTURE</textPath>
      </text>
      {/* Star dividers */}
      <text fill="#f52d7e" fontSize="6" fontFamily="sans-serif" x="21" y="48">★</text>
      <text fill="#f52d7e" fontSize="6" fontFamily="sans-serif" x="45" y="48">★</text>
    </svg>
  );
}

// ── Main card ─────────────────────────────────────────────────────────────────

function BuilderCard({ photo, name, role, team, builderTitle, builderTitleSub, frameId }: Omit<LivePreviewProps, 'generating' | 'generatedImage'>) {
  const displayName = name || 'YOUR NAME';
  const nameParts = displayName.trim().split(' ');
  const firstName = nameParts[0] || 'YOUR';
  const lastName = nameParts.slice(1).join(' ');
  
  const displayRole = role || 'BUILDER';
  const displayTitle = builderTitle || 'THE GOA BUILDER';
  const displayStack = builderTitleSub || '';
  const displayShipping = team || 'BUILDING THE FUTURE';
  const displayClass = 'EXPERIMENTAL BUILDER';

  return (
    <div style={{
      width: '100%',
      aspectRatio: '0.77',
      fontFamily: 'inherit',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      border: '2px solid #1a1a1a',
      boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
    }}>

      {/* ═══ TOP DARK SECTION ═══ */}
      <div style={{
        flex: '0 0 57%',
        background: '#0e1810',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <HalftoneGrid />
        <GridLines />

        {/* Top bar: BUILD · SHIP · REPEAT */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          padding: '4px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          zIndex: 3,
        }}>
          <div style={{
            fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700,
            fontSize: 'clamp(0.35rem, 1vw, 0.48rem)',
            color: 'rgba(250,245,232,0.5)',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}>
            BUILD · SHIP · REPEAT
          </div>
          <div style={{ flex: 1, height: 1, background: 'rgba(250,245,232,0.15)', marginLeft: 4 }} />
          <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 'clamp(0.3rem, 0.8vw, 0.4rem)', color: 'rgba(250,245,232,0.2)', letterSpacing: '0.04em' }}>8001</div>
        </div>

        {/* Photo — right side, diagonal clip */}
        <div style={{
          position: 'absolute',
          top: 0, right: 0,
          width: '58%',
          height: '100%',
          clipPath: 'polygon(22% 0%, 100% 0%, 100% 100%, 0% 100%)',
          overflow: 'hidden',
          zIndex: 1,
        }}>
          {photo ? (
            <img src={photo} alt="" style={{
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center top',
              filter: 'grayscale(30%) contrast(1.1)',
            }} />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              background: 'linear-gradient(145deg, #1e2e20 0%, #0e1810 60%, #162218 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
              paddingRight: '10%',
            }}>
              <div style={{ opacity: 0.12, fontSize: 'clamp(3rem, 10vw, 6rem)' }}>👤</div>
            </div>
          )}
          {/* Overlay grain on photo */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to right, rgba(14,24,16,0.7) 0%, transparent 40%)',
          }} />
        </div>

        {/* HH GOA 2026 badge — top right */}
        <div style={{
          position: 'absolute', top: 0, right: 0,
          background: '#f52d7e',
          padding: '5px 10px',
          zIndex: 4,
          border: '2px solid #0e1810',
          borderTop: 'none', borderRight: 'none',
        }}>
          <div style={{
            fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900,
            fontSize: 'clamp(0.8rem, 2.5vw, 1.2rem)',
            color: '#fff', letterSpacing: '0.04em',
            lineHeight: 1, textAlign: 'center',
          }}>HH<br />GOA</div>
          <div style={{
            fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700,
            fontSize: 'clamp(0.5rem, 1.4vw, 0.7rem)',
            color: 'rgba(255,255,255,0.85)',
            textAlign: 'center', letterSpacing: '0.06em',
          }}>2026</div>
        </div>

        {/* Left: Stacked title */}
        <div style={{
          position: 'absolute',
          left: 0, bottom: '6%',
          width: '54%',
          padding: '0 0 0 10px',
          zIndex: 2,
        }}>
          {/* Decorative asterisk */}
          <div style={{
            fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 400,
            fontSize: 'clamp(0.55rem, 1.6vw, 0.9rem)',
            color: 'rgba(250,245,232,0.25)',
            letterSpacing: '0.1em', marginBottom: 2,
          }}>✦ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ✦</div>

          <div style={{
            fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900,
            fontSize: 'clamp(1.6rem, 5.5vw, 3.2rem)',
            color: '#faf5e8',
            lineHeight: 0.88,
            letterSpacing: '-0.01em',
            textTransform: 'uppercase',
          }}>HACKER</div>
          <div style={{
            fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900,
            fontSize: 'clamp(1.6rem, 5.5vw, 3.2rem)',
            color: '#faf5e8',
            lineHeight: 0.88,
            letterSpacing: '-0.01em',
            textTransform: 'uppercase',
          }}>HOUSE</div>
          <div style={{
            fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900,
            fontSize: 'clamp(1.6rem, 5.5vw, 3.2rem)',
            color: '#f52d7e',
            lineHeight: 0.88,
            letterSpacing: '-0.01em',
            textTransform: 'uppercase',
          }}>GOA</div>

          <div style={{
            fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700,
            fontSize: 'clamp(0.75rem, 2.4vw, 1.4rem)',
            color: '#f5e842',
            lineHeight: 1.2,
            marginTop: 4,
          }}>2026</div>

          <div style={{
            fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 600,
            fontSize: 'clamp(0.38rem, 1.1vw, 0.58rem)',
            color: 'rgba(250,245,232,0.55)',
            letterSpacing: '0.06em',
            lineHeight: 1.5,
            marginTop: 4,
          }}>
            GOA, INDIA<br />
            28—31 OCT 2026<br />
            #FRAMEINGOA
          </div>

          {/* Decorative small mark */}
          <div style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: 'clamp(0.3rem, 0.85vw, 0.45rem)',
            color: 'rgba(250,245,232,0.18)',
            marginTop: 6,
            letterSpacing: '0.04em',
          }}>▤ &nbsp; ✕ &nbsp; + &nbsp; ─ ─</div>
        </div>

        {/* Building The Future stamp */}
        <div style={{
          position: 'absolute',
          right: '2%', bottom: '12%',
          zIndex: 3,
          opacity: 0.8,
          width: 'clamp(50px, 13%, 72px)',
        }}>
          <BuildingTheFutureStamp />
        </div>

        {/* Plus/crosshair decorations */}
        <div style={{ position: 'absolute', left: '52%', top: '18%', zIndex: 2, color: 'rgba(250,245,232,0.2)', fontSize: 'clamp(0.5rem, 1.5vw, 0.8rem)', fontFamily: 'sans-serif' }}>+</div>
        <div style={{ position: 'absolute', left: '44%', bottom: '22%', zIndex: 2, color: 'rgba(250,245,232,0.15)', fontSize: 'clamp(0.4rem, 1.2vw, 0.7rem)', fontFamily: 'sans-serif' }}>✦</div>
      </div>

      {/* ═══ CREAM LOWER SECTION ═══ */}
      <div style={{
        flex: '0 0 32%',
        background: '#f5f0df',
        position: 'relative',
        display: 'flex',
        overflow: 'hidden',
      }}>
        {/* Left: name + role + title + stack */}
        <div style={{
          flex: '0 0 58%',
          padding: '8px 8px 6px 10px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 2,
          position: 'relative',
          zIndex: 2,
          overflow: 'hidden',
        }}>
          {/* Name — large bold black, may wrap to two lines */}
          <div>
            <div style={{
              fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900,
              fontSize: displayName.length > 12 ? 'clamp(1.3rem, 4vw, 2.2rem)' : 'clamp(1.6rem, 5vw, 2.8rem)',
              color: '#0e1810',
              lineHeight: 0.88,
              letterSpacing: '-0.01em',
              textTransform: 'uppercase',
            }}>
              {firstName}
            </div>
            {lastName && (
              <div style={{
                fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900,
                fontSize: displayName.length > 12 ? 'clamp(1.3rem, 4vw, 2.2rem)' : 'clamp(1.6rem, 5vw, 2.8rem)',
                color: '#0e1810',
                lineHeight: 0.88,
                letterSpacing: '-0.01em',
                textTransform: 'uppercase',
              }}>
                {lastName}
              </div>
            )}
          </div>

          {/* Role — yellow bar */}
          <div style={{
            background: '#f5e842',
            display: 'inline-block',
            padding: '1px 6px',
            marginTop: 3,
            alignSelf: 'flex-start',
          }}>
            <span style={{
              fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700,
              fontSize: 'clamp(0.44rem, 1.3vw, 0.65rem)',
              color: '#0e1810',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}>
              {displayRole.toUpperCase()}
            </span>
          </div>

          {/* Builder title — pink outlined box */}
          <div style={{
            border: '1.5px solid #f52d7e',
            padding: '2px 8px',
            marginTop: 2,
            alignSelf: 'flex-start',
            maxWidth: '95%',
            overflow: 'hidden',
          }}>
            <span style={{
              fontFamily: 'Playfair Display, serif', fontWeight: 900, fontStyle: 'italic',
              fontSize: 'clamp(0.6rem, 1.8vw, 1rem)',
              color: '#f52d7e',
              letterSpacing: '-0.01em',
            }}>
              {displayTitle}
            </span>
          </div>

          {/* Stack / sub line */}
          {displayStack && (
            <div style={{
              fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 600,
              fontSize: 'clamp(0.38rem, 1.1vw, 0.55rem)',
              color: '#0e1810',
              letterSpacing: '0.06em',
              opacity: 0.7,
              marginTop: 2,
              textTransform: 'uppercase',
            }}>
              &lt;/&gt; {displayStack}
            </div>
          )}
        </div>

        {/* Right: Goa scene + signs */}
        <div style={{
          flex: '0 0 42%',
          position: 'relative',
          overflow: 'hidden',
          borderLeft: '1px solid rgba(14,24,16,0.15)',
        }}>
          {/* Sunset scene SVG background */}
          <div style={{ position: 'absolute', inset: 0 }}>
            <SunsetScene />
          </div>

          {/* Palm trees overlay */}
          <div style={{ position: 'absolute', bottom: 0, left: -4, zIndex: 2 }}>
            <PalmLeft />
          </div>
          <div style={{ position: 'absolute', bottom: 0, right: -4, zIndex: 2 }}>
            <PalmRight />
          </div>

          {/* Vertical yellow label "LESS NOISE, MORE SIGNAL" */}
          <div style={{
            position: 'absolute', right: 0, top: 0, bottom: 0,
            width: 'clamp(12px, 3.5%, 18px)',
            background: '#f5e842',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 3,
          }}>
            <div style={{
              fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800,
              fontSize: 'clamp(0.28rem, 0.8vw, 0.4rem)',
              color: '#0e1810',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              transform: 'rotate(180deg)',
              whiteSpace: 'nowrap',
            }}>
              LESS NOISE, MORE SIGNAL
            </div>
          </div>

          {/* BUILD / SHIP / REPEAT signs */}
          <div style={{
            position: 'absolute', bottom: 6, left: 8, zIndex: 3,
          }}>
            <BuildShipRepeatSign />
          </div>
        </div>
      </div>

      {/* ═══ BOTTOM DARK STRIP ═══ */}
      <div style={{
        flex: '0 0 11%',
        background: '#0e1810',
        borderTop: '2px solid #1a1a1a',
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        gap: 0,
        overflow: 'hidden',
      }}>
        {/* Leaf icon */}
        <div style={{
          fontFamily: 'sans-serif',
          fontSize: 'clamp(0.5rem, 1.5vw, 0.85rem)',
          marginRight: 6,
          opacity: 0.7,
        }}>🌿</div>

        {/* Builder Class */}
        <div style={{ flex: 1, borderRight: '1px solid rgba(250,245,232,0.12)', paddingRight: 6, paddingLeft: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 'clamp(0.3rem, 0.85vw, 0.42rem)', color: 'rgba(250,245,232,0.45)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>BUILDER CLASS</div>
            <div style={{ fontSize: 'clamp(0.3rem, 0.8vw, 0.4rem)', color: '#f52d7e' }}>+</div>
          </div>
          <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 'clamp(0.36rem, 1vw, 0.5rem)', color: '#faf5e8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{displayClass}</div>
        </div>

        {/* Currently Shipping */}
        <div style={{ flex: 1.2, borderRight: '1px solid rgba(250,245,232,0.12)', padding: '0 6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 'clamp(0.3rem, 0.85vw, 0.42rem)', color: 'rgba(250,245,232,0.45)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>CURRENTLY SHIPPING</div>
            <div style={{ fontSize: 'clamp(0.3rem, 0.8vw, 0.4rem)', color: '#f52d7e' }}>+</div>
          </div>
          <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 'clamp(0.36rem, 1vw, 0.5rem)', color: '#faf5e8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{displayShipping}</div>
        </div>

        {/* Builder ID + barcode */}
        <div style={{ flex: 1, padding: '0 0 0 6px' }}>
          <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: 'clamp(0.3rem, 0.85vw, 0.42rem)', color: 'rgba(250,245,232,0.45)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>BUILDER ID</div>
          <div style={{ fontFamily: 'Space Mono, monospace', fontWeight: 700, fontSize: 'clamp(0.32rem, 0.9vw, 0.44rem)', color: '#faf5e8', letterSpacing: '0.04em' }}>{frameId}</div>
          {/* Mini barcode */}
          <div style={{ display: 'flex', gap: 1, marginTop: 2, alignItems: 'flex-end' }}>
            {[2,3,1,4,2,1,3,2,4,1,2,3,1,2,4,1,3,2].map((h, i) => (
              <div key={i} style={{ width: 1.2, height: h * 2 + 2, background: '#faf5e8', opacity: 0.7 }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Export ────────────────────────────────────────────────────────────────────

export function LivePreview(props: LivePreviewProps) {
  const { generating, generatedImage, ...rest } = props;

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      <AnimatePresence>
        {generating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute', inset: 0,
              background: 'rgba(14,24,16,0.92)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              zIndex: 10,
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
              style={{
                width: 36, height: 36,
                border: '3px solid rgba(245,232,66,0.2)',
                borderTop: '3px solid #f5e842',
                borderRadius: '50%', marginBottom: 10,
              }}
            />
            <div style={{
              fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700,
              fontSize: '0.72rem', letterSpacing: '0.18em',
              textTransform: 'uppercase', color: '#f5e842',
            }}>
              GENERATING...
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {generatedImage && !generating && (
          <motion.div
            key="generated"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <img
              src={generatedImage}
              alt="Generated HH Goa ID"
              style={{ width: '100%', display: 'block', imageRendering: 'crisp-edges' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {!generatedImage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <BuilderCard {...rest} />
        </motion.div>
      )}
    </div>
  );
}
