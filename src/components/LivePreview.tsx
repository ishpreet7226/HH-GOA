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

interface StyleTokens {
  bg: string;
  fg: string;
  accent1: string;
  accent2: string;
  border: string;
  stripeBg: string;
  stripeText: string;
  bgPattern: string;
  bgTemplateUrl: string;
}

const STYLE_TOKENS: Record<StyleId, StyleTokens> = {
  'goa-classic': {
    bg: '#faf5e8', fg: '#1a5c2a', accent1: '#f5e842', accent2: '#f52d7e',
    border: '#1a5c2a', stripeBg: '#1a5c2a', stripeText: '#f5e842', bgPattern: '#f0e8d0',
    bgTemplateUrl: '/templates/goa-classic.png',
  },
  'night-shift': {
    bg: '#0f2a16', fg: '#faf5e8', accent1: '#f5e842', accent2: '#f52d7e',
    border: '#f5e842', stripeBg: '#f5e842', stripeText: '#0f2a16', bgPattern: '#1a3d22',
    bgTemplateUrl: '/templates/night-shift.png',
  },
  'sunset-builder': {
    bg: '#faf5e8', fg: '#1a5c2a', accent1: '#f52d7e', accent2: '#f5e842',
    border: '#f52d7e', stripeBg: '#f52d7e', stripeText: '#faf5e8', bgPattern: '#fce8d0',
    bgTemplateUrl: '/templates/sunset-builder.png',
  },
};

function HalftonePattern({ color }: { color: string }) {
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.5 }}>
      <defs>
        <pattern id="dots" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="7" cy="7" r="1.4" fill={color} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dots)" />
    </svg>
  );
}

function PalmIcon({ color, flip }: { color: string; flip?: boolean }) {
  return (
    <svg width="40" height="65" viewBox="0 0 40 65" fill="none"
      style={{ transform: flip ? 'scaleX(-1)' : 'none', opacity: 0.3 }}>
      <path d="M18 65 Q22 40 25 5" stroke={color} strokeWidth="2" />
      <path d="M25 5 Q38 2 44 -8" stroke={color} strokeWidth="1.5" />
      <path d="M25 5 Q12 -1 6 -10" stroke={color} strokeWidth="1.5" />
      <path d="M25 5 Q28 -8 24 -22" stroke={color} strokeWidth="1.5" />
      <path d="M25 5 Q16 -9 20 -22" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

function SunRays({ color }: { color: string }) {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <circle cx="28" cy="28" r="14" fill={color} />
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg, i) => (
        <line
          key={i}
          x1={28 + 18 * Math.cos((deg * Math.PI) / 180)}
          y1={28 + 18 * Math.sin((deg * Math.PI) / 180)}
          x2={28 + 25 * Math.cos((deg * Math.PI) / 180)}
          y2={28 + 25 * Math.sin((deg * Math.PI) / 180)}
          stroke={color} strokeWidth="1.8" strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

function WaveRow({ color }: { color: string }) {
  return (
    <svg width="100%" height="12" viewBox="0 0 300 12" preserveAspectRatio="none" fill="none">
      {[0, 50, 100, 150, 200, 250].map((x, i) => (
        <path key={i}
          d={`M${x} 6 Q${x + 12} 1 ${x + 25} 6 Q${x + 37} 11 ${x + 50} 6`}
          stroke={color} strokeWidth="1.2" />
      ))}
    </svg>
  );
}

// Builder ID Card preview
function BuilderIdPreview({ photo, name, role, team, builderTitle, builderTitleSub, frameId, style }: Omit<LivePreviewProps, 'format' | 'generating' | 'generatedImage'>) {
  const s = STYLE_TOKENS[style];

  return (
    <div style={{
      backgroundImage: `url(${s.bgTemplateUrl})`,
      backgroundSize: '100% 100%',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      width: '100%',
      aspectRatio: '0.75',
      fontFamily: 'inherit',
      position: 'relative',
      overflow: 'hidden',
      border: `3px solid ${s.border}`,
      boxShadow: `6px 6px 0 ${s.border}`,
    }}>
      {/* Top Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        padding: '12px 14px',
        fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.55rem', letterSpacing: '0.18em', color: s.fg
      }}>
        <span>HACKER HOUSE GOA</span>
        <span>OCT 28–31 · 2026</span>
      </div>

      <div style={{
        textAlign: 'center', marginTop: '2%',
        fontFamily: 'Playfair Display, serif', fontWeight: 900, fontStyle: 'italic',
        fontSize: 'clamp(1.8rem, 6vw, 2.8rem)', color: s.fg, letterSpacing: '-0.01em'
      }}>
        BUILDER ID
      </div>

      {/* Photo */}
      <div style={{
        margin: '4% auto 0',
        width: '42%',
        aspectRatio: '1',
        borderRadius: 8,
        border: `3px solid ${s.accent1}`,
        boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
        overflow: 'hidden',
        position: 'relative',
        background: '#fff',
      }}>
        {photo ? (
          <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2.5rem', background: s.bgPattern
          }}>
            👤
          </div>
        )}
      </div>

      {/* Info Section */}
      <div style={{
        margin: '5% auto 0',
        width: '72%',
        background: s.bg === '#0f2a16' ? 'rgba(15,42,22,0.85)' : 'rgba(250,245,232,0.85)',
        borderRadius: 12,
        padding: '10px 0',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <div style={{
          fontFamily: 'Playfair Display, serif', fontWeight: 900,
          fontSize: name.length > 14 ? 'clamp(1rem, 3vw, 1.4rem)' : 'clamp(1.3rem, 4vw, 1.8rem)',
          color: s.nameColor, letterSpacing: '-0.01em', wordBreak: 'break-word',
          textAlign: 'center', padding: '0 10px'
        }}>
          {(name || 'YOUR NAME').toUpperCase()}
        </div>
        
        <div style={{ width: '50%', height: 2, background: s.accent2, margin: '6px 0' }} />

        <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.5rem', letterSpacing: '0.2em', color: s.label }}>
          ROLE
        </div>
        <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.65rem', color: s.fg, marginTop: 2 }}>
          {role || 'Builder'}
        </div>

        {team && (
          <>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.5rem', letterSpacing: '0.2em', color: s.label, marginTop: 6 }}>
              TEAM
            </div>
            <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.65rem', color: s.fg, marginTop: 2 }}>
              {team}
            </div>
          </>
        )}
        
        <div style={{
          background: s.accent1,
          margin: '8px 12px 4px', padding: '6px 12px',
          borderRadius: 6, width: '80%', textAlign: 'center'
        }}>
          <div style={{
            fontFamily: 'Playfair Display, serif', fontWeight: 900, fontStyle: 'italic',
            fontSize: 'clamp(0.8rem, 2.5vw, 1.1rem)', color: s.nameColor === '#faf5e8' ? s.fg : '#0f2a16'
          }}>
            {builderTitle}
          </div>
        </div>
      </div>

      <div style={{
        position: 'absolute', bottom: '4%', left: '50%', transform: 'translateX(-50%)',
        background: s.accent2, color: '#fff',
        padding: '3px 12px', borderRadius: 10,
        fontFamily: 'Space Mono, monospace', fontWeight: 700, fontSize: '0.45rem',
      }}>
        {frameId}
      </div>
    </div>
  );
}

// PFP Frame preview
function PFPFramePreview({ photo, name, builderTitle, style }: Pick<LivePreviewProps, 'photo' | 'name' | 'builderTitle' | 'style'>) {
  const s = STYLE_TOKENS[style];

  return (
    <div style={{
      background: s.bg,
      width: '100%',
      aspectRatio: '1',
      position: 'relative',
      overflow: 'hidden',
      border: `3px solid ${s.border}`,
      boxShadow: `6px 6px 0 ${s.border}`,
    }}>
      <HalftonePattern color={s.bgPattern} />

      {/* Top strip */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        background: s.stripeBg, padding: '7px 14px',
        textAlign: 'center',
        fontFamily: 'Playfair Display, serif',
        fontWeight: 900,
        fontStyle: 'italic',
        fontSize: 'clamp(0.7rem, 2.5vw, 1rem)',
        color: s.stripeText,
        zIndex: 2,
      }}>
        HACKER HOUSE GOA
      </div>

      {/* Photo circle */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '64%',
        aspectRatio: '1',
        borderRadius: '50%',
        border: `3px solid ${s.border}`,
        outline: `5px dashed ${s.accent1}`,
        outlineOffset: 4,
        overflow: 'hidden',
        background: s.bgPattern,
      }}>
        {photo ? (
          <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: s.fg, opacity: 0.3, fontSize: '0.6rem',
            fontFamily: 'Barlow Condensed, sans-serif',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            PHOTO
          </div>
        )}
      </div>

      {/* Corner frames */}
      {[{top:28,left:8},{top:28,right:8},{bottom:28,left:8},{bottom:28,right:8}].map((pos, i) => (
        <div key={i} style={{
          position: 'absolute', ...pos, width: 18, height: 18, zIndex: 2,
          borderTop: i < 2 ? `2.5px solid ${s.border}` : 'none',
          borderBottom: i >= 2 ? `2.5px solid ${s.border}` : 'none',
          borderLeft: i % 2 === 0 ? `2.5px solid ${s.border}` : 'none',
          borderRight: i % 2 !== 0 ? `2.5px solid ${s.border}` : 'none',
        }} />
      ))}

      {/* Palm decorations */}
      <div style={{ position: 'absolute', bottom: 28, left: 4, zIndex: 1 }}>
        <PalmIcon color={s.fg} />
      </div>
      <div style={{ position: 'absolute', bottom: 28, right: 4, zIndex: 1 }}>
        <PalmIcon color={s.fg} flip />
      </div>

      {/* Sun */}
      <div style={{ position: 'absolute', top: 36, right: 16, zIndex: 1, opacity: 0.8 }}>
        <SunRays color={s.accent1} />
      </div>

      {/* Bottom strip */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: s.stripeBg,
        padding: '7px 14px',
        display: 'flex',
        justifyContent: 'space-between',
        zIndex: 2,
      }}>
        <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: s.stripeText }}>
          {(name || 'BUILDER').toUpperCase()}
        </span>
        <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.6rem', letterSpacing: '0.1em', color: s.accent2 === s.stripeText ? '#fff' : s.accent2 }}>
          #FRAMEINGOA
        </span>
      </div>

      {/* Builder title - curved text simulation with straight text */}
      <div style={{
        position: 'absolute',
        bottom: 42, left: 0, right: 0,
        textAlign: 'center',
        fontFamily: 'Barlow Condensed, sans-serif',
        fontWeight: 700,
        fontSize: '0.52rem',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: s.accent2,
        zIndex: 2,
      }}>
        ★ {builderTitle} ★
      </div>
    </div>
  );
}

export function LivePreview(props: LivePreviewProps) {
  const { generating, generatedImage, format, ...rest } = props;

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      {/* Generating overlay */}
      <AnimatePresence>
        {generating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(15,42,22,0.85)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
              style={{
                width: 40, height: 40,
                border: '3px solid rgba(245,232,66,0.2)',
                borderTop: '3px solid #f5e842',
                borderRadius: '50%',
                marginBottom: 12,
              }}
            />
            <div style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 700,
              fontSize: '0.75rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#f5e842',
            }}>
              GENERATING...
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generated result */}
      <AnimatePresence>
        {generatedImage && !generating && (
          <motion.div
            key="generated"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <img
              src={generatedImage}
              alt="Generated HH Goa ID"
              style={{
                width: '100%',
                display: 'block',
                imageRendering: 'crisp-edges',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live preview when no generated image */}
      {!generatedImage && (
        <motion.div
          key={format}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {format === 'builder-id' ? (
            <BuilderIdPreview {...rest} />
          ) : (
            <PFPFramePreview photo={rest.photo} name={rest.name} builderTitle={rest.builderTitle} style={rest.style} />
          )}
        </motion.div>
      )}
    </div>
  );
}
