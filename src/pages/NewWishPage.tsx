import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { toast } from 'react-toastify';
import { Send, Image, User, MessageSquare, Video } from 'lucide-react';
import { handleMediaUpload, MediaFile } from '../utils/mediaHandler';

const NewWishPage: React.FC = () => {
  const { addWish, isSubmissionPaused } = useData();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [type, setType] = useState<'mod' | 'vip'>('mod');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [profileImage, setProfileImage] = useState<MediaFile | null>(null);
  const [media, setMedia] = useState<MediaFile | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);

  const profileImageRef = useRef<HTMLInputElement>(null);
  const mediaRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: (file: MediaFile | null) => void,
    setUploading: (uploading: boolean) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const mediaFile = await handleMediaUpload(file);
      if (mediaFile) {
        setFile(mediaFile);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Error al procesar el archivo');
      }
      e.target.value = '';
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmissionPaused) {
      toast.error('Las felicitaciones están pausadas temporalmente por el administrador.');
      return;
    }

    if (!name || !message || !profileImage || !media) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    if (isUploadingImage || isUploadingMedia) {
      toast.warning('Espera a que se termine de subir la imagen y el video antes de enviar.');
      return;
    }

    setIsSubmitting(true);

    try {
      addWish({
        name,
        type,
        message,
        image: profileImage.url,
        mediaUrl: media.url,
      });

      toast.success('¡Tu felicitación ha sido enviada con éxito!');
      navigate('/');
    } catch (error) {
      toast.error('Error al enviar tu felicitación. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage:
          'url(https://cdn.discordapp.com/attachments/1180691474262798495/1379629230043693188/GKOIl-9WgAAkxU9.jpg?ex=6840ef58&is=683f9dd8&hm=a71ed9259bc90a6000c23509ae5535daff3408e245043258a10b406012907588)',
      }}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white bg-opacity-90 rounded-xl shadow-md p-6 mb-8 backdrop-blur-md">
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
                      className="h-4 w-4 text-[#32CD32]"
                    />
                    <span className="ml-2">Moderador</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="vip"
                      checked={type === 'vip'}
                      onChange={() => setType('vip')}
                      className="h-4 w-4 text-[#FF69B4]"
                    />
                    <span className="ml-2">VIP</span>
                  </label>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Foto de perfil (Máx. 100MB)
                </label>
                <input
                  type="file"
                  ref={profileImageRef}
                  onChange={(e) => handleFileChange(e, setProfileImage, setIsUploadingImage)}
                  accept="image/*"
                  className="input-field"
                  required
                />
                {isUploadingImage && (
                  <p className="text-blue-500 text-sm mt-1">Subiendo imagen...</p>
                )}
                {profileImage && (
                  <div className="mt-2">
                    <img
                      src={profileImage.url}
                      alt="Preview"
                      className="h-20 w-20 object-cover rounded-full"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Tamaño: {(profileImage.size / (1024 * 1024)).toFixed(2)}MB
                    </p>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center">
                  <Video className="h-4 w-4 mr-2" />
                  Imagen o Video (Máx. 100MB)
                </label>
                <input
                  type="file"
                  ref={mediaRef}
                  onChange={(e) => handleFileChange(e, setMedia, setIsUploadingMedia)}
                  accept="image/*,video/mp4,video/webm,video/ogg"
                  className="input-field"
                  required
                />
                {isUploadingMedia && (
                  <p className="text-blue-500 text-sm mt-1">Subiendo video/imagen...</p>
                )}
                {media && (
                  <div className="mt-2">
                    {media.type === 'video' ? (
                      <video
                        src={media.url}
                        className="max-h-48 w-full object-cover rounded-lg"
                        controls
                      />
                    ) : (
                      <img
                        src={media.url}
                        alt="Preview"
                        className="max-h-48 w-full object-cover rounded-lg"
                      />
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Tamaño: {(media.size / (1024 * 1024)).toFixed(2)}MB
                    </p>
                  </div>
                )}
              </div>

              <div className="mb-6">
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

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="btn btn-primary flex items-center"
                  disabled={isSubmitting || isUploadingImage || isUploadingMedia}
                >
                  <Send className="h-5 w-5 mr-2" />
                  {isSubmitting ? 'Enviando...' : 'Enviar Felicitación'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewWishPage;
