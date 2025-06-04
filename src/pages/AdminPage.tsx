import React, { useState } from 'react';
import { useData, WishType } from '../context/DataContext';
import WishCard from '../components/WishCard';
import { toast } from 'react-toastify';
import { PauseCircle, PlayCircle, AlertTriangle, Search, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminPage: React.FC = () => {
  const { wishes, deleteWish, editWish, isSubmissionPaused, toggleSubmission } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'mod' | 'vip'>('all');
  const [editingWish, setEditingWish] = useState<WishType | null>(null);
  const [showWishList, setShowWishList] = useState(false);
  const navigate = useNavigate();
  
  // Filter and search wishes
  const filteredWishes = wishes.filter(wish => {
    const matchesFilter = filter === 'all' || wish.type === filter;
    const matchesSearch = wish.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          wish.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta felicitación?')) {
      deleteWish(id);
      toast.success('Felicitación eliminada con éxito');
    }
  };

  const handleEdit = (id: string) => {
    const wish = wishes.find(w => w.id === id);
    if (wish) {
      setEditingWish(wish);
    }
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingWish) {
      editWish(editingWish.id, editingWish);
      setEditingWish(null);
      toast.success('Felicitación actualizada con éxito');
    }
  };

  const scrollToWish = (id: string) => {
    const element = document.getElementById(`wish-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      element.classList.add('highlight-wish');
      setTimeout(() => element.classList.remove('highlight-wish'), 2000);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Panel de Administrador</h1>
          <button 
            onClick={() => navigate(-1)}
            className="btn btn-dark"
          >
            Volver
          </button>
        </div>
        
        {/* Admin Controls */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <h2 className="text-xl font-bold mb-4 md:mb-0">Controles</h2>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => setShowWishList(!showWishList)}
                className="btn btn-secondary flex items-center"
              >
                <List className="h-5 w-5 mr-2" />
                Lista de Felicitaciones
              </button>
              
              <button 
                onClick={toggleSubmission}
                className={`btn flex items-center ${isSubmissionPaused ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white`}
              >
                {isSubmissionPaused ? (
                  <>
                    <PlayCircle className="h-5 w-5 mr-2" />
                    Activar Felicitaciones
                  </>
                ) : (
                  <>
                    <PauseCircle className="h-5 w-5 mr-2" />
                    Pausar Felicitaciones
                  </>
                )}
              </button>
            </div>
          </div>
          
          {isSubmissionPaused && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Las felicitaciones están pausadas. Los usuarios no pueden enviar nuevos mensajes.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Wish List Modal */}
          {showWishList && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">Lista de Felicitaciones</h3>
                  <button 
                    onClick={() => setShowWishList(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-2">
                  {wishes.map(wish => (
                    <button
                      key={wish.id}
                      onClick={() => {
                        scrollToWish(wish.id);
                        setShowWishList(false);
                      }}
                      className="w-full text-left p-3 hover:bg-gray-100 rounded-lg flex items-center"
                    >
                      <img 
                        src={wish.image} 
                        alt={wish.name}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <p className="font-semibold">{wish.name}</p>
                        <p className="text-sm text-gray-500">
                          {wish.type === 'mod' ? 'Moderador' : 'VIP'}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-grow">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar felicitaciones..."
                  className="input-field pl-10"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'mod' | 'vip')}
                className="input-field"
              >
                <option value="all">Todos</option>
                <option value="mod">Moderadores</option>
                <option value="vip">VIPs</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Edit Modal */}
        {editingWish && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Editar Felicitación</h3>
              
              <form onSubmit={handleUpdate}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={editingWish.name}
                    onChange={(e) => setEditingWish({...editingWish, name: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Tipo
                  </label>
                  <select
                    value={editingWish.type}
                    onChange={(e) => setEditingWish({...editingWish, type: e.target.value as 'mod' | 'vip'})}
                    className="input-field"
                  >
                    <option value="mod">Moderador</option>
                    <option value="vip">VIP</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Mensaje
                  </label>
                  <textarea
                    value={editingWish.message}
                    onChange={(e) => setEditingWish({...editingWish, message: e.target.value})}
                    className="input-field min-h-[120px]"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    URL de imagen de perfil
                  </label>
                  <input
                    type="url"
                    value={editingWish.image}
                    onChange={(e) => setEditingWish({...editingWish, image: e.target.value})}
                    className="input-field"
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    URL de media
                  </label>
                  <input
                    type="url"
                    value={editingWish.mediaUrl}
                    onChange={(e) => setEditingWish({...editingWish, mediaUrl: e.target.value})}
                    className="input-field"
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button 
                    type="button"
                    onClick={() => setEditingWish(null)}
                    className="btn bg-gray-200 text-gray-800 hover:bg-gray-300"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="btn btn-primary"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Wishes List */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Gestionar Felicitaciones ({filteredWishes.length})</h2>
          
          {filteredWishes.length > 0 ? (
            <div>
              {filteredWishes.map(wish => (
                <div key={wish.id} id={`wish-${wish.id}`}>
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
            <div className="text-center py-12 bg-white rounded-xl shadow-md">
              <p className="text-gray-500 text-lg">No se encontraron felicitaciones.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;