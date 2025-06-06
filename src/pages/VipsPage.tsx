import React from 'react';
import { useData } from '../context/DataContext';
import WishCard from '../components/WishCard';

const VipsPage: React.FC = () => {
  const { wishes } = useData();
  const vipWishes = wishes.filter(wish => wish.type === 'vip');

  return (
    <div className="min-h-screen bg-[url('https://res.cloudinary.com/dlcusrqqy/image/upload/v1749182597/fondovips_amxeiw.png')] bg-fixed bg-cover bg-center">
      <div className="bg-black/30 min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="backdrop-blur-sm bg-white/30 rounded-xl p-6 mb-12 text-center">
              <h1 className="text-4xl font-bold mb-4 text-white">Felicitaciones de VIPs</h1>
              <p className="text-lg text-white/90">
                Aunque maltratas a tus VIPs, también te han dejado unos lindos mensajitos.
              </p>
            </div>
            
            {vipWishes.length > 0 ? (
              <div className="space-y-6">
                {vipWishes.map(wish => (
                  <WishCard key={wish.id} wish={wish} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white/90 rounded-xl">
                <p className="text-gray-500 text-lg">Aún no hay felicitaciones de VIPs.</p>
                <p className="text-gray-500">¡Sé el primero en dejar tu mensaje!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VipsPage;
