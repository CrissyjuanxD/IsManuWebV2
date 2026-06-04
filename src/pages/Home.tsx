import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Plus } from 'lucide-react';

const Home: React.FC = () => {
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAdminAccess = () => {
    if (password === 'KARU_MANDARINO777') {
      navigate('/admin');
      setShowAdminModal(false);
      setPassword('');
      setError('');
    } else {
      setError('Contraseña incorrecta');
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-[url('https://res.cloudinary.com/dlcusrqqy/image/upload/v1749184330/fondoprincipal_manuweb_mvypwg.png')] bg-fixed bg-cover bg-center bg-no-repeat">
      <div className="bg-gradient-to-b from-black/60 to-black/10 h-full relative flex flex-col justify-center">
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            
            {/* Título */}
            <div className="flex items-center justify-center mb-3">
              <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-md mr-3">
                ¡Feliz Cumpleaños Manuel!
              </h1>
              <img 
                src="https://res.cloudinary.com/dlcusrqqy/image/upload/v1749184519/palito_manuweb_p3oglm.png" 
                alt="Manuelin" 
                className="w-12 h-12 md:w-16 md:h-16 rounded-full border-4 border-white shadow-lg flex-shrink-0"
              />
            </div>

            {/* Descripción */}
            <p className="text-base md:text-lg mb-6 text-white/90 leading-snug">
              Ya que es un día especial, decidí prepararte una sorpresa junto con algunos Mods, VIPs y Manuriters del canal. Espero disfrutes los mensajitos 🧡
              <br />
              <span className="text-sm opacity-75">PD: NO presiones el #MANUCUM morado!!</span>
            </p>
            
            {/* Botones de navegación */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 mb-6">
              <Link to="/mods" className="btn btn-dark">
                Felicitaciones Mods
              </Link>
              <Link to="/vips" className="btn bg-white text-primary hover:bg-gray-100">
                Felicitaciones VIPs Y Manuriters Reconocidos
              </Link>
            </div>

            {/* Botón destacado de Añadir Felicitación */}
            <div className="flex flex-col items-center gap-1">
              <p className="text-white/80 text-sm font-medium">¿Quieres dejarle un mensaje?</p>
              <Link 
                to="/new-wish"
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold px-6 py-3 rounded-full shadow-lg hover:shadow-orange-500/40 transition-all text-base border-2 border-white/30"
              >
                <Plus className="h-5 w-5" />
                ¡Añadir Felicitación!
              </Link>
            </div>

          </div>
        </div>

        {/* ADM escondido en esquina inferior izquierda */}
        <div className="absolute bottom-4 left-4">
          <button 
            onClick={() => setShowAdminModal(true)}
            className="bg-black/30 hover:bg-black/50 text-white/50 hover:text-white text-xs px-2 py-1 rounded flex items-center transition-all"
          >
            <Lock className="h-3 w-3 mr-1" />
            ADM
          </button>
        </div>

      </div>
      
      {/* Admin Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Acceso de Administrador</h3>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdminAccess()}
                className="input-field"
                placeholder="Ingresa la contraseña"
              />
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowAdminModal(false)}
                className="btn bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button 
                onClick={handleAdminAccess}
                className="btn btn-primary"
              >
                Acceder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;