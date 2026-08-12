import { motion } from 'framer-motion';
import type { StyleId } from '../utils/canvasGenerator';

interface StyleConfig {
  id: StyleId;
  name: string;
  sub: string;
  bg: string;
  accent: string;
  text: string;
  border: string;
  icon: string;
}

const STYLES: StyleConfig[] = [
  {
    id: 'goa-classic',
    name: 'GOA CLASSIC',
    sub: 'Retro travel poster',
    bg: '#faf5e8',
    accent: '#1a5c2a',
    text: '#1a5c2a',
    border: '#1a5c2a',
    icon: '🌴',
  },
  {
    id: 'night-shift',
    name: 'NIGHT SHIFT',
    sub: 'Hacker atmosphere',
    bg: '#0f2a16',
    accent: '#f5e842',
    text: '#f5e842',
    border: '#f5e842',
    icon: '🌙',
  },
  {
    id: 'sunset-builder',
    name: 'SUNSET BUILDER',
    sub: 'Goa celebration',
    bg: '#faf5e8',
    accent: '#f52d7e',
    text: '#f52d7e',
    border: '#f52d7e',
    icon: '🌅',
  },
];

interface StyleSelectorProps {
  value: StyleId;
  onChange: (style: StyleId) => void;
}

export function StyleSelector({ value, onChange }: StyleSelectorProps) {
  return (
    <div className="field-group">
      <label className="field-label">VISUAL STYLE</label>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
        {STYLES.map((style) => (
          <motion.button
            key={style.id}
            className={`style-btn ${value === style.id ? 'active' : ''}`}
            onClick={() => onChange(style.id)}
            whileTap={{ scale: 0.97 }}
            style={{
              background: value === style.id ? style.bg : 'rgba(255,255,255,0.03)',
              borderColor: value === style.id ? style.border : 'rgba(245,232,66,0.2)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Mini preview swatch */}
            <div style={{
              width: '100%',
              height: 36,
              background: style.bg,
              border: `2px solid ${style.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 6px',
              marginBottom: 6,
            }}>
              <div style={{
                width: 20, height: 8,
                background: style.accent,
              }} />
              <span style={{ fontSize: '0.9rem' }}>{style.icon}</span>
              <div style={{
                width: 8, height: 8,
                borderRadius: '50%',
                background: style.text,
              }} />
            </div>

            <div style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 800,
              fontSize: '0.6rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: value === style.id ? style.text : 'rgba(250,245,232,0.6)',
              textAlign: 'center',
              lineHeight: 1.2,
            }}>
              {style.name}
            </div>
            <div style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '0.5rem',
              color: value === style.id ? style.text : 'rgba(250,245,232,0.35)',
              textAlign: 'center',
              marginTop: 2,
              opacity: 0.8,
            }}>
              {style.sub}
            </div>

            {value === style.id && (
              <motion.div
                layoutId="style-active"
                style={{
                  position: 'absolute',
                  inset: 0,
                  border: `2px solid ${style.border}`,
                  pointerEvents: 'none',
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
