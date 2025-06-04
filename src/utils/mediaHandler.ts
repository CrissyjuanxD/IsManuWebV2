import { v4 as uuidv4 } from 'uuid';

export interface MediaFile {
  id: string;
  url: string;
  type: 'image' | 'video';
  size: number;
}

const MAX_FILE_SIZE = 100 * 1024 * 1024;
const CLOUD_NAME = 'dlcusrqqy'; // <- reemplaza esto
const UPLOAD_PRESET = 'uploadfilesismanuweb'; // <- reemplaza esto

export const validateFileSize = (file: File): boolean => {
  return file.size <= MAX_FILE_SIZE;
};

export const handleMediaUpload = async (file: File): Promise<MediaFile | null> => {
  if (!validateFileSize(file)) {
    throw new Error('El archivo excede el límite de 100MB');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('public_id', uuidv4());

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    console.error('Error al subir a Cloudinary:', await res.text());
    throw new Error('No se pudo subir el archivo');
  }

  const data = await res.json();

  return {
    id: data.public_id,
    url: data.secure_url,
    type: file.type.startsWith('video') ? 'video' : 'image',
    size: file.size,
  };
};
