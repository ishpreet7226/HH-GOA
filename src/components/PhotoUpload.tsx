import { useRef, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import heic2any from 'heic2any';

interface PhotoUploadProps {
  photo: string | null;
  onPhotoChange: (dataUrl: string) => void;
  onPhotoRemove: () => void;
}

export function PhotoUpload({ photo, onPhotoChange, onPhotoRemove }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const processFile = useCallback(async (file: File) => {
    if (!file) return;
    setError('');
    setLoading(true);

    try {
      let processedFile: File | Blob = file;

      // HEIC conversion
      if (file.type === 'image/heic' || file.type === 'image/heif' || file.name.toLowerCase().endsWith('.heic')) {
        processedFile = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.92 }) as Blob;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onPhotoChange(result);
        setLoading(false);
      };
      reader.onerror = () => {
        setError('Failed to read file.');
        setLoading(false);
      };
      reader.readAsDataURL(processedFile);
    } catch {
      setError('Could not process image. Try JPG or PNG.');
      setLoading(false);
    }
  }, [onPhotoChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  return (
    <div className="field-group">
      <label className="field-label">YOUR PHOTO</label>
      <AnimatePresence mode="wait">
        {photo ? (
          <motion.div
            key="photo-preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{ position: 'relative' }}
          >
            <div style={{
              width: '100%',
              aspectRatio: '4/3',
              overflow: 'hidden',
              border: '2px solid rgba(245,232,66,0.4)',
              position: 'relative',
            }}>
              <img
                src={photo}
                alt="Uploaded"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center top',
                  display: 'block',
                }}
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(15,42,22,0.6) 0%, transparent 40%)',
              }} />
              {/* Corner accents */}
              {[
                { top: 6, left: 6 }, { top: 6, right: 6 },
                { bottom: 6, left: 6 }, { bottom: 6, right: 6 }
              ].map((pos, i) => (
                <div key={i} style={{
                  position: 'absolute', ...pos,
                  width: 16, height: 16,
                  borderTop: i < 2 ? '2px solid #f5e842' : 'none',
                  borderBottom: i >= 2 ? '2px solid #f5e842' : 'none',
                  borderLeft: i % 2 === 0 ? '2px solid #f5e842' : 'none',
                  borderRight: i % 2 === 1 ? '2px solid #f5e842' : 'none',
                }} />
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onPhotoRemove}
              style={{
                position: 'absolute', top: 10, right: 10,
                background: '#f52d7e',
                border: '1.5px solid #0f2a16',
                color: '#fff',
                width: 28, height: 28,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Space Mono, monospace',
                fontSize: '0.75rem',
                cursor: 'pointer',
                boxShadow: '2px 2px 0 #0f2a16',
              }}
            >
              ✕
            </motion.button>
            <div style={{
              position: 'absolute', bottom: 8, left: 8,
              fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: '0.6rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'rgba(245,232,66,0.8)',
              background: 'rgba(15,42,22,0.7)',
              padding: '2px 6px',
            }}>
              PHOTO LOADED ✓
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="upload-zone"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            style={{ padding: '2rem 1.5rem', minHeight: 180 }}
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                style={{
                  width: 32, height: 32,
                  border: '3px solid rgba(245,232,66,0.2)',
                  borderTop: '3px solid #f5e842',
                  borderRadius: '50%',
                }}
              />
            ) : (
              <>
                <div style={{ fontSize: '2rem', marginBottom: '0.3rem' }}>☀</div>
                <div style={{
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'rgba(245,232,66,0.7)',
                  textAlign: 'center',
                }}>
                  Drop photo here
                </div>
                <div style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '0.62rem',
                  color: 'rgba(250,245,232,0.35)',
                  textAlign: 'center',
                  marginTop: '0.2rem',
                }}>
                  or click to browse
                </div>
                <div style={{
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontSize: '0.6rem',
                  color: 'rgba(250,245,232,0.2)',
                  letterSpacing: '0.1em',
                  textAlign: 'center',
                  marginTop: '0.3rem',
                  textTransform: 'uppercase',
                }}>
                  JPG · PNG · WEBP · HEIC
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      {error && (
        <div style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: '0.65rem',
          color: '#f52d7e',
          marginTop: '0.3rem',
        }}>
          ⚠ {error}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
        onChange={handleChange}
        style={{ display: 'none' }}
      />
    </div>
  );
}
