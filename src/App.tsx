import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Intro } from './components/Intro';
import { PhotoUpload } from './components/PhotoUpload';
import { StyleSelector } from './components/StyleSelector';
import { LivePreview } from './components/LivePreview';
import { generateBuilderTitle, generateFrameId } from './utils/titleGenerator';
import { generateCard } from './utils/canvasGenerator';
import type { StyleId } from './utils/canvasGenerator';

// ─── Ticker tape ──────────────────────────────────────────────────────────────
function Ticker() {
  const items = ['HACKER HOUSE GOA', '#FRAMEINGOA', 'OCT 28–31 · 2026', 'GOA, INDIA', 'BUILD IN GOA', '2:47 PM STUDIO', 'IDENTITY STUDIO'];
  const text = items.join('  ·  ') + '  ·  ' + items.join('  ·  ');
  return (
    <div style={{
      background: '#f5e842',
      color: '#0f2a16',
      padding: '7px 0',
      overflow: 'hidden',
      borderTop: '2px solid #0f2a16',
      borderBottom: '2px solid #0f2a16',
    }}>
      <div style={{
        display: 'inline-block',
        whiteSpace: 'nowrap',
        fontFamily: 'Barlow Condensed, sans-serif',
        fontWeight: 800,
        fontSize: '0.72rem',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        animation: 'ticker 22s linear infinite',
      }}>
        {text}
      </div>
    </div>
  );
}

// ─── Goa SVG motifs ───────────────────────────────────────────────────────────
function GoaScooter() {
  return (
    <svg width="80" height="44" viewBox="0 0 80 44" fill="none" style={{ opacity: 0.18 }}>
      <ellipse cx="18" cy="36" rx="10" ry="10" stroke="#f52d7e" strokeWidth="2" />
      <ellipse cx="62" cy="36" rx="10" ry="10" stroke="#f52d7e" strokeWidth="2" />
      <path d="M18 26 L30 16 L50 14 L62 26" stroke="#f52d7e" strokeWidth="2" fill="none" />
      <path d="M50 14 L54 8 L60 8 L62 14" stroke="#f52d7e" strokeWidth="1.5" fill="none" />
      <path d="M18 26 L62 26" stroke="#f52d7e" strokeWidth="2" />
      <path d="M32 26 L28 14" stroke="#f52d7e" strokeWidth="1.5" />
    </svg>
  );
}

function SunBurst({ size = 64, color = '#f5e842' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="18" fill={color} />
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg, i) => (
        <line key={i}
          x1={32 + 22 * Math.cos((deg * Math.PI) / 180)}
          y1={32 + 22 * Math.sin((deg * Math.PI) / 180)}
          x2={32 + 30 * Math.cos((deg * Math.PI) / 180)}
          y2={32 + 30 * Math.sin((deg * Math.PI) / 180)}
          stroke={color} strokeWidth="2.5" strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

function PalmSilhouette({ flip = false, opacity = 0.12 }: { flip?: boolean; opacity?: number }) {
  return (
    <svg width="120" height="200" viewBox="0 0 80 140" fill="none"
      style={{ transform: flip ? 'scaleX(-1)' : 'none', opacity }}>
      <path d="M38 140 Q44 90 50 10" stroke="#f5e842" strokeWidth="4" />
      <path d="M50 10 Q70 4 78 -12" stroke="#4aad60" strokeWidth="3" />
      <path d="M50 10 Q28 2 16 -14" stroke="#4aad60" strokeWidth="3" />
      <path d="M50 10 Q54 -12 46 -34" stroke="#4aad60" strokeWidth="3" />
      <path d="M50 10 Q34 -14 38 -36" stroke="#4aad60" strokeWidth="3" />
      <path d="M50 10 Q70 -18 80 -12" stroke="#4aad60" strokeWidth="3" />
      <path d="M50 10 Q12 -8 4 -26" stroke="#4aad60" strokeWidth="3" />
    </svg>
  );
}

// ─── Format selector ─────────────────────────────────────────────────────────
function FormatSelector({
  value, onChange
}: {
  value: 'builder-id' | 'pfp-frame';
  onChange: (v: 'builder-id' | 'pfp-frame') => void;
}) {
  return (
    <div className="field-group">
      <label className="field-label">OUTPUT FORMAT</label>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
        {(['builder-id', 'pfp-frame'] as const).map((fmt) => (
          <motion.button
            key={fmt}
            whileTap={{ scale: 0.97 }}
            onClick={() => onChange(fmt)}
            style={{
              background: value === fmt ? 'rgba(245,232,66,0.1)' : 'rgba(255,255,255,0.03)',
              border: `2px solid ${value === fmt ? '#f5e842' : 'rgba(245,232,66,0.2)'}`,
              padding: '0.65rem 0.75rem',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            <div style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 800,
              fontSize: '0.7rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: value === fmt ? '#f5e842' : 'rgba(250,245,232,0.5)',
            }}>
              {fmt === 'builder-id' ? '🪪 BUILDER ID' : '🖼 PFP FRAME'}
            </div>
            <div style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '0.5rem',
              color: value === fmt ? 'rgba(245,232,66,0.6)' : 'rgba(250,245,232,0.25)',
              marginTop: 3,
            }}>
              {fmt === 'builder-id' ? '900×1200 · Poster' : '1080×1080 · X Profile'}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ─── Field input ─────────────────────────────────────────────────────────────
function Field({ label, placeholder, value, onChange, hint }: {
  label: string; placeholder: string; value: string;
  onChange: (v: string) => void; hint?: string;
}) {
  return (
    <div className="field-group">
      <label className="field-label">{label}</label>
      <input
        className="field-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={60}
      />
      {hint && (
        <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.55rem', color: 'rgba(250,245,232,0.3)', marginTop: 2 }}>
          {hint}
        </div>
      )}
    </div>
  );
}

// ─── Builder title reveal ─────────────────────────────────────────────────────
function BuilderTitleReveal({ title, sub, visible }: { title: string; sub: string; visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
          style={{
            background: 'rgba(245,232,66,0.08)',
            border: '1.5px solid rgba(245,232,66,0.3)',
            padding: '0.6rem 0.9rem',
            marginTop: '-0.2rem',
          }}
        >
          <div style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 600,
            fontSize: '0.55rem',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'rgba(245,232,66,0.6)',
            marginBottom: 3,
          }}>
            YOUR BUILDER TITLE
          </div>
          <div style={{
            fontFamily: 'Playfair Display, serif',
            fontWeight: 900,
            fontStyle: 'italic',
            fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
            color: '#f5e842',
            lineHeight: 1.1,
          }}>
            {title}
          </div>
          <div style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: '0.6rem',
            color: '#f52d7e',
            marginTop: 2,
            opacity: 0.85,
          }}>
            {sub}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Download / Share actions ─────────────────────────────────────────────────
function ActionBar({ imageUrl, name, role, onReset }: { imageUrl: string; name: string; role: string; onReset: () => void }) {
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDownload = useCallback(() => {
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `HH-GOA-${(name || 'builder').replace(/\s+/g, '-').toUpperCase()}.png`;
    a.click();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  }, [imageUrl, name]);

  const handleShareX = useCallback(async () => {
    setIsUploading(true);
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageUrl, name })
      });
      
      let shareLink = 'https://hhgoa.com'; // fallback
      
      if (response.ok) {
        const { url } = await response.json();
        const hostname = window.location.hostname === 'localhost' ? 'localhost:5173' : window.location.hostname;
        const protocol = window.location.hostname === 'localhost' ? 'http' : 'https';
        shareLink = `${protocol}://${hostname}/api/share?img=${encodeURIComponent(url)}&name=${encodeURIComponent(name)}&role=${encodeURIComponent(role)}`;
      }

      const text = encodeURIComponent(`Just claimed my official builder ID for Hacker House Goa 2026! 🌴\n\nBuilding something special in GOA this October.\n\n#FrameInGoa #HackerHouseGoa #HHGoa2026\n\n${shareLink}`);
      window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (error) {
      console.error('Share failed', error);
      // Fallback
      const text = encodeURIComponent(`Just claimed my official builder ID for Hacker House Goa 2026! 🌴\n\nBuilding something special in GOA this October.\n\n#FrameInGoa #HackerHouseGoa #HHGoa2026`);
      window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
    } finally {
      setIsUploading(false);
    }
  }, [imageUrl, name, role]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}
    >
      {/* Success message */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        style={{
          background: 'rgba(74,173,96,0.12)',
          border: '1.5px solid rgba(74,173,96,0.4)',
          padding: '0.6rem 0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ delay: 0.3, duration: 0.4 }}
          style={{ fontSize: '1rem' }}
        >
          🌴
        </motion.div>
        <div>
          <div style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 800,
            fontSize: '0.72rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#4aad60',
          }}>
            YOUR ID IS READY
          </div>
          <div style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: '0.55rem',
            color: 'rgba(74,173,96,0.7)',
            marginTop: 2,
          }}>
            Share it with #FrameInGoa
          </div>
        </div>
      </motion.div>

      {/* Action buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
        <motion.button
          className="btn btn-yellow"
          onClick={handleDownload}
          whileTap={{ scale: 0.96 }}
          style={{ fontSize: '0.75rem', padding: '0.75rem 1rem', letterSpacing: '0.1em' }}
        >
          {downloaded ? '✓ SAVED!' : '↓ DOWNLOAD'}
        </motion.button>
        <motion.button
          className="btn btn-pink"
          onClick={handleShareX}
          disabled={isUploading}
          whileTap={{ scale: isUploading ? 1 : 0.96 }}
          style={{ fontSize: '0.75rem', padding: '0.75rem 1rem', letterSpacing: '0.1em', opacity: isUploading ? 0.7 : 1, cursor: isUploading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {isUploading ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid #0f2a16', borderTopColor: 'transparent', borderRadius: '50%' }}
              />
              UPLOADING...
            </span>
          ) : copied ? '✓ SHARED!' : '✕ SHARE TO X'}
        </motion.button>
      </div>

      <button
        onClick={onReset}
        style={{
          fontFamily: 'Barlow Condensed, sans-serif',
          fontWeight: 700,
          fontSize: '0.65rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'rgba(250,245,232,0.35)',
          padding: '0.4rem',
          cursor: 'pointer',
          background: 'none',
          border: 'none',
          transition: 'color 0.15s',
          textAlign: 'center',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = 'rgba(250,245,232,0.65)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(250,245,232,0.35)')}
      >
        ↺ Make another
      </button>
    </motion.div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [photo, setPhoto] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [team, setTeam] = useState('');
  const [style, setStyle] = useState<StyleId>('goa-classic');
  const [format, setFormat] = useState<'builder-id' | 'pfp-frame'>('builder-id');
  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [frameId] = useState(() => generateFrameId('', ''));

  const { title: builderTitle, sub: builderTitleSub } = generateBuilderTitle(role, name);
  const hasRole = role.trim().length > 0;

  const handleGenerate = useCallback(async () => {
    setGenerating(true);
    setGeneratedImage(null);
    await new Promise(r => setTimeout(r, 400)); // brief pulse
    try {
      const url = await generateCard({
        photo,
        name: name.trim() || 'Builder',
        role: role.trim() || 'Builder',
        team: team.trim(),
        builderTitle,
        builderTitleSub,
        frameId,
        style,
        format,
      });
      setGeneratedImage(url);
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  }, [photo, name, role, team, builderTitle, builderTitleSub, frameId, style, format]);

  const handleReset = useCallback(() => {
    setGeneratedImage(null);
  }, []);

  // Auto-regenerate live preview when style changes (but only if already generated)
  const prevStyle = useRef(style);
  useEffect(() => {
    if (generatedImage && prevStyle.current !== style) {
      prevStyle.current = style;
      handleGenerate();
    } else {
      prevStyle.current = style;
    }
  }, [style]);

  return (
    <>
      {/* Intro */}
      <AnimatePresence>
        {showIntro && <Intro onComplete={() => setShowIntro(false)} />}
      </AnimatePresence>

      {/* App shell */}
      <AnimatePresence>
        {!showIntro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
          >
            {/* ── HEADER ── */}
            <header style={{
              background: '#1a5c2a',
              borderBottom: '2.5px solid #0f2a16',
              padding: '14px 28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'sticky',
              top: 0,
              zIndex: 100,
            }}>
              {/* Logo */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                <div style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '0.6rem',
                  color: 'rgba(245,232,66,0.6)',
                  letterSpacing: '0.08em',
                  lineHeight: 1,
                }}>
                  2:47PM<br />STUDIO
                </div>
                <div style={{
                  width: '1.5px', height: 28,
                  background: 'rgba(245,232,66,0.2)',
                  marginLeft: 4,
                }} />
                <div style={{ marginLeft: 4 }}>
                  <div style={{
                    fontFamily: 'Playfair Display, serif',
                    fontWeight: 900,
                    fontStyle: 'italic',
                    fontSize: 'clamp(1rem, 3vw, 1.4rem)',
                    color: '#f5e842',
                    lineHeight: 1,
                    letterSpacing: '-0.01em',
                  }}>
                    HH GOA
                  </div>
                  <div style={{
                    fontFamily: 'Barlow Condensed, sans-serif',
                    fontWeight: 600,
                    fontSize: '0.55rem',
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: 'rgba(245,232,66,0.5)',
                  }}>
                    IDENTITY STUDIO
                  </div>
                </div>
              </div>

              {/* Right header items */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                <div style={{
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontWeight: 700,
                  fontSize: '0.62rem',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'rgba(250,245,232,0.45)',
                }}>
                  GOA · INDIA
                </div>
                <div style={{
                  background: '#f52d7e',
                  color: '#fff',
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontWeight: 800,
                  fontSize: '0.65rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  padding: '5px 12px',
                  border: '1.5px solid #0f2a16',
                  boxShadow: '2px 2px 0 #0f2a16',
                }}>
                  OCT 2026
                </div>
              </div>
            </header>

            {/* Ticker */}
            <Ticker />

            {/* ── HERO INTRO TEXT ── */}
            <div style={{
              background: '#1a5c2a',
              padding: 'clamp(2rem, 5vw, 3.5rem) clamp(1.5rem, 4vw, 4rem)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              borderBottom: '2.5px solid #0f2a16',
            }}>
              {/* Background halftone */}
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.07, pointerEvents: 'none' }}>
                <defs>
                  <pattern id="hero-dots" x="0" y="0" width="18" height="18" patternUnits="userSpaceOnUse">
                    <circle cx="9" cy="9" r="1.5" fill="#f5e842" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#hero-dots)" />
              </svg>

              {/* Decorative palms */}
              <div style={{ position: 'absolute', left: 0, bottom: 0 }}>
                <PalmSilhouette opacity={0.3} />
              </div>
              <div style={{ position: 'absolute', right: 0, bottom: 0 }}>
                <PalmSilhouette flip opacity={0.3} />
              </div>

              {/* Sun top-right */}
              <div style={{ position: 'absolute', top: 16, right: 20, opacity: 0.7 }}>
                <SunBurst size={72} color="#f5e842" />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
              >
                <div style={{
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: 'rgba(245,232,66,0.6)',
                  marginBottom: '0.75rem',
                }}>
                  — Hacker House Goa 2026 —
                </div>
                <h1 style={{
                  fontFamily: 'Playfair Display, serif',
                  fontWeight: 900,
                  fontStyle: 'italic',
                  fontSize: 'clamp(2.2rem, 8vw, 5rem)',
                  color: '#f5e842',
                  lineHeight: 0.9,
                  letterSpacing: '-0.02em',
                  marginBottom: '0.4rem',
                }}>
                  Claim Your
                </h1>
                <h1 style={{
                  fontFamily: 'Playfair Display, serif',
                  fontWeight: 900,
                  fontSize: 'clamp(2.2rem, 8vw, 5rem)',
                  color: '#faf5e8',
                  lineHeight: 0.9,
                  letterSpacing: '-0.02em',
                  marginBottom: '1rem',
                }}>
                  BUILDER ID
                </h1>
                <p style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: 'clamp(0.65rem, 1.8vw, 0.82rem)',
                  color: 'rgba(250,245,232,0.55)',
                  letterSpacing: '-0.01em',
                  maxWidth: 480,
                  margin: '0 auto',
                  lineHeight: 1.6,
                }}>
                  Upload your photo. Get your official HH Goa 2026 card.<br />
                  Share with <span style={{ color: '#f52d7e', fontWeight: 700 }}>#FrameInGoa</span>
                </p>
              </motion.div>
            </div>

            {/* ── MAIN STUDIO ── */}
            <main style={{ flex: 1, padding: 'clamp(1.5rem, 4vw, 3rem) clamp(1rem, 4vw, 3rem)', background: 'linear-gradient(180deg, #1a5c2a 0%, #163f20 50%, #1a5c2a 100%)' }}>
              {/* Desktop: 2-column; Mobile: stacked */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'clamp(280px, 38%, 420px) 1fr',
                gap: 'clamp(1.5rem, 4vw, 3rem)',
                maxWidth: 1200,
                margin: '0 auto',
                alignItems: 'start',
              }}
              className="studio-grid"
              >
                {/* ── LEFT PANEL: CONTROLS ── */}
                <motion.div
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}
                >
                  {/* Panel header */}
                  <div style={{
                    borderBottom: '1.5px solid rgba(245,232,66,0.15)',
                    paddingBottom: '0.75rem',
                  }}>
                    <div style={{
                      fontFamily: 'Barlow Condensed, sans-serif',
                      fontWeight: 800,
                      fontSize: '0.65rem',
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      color: 'rgba(245,232,66,0.5)',
                    }}>
                      STUDIO
                    </div>
                    <div style={{
                      fontFamily: 'Playfair Display, serif',
                      fontWeight: 900,
                      fontStyle: 'italic',
                      fontSize: 'clamp(1.2rem, 3vw, 1.6rem)',
                      color: '#faf5e8',
                      lineHeight: 1,
                      marginTop: 2,
                    }}>
                      Personalize
                    </div>
                  </div>

                  {/* Photo upload */}
                  <PhotoUpload
                    photo={photo}
                    onPhotoChange={setPhoto}
                    onPhotoRemove={() => setPhoto(null)}
                  />

                  {/* Format selector */}
                  <FormatSelector value={format} onChange={setFormat} />

                  {/* Fields */}
                  <Field
                    label="YOUR NAME"
                    placeholder="e.g. Priya Sharma"
                    value={name}
                    onChange={setName}
                  />

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    <Field
                      label="STACK / ROLE"
                      placeholder="e.g. Full Stack · AI Engineer"
                      value={role}
                      onChange={setRole}
                      hint="This generates your builder title"
                    />
                    <BuilderTitleReveal
                      title={builderTitle}
                      sub={builderTitleSub}
                      visible={hasRole}
                    />
                  </div>

                  <Field
                    label="TEAM (OPTIONAL)"
                    placeholder="e.g. Team Chaos"
                    value={team}
                    onChange={setTeam}
                  />

                  {/* Style selector */}
                  <StyleSelector value={style} onChange={(s) => {
                    setStyle(s);
                    setGeneratedImage(null);
                  }} />

                  {/* Scooter decorative */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', opacity: 0.6 }}>
                    <GoaScooter />
                  </div>

                  {/* Generate button */}
                  {!generatedImage && (
                    <motion.button
                      className="btn btn-yellow btn-lg"
                      onClick={handleGenerate}
                      disabled={generating}
                      whileHover={{ scale: generating ? 1 : 1.02 }}
                      whileTap={{ scale: generating ? 1 : 0.97 }}
                      style={{
                        width: '100%',
                        opacity: generating ? 0.7 : 1,
                        cursor: generating ? 'not-allowed' : 'pointer',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      {generating ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                            style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid #0f2a16', borderTopColor: 'transparent', borderRadius: '50%' }}
                          />
                          BUILDING...
                        </span>
                      ) : (
                        <span>⚡ GENERATE MY ID</span>
                      )}
                    </motion.button>
                  )}

                  {/* Action bar after generation */}
                  {generatedImage && !generating && (
                    <ActionBar
                      imageUrl={generatedImage}
                      name={name}
                      role={role}
                      onReset={handleReset}
                    />
                  )}

                  {/* Hashtag */}
                  <div style={{
                    textAlign: 'center',
                    fontFamily: 'Space Mono, monospace',
                    fontSize: '0.58rem',
                    color: 'rgba(250,245,232,0.2)',
                    letterSpacing: '0.06em',
                    paddingTop: '0.5rem',
                    borderTop: '1px solid rgba(245,232,66,0.08)',
                  }}>
                    #FrameInGoa · #HackerHouseGoa · hhgoa.com
                  </div>
                </motion.div>

                {/* ── RIGHT PANEL: PREVIEW ── */}
                <motion.div
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  style={{ position: 'sticky', top: 90 }}
                >
                  {/* Preview label */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.75rem',
                  }}>
                    <div>
                      <div style={{
                        fontFamily: 'Barlow Condensed, sans-serif',
                        fontWeight: 800,
                        fontSize: '0.6rem',
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        color: 'rgba(245,232,66,0.5)',
                      }}>
                        LIVE PREVIEW
                      </div>
                      <div style={{
                        fontFamily: 'Playfair Display, serif',
                        fontWeight: 900,
                        fontStyle: 'italic',
                        fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
                        color: '#faf5e8',
                        lineHeight: 1,
                        marginTop: 2,
                      }}>
                        Your Identity Card
                      </div>
                    </div>
                    <div style={{
                      background: generatedImage ? '#f52d7e' : 'rgba(245,232,66,0.1)',
                      border: `1.5px solid ${generatedImage ? '#f52d7e' : 'rgba(245,232,66,0.2)'}`,
                      padding: '3px 10px',
                      fontFamily: 'Barlow Condensed, sans-serif',
                      fontWeight: 700,
                      fontSize: '0.55rem',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: generatedImage ? '#fff' : 'rgba(245,232,66,0.4)',
                    }}>
                      {generatedImage ? '● READY' : '○ PREVIEW'}
                    </div>
                  </div>

                  {/* Frame ID badge */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.75rem',
                  }}>
                    <div style={{
                      fontFamily: 'Space Mono, monospace',
                      fontSize: '0.55rem',
                      color: 'rgba(250,245,232,0.3)',
                      letterSpacing: '0.08em',
                    }}>
                      FRAME ID:
                    </div>
                    <div style={{
                      background: 'rgba(245,50,125,0.15)',
                      border: '1px solid rgba(245,50,125,0.3)',
                      padding: '1px 8px',
                      fontFamily: 'Space Mono, monospace',
                      fontSize: '0.55rem',
                      color: '#f52d7e',
                      letterSpacing: '0.06em',
                    }}>
                      {frameId}
                    </div>
                  </div>

                  {/* The actual preview */}
                  <div style={{
                    maxWidth: format === 'pfp-frame' ? 480 : 420,
                    margin: '0 auto',
                  }}>
                    <LivePreview
                      photo={photo}
                      name={name}
                      role={role}
                      team={team}
                      builderTitle={builderTitle}
                      builderTitleSub={builderTitleSub}
                      frameId={frameId}
                      style={style}
                      format={format}
                      generating={generating}
                      generatedImage={generatedImage}
                    />
                  </div>

                  {/* Preview note */}
                  {!generatedImage && (
                    <div style={{
                      marginTop: '0.75rem',
                      textAlign: 'center',
                      fontFamily: 'Space Mono, monospace',
                      fontSize: '0.55rem',
                      color: 'rgba(250,245,232,0.25)',
                      letterSpacing: '0.04em',
                    }}>
                      ↑ Approximate preview · Final image is higher quality
                    </div>
                  )}

                  {/* Mobile generate button (shows below preview on mobile) */}
                  {!generatedImage && (
                    <div className="show-mobile" style={{ marginTop: '1.5rem' }}>
                      <motion.button
                        className="btn btn-yellow btn-lg"
                        onClick={handleGenerate}
                        disabled={generating}
                        style={{ width: '100%', opacity: generating ? 0.7 : 1 }}
                      >
                        {generating ? 'BUILDING...' : '⚡ GENERATE MY ID'}
                      </motion.button>
                    </div>
                  )}
                  {generatedImage && !generating && (
                    <div className="show-mobile" style={{ marginTop: '1.5rem' }}>
                      <ActionBar imageUrl={generatedImage} name={name} role={role} onReset={handleReset} />
                    </div>
                  )}
                </motion.div>
              </div>
            </main>

            {/* ── FOOTER ── */}
            <footer style={{
              background: '#0f2a16',
              borderTop: '2px solid rgba(245,232,66,0.1)',
              padding: '1.5rem 2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}>
              <div style={{
                fontFamily: 'Playfair Display, serif',
                fontWeight: 900,
                fontStyle: 'italic',
                fontSize: '1rem',
                color: '#f5e842',
              }}>
                HH GOA 2026
              </div>
              <div style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: '0.55rem',
                color: 'rgba(250,245,232,0.25)',
                letterSpacing: '0.06em',
                textAlign: 'center',
              }}>
                Made with 🌴 for Hacker House Goa · #FrameInGoa
              </div>
              <div style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                fontWeight: 700,
                fontSize: '0.6rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'rgba(250,245,232,0.3)',
              }}>
                2:47 PM STUDIO
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Responsive CSS overrides */}
      <style>{`
        @media (max-width: 768px) {
          .studio-grid {
            grid-template-columns: 1fr !important;
          }
          .studio-grid > *:first-child {
            order: 2;
          }
          .studio-grid > *:last-child {
            order: 1;
          }
        }
      `}</style>
    </>
  );
}
