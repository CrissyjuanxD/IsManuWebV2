import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { toast } from 'react-toastify';
import { Send, User, MessageSquare, Video, Upload, X, ChevronLeft, Calendar } from 'lucide-react';
import { handleMediaUpload, MediaFile } from '../utils/mediaHandler';

const TYPE_CONFIG = {
  mod: { color: '#32CD32', label: 'Moderador', bg: 'rgba(50,205,50,0.10)', border: 'rgba(50,205,50,0.35)', glow: 'rgba(50,205,50,0.12)' },
  vip: { color: '#FF69B4', label: 'VIP / Manuriter Reconocido', bg: 'rgba(255,105,180,0.10)', border: 'rgba(255,105,180,0.35)', glow: 'rgba(255,105,180,0.12)' },
};

/* ─── Hook: detect if viewport is narrow (mobile) ─── */
const useIsMobile = () => {
  const [mobile, setMobile] = React.useState(() => window.innerWidth < 640);
  React.useEffect(() => {
    const handler = () => setMobile(window.innerWidth < 640);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return mobile;
};

const NewWishPage: React.FC = () => {
  const { addWish, isSubmissionPaused } = useData();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [name, setName] = useState('');
  const [type, setType] = useState<'mod' | 'vip'>('mod');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [profileImage, setProfileImage] = useState<MediaFile | null>(null);
  const [media, setMedia] = useState<MediaFile | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);

  const profileImageRef = useRef<HTMLInputElement>(null);
  const mediaRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (
    file: File,
    setFile: (f: MediaFile | null) => void,
    setUploading: (v: boolean) => void
  ) => {
    setUploading(true);
    try {
      const mediaFile = await handleMediaUpload(file);
      if (mediaFile) setFile(mediaFile);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al procesar el archivo');
    } finally {
      setUploading(false);
    }
  }, []);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: (f: MediaFile | null) => void,
    setUploading: (v: boolean) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file, setFile, setUploading);
    e.target.value = '';
  };

  const clearFile = (setter: (f: MediaFile | null) => void, ref: React.RefObject<HTMLInputElement>) => {
    setter(null);
    if (ref.current) ref.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmissionPaused) { toast.error('Las felicitaciones están pausadas temporalmente.'); return; }
    if (!name || !message) { toast.error('Completa los campos obligatorios (Nombre y Mensaje)'); return; }
    if (!profileImage) { toast.error('La foto de perfil es obligatoria.'); return; }
    if (isUploadingImage || isUploadingMedia) { toast.warning('Espera a que terminen de subirse los archivos.'); return; }

    setIsSubmitting(true);
    try {
      await addWish({ name, type, message, image: profileImage.url, mediaUrl: media?.url || '' });
      toast.success('¡Tu felicitación ha sido enviada con éxito!');
      navigate('/');
    } catch (error) {
      toast.error(error instanceof Error ? `Error: ${error.message}` : 'Error desconocido al enviar.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const cfg = TYPE_CONFIG[type];
  const today = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });

  /* ─── Preview card (shared between layouts) ─── */
  const PreviewCard = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{
        fontSize: 11, fontWeight: 700, color: '#94a3b8',
        textTransform: 'uppercase', letterSpacing: '0.5px',
      }}>
        Vista previa
      </div>

      <div style={{
        background: 'linear-gradient(145deg, #0f0f18 0%, #13131f 100%)',
        border: `1px solid ${cfg.border}`,
        borderTop: `3px solid ${cfg.color}`,
        borderRadius: 14,
        padding: isMobile ? '16px' : '14px 16px',
        boxShadow: `0 6px 24px ${cfg.glow}`,
      }}>
        {/* Author row — badge lives here, no more absolute positioning */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12, gap: 10 }}>
          {/* Avatar */}
          <div style={{
            width: isMobile ? 48 : 42,
            height: isMobile ? 48 : 42,
            borderRadius: '50%',
            border: `2px solid ${cfg.color}`,
            overflow: 'hidden', flexShrink: 0,
            boxShadow: `0 0 10px ${cfg.glow}`,
            background: '#1e1e2e',
          }}>
            {profileImage
              ? <img src={profileImage.url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={18} style={{ color: '#475569' }} />
                </div>
            }
          </div>

          {/* Name + date + badge — stacked, never colliding */}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontSize: isMobile ? 14 : 13, fontWeight: 700, color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {name || <span style={{ color: '#475569', fontStyle: 'italic' }}>Tu nombre</span>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Calendar size={10} style={{ color: '#475569' }} />
                <span style={{ fontSize: 10, color: '#475569' }}>{today}</span>
              </div>
              {/* Badge inline, after date */}
              <div style={{
                background: cfg.bg, border: `1px solid ${cfg.border}`,
                color: cfg.color, fontSize: 9, fontWeight: 700,
                padding: '2px 7px', borderRadius: 20, whiteSpace: 'nowrap',
                lineHeight: 1.4,
              }}>
                {cfg.label}
              </div>
            </div>
          </div>
        </div>

        {/* Message — full on mobile, clamped on desktop sidebar */}
        <p style={{
          margin: 0, color: '#94a3b8',
          fontSize: isMobile ? 13 : 12,
          lineHeight: 1.65,
          whiteSpace: 'pre-line',
          wordBreak: 'break-word',
          ...(isMobile ? {} : {
            display: '-webkit-box',
            WebkitLineClamp: 6,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }),
        }}>
          {message || <span style={{ fontStyle: 'italic' }}>Tu mensaje aparecerá aquí...</span>}
        </p>

        {/* Media — full height on mobile */}
        {media && (
          <div style={{ marginTop: 12, borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
            {media.type === 'video'
              ? <video
                  src={media.url}
                  controls
                  style={{ width: '100%', display: 'block', maxHeight: isMobile ? 'none' : 100, objectFit: 'contain', background: '#0a0a14' }}
                />
              : <img
                  src={media.url}
                  alt="media"
                  style={{ width: '100%', display: 'block', maxHeight: isMobile ? 'none' : 100, objectFit: isMobile ? 'contain' : 'cover' }}
                />
            }
          </div>
        )}
      </div>

      <p style={{ margin: 0, fontSize: 11, color: '#94a3b8', lineHeight: 1.5, textAlign: 'center' }}>
        Así se verá tu felicitación publicada
      </p>
    </div>
  );

  /* ─── Form fields (same in both layouts) ─── */
  const FormFields = (
    <>
      {/* Nombre */}
      <Field label="Nombre" icon={<User size={12} style={{ color: '#FF69B4' }} />} required>
        <StyledInput value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre o nick" required />
      </Field>

      {/* Tipo */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <FieldLabel text="Tipo de felicitación" />
        <div style={{ display: 'flex', gap: 10, flexDirection: isMobile ? 'row' : 'column', flexWrap: 'wrap' }}>
          {(['mod', 'vip'] as const).map(v => {
            const c = TYPE_CONFIG[v];
            return (
              <label key={v} style={{
                flex: 1, minWidth: 130,
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '11px 14px', borderRadius: 10,
                border: `1.5px solid ${type === v ? c.color + '80' : 'rgba(0,0,0,0.1)'}`,
                background: type === v ? c.bg : 'rgba(255,255,255,0.5)',
                boxShadow: type === v ? `0 0 0 3px ${c.color}20` : 'none',
                cursor: 'pointer', transition: 'all 0.16s',
              }}>
                <input type="radio" value={v} checked={type === v} onChange={() => setType(v)} style={{ display: 'none' }} />
                <span style={{
                  width: 9, height: 9, borderRadius: '50%', flexShrink: 0,
                  background: type === v ? c.color : '#cbd5e1',
                  boxShadow: type === v ? `0 0 6px ${c.color}` : 'none',
                }} />
                <div style={{ fontSize: 12, fontWeight: 700, color: type === v ? c.color : '#475569' }}>{c.label}</div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Foto de perfil */}
      <Field label="Foto de perfil" icon={<User size={12} style={{ color: '#FF69B4' }} />} required>
        {!profileImage ? (
          <ImageDropZone
            loading={isUploadingImage}
            onClick={() => profileImageRef.current?.click()}
            onFileDrop={f => processFile(f, setProfileImage, setIsUploadingImage)}
            accept="image/*"
          />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'rgba(255,255,255,0.6)', borderRadius: 10, border: '1.5px solid rgba(0,0,0,0.08)' }}>
            <img src={profileImage.url} alt="avatar"
              style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${cfg.color}`, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#334155', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                Foto cargada
              </div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>{(profileImage.size / (1024 * 1024)).toFixed(2)} MB</div>
            </div>
            <button type="button" onClick={() => clearFile(setProfileImage, profileImageRef)}
              style={{ background: 'rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 6, width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b', flexShrink: 0 }}>
              <X size={12} />
            </button>
          </div>
        )}
        <input ref={profileImageRef} type="file" accept="image/*" style={{ display: 'none' }}
          onChange={e => handleFileChange(e, setProfileImage, setIsUploadingImage)} />
      </Field>

      {/* Media */}
      <Field label="Imagen o Video" icon={<Video size={12} style={{ color: '#FF69B4' }} />} optional>
        {!media ? (
          <MediaDropZone
            loading={isUploadingMedia}
            onClick={() => mediaRef.current?.click()}
            onFileDrop={f => processFile(f, setMedia, setIsUploadingMedia)}
            accept="image/*,video/mp4,video/webm,video/ogg"
          />
        ) : (
          <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', border: '1.5px solid rgba(0,0,0,0.08)' }}>
            {media.type === 'video'
              ? <video src={media.url} controls style={{ width: '100%', maxHeight: 160, display: 'block' }} />
              : <img src={media.url} alt="media" style={{ width: '100%', maxHeight: 160, objectFit: 'cover', display: 'block' }} />
            }
            <button type="button" onClick={() => clearFile(setMedia, mediaRef)}
              style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 6, width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#475569' }}>
              <X size={12} />
            </button>
            <span style={{ display: 'block', padding: '5px 10px', fontSize: 11, color: '#64748b', background: 'rgba(255,255,255,0.7)' }}>
              {(media.size / (1024 * 1024)).toFixed(2)} MB
            </span>
          </div>
        )}
        <input ref={mediaRef} type="file" accept="image/*,video/mp4,video/webm,video/ogg"
          style={{ display: 'none' }}
          onChange={e => handleFileChange(e, setMedia, setIsUploadingMedia)} />
      </Field>

      {/* Mensaje */}
      <Field label="Mensaje" icon={<MessageSquare size={12} style={{ color: '#FF69B4' }} />} required>
        <StyledTextarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Escribe tu mensaje de felicitación..." required />
        <div style={{ fontSize: 11, color: '#94a3b8', textAlign: 'right', marginTop: 3 }}>{message.length} caracteres</div>
      </Field>
    </>
  );

  const SubmitBtn = (
    <button type="submit"
      disabled={isSubmitting || isUploadingImage || isUploadingMedia}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        padding: '14px 28px',
        background: 'linear-gradient(135deg, #FF69B4 0%, #ff3fa0 100%)',
        color: '#fff', border: 'none', borderRadius: 12,
        fontSize: 14, fontWeight: 800,
        cursor: (isSubmitting || isUploadingImage || isUploadingMedia) ? 'not-allowed' : 'pointer',
        opacity: (isSubmitting || isUploadingImage || isUploadingMedia) ? 0.6 : 1,
        boxShadow: '0 5px 18px rgba(255,105,180,0.35)',
        letterSpacing: '0.2px',
        width: '100%',
        boxSizing: 'border-box' as const,
      }}>
      <Send size={15} />
      {isSubmitting ? 'Enviando...' : (isUploadingImage || isUploadingMedia) ? 'Subiendo...' : 'Enviar Felicitación'}
    </button>
  );

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: 'url(https://res.cloudinary.com/dlcusrqqy/image/upload/v1749185199/enviarf_manuweb_qipk4i.jpg)',
      backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed',
      display: 'flex', flexDirection: 'column',
    }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ position: 'relative', zIndex: 1, padding: '40px 16px 60px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        {/* Back button */}
        <div style={{ width: '100%', maxWidth: 680, marginBottom: 16 }}>
          <button onClick={() => navigate('/')} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.4)',
            borderRadius: 8, padding: '7px 14px',
            color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            textShadow: '0 1px 3px rgba(0,0,0,0.3)',
          }}>
            <ChevronLeft size={15} /> Volver
          </button>
        </div>

        {/* Card wrapper */}
        <div style={{
          width: '100%', maxWidth: 680,
          background: 'rgba(248,248,250,0.82)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.6)',
          borderRadius: 22,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.1)',
        }}>

          {/* Header */}
          <div style={{
            position: 'relative', padding: '32px 36px 26px',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
            overflow: 'hidden',
            background: 'rgba(255,255,255,0.5)',
          }}>
            <div style={{
              position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)',
              width: 380, height: 180,
              background: 'radial-gradient(ellipse at center, rgba(255,105,180,0.18) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#0f172a', textAlign: 'center', letterSpacing: '-0.5px' }}>
              Añade tu felicitación
            </h2>
            <p style={{ margin: '7px 0 0', fontSize: 13, color: '#64748b', textAlign: 'center' }}>
              Deja tu mensaje especial para IsManuPlay 🧡
            </p>
          </div>

          {/* ── DESKTOP: two columns ── */}
          {!isMobile && (
            <div style={{ display: 'flex' }}>
              {/* Form column */}
              <form onSubmit={handleSubmit} style={{
                flex: 1, padding: '28px 32px 32px',
                display: 'flex', flexDirection: 'column', gap: 20,
                borderRight: '1px solid rgba(0,0,0,0.06)',
              }}>
                {FormFields}
                {SubmitBtn}
              </form>

              {/* Preview column */}
              <div style={{ width: 260, flexShrink: 0, padding: '28px 20px 32px' }}>
                {PreviewCard}
              </div>
            </div>
          )}

          {/* ── MOBILE: single column, preview between message and submit ── */}
          {isMobile && (
            <form onSubmit={handleSubmit} style={{
              padding: '24px 18px 28px',
              display: 'flex', flexDirection: 'column', gap: 20,
            }}>
              {FormFields}

              {/* Preview sits here, above the submit button */}
              <div style={{
                background: 'rgba(0,0,0,0.04)',
                borderRadius: 14,
                padding: '16px',
                border: '1px solid rgba(0,0,0,0.08)',
              }}>
                {PreviewCard}
              </div>

              {SubmitBtn}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── Drop zones ─────────────────────────────────── */

const ImageDropZone: React.FC<{ loading: boolean; onClick: () => void; onFileDrop: (f: File) => void; accept: string }> = ({ loading, onClick, onFileDrop }) => {
  const [drag, setDrag] = React.useState(false);
  return (
    <div
      onClick={onClick}
      onDragOver={e => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={e => {
        e.preventDefault(); setDrag(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) onFileDrop(file);
        else toast.error('Solo se aceptan imágenes aquí.');
      }}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 6, padding: '20px 16px',
        background: drag ? 'rgba(255,105,180,0.07)' : 'rgba(255,255,255,0.45)',
        border: `1.5px dashed ${drag ? '#FF69B4' : 'rgba(0,0,0,0.18)'}`,
        borderRadius: 10, cursor: 'pointer', transition: 'all 0.16s',
      }}>
      {loading
        ? <Spinner color="#FF69B4" />
        : <>
            <Upload size={20} style={{ color: '#94a3b8' }} />
            <span style={{ fontSize: 13, color: '#475569', fontWeight: 500 }}>Arrastra o haz clic</span>
            <span style={{ fontSize: 11, color: '#94a3b8' }}>PNG, JPG, WEBP · Máx. 100MB</span>
          </>
      }
    </div>
  );
};

const MediaDropZone: React.FC<{ loading: boolean; onClick: () => void; onFileDrop: (f: File) => void; accept: string }> = ({ loading, onClick, onFileDrop }) => {
  const [drag, setDrag] = React.useState(false);
  return (
    <div
      onClick={onClick}
      onDragOver={e => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={e => {
        e.preventDefault(); setDrag(false);
        const file = e.dataTransfer.files[0];
        if (file) onFileDrop(file);
      }}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 6, padding: '20px 16px',
        background: drag ? 'rgba(255,105,180,0.07)' : 'rgba(255,255,255,0.45)',
        border: `1.5px dashed ${drag ? '#FF69B4' : 'rgba(0,0,0,0.18)'}`,
        borderRadius: 10, cursor: 'pointer', transition: 'all 0.16s',
      }}>
      {loading
        ? <Spinner color="#FF69B4" />
        : <>
            <Upload size={20} style={{ color: '#94a3b8' }} />
            <span style={{ fontSize: 13, color: '#475569', fontWeight: 500 }}>Arrastra o haz clic</span>
            <span style={{ fontSize: 11, color: '#94a3b8' }}>PNG, JPG, MP4, WEBM · Máx. 100MB</span>
          </>
      }
    </div>
  );
};

const Spinner: React.FC<{ color: string }> = ({ color }) => (
  <div style={{ width: 22, height: 22, borderRadius: '50%', border: `2.5px solid ${color}30`, borderTopColor: color, animation: 'spin 0.8s linear infinite' }} />
);

/* ─── Form helpers ───────────────────────────────── */

const FieldLabel: React.FC<{ text: string }> = ({ text }) => (
  <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{text}</span>
);

const Field: React.FC<{ label: string; icon?: React.ReactNode; required?: boolean; optional?: boolean; children: React.ReactNode }> = ({ label, icon, required, optional, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
    <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
      {icon}{label}
      {required && <span style={{ color: '#FF69B4' }}>*</span>}
      {optional && <span style={{ color: '#94a3b8', fontWeight: 400, textTransform: 'none', fontSize: 11 }}>(opcional)</span>}
    </label>
    {children}
  </div>
);

const inputBase: React.CSSProperties = {
  width: '100%', padding: '10px 14px',
  background: 'rgba(255,255,255,0.6)',
  border: '1.5px solid rgba(0,0,0,0.12)',
  borderRadius: 9, color: '#0f172a', fontSize: 14,
  outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
  transition: 'border-color 0.16s, box-shadow 0.16s, background 0.16s',
};

const StyledInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => {
  const [f, setF] = React.useState(false);
  return <input {...props} style={{ ...inputBase, borderColor: f ? '#FF69B4' : 'rgba(0,0,0,0.12)', boxShadow: f ? '0 0 0 3px rgba(255,105,180,0.12)' : 'none', background: f ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)' }} onFocus={() => setF(true)} onBlur={() => setF(false)} />;
};

const StyledTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => {
  const [f, setF] = React.useState(false);
  return <textarea {...props} style={{ ...inputBase, minHeight: 110, resize: 'vertical', borderColor: f ? '#FF69B4' : 'rgba(0,0,0,0.12)', boxShadow: f ? '0 0 0 3px rgba(255,105,180,0.12)' : 'none', background: f ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)' }} onFocus={() => setF(true)} onBlur={() => setF(false)} />;
};

export default NewWishPage;