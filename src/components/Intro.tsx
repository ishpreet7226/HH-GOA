import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface IntroProps {
  onComplete: () => void;
}

// SVG Goa motifs
const SunSVG = () => (
  <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
    <circle cx="45" cy="45" r="24" fill="#f5e842" />
    {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg, i) => (
      <line
        key={i}
        x1={45 + 30 * Math.cos((deg * Math.PI) / 180)}
        y1={45 + 30 * Math.sin((deg * Math.PI) / 180)}
        x2={45 + 40 * Math.cos((deg * Math.PI) / 180)}
        y2={45 + 40 * Math.sin((deg * Math.PI) / 180)}
        stroke="#f5e842"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    ))}
  </svg>
);

const PalmSVG = ({ flip = false }: { flip?: boolean }) => (
  <svg
    width="60"
    height="100"
    viewBox="0 0 60 100"
    style={{ transform: flip ? 'scaleX(-1)' : 'none' }}
    fill="none"
  >
    <path d="M28 100 Q35 60 40 10" stroke="#4aad60" strokeWidth="3" fill="none" />
    <path d="M40 10 Q60 5 70 -10" stroke="#4aad60" strokeWidth="2.5" fill="none" />
    <path d="M40 10 Q20 0 10 -15" stroke="#4aad60" strokeWidth="2.5" fill="none" />
    <path d="M40 10 Q45 -10 38 -30" stroke="#4aad60" strokeWidth="2.5" fill="none" />
    <path d="M40 10 Q25 -15 30 -35" stroke="#4aad60" strokeWidth="2.5" fill="none" />
    <path d="M40 10 Q55 -20 65 -15" stroke="#4aad60" strokeWidth="2.5" fill="none" />
  </svg>
);

const WaveSVG = () => (
  <svg width="300" height="24" viewBox="0 0 300 24" fill="none">
    {[0, 50, 100, 150, 200, 250].map((x, i) => (
      <path
        key={i}
        d={`M${x} 12 Q${x + 12} 4 ${x + 25} 12 Q${x + 37} 20 ${x + 50} 12`}
        stroke="rgba(250,245,232,0.25)"
        strokeWidth="1.5"
        fill="none"
      />
    ))}
  </svg>
);

export function Intro({ onComplete }: IntroProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // Phase sequence: 0 → assemble → 1 → hold → 2 → exit
    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 1800);
    const t3 = setTimeout(() => onComplete(), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase < 2 && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            position: 'fixed',
            inset: 0,
            background: '#1a5c2a',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            overflow: 'hidden',
          }}
        >
          {/* Halftone dots */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'radial-gradient(circle, rgba(245,232,66,0.1) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }} />

          {/* Palm left */}
          <motion.div
            initial={{ x: -60, opacity: 0, rotate: -15 }}
            animate={{ x: 0, opacity: 1, rotate: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            style={{ position: 'absolute', left: '6%', bottom: '15%', animation: 'float-palm 4s ease-in-out infinite' }}
          >
            <PalmSVG />
          </motion.div>

          {/* Palm right */}
          <motion.div
            initial={{ x: 60, opacity: 0, rotate: 15 }}
            animate={{ x: 0, opacity: 1, rotate: 0 }}
            transition={{ delay: 0.15, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            style={{ position: 'absolute', right: '6%', bottom: '15%', animation: 'float-palm 4s ease-in-out infinite 2s' }}
          >
            <PalmSVG flip />
          </motion.div>

          {/* Waves */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            style={{ position: 'absolute', bottom: '10%' }}
          >
            <WaveSVG />
          </motion.div>

          {/* Sun */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.05, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            style={{ position: 'absolute', top: '12%', right: '12%' }}
          >
            <SunSVG />
          </motion.div>

          {/* Small editorial label top */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            style={{
              position: 'absolute', top: 28, left: 32,
              fontFamily: 'Space Mono, monospace',
              fontSize: '0.65rem',
              color: 'rgba(245,232,66,0.6)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            2:47 PM STUDIO
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            style={{
              position: 'absolute', top: 28, right: 32,
              fontFamily: 'Space Mono, monospace',
              fontSize: '0.65rem',
              color: 'rgba(245,232,66,0.6)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            GOA · INDIA
          </motion.div>

          {/* Main content */}
          <div style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
            {/* HH GOA large */}
            <div style={{ overflow: 'hidden', marginBottom: '0.1em' }}>
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ delay: 0.05, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{
                  fontFamily: 'Playfair Display, serif',
                  fontWeight: 900,
                  fontSize: 'clamp(3.5rem, 12vw, 8rem)',
                  color: '#f5e842',
                  lineHeight: 0.88,
                  letterSpacing: '-0.02em',
                }}
              >
                HACKER HOUSE
              </motion.div>
            </div>

            <div style={{ overflow: 'hidden', marginBottom: '0.6em' }}>
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ delay: 0.12, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{
                  fontFamily: 'Playfair Display, serif',
                  fontWeight: 900,
                  fontStyle: 'italic',
                  fontSize: 'clamp(3.5rem, 12vw, 8rem)',
                  color: '#f5e842',
                  lineHeight: 0.88,
                  letterSpacing: '-0.02em',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.3em',
                }}
              >
                GOA
                <motion.span
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.35, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                  style={{
                    display: 'inline-block',
                    background: '#f52d7e',
                    color: '#fff',
                    fontFamily: 'Barlow Condensed, sans-serif',
                    fontSize: 'clamp(1.2rem, 4vw, 2.5rem)',
                    fontStyle: 'normal',
                    fontWeight: 800,
                    padding: '0.1em 0.4em',
                    lineHeight: 1.1,
                    letterSpacing: '0.05em',
                  }}
                >
                  गोवा
                </motion.span>
              </motion.div>
            </div>

            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(0.75rem, 2vw, 1rem)',
                color: 'rgba(250,245,232,0.7)',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
              }}
            >
              — Identity Studio —
            </motion.div>
          </div>

          {/* Bottom tagline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            style={{
              position: 'absolute', bottom: 30,
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 600,
              fontSize: '0.7rem',
              color: 'rgba(245,232,66,0.5)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            OCT 28–31 · 2026
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
