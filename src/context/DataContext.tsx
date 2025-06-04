import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

export interface WishType {
  id: string;
  name: string;
  type: 'mod' | 'vip';
  message: string;
  image: string;
  mediaUrl: string;
  date: number;
}

interface DataContextType {
  wishes: WishType[];
  addWish: (wish: Omit<WishType, 'id' | 'date'>) => Promise<void>;
  deleteWish: (id: string) => Promise<boolean>;
  editWish: (id: string, updatedWish: Partial<WishType>) => Promise<void>;
  isSubmissionPaused: boolean;
  toggleSubmission: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishes, setWishes] = useState<WishType[]>([]);
  const [isSubmissionPaused, setIsSubmissionPaused] = useState(false);

  // Cargar datos desde Supabase al iniciar
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('wishes')
        .select('*')
        .order('date', { ascending: false });

      if (data) setWishes(data as WishType[]);
      if (error) console.error('Error loading wishes:', error);

      const { data: configData, error: configError } = await supabase
        .from('config')
        .select('isSubmissionPaused')
        .single();

      if (configData) setIsSubmissionPaused(configData.isSubmissionPaused);
      if (configError) console.error('Error loading config:', configError);
    };

    fetchData();
  }, []);

  const addWish = async (wish: Omit<WishType, 'id' | 'date'>) => {
    const newWish = {
      ...wish,
      id: uuidv4(),
      date: new Date().toISOString(),
    };

    console.log('Datos a insertar en Supabase:', newWish);

    try {
      const { data, error } = await supabase
        .from('wishes')
        .insert(newWish)
        .select()
        .single();

      if (error) {
        console.error('Error de Supabase:', error);
        throw new Error(error.message || 'Error al agregar la felicitación');
      }

      if (!data) {
        throw new Error('No se recibieron datos de Supabase');
      }

      console.log('Felicitación agregada correctamente:', data);
      setWishes(prev => [data as WishType, ...prev]);
      return data;
    } catch (error) {
      console.error('Error completo en addWish:', error);
      throw error; // Re-lanzamos el error para que lo capture handleSubmit
    }
  };

  const deleteWish = async (id: string) => {
    try {
      console.log('Intentando eliminar felicitación con ID:', id);
      
      // Opción 1: Eliminar sin necesidad de contar filas afectadas
      const { error } = await supabase
        .from('wishes')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error de Supabase al eliminar:', error);
        throw new Error(`Error al eliminar: ${error.message}`);
      }

      console.log('Felicitación eliminada correctamente de Supabase');
      
      // Actualizar el estado local
      setWishes(prev => prev.filter(wish => wish.id !== id));
      
      return true;
    } catch (error) {
      console.error('Error completo al eliminar:', error);
      throw error;
    }
  };

  const editWish = async (id: string, updatedWish: Partial<WishType>) => {
    const { error } = await supabase.from('wishes').update(updatedWish).eq('id', id);
    if (error) throw new Error('Error editing wish');
    setWishes(prev =>
      prev.map(wish => (wish.id === id ? { ...wish, ...updatedWish } : wish))
    );
  };

  const toggleSubmission = async () => {
    const newStatus = !isSubmissionPaused;

    try {
      console.log('Actualizando estado de envíos a:', newStatus);
      
      const { error } = await supabase
        .from('config')
        .upsert({ id: 1, isSubmissionPaused: newStatus }); // Usamos upsert en lugar de update

      if (error) {
        console.error('Error de Supabase:', error);
        throw new Error(`Error al actualizar: ${error.message}`);
      }

      console.log('Estado de envíos actualizado correctamente');
      setIsSubmissionPaused(newStatus);
    } catch (error) {
      console.error('Error completo en toggleSubmission:', error);
      throw error;
    }
  };

  return (
    <DataContext.Provider
      value={{
        wishes,
        addWish,
        deleteWish,
        editWish,
        isSubmissionPaused,
        toggleSubmission,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
