import React, { createContext, useContext, useState, useEffect } from 'react';
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
  addWish: (wish: Omit<WishType, 'id' | 'date'>) => void;
  deleteWish: (id: string) => void;
  editWish: (id: string, updatedWish: Partial<WishType>) => void;
  isSubmissionPaused: boolean;
  toggleSubmission: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Initial data to populate the website
const initialWishes: WishType[] = [
  {
    id: uuidv4(),
    name: 'CrissyjuanxD',
    type: 'mod',
    message: 'Feliz cumpleaños Manuel! Espero que tengas un día espectacular lleno de alegría y buenos momentos. Gracias por todas las risas que nos das en tus streams.',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    mediaUrl: 'https://images.pexels.com/photos/3171837/pexels-photo-3171837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    date: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },
  {
    id: uuidv4(),
    name: 'StreamerFan123',
    type: 'vip',
    message: 'Manuel, eres el mejor streamer! Tu contenido siempre me alegra el día. Te deseo un cumpleaños increíble rodeado de tus seres queridos.',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    mediaUrl: 'https://images.pexels.com/photos/2690323/pexels-photo-2690323.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    date: Date.now() - 1000 * 60 * 60 * 24,
  },
  {
    id: uuidv4(),
    name: 'GameMaster',
    type: 'mod',
    message: 'Muchas felicidades en tu día especial, Manuel! Gracias por crear esta comunidad tan increíble. Que cumplas muchos más!',
    image: 'https://randomuser.me/api/portraits/men/22.jpg',
    mediaUrl: 'https://images.pexels.com/photos/3831849/pexels-photo-3831849.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    date: Date.now() - 1000 * 60 * 60 * 12,
  },
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishes, setWishes] = useState<WishType[]>(() => {
    const savedWishes = localStorage.getItem('manucum-wishes');
    return savedWishes ? JSON.parse(savedWishes) : initialWishes;
  });
  
  const [isSubmissionPaused, setIsSubmissionPaused] = useState<boolean>(() => {
    const savedStatus = localStorage.getItem('manucum-paused');
    return savedStatus ? JSON.parse(savedStatus) : false;
  });

  useEffect(() => {
    localStorage.setItem('manucum-wishes', JSON.stringify(wishes));
  }, [wishes]);

  useEffect(() => {
    localStorage.setItem('manucum-paused', JSON.stringify(isSubmissionPaused));
  }, [isSubmissionPaused]);

  const addWish = (wish: Omit<WishType, 'id' | 'date'>) => {
    const newWish: WishType = {
      ...wish,
      id: uuidv4(),
      date: Date.now(),
    };
    
    setWishes(prevWishes => [newWish, ...prevWishes]);
  };

  const deleteWish = (id: string) => {
    setWishes(prevWishes => prevWishes.filter(wish => wish.id !== id));
  };

  const editWish = (id: string, updatedWish: Partial<WishType>) => {
    setWishes(prevWishes => 
      prevWishes.map(wish => 
        wish.id === id ? { ...wish, ...updatedWish } : wish
      )
    );
  };

  const toggleSubmission = () => {
    setIsSubmissionPaused(prev => !prev);
  };

  return (
    <DataContext.Provider value={{ 
      wishes, 
      addWish, 
      deleteWish, 
      editWish,
      isSubmissionPaused,
      toggleSubmission 
    }}>
      {children}
    </DataContext.Provider>
  );
};