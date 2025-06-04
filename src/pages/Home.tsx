import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

const Home: React.FC = () => {
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAdminAccess = () => {
    if (password === 'Guillen14xD') {
      navigate('/admin');
      setShowAdminModal(false);
      setPassword('');
      setError('');
    } else {
      setError('Contraseña incorrecta');
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-[url('https://media.discordapp.net/attachments/747301509359992834/1260066022682005576/Untitled236_20240708212219.png?ex=68405dae&is=683f0c2e&hm=0846631b3824b69a259d1e8ab12f85b50f6b9e07820d14de34e301321d27c690&=&format=webp&quality=lossless&width=742&height=544')] bg-fixed bg-cover bg-center bg-no-repeat">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary/50 to-secondary/50 h-full py-16 md:py-24 relative overflow-hidden flex flex-col justify-center">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-md mr-4">
                ¡Feliz Cumpleaños Manuel!
              </h1>
              <img 
                src="https://cdn.discordapp.com/attachments/1180691474262798495/1379626632435994634/1058_sin_titulo_20240606143716.png?ex=6840eced&is=683f9b6d&hm=1a02b84cdc0e3a4bb69d43abc76287e2640368b6b818a03ea5d7086c0abc85be&" 
                alt="Manuelin" 
                className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white shadow-lg"
              />
            </div>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Ya que es un día especial, decidí prepararte una sorpresa junto con algunos mods y VIPs del canal. Espero que disfrutes los mensajitos 🧡
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/mods" className="btn btn-dark">
                Felicitaciones Mods
              </Link>
              <Link to="/vips" className="btn bg-white text-primary hover:bg-gray-100">
                Felicitaciones VIPs
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom buttons */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          <Link 
            to="/new-wish"
            className="bg-gray-900/70 hover:bg-gray-900 text-white text-xs px-3 py-1 rounded-full flex items-center transition-all"
          >
            Añadir Felicitación
          </Link>
          <button 
            onClick={() => setShowAdminModal(true)}
            className="bg-gray-900/70 hover:bg-gray-900 text-white text-xs px-3 py-1 rounded-full flex items-center transition-all"
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