import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../context/DataContext';
import WishCard from '../components/WishCard';
import { Search, X } from 'lucide-react';

const VipsPage: React.FC = () => {
  const { wishes } = useData();
  const vipWishes = wishes.filter(wish => wish.type === 'vip');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWish, setSelectedWish] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedWish) {
      const element = document.getElementById(selectedWish);
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [selectedWish]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filteredWishes = vipWishes.filter(wish =>
    wish.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayWishes = searchTerm.trim() ? filteredWishes : vipWishes;

  const handleSelect = (id: string) => {
    setSelectedWish(id);
    setDropdownOpen(false);
    setSearchTerm('');
  };

  const clearSearch = () => {
    setSearchTerm('');
    setDropdownOpen(false);
    setSelectedWish(null);
  };

  return (
    <div className="min-h-screen bg-[url('https://res.cloudinary.com/dlcusrqqy/image/upload/v1749182597/fondovips_amxeiw.png')] bg-fixed bg-cover bg-center">
      <div className="bg-black/30 min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">

            {/* Header */}
            <div className="backdrop-blur-sm bg-white/30 rounded-xl p-6 mb-10 text-center">
              <h1 className="text-4xl font-bold mb-4 text-white">Felicitaciones de VIPs y Manuriters Reconocidos</h1>
              <p className="text-lg text-white/90">
                Aunque maltrates a tus queridos manuriters, también te han dejado unos lindos mensajitos.
              </p>
            </div>

            {/* Search */}
            <div ref={searchRef} style={{ position: 'relative', marginBottom: 32 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 0,
                background: 'rgba(10,10,20,0.72)',
                backdropFilter: 'blur(14px)',
                border: '1.5px solid rgba(255,105,180,0.35)',
                borderRadius: 14,
                boxShadow: '0 4px 24px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,105,180,0.1)',
                overflow: 'hidden',
              }}>
                <div style={{ paddingLeft: 16, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                  <Search size={18} style={{ color: '#FF69B4' }} />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => { setSearchTerm(e.target.value); setDropdownOpen(true); }}
                  onFocus={() => searchTerm && setDropdownOpen(true)}
                  placeholder="Buscar VIP o Manuriter por nombre..."
                  style={{
                    flex: 1, padding: '14px 12px',
                    background: 'transparent', border: 'none', outline: 'none',
                    color: '#fff', fontSize: 15, fontWeight: 600,
                  }}
                />
                {searchTerm && (
                  <button onClick={clearSearch} style={{
                    paddingRight: 14, background: 'transparent', border: 'none',
                    cursor: 'pointer', display: 'flex', alignItems: 'center',
                    color: '#64748b',
                  }}>
                    <X size={16} />
                  </button>
                )}
                <div style={{
                  padding: '8px 16px',
                  borderLeft: '1px solid rgba(255,105,180,0.2)',
                  background: 'rgba(255,105,180,0.1)',
                  color: '#FF69B4', fontSize: 12, fontWeight: 700,
                  whiteSpace: 'nowrap',
                }}>
                  {vipWishes.length} VIPs
                </div>
              </div>

              {/* Dropdown */}
              {dropdownOpen && searchTerm && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 50,
                  background: 'rgba(10,10,20,0.95)', backdropFilter: 'blur(16px)',
                  border: '1.5px solid rgba(255,105,180,0.3)',
                  borderRadius: 12,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                  overflow: 'hidden',
                  maxHeight: 280, overflowY: 'auto',
                }}>
                  {filteredWishes.length > 0 ? filteredWishes.map(wish => (
                    <button key={wish.id} onClick={() => handleSelect(wish.id)} style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      width: '100%', padding: '11px 16px',
                      background: 'transparent', border: 'none',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      cursor: 'pointer', textAlign: 'left',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,105,180,0.1)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <img src={wish.image} alt={wish.name} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #FF69B4', flexShrink: 0 }} />
                      <span style={{ color: '#f1f5f9', fontSize: 14, fontWeight: 600 }}>{wish.name}</span>
                      <span style={{ marginLeft: 'auto', fontSize: 11, color: '#475569' }}>
                        {new Date(wish.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                      </span>
                    </button>
                  )) : (
                    <div style={{ padding: '16px', color: '#64748b', fontSize: 14, textAlign: 'center' }}>
                      No se encontró ningún VIP con ese nombre.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Results label */}
            {searchTerm && (
              <div style={{ marginBottom: 16, color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600 }}>
                {filteredWishes.length} resultado{filteredWishes.length !== 1 ? 's' : ''} para "{searchTerm}"
              </div>
            )}

            {/* Cards */}
            {displayWishes.length > 0 ? (
              <div className="space-y-6">
                {displayWishes.map(wish => (
                  <div key={wish.id} id={wish.id}
                    style={selectedWish === wish.id ? { outline: '2px solid #FF69B4', borderRadius: 16, boxShadow: '0 0 0 4px rgba(255,105,180,0.2)' } : {}}>
                    <WishCard wish={wish} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white/90 rounded-xl">
                <p className="text-gray-500 text-lg">
                  {searchTerm ? 'No se encontraron VIPs con ese nombre.' : 'Aún no hay felicitaciones de VIPs y Manuriters Reconocidos.'}
                </p>
                {!searchTerm && <p className="text-gray-500">¡Sé el primero en dejar tu mensaje!</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VipsPage;