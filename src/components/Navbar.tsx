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
  const [currentSong, setCurrentSong] = useState<number>(SONGS.length - 1);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audio) audio.pause();

    const audioElement = new Audio(SONGS[currentSong].url);
    audioElement.volume = 0.5;
    setAudio(audioElement);

    audioElement.play().then(() => {
      setIsPlaying(true);
    }).catch(() => {
      setIsPlaying(false);
    });

    audioElement.onended = () => setIsPlaying(false);

    return () => { audioElement.pause(); };
  }, [currentSong]);

  const toggleMusic = () => {
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      const nextSong = (currentSong + 1) % SONGS.length;
      setCurrentSong(nextSong);
    }
  };

  const socialLinks = [
    { href: "https://www.twitch.tv/ismanuplay", icon: <Twitch />, label: "Twitch" },
    { href: "https://x.com/IsManuPlay", icon: <Twitter />, label: "Twitter" },
    { href: "https://www.instagram.com/itsmanuplay/", icon: <Instagram />, label: "Instagram" },
    { href: "https://www.youtube.com/@ismanuplay", icon: <Youtube />, label: "YouTube Principal" },
    { href: "https://www.youtube.com/@IsManu_", icon: <Youtube />, label: "YouTube Secundario" },
  ];

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
        <div className="flex items-center justify-between gap-2">

          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0">
            <img 
              src="https://yt3.googleusercontent.com/_E8Fk_yp8XLRgJUH7hBdpJS3nOTWEOOS02D451n1GBh_hsJ_z3L2pL0cXUnBUmBbwPQDCLmO=s160-c-k-c0x00ffffff-no-rj" 
              alt="Manuelin" 
              className="w-10 h-10 rounded-full border-2 border-white mr-2"
            />
            <span className="text-white font-bold text-lg md:text-2xl">Manuelin</span>
          </Link>

          {/* #MANUCUM */}
          <button 
            onClick={toggleMusic}
            className="flex items-center space-x-1 text-white hover:text-accent transition-colors shrink-0"
            aria-label={isPlaying ? "Pause music" : "Play music"}
          >
            <span className="text-base md:text-2xl font-bold" style={{ color: '#b667d6' }}>
              #MANUCUM
            </span>
            <img 
              src="https://res.cloudinary.com/dlcusrqqy/image/upload/v1749183649/manubaile_manuweb_i2xgf5.gif" 
              alt="Manucum GIF" 
              className="w-5 h-5 md:w-6 md:h-6"
            />
          </button>

          {/* Redes sociales: grid 3-2 en móvil, fila en desktop */}
          <div className="shrink-0">
            {/* MÓVIL: grid 3 cols, fila 1 tiene 3 iconos, fila 2 tiene 2 centrados */}
            <div className="flex md:hidden flex-col items-center gap-0.5">
              <div className="flex items-center gap-1">
                {socialLinks.slice(0, 3).map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="nav-link" aria-label={s.label}>
                    {React.cloneElement(s.icon as React.ReactElement, { className: 'h-3 w-3' })}
                  </a>
                ))}
              </div>
              <div className="flex items-center gap-1">
                {socialLinks.slice(3).map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="nav-link" aria-label={s.label}>
                    {React.cloneElement(s.icon as React.ReactElement, { className: 'h-3 w-3' })}
                  </a>
                ))}
              </div>
            </div>

            {/* DESKTOP: fila normal */}
            <div className="hidden md:flex items-center space-x-3">
              {socialLinks.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="nav-link" aria-label={s.label}>
                  {React.cloneElement(s.icon as React.ReactElement, { className: 'h-5 w-5' })}
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;