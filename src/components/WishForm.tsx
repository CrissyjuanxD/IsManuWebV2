import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { toast } from 'react-toastify';
import { Send, Image, User, MessageSquare } from 'lucide-react';

const WishForm: React.FC = () => {
  const { addWish, isSubmissionPaused } = useData();
  const [name, setName] = useState('');
  const [type, setType] = useState<'mod' | 'vip'>('mod');
  const [message, setMessage] = useState('');
  const [image, setImage] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmissionPaused) {
      toast.error('Las felicitaciones están pausadas temporalmente por el administrador.');
      return;
    }
    
    if (!name || !message) {
      toast.error('Por favor completa los campos obligatorios');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      addWish({
        name,
        type,
        message,
        image: image || `https://randomuser.me/api/portraits/${type === 'mod' ? 'men' : 'women'}/${Math.floor(Math.random() * 70) + 1}.jpg`,
        mediaUrl,
      });
      
      toast.success('¡Tu felicitación ha sido enviada con éxito!');
      
      // Reset form
      setName('');
      setType('mod');
      setMessage('');
      setImage('');
      setMediaUrl('');
    } catch (error) {
      toast.error('Error al enviar tu felicitación. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmissionPaused) {
    return (
      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-500\" viewBox="0 0 20 20\" fill="currentColor">
              <path fillRule="evenodd\" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z\" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              Las felicitaciones están temporalmente deshabilitadas por el administrador.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Añade tu felicitación</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center">
            <User className="h-4 w-4 mr-2" />
            Nombre
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
            placeholder="Tu nombre"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Tipo de felicitación
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="mod"
                checked={type === 'mod'}
                onChange={() => setType('mod')}
                className="h-4 w-4 text-primary focus:ring-primary"
              />
              <span className="ml-2">Moderador</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="vip"
                checked={type === 'vip'}
                onChange={() => setType('vip')}
                className="h-4 w-4 text-accent focus:ring-accent"
              />
              <span className="ml-2">VIP</span>
            </label>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center">
            <MessageSquare className="h-4 w-4 mr-2" />
            Mensaje
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="input-field min-h-[120px]"
            placeholder="Escribe tu mensaje de felicitación..."
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center">
            <Image className="h-4 w-4 mr-2" />
            URL de tu foto (opcional)
          </label>
          <input
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="input-field"
            placeholder="https://ejemplo.com/tu-imagen.jpg"
          />
          <p className="text-xs text-gray-500 mt-1">Si no proporcionas una imagen, se usará una aleatoria.</p>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center">
            <Image className="h-4 w-4 mr-2" />
            URL de imagen/media (opcional)
          </label>
          <input
            type="url"
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
            className="input-field"
            placeholder="https://ejemplo.com/media.jpg"
          />
        </div>
        
        <div className="flex justify-center">
          <button
            type="submit"
            className="btn btn-primary flex items-center"
            disabled={isSubmitting}
          >
            <Send className="h-5 w-5 mr-2" />
            {isSubmitting ? 'Enviando...' : 'Enviar Felicitación'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WishForm;