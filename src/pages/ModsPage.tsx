import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import WishCard from '../components/WishCard';
import { Search } from 'lucide-react';

const ModsPage: React.FC = () => {
  const { wishes } = useData();
  const modWishes = wishes.filter(wish => wish.type === 'mod');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWish, setSelectedWish] = useState<string | null>(null);

  useEffect(() => {
    if (selectedWish) {
      const element = document.getElementById(selectedWish);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [selectedWish]);

  const filteredWishes = modWishes.filter(wish => 
    wish.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[url('https://cdn.discordapp.com/attachments/1180691474262798495/1379595553079431178/GMTgpV0XcAAubT1.jpg?ex=6840cffb&is=683f7e7b&hm=fbc8798203224ed4c0415f05a02da96ed8053a53f1696552c1c1cfa8dbd306ed&')] bg-fixed bg-cover bg-center bg-no-repeat">
      <div className="bg-black/30 min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="backdrop-blur-sm bg-white/30 rounded-xl p-6 mb-12 text-center">
              <h1 className="text-4xl font-bold mb-4 text-white">Felicitaciones de Moderadores</h1>
              <p className="text-lg text-white/90">
                Aunque nos dejes sin comer, tus queridos mods tienen unas palabras para ti.  
              </p>
            </div>

            <div className="mb-8">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nombre..."
                  className="w-full px-4 py-2 pl-10 rounded-lg bg-white/90 backdrop-blur-sm"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
              </div>
              {searchTerm && filteredWishes.length > 0 && (
                <div className="mt-2 bg-white/90 backdrop-blur-sm rounded-lg p-2">
                  {filteredWishes.map(wish => (
                    <button
                      key={wish.id}
                      onClick={() => setSelectedWish(wish.id)}
                      className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                    >
                      {wish.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {modWishes.length > 0 ? (
              <div className="space-y-6">
                {modWishes.map(wish => (
                  <div key={wish.id} id={wish.id}>
                    <WishCard wish={wish} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white/90 backdrop-blur-sm rounded-xl">
                <p className="text-gray-500 text-lg">Aún no hay felicitaciones de moderadores.</p>
                <p className="text-gray-500">¡Sé el primero en dejar tu mensaje!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModsPage;