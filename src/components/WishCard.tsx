import React, { useState } from 'react';
import { WishType } from '../context/DataContext';
import { Eye, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface WishCardProps {
  wish: WishType;
  isAdmin?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onPrevious?: () => void;
  onNext?: () => void;
  showNavigation?: boolean;
}

const TYPE_CONFIG = {
  mod: {
    color: '#32CD32',
    label: 'Moderador',
    bg: 'rgba(50,205,50,0.12)',
    border: 'rgba(50,205,50,0.3)',
    glow: 'rgba(50,205,50,0.15)',
  },
  vip: {
    color: '#FF69B4',
    label: 'VIP / Manuriter Reconocido',
    bg: 'rgba(255,105,180,0.12)',
    border: 'rgba(255,105,180,0.3)',
    glow: 'rgba(255,105,180,0.15)',
  },
};

const WishCard: React.FC<WishCardProps> = ({
  wish,
  isAdmin = false,
  onEdit,
  onDelete,
  onPrevious,
  onNext,
  showNavigation = false,
}) => {
  const [isMediaExpanded, setIsMediaExpanded] = useState(false);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isVideo =
    wish.mediaUrl?.match(/\.(mp4|webm|ogg)$/i) ||
    (wish.mediaUrl?.includes('blob:') && wish.mediaUrl?.startsWith('blob:'));

  const cfg = TYPE_CONFIG[wish.type] ?? TYPE_CONFIG.vip;

  return (
    <div
      style={{
        background: 'linear-gradient(145deg, #0f0f18 0%, #13131f 100%)',
        border: `1px solid ${cfg.border}`,
        borderTop: `3px solid ${cfg.color}`,
        borderRadius: 16,
        marginBottom: 20,
        position: 'relative',
        overflow: 'visible',
        boxShadow: `0 8px 32px ${cfg.glow}, 0 2px 8px rgba(0,0,0,0.4)`,
        padding: '20px 22px',
      }}
    >
      {/* Badge */}
      <div
        style={{
          position: 'absolute',
          top: 14,
          right: 14,
          background: cfg.bg,
          border: `1px solid ${cfg.border}`,
          color: cfg.color,
          fontSize: 11,
          fontWeight: 700,
          padding: '4px 10px',
          borderRadius: 20,
          letterSpacing: '0.3px',
          backdropFilter: 'blur(4px)',
          whiteSpace: 'nowrap',
        }}
      >
        {cfg.label}
      </div>

      {/* Navigation arrows */}
      {showNavigation && (
        <>
          <button
            onClick={onPrevious}
            style={{
              position: 'absolute',
              left: -20,
              top: '50%',
              transform: 'translateY(-50%)',
              background: '#1e1e2e',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '50%',
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#94a3b8',
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            }}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={onNext}
            style={{
              position: 'absolute',
              right: -20,
              top: '50%',
              transform: 'translateY(-50%)',
              background: '#1e1e2e',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '50%',
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#94a3b8',
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            }}
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}

      {/* Author row */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16, paddingRight: 120 }}>
        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: '50%',
            border: `2px solid ${cfg.color}`,
            overflow: 'hidden',
            flexShrink: 0,
            boxShadow: `0 0 12px ${cfg.glow}`,
          }}
        >
          <img
            src={wish.image}
            alt={wish.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>
        <div style={{ marginLeft: 14 }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.3px' }}>
            {wish.name}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 3 }}>
            <Calendar size={12} style={{ color: '#475569' }} />
            <span style={{ fontSize: 12, color: '#475569' }}>{formatDate(wish.date)}</span>
          </div>
        </div>
      </div>

      {/* Message */}
      <div style={{ marginBottom: wish.mediaUrl ? 16 : 0 }}>
        <p
          style={{
            margin: 0,
            color: '#cbd5e1',
            fontSize: 15,
            lineHeight: 1.65,
            whiteSpace: 'pre-line',
          }}
        >
          {wish.message}
        </p>
      </div>

      {/* Media */}
      {wish.mediaUrl && (
        <div style={{ marginBottom: isAdmin ? 16 : 0 }}>
          {isVideo ? (
            <div
              style={{
                borderRadius: 10,
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <video
                src={wish.mediaUrl}
                style={{ width: '100%', display: 'block' }}
                controls
                controlsList="nodownload"
                preload="metadata"
                playsInline
              >
                Tu navegador no soporta la reproducción de videos.
              </video>
            </div>
          ) : (
            <div
              style={{
                position: 'relative',
                borderRadius: 10,
                overflow: 'hidden',
                cursor: 'pointer',
                border: '1px solid rgba(255,255,255,0.08)',
                height: isMediaExpanded ? 'auto' : 200,
              }}
              onClick={() => setIsMediaExpanded(!isMediaExpanded)}
            >
              <img
                src={wish.mediaUrl}
                alt="Media content"
                style={{
                  width: '100%',
                  height: isMediaExpanded ? 'auto' : '100%',
                  objectFit: isMediaExpanded ? 'contain' : 'cover',
                  display: 'block',
                }}
              />
              {!isMediaExpanded && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(0,0,0,0.35)',
                    transition: 'background 0.2s',
                  }}
                >
                  <div
                    style={{
                      background: 'rgba(255,255,255,0.15)',
                      backdropFilter: 'blur(6px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: 30,
                      padding: '8px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      color: '#fff',
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    <Eye size={15} />
                    Ver completo
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Admin actions */}
      {isAdmin && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
          <button
            onClick={() => onEdit && onEdit(wish.id)}
            style={{
              padding: '6px 16px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 8,
              color: '#94a3b8',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Editar
          </button>
          <button
            onClick={() => onDelete && onDelete(wish.id)}
            style={{
              padding: '6px 16px',
              background: 'rgba(239,68,68,0.12)',
              border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: 8,
              color: '#f87171',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Eliminar
          </button>
        </div>
      )}
    </div>
  );
};

export default WishCard;