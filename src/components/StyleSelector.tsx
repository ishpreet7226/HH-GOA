import { motion } from 'framer-motion';
import type { StyleId } from '../utils/canvasGenerator';

const STYLES = [{ id: 'goa-classic' as StyleId, name: 'GOA CLASSIC', sub: 'Retro travel poster', icon: '🌴' }];

interface StyleSelectorProps { value: StyleId; onChange: (style: StyleId) => void; }

export function StyleSelector({ value, onChange }: StyleSelectorProps) {
  return (
    <div className="field-group">
      <label className="field-label">VISUAL STYLE</label>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' }}>
        {STYLES.map((style) => (
          <motion.button key={style.id} className={`style-btn ${value === style.id ? 'active' : ''}`}
            onClick={() => onChange(style.id)} whileTap={{ scale: 0.98 }}
            style={{ background: value === style.id ? 'var(--surface-elevated)' : 'transparent', borderColor: value === style.id ? 'var(--yellow)' : 'var(--border-subtle)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ width: '100%', height: 36, background: '#f0e6c8', border: '1px solid #111312', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 6px', marginBottom: 8 }}>
              <div style={{ width: 16, height: 4, background: '#e5245e' }} />
              <span style={{ fontSize: '0.8rem' }}>{style.icon}</span>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#eebb22' }} />
            </div>
            <div style={{ fontFamily: 'var(--font-cond)', fontWeight: 700, fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: value === style.id ? 'var(--text-primary)' : 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.2 }}>{style.name}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color: value === style.id ? 'var(--yellow)' : 'var(--text-tertiary)', textAlign: 'center', marginTop: 4, letterSpacing: '0.05em' }}>{style.sub}</div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
