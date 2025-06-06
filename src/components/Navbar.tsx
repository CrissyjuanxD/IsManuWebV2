import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Instagram, Twitch, Youtube } from 'lucide-react';

const SONGS = [
  { 
    name: "NightDancer IsManuPlay", 
    url: "https://res.cloudinary.com/dlcusrqqy/video/upload/v1749183409/night_dancer_manuweb_hnphsn.mp3" 
  },
  { 
    name: "DuaLipa", 
    url: "https://res.cloudinary.com/dlcusrqqy/video/upload/v1749183523/dualiapa_manuweb_wnjvku.mp3" 
  },
  { 
    name: "RapManujiji", 
    url: "https://res.cloudinary.com/dlcusrqqy/video/upload/v1749183513/rapmanu_manuweb_ao3nw5.mp3" 
  }
];

const Navbar: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState<number>(SONGS.length - 1); // Empieza en la última para que al hacer click avance a la primera
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Pausamos audio anterior si existe
    if (audio) {
      audio.pause();
    }

    // Creamos nuevo audio para la canción actual
    const audioElement = new Audio(SONGS[currentSong].url);
    audioElement.volume = 0.5;
    setAudio(audioElement);

    // Reproducimos la canción
    audioElement.play().then(() => {
      setIsPlaying(true);
    }).catch(() => {
      setIsPlaying(false);
    });

    // Cuando termine la canción, marcamos como no reproduciendo
    audioElement.onended = () => {
      setIsPlaying(false);
    };

    // Limpiar al desmontar o cambiar canción
    return () => {
      audioElement.pause();
    };
  }, [currentSong]);

  const toggleMusic = () => {
    if (!audio) return;

    if (isPlaying) {
      // Si está sonando, la pausamos sin cambiar canción
      audio.pause();
      setIsPlaying(false);
    } else {
      // Si está pausado, avanzamos a la siguiente canción y se reproducirá en useEffect
      const nextSong = (currentSong + 1) % SONGS.length;
      setCurrentSong(nextSong);
    }
  };

  return (
    <nav className={`bg-primary sticky top-0 z-50 shadow-md relative overflow-hidden ${className}`}>
      {/* Confetti Animation */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="confetti-container">
          {[...Array(50)].map((_, i) => (
            <div 
              key={i} 
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                backgroundColor: [
                  '#FFF', '#FFD700', '#FF69B4', '#32CD32', 
                  '#4169E1', '#9370DB', '#FF4500', '#00CED1'
                ][Math.floor(Math.random() * 8)]
              }}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 py-3 relative">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img 
              src="https://yt3.googleusercontent.com/_E8Fk_yp8XLRgJUH7hBdpJS3nOTWEOOS02D451n1GBh_hsJ_z3L2pL0cXUnBUmBbwPQDCLmO=s160-c-k-c0x00ffffff-no-rj" 
              alt="Manuelin" 
              className="w-10 h-10 rounded-full border-2 border-white mr-3"
            />
            <span className="text-white font-bold text-xl md:text-2xl">Manuelin</span>
          </Link>

          <div className="hidden md:flex items-center">
            <button 
              onClick={toggleMusic}
              className="flex items-center space-x-2 text-white hover:text-accent transition-colors"
              aria-label={isPlaying ? "Pause music" : "Play music"}
              style={{ whiteSpace: 'nowrap' }}  // evita que el contenido haga wrap a la siguiente línea
            >
              <span className="text-2xl font-bold" style={{ color: '#b667d6' }}>
                #MANUCUM
              </span>
              <img 
                src="https://res.cloudinary.com/dlcusrqqy/image/upload/v1749183649/manubaile_manuweb_i2xgf5.gif" 
                alt="Manucum GIF" 
                className="w-6 h-6"
              />
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <a href="https://www.twitch.tv/ismanuplay" target="_blank" rel="noopener noreferrer" className="nav-link" aria-label="Twitch">
              <Twitch className="h-5 w-5" />
            </a>
            <a href="https://x.com/IsManuPlay" target="_blank" rel="noopener noreferrer" className="nav-link" aria-label="Twitter">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="https://www.instagram.com/itsmanuplay/" target="_blank" rel="noopener noreferrer" className="nav-link" aria-label="Instagram">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="https://www.youtube.com/@ismanuplay" target="_blank" rel="noopener noreferrer" className="nav-link" aria-label="YouTube Principal">
              <Youtube className="h-5 w-5" />
            </a>
            <a href="https://www.youtube.com/@IsManu_" target="_blank" rel="noopener noreferrer" className="nav-link" aria-label="YouTube Secundario">
              <Youtube className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
