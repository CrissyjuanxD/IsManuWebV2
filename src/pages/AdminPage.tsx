import React, { useState } from 'react';
import { useData, WishType } from '../context/DataContext';
import WishCard from '../components/WishCard';
import { toast } from 'react-toastify';
import {
  PauseCircle, PlayCircle, AlertTriangle, Search,
  List, ChevronLeft, Shield, Trash2, X, Save,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/* ── tiny helpers ─────────────────────────── */
const glass = (alpha = 0.07): React.CSSProperties => ({
  background: `rgba(255,255,255,${alpha})`,
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,255,255,0.12)',
});

const card: React.CSSProperties = {
  ...glass(0.06),
  borderRadius: 18,
  padding: '24px 28px',
  marginBottom: 24,
  boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
};

/* ── component ────────────────────────────── */
const AdminPage: React.FC = () => {
  const { wishes, deleteWish, editWish, isSubmissionPaused, toggleSubmission } = useData();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'mod' | 'vip'>('all');
  const [editingWish, setEditingWish] = useState<WishType | null>(null);
  const [showWishList, setShowWishList] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  /* ── search & filter — case-insensitive, trims accents for robustness ── */
  const normalize = (s: string) =>
    s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const filteredWishes = wishes.filter(wish => {
    const matchesFilter = filter === 'all' || wish.type === filter;
    const term = normalize(searchTerm.trim());
    const matchesSearch =
      !term ||
      normalize(wish.name).includes(term) ||
      normalize(wish.message).includes(term);
    return matchesFilter && matchesSearch;
  });

  /* ── handlers ── */
  const handleDelete = async (id: string) => {
    if (window.confirm('¿Eliminar esta felicitación?')) {
      const ok = await deleteWish(id);
      ok ? toast.success('Eliminada con éxito') : toast.error('No se pudo eliminar');
    }
  };

  const handleEdit = (id: string) => {
    const w = wishes.find(w => w.id === id);
    if (w) setEditingWish({ ...w });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingWish) {
      editWish(editingWish.id, editingWish);
      setEditingWish(null);
      toast.success('Felicitación actualizada');
    }
  };

  const scrollToWish = (id: string) => {
    const el = document.getElementById(`wish-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      el.classList.add('highlight-wish');
      setTimeout(() => el.classList.remove('highlight-wish'), 2000);
    }
  };

  /* ── derived ── */
  const modCount = wishes.filter(w => w.type === 'mod').length;
  const vipCount = wishes.filter(w => w.type === 'vip').length;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0d0d1a 0%, #0f1323 50%, #130d1a 100%)',
      padding: '40px 16px 80px',
      fontFamily: 'inherit',
    }}>
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .admin-fade { animation: fadeIn 0.3s ease both; }
        .highlight-wish { box-shadow: 0 0 0 3px #FF69B4 !important; transition: box-shadow 0.3s; }
        .wish-row:hover { background: rgba(255,255,255,0.06) !important; }
      `}</style>

      <div style={{ maxWidth: 860, margin: '0 auto' }}>

        {/* ── Top bar ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12,
              background: 'linear-gradient(135deg,#FF69B4,#c026d3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(255,105,180,0.4)',
            }}>
              <Shield size={20} color="#fff" />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.4px' }}>
                Panel de Administrador
              </h1>
              <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>IsManuPlay · Gestión de felicitaciones</p>
            </div>
          </div>

          <button onClick={() => navigate(-1)} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: 9, padding: '8px 16px',
            color: '#cbd5e1', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}>
            <ChevronLeft size={15} /> Volver
          </button>
        </div>

        {/* ── Stats row ── */}
        <div style={{ display: 'flex', gap: 14, marginBottom: 24, flexWrap: 'wrap' }}>
          {[
            { label: 'Total', value: wishes.length, color: '#FF69B4' },
            { label: 'Moderadores', value: modCount, color: '#32CD32' },
            { label: 'VIPs', value: vipCount, color: '#a78bfa' },
            { label: 'Estado', value: isSubmissionPaused ? 'Pausado' : 'Activo', color: isSubmissionPaused ? '#f59e0b' : '#34d399' },
          ].map(s => (
            <div key={s.label} style={{
              ...glass(0.07), borderRadius: 14, padding: '14px 20px',
              flex: 1, minWidth: 110,
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            }}>
              <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
                {s.label}
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* ── Controls card ── */}
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Controles
            </span>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {/* Lista */}
              <button onClick={() => setShowWishList(true)} style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)',
                borderRadius: 9, padding: '9px 16px',
                color: '#cbd5e1', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}>
                <List size={15} /> Lista
              </button>

              {/* Pause / Resume */}
              <button
                onClick={async () => {
                  try { await toggleSubmission(); }
                  catch (err) { toast.error(err instanceof Error ? err.message : 'Error'); }
                }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  background: isSubmissionPaused
                    ? 'linear-gradient(135deg,#22c55e,#16a34a)'
                    : 'linear-gradient(135deg,#ef4444,#dc2626)',
                  border: 'none',
                  borderRadius: 9, padding: '9px 18px',
                  color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  boxShadow: isSubmissionPaused ? '0 4px 14px rgba(34,197,94,0.35)' : '0 4px 14px rgba(239,68,68,0.35)',
                }}>
                {isSubmissionPaused
                  ? <><PlayCircle size={15} /> Activar</>
                  : <><PauseCircle size={15} /> Pausar</>}
              </button>
            </div>
          </div>

          {/* Paused warning */}
          {isSubmissionPaused && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)',
              borderRadius: 10, padding: '12px 16px', marginBottom: 20,
            }}>
              <AlertTriangle size={16} style={{ color: '#f59e0b', flexShrink: 0 }} />
              <p style={{ margin: 0, fontSize: 13, color: '#fcd34d' }}>
                Las felicitaciones están pausadas. Los usuarios no pueden enviar mensajes.
              </p>
            </div>
          )}

          {/* Search + Filter */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {/* Search */}
            <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
              <Search size={15} style={{
                position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                color: searchFocused ? '#FF69B4' : '#64748b', pointerEvents: 'none',
                transition: 'color 0.16s',
              }} />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre o mensaje..."
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                style={{
                  width: '100%', padding: '10px 14px 10px 36px',
                  background: 'rgba(255,255,255,0.06)',
                  border: `1.5px solid ${searchFocused ? '#FF69B480' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: 9, color: '#f1f5f9', fontSize: 14,
                  outline: 'none', boxSizing: 'border-box',
                  boxShadow: searchFocused ? '0 0 0 3px rgba(255,105,180,0.12)' : 'none',
                  transition: 'border-color 0.16s, box-shadow 0.16s',
                }}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  style={{
                    position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                    background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 4,
                    width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: '#94a3b8',
                  }}>
                  <X size={11} />
                </button>
              )}
            </div>

            {/* Filter */}
            <select
              value={filter}
              onChange={e => setFilter(e.target.value as 'all' | 'mod' | 'vip')}
              style={{
                padding: '10px 14px',
                background: 'rgba(255,255,255,0.06)',
                border: '1.5px solid rgba(255,255,255,0.1)',
                borderRadius: 9, color: '#f1f5f9', fontSize: 14,
                outline: 'none', cursor: 'pointer',
                minWidth: 140,
              }}>
              <option value="all" style={{ background: '#1e1e2e' }}>Todos ({wishes.length})</option>
              <option value="mod" style={{ background: '#1e1e2e' }}>Moderadores ({modCount})</option>
              <option value="vip" style={{ background: '#1e1e2e' }}>VIPs ({vipCount})</option>
            </select>
          </div>

          {/* Live result count */}
          {searchTerm.trim() && (
            <p style={{ margin: '10px 0 0', fontSize: 12, color: '#64748b' }}>
              {filteredWishes.length === 0
                ? 'Sin resultados para "'+ searchTerm +'"'
                : `${filteredWishes.length} resultado${filteredWishes.length !== 1 ? 's' : ''} para "${searchTerm}"`}
            </p>
          )}
        </div>

        {/* ── Wishes list ── */}
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 16 }}>
            Felicitaciones ({filteredWishes.length})
          </h2>

          {filteredWishes.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {filteredWishes.map(wish => (
                <div key={wish.id} id={`wish-${wish.id}`} className="admin-fade">
                  <WishCard
                    wish={wish}
                    isAdmin={true}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              ...glass(0.05), borderRadius: 16,
              padding: '48px 24px', textAlign: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            }}>
              <Search size={32} style={{ color: '#334155', marginBottom: 12 }} />
              <p style={{ margin: 0, color: '#64748b', fontSize: 15 }}>
                {searchTerm
                  ? `No hay resultados para "${searchTerm}"`
                  : 'No hay felicitaciones todavía.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ══ Modal: Lista de felicitaciones ══ */}
      {showWishList && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 50, padding: 16,
        }} onClick={() => setShowWishList(false)}>
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#13131f', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 18, padding: '24px', width: '100%', maxWidth: 480,
              maxHeight: '80vh', overflowY: 'auto',
              boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
            }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#f1f5f9' }}>
                Lista de Felicitaciones
              </h3>
              <button onClick={() => setShowWishList(false)} style={{
                background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 8,
                width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#94a3b8',
              }}>
                <X size={15} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {wishes.map(wish => {
                const isVip = wish.type === 'vip';
                const dotColor = isVip ? '#FF69B4' : '#32CD32';
                return (
                  <button
                    key={wish.id}
                    className="wish-row"
                    onClick={() => { scrollToWish(wish.id); setShowWishList(false); }}
                    style={{
                      width: '100%', textAlign: 'left',
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '10px 12px', borderRadius: 10,
                      background: 'transparent', border: 'none',
                      cursor: 'pointer', transition: 'background 0.14s',
                    }}>
                    <img
                      src={wish.image} alt={wish.name}
                      style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${dotColor}`, flexShrink: 0 }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {wish.name}
                      </p>
                      <p style={{ margin: 0, fontSize: 11, color: dotColor, fontWeight: 600 }}>
                        {isVip ? 'VIP / Manuriter' : 'Moderador'}
                      </p>
                    </div>
                    <ChevronLeft size={14} style={{ color: '#475569', transform: 'rotate(180deg)', flexShrink: 0 }} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ══ Modal: Editar felicitación ══ */}
      {editingWish && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 50, padding: 16,
        }} onClick={() => setEditingWish(null)}>
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#13131f', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 20, padding: '28px', width: '100%', maxWidth: 460,
              maxHeight: '90vh', overflowY: 'auto',
              boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
            }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#f1f5f9' }}>
                Editar Felicitación
              </h3>
              <button onClick={() => setEditingWish(null)} style={{
                background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 8,
                width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#94a3b8',
              }}>
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Nombre */}
              <EditField label="Nombre">
                <EditInput
                  value={editingWish.name}
                  onChange={e => setEditingWish({ ...editingWish, name: e.target.value })}
                  required
                />
              </EditField>

              {/* Tipo */}
              <EditField label="Tipo">
                <select
                  value={editingWish.type}
                  onChange={e => setEditingWish({ ...editingWish, type: e.target.value as 'mod' | 'vip' })}
                  style={editSelectStyle}>
                  <option value="mod" style={{ background: '#1e1e2e' }}>Moderador</option>
                  <option value="vip" style={{ background: '#1e1e2e' }}>VIP / Manuriter</option>
                </select>
              </EditField>

              {/* Mensaje */}
              <EditField label="Mensaje">
                <textarea
                  value={editingWish.message}
                  onChange={e => setEditingWish({ ...editingWish, message: e.target.value })}
                  required
                  style={{ ...editInputStyle, minHeight: 120, resize: 'vertical' }}
                />
              </EditField>

              {/* URL perfil */}
              <EditField label="URL imagen de perfil">
                <EditInput
                  type="url"
                  value={editingWish.image}
                  onChange={e => setEditingWish({ ...editingWish, image: e.target.value })}
                />
              </EditField>

              {/* URL media */}
              <EditField label="URL de media">
                <EditInput
                  type="url"
                  value={editingWish.mediaUrl}
                  onChange={e => setEditingWish({ ...editingWish, mediaUrl: e.target.value })}
                />
              </EditField>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                <button
                  type="button"
                  onClick={() => setEditingWish(null)}
                  style={{
                    flex: 1, padding: '11px', borderRadius: 10,
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#94a3b8', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  }}>
                  <X size={14} /> Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1, padding: '11px', borderRadius: 10,
                    background: 'linear-gradient(135deg,#FF69B4,#ff3fa0)',
                    border: 'none',
                    color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    boxShadow: '0 4px 14px rgba(255,105,180,0.35)',
                  }}>
                  <Save size={14} /> Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Edit modal helpers ─────────────────────── */
const editInputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 13px',
  background: 'rgba(255,255,255,0.05)',
  border: '1.5px solid rgba(255,255,255,0.1)',
  borderRadius: 9, color: '#f1f5f9', fontSize: 14,
  outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
};

const editSelectStyle: React.CSSProperties = {
  ...editInputStyle,
  cursor: 'pointer',
};

const EditInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => {
  const [f, setF] = React.useState(false);
  return (
    <input
      {...props}
      style={{
        ...editInputStyle,
        borderColor: f ? '#FF69B480' : 'rgba(255,255,255,0.1)',
        boxShadow: f ? '0 0 0 3px rgba(255,105,180,0.1)' : 'none',
      }}
      onFocus={() => setF(true)}
      onBlur={() => setF(false)}
    />
  );
};

const EditField: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
      {label}
    </label>
    {children}
  </div>
);

export default AdminPage;