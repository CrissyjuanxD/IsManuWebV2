import React, { useState, useRef } from 'react';
import { useData } from '../context/DataContext';
import { toast } from 'react-toastify';
import { Send, User, MessageSquare, Upload, X, Image, Film } from 'lucide-react';

const WishForm: React.FC = () => {
  const { addWish, isSubmissionPaused } = useData();
  const [name, setName] = useState('');
  const [type, setType] = useState<'mod' | 'vip'>('mod');
  const [message, setMessage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 100 * 1024 * 1024) {
      toast.error('La imagen no puede superar los 100MB.');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 100 * 1024 * 1024) {
      toast.error('El archivo no puede superar los 100MB.');
      return;
    }
    setMediaFile(file);
    setMediaPreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview('');
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const clearMedia = () => {
    setMediaFile(null);
    setMediaPreview('');
    if (mediaInputRef.current) mediaInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmissionPaused) {
      toast.error('Las felicitaciones están pausadas temporalmente por el administrador.');
      return;
    }

    if (!name || !message) {
      toast.error('Por favor completa los campos obligatorios');
      return;
    }

    setIsSubmitting(true);

    try {
      const avatarUrl = imagePreview
        || `https://randomuser.me/api/portraits/${type === 'mod' ? 'men' : 'women'}/${Math.floor(Math.random() * 70) + 1}.jpg`;

      addWish({
        name,
        type,
        message,
        image: avatarUrl,
        mediaUrl: mediaPreview || '',
      });

      toast.success('¡Tu felicitación ha sido enviada con éxito!');

      setName('');
      setType('mod');
      setMessage('');
      clearImage();
      clearMedia();
    } catch (error) {
      toast.error('Error al enviar tu felicitación. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmissionPaused) {
    return (
      <div style={styles.pausedBanner}>
        <svg style={{ height: 20, width: 20, color: '#f59e0b', flexShrink: 0 }} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <p style={{ color: '#fcd34d', margin: 0, fontSize: 14 }}>
          Las felicitaciones están temporalmente deshabilitadas por el administrador.
        </p>
      </div>
    );
  }

  const isVideo = mediaFile?.type.startsWith('video/');

  return (
    <div style={styles.wrapper}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerGlow} />
        <h2 style={styles.title}>Añade tu felicitación</h2>
        <p style={styles.subtitle}>Deja tu mensaje para IsManuPlay 🧡</p>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>

        {/* Nombre */}
        <div style={styles.fieldGroup}>
          <label style={styles.label}>
            <User size={14} style={styles.labelIcon} />
            Nombre <span style={styles.required}>*</span>
          </label>
          <div style={styles.inputWrapper}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
              placeholder="Tu nombre o nick"
              required
              onFocus={e => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={e => Object.assign(e.target.style, styles.inputBlur)}
            />
          </div>
        </div>

        {/* Tipo */}
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Tipo de felicitación</label>
          <div style={styles.typeGrid}>
            {([
              { value: 'mod', label: 'Moderador', color: '#32CD32', desc: 'Staff del canal' },
              { value: 'vip', label: 'VIP / Manuriter Reconocido', color: '#FF69B4', desc: 'Fan especial' },
            ] as { value: 'mod' | 'vip'; label: string; color: string; desc: string }[]).map((opt) => (
              <label
                key={opt.value}
                style={{
                  ...styles.typeCard,
                  borderColor: type === opt.value ? opt.color : 'rgba(255,255,255,0.08)',
                  background: type === opt.value
                    ? `linear-gradient(135deg, ${opt.color}18 0%, ${opt.color}08 100%)`
                    : 'rgba(255,255,255,0.03)',
                  boxShadow: type === opt.value ? `0 0 18px ${opt.color}30` : 'none',
                }}
              >
                <input
                  type="radio"
                  value={opt.value}
                  checked={type === opt.value}
                  onChange={() => setType(opt.value)}
                  style={{ display: 'none' }}
                />
                <span style={{ ...styles.typeDot, background: opt.color, boxShadow: type === opt.value ? `0 0 8px ${opt.color}` : 'none' }} />
                <div>
                  <div style={{ ...styles.typeLabel, color: type === opt.value ? opt.color : '#cbd5e1' }}>
                    {opt.label}
                  </div>
                  <div style={styles.typeDesc}>{opt.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Foto de perfil */}
        <div style={styles.fieldGroup}>
          <label style={styles.label}>
            <User size={14} style={styles.labelIcon} />
            Foto de perfil <span style={styles.optional}>(opcional, máx 100MB)</span>
          </label>
          {!imagePreview ? (
            <div
              style={styles.dropZone}
              onClick={() => imageInputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = '#FF69B4'; }}
              onDragLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
              onDrop={e => {
                e.preventDefault();
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                const file = e.dataTransfer.files[0];
                if (file && file.type.startsWith('image/')) {
                  if (file.size <= 100 * 1024 * 1024) {
                    setImageFile(file);
                    setImagePreview(URL.createObjectURL(file));
                  }
                }
              }}
            >
              <Upload size={22} style={{ color: '#64748b', marginBottom: 8 }} />
              <span style={styles.dropText}>Arrastra o haz clic para subir</span>
              <span style={styles.dropSub}>PNG, JPG, WEBP</span>
              <input ref={imageInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
            </div>
          ) : (
            <div style={styles.previewBox}>
              <img src={imagePreview} alt="preview" style={styles.imagePreview} />
              <button type="button" onClick={clearImage} style={styles.clearBtn}>
                <X size={14} />
              </button>
              <span style={styles.previewName}>{imageFile?.name}</span>
            </div>
          )}
        </div>

        {/* Imagen o video */}
        <div style={styles.fieldGroup}>
          <label style={styles.label}>
            <Film size={14} style={styles.labelIcon} />
            Imagen o Video <span style={styles.optional}>(opcional, máx 100MB)</span>
          </label>
          {!mediaPreview ? (
            <div
              style={styles.dropZone}
              onClick={() => mediaInputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = '#FF69B4'; }}
              onDragLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
              onDrop={e => {
                e.preventDefault();
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                const file = e.dataTransfer.files[0];
                if (file && file.size <= 100 * 1024 * 1024) {
                  setMediaFile(file);
                  setMediaPreview(URL.createObjectURL(file));
                }
              }}
            >
              <Image size={22} style={{ color: '#64748b', marginBottom: 8 }} />
              <span style={styles.dropText}>Arrastra o haz clic para subir</span>
              <span style={styles.dropSub}>PNG, JPG, MP4, WEBM, OGG</span>
              <input ref={mediaInputRef} type="file" accept="image/*,video/*" style={{ display: 'none' }} onChange={handleMediaChange} />
            </div>
          ) : (
            <div style={styles.previewBox}>
              {isVideo ? (
                <video src={mediaPreview} style={styles.imagePreview} controls muted />
              ) : (
                <img src={mediaPreview} alt="media preview" style={styles.imagePreview} />
              )}
              <button type="button" onClick={clearMedia} style={styles.clearBtn}>
                <X size={14} />
              </button>
              <span style={styles.previewName}>{mediaFile?.name}</span>
            </div>
          )}
        </div>

        {/* Mensaje */}
        <div style={styles.fieldGroup}>
          <label style={styles.label}>
            <MessageSquare size={14} style={styles.labelIcon} />
            Mensaje <span style={styles.required}>*</span>
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={styles.textarea}
            placeholder="Escribe tu mensaje de felicitación..."
            required
            onFocus={e => Object.assign(e.target.style, styles.inputFocus)}
            onBlur={e => Object.assign(e.target.style, styles.inputBlur)}
          />
          <div style={styles.charCount}>{message.length} caracteres</div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            ...styles.submitBtn,
            opacity: isSubmitting ? 0.7 : 1,
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
          }}
        >
          <Send size={17} style={{ marginRight: 8 }} />
          {isSubmitting ? 'Enviando...' : 'Enviar Felicitación'}
        </button>
      </form>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    background: 'linear-gradient(145deg, #0f0f18 0%, #13131f 100%)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 32,
    boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
  },
  header: {
    position: 'relative',
    padding: '32px 32px 24px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    overflow: 'hidden',
  },
  headerGlow: {
    position: 'absolute',
    top: -60,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 320,
    height: 160,
    background: 'radial-gradient(ellipse at center, rgba(255,105,180,0.18) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  title: {
    margin: 0,
    fontSize: 26,
    fontWeight: 700,
    color: '#f1f5f9',
    textAlign: 'center',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    margin: '6px 0 0',
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
  },
  form: {
    padding: '28px 32px 32px',
    display: 'flex',
    flexDirection: 'column',
    gap: 22,
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: '#94a3b8',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    letterSpacing: '0.3px',
    textTransform: 'uppercase',
  },
  labelIcon: {
    color: '#FF69B4',
  },
  required: {
    color: '#FF69B4',
    marginLeft: 2,
  },
  optional: {
    color: '#475569',
    fontWeight: 400,
    textTransform: 'none',
    fontSize: 11,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10,
    color: '#f1f5f9',
    fontSize: 15,
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
  },
  inputFocus: {
    borderColor: '#FF69B4',
    boxShadow: '0 0 0 3px rgba(255,105,180,0.12)',
  },
  inputBlur: {
    borderColor: 'rgba(255,255,255,0.1)',
    boxShadow: 'none',
  },
  textarea: {
    width: '100%',
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10,
    color: '#f1f5f9',
    fontSize: 15,
    outline: 'none',
    resize: 'vertical',
    minHeight: 120,
    fontFamily: 'inherit',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
  },
  charCount: {
    fontSize: 11,
    color: '#475569',
    textAlign: 'right',
    marginTop: 2,
  },
  typeGrid: {
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap',
  },
  typeCard: {
    flex: 1,
    minWidth: 160,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '14px 16px',
    borderRadius: 12,
    border: '1.5px solid',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  typeDot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    flexShrink: 0,
    transition: 'box-shadow 0.2s',
  },
  typeLabel: {
    fontSize: 13,
    fontWeight: 700,
    transition: 'color 0.2s',
  },
  typeDesc: {
    fontSize: 11,
    color: '#475569',
    marginTop: 2,
  },
  dropZone: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '28px 20px',
    background: 'rgba(255,255,255,0.02)',
    border: '1.5px dashed rgba(255,255,255,0.1)',
    borderRadius: 12,
    cursor: 'pointer',
    transition: 'border-color 0.2s, background 0.2s',
    gap: 4,
  },
  dropText: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: 500,
  },
  dropSub: {
    fontSize: 12,
    color: '#475569',
  },
  previewBox: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.08)',
    background: '#0a0a14',
  },
  imagePreview: {
    width: '100%',
    maxHeight: 200,
    objectFit: 'cover',
    display: 'block',
  },
  clearBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    background: 'rgba(0,0,0,0.7)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 6,
    color: '#f1f5f9',
    width: 28,
    height: 28,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    backdropFilter: 'blur(4px)',
  },
  previewName: {
    display: 'block',
    padding: '8px 12px',
    fontSize: 12,
    color: '#64748b',
    background: 'rgba(0,0,0,0.4)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  submitBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '14px 28px',
    background: 'linear-gradient(135deg, #FF69B4 0%, #ff4da6 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'opacity 0.2s, transform 0.1s',
    boxShadow: '0 4px 20px rgba(255,105,180,0.35)',
    alignSelf: 'center',
    minWidth: 220,
    letterSpacing: '0.3px',
  },
  pausedBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    background: 'rgba(251,191,36,0.1)',
    border: '1px solid rgba(251,191,36,0.25)',
    borderRadius: 12,
    padding: '14px 18px',
    marginBottom: 24,
  },
};

export default WishForm;