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

const WishCard: React.FC<WishCardProps> = ({ 
  wish, 
  isAdmin = false,
  onEdit,
  onDelete,
  onPrevious,
  onNext,
  showNavigation = false
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

  const isVideo = wish.mediaUrl?.match(/\.(mp4|webm|ogg)$/i) || wish.mediaUrl?.includes('blob:') && wish.mediaUrl?.startsWith('blob:');

  return (
    <div className="card p-6 mb-6 border-t-4 relative" style={{ 
      borderTopColor: wish.type === 'mod' ? '#32CD32' : '#FF69B4' 
    }}>
      <div className="absolute top-2 right-2 text-xs px-2 py-1 rounded-full" style={{
        backgroundColor: wish.type === 'mod' ? '#32CD32' : '#FF69B4',
        color: 'white'
      }}>
        {wish.type === 'mod' ? 'Moderador' : 'VIP'}
      </div>
      
      {showNavigation && (
        <>
          <button 
            onClick={onPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button 
            onClick={onNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}
      
      <div className="flex items-center mb-4">
        <img 
          src={wish.image} 
          alt={wish.name} 
          className="h-14 w-14 rounded-full object-cover border-2 border-primary"
        />
        <div className="ml-4">
          <h3 className="text-xl font-bold">{wish.name}</h3>
          <div className="flex items-center text-gray-500 text-sm">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{formatDate(wish.date)}</span>
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-gray-800 whitespace-pre-line">{wish.message}</p>
      </div>
      
      {wish.mediaUrl && (
        <div className="mb-4">
          {isVideo ? (
            <div className="relative rounded-lg overflow-hidden">
              <video
                src={wish.mediaUrl}
                className="w-full"
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
              className={`relative overflow-hidden rounded-lg cursor-pointer ${isMediaExpanded ? 'h-auto' : 'h-48'}`}
              onClick={() => setIsMediaExpanded(!isMediaExpanded)}
            >
              <img 
                src={wish.mediaUrl} 
                alt="Media content" 
                className={`w-full ${isMediaExpanded ? 'h-auto' : 'h-full object-cover'}`}
              />
              {!isMediaExpanded && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-40 transition-all">
                  <button className="bg-white bg-opacity-80 rounded-full p-2 flex items-center">
                    <Eye className="h-5 w-5 mr-1" />
                    <span className="text-sm font-medium">Ver completo</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {isAdmin && (
        <div className="flex justify-end space-x-2 mt-4">
          <button 
            onClick={() => onEdit && onEdit(wish.id)}
            className="btn-secondary text-sm py-1 px-3"
          >
            Editar
          </button>
          <button 
            onClick={() => onDelete && onDelete(wish.id)}
            className="bg-red-500 hover:bg-red-600 text-white text-sm py-1 px-3 rounded-full"
          >
            Eliminar
          </button>
        </div>
      )}
    </div>
  );
};

export default WishCard;