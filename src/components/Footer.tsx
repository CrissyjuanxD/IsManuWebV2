import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-white py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-2 md:mb-0">
            <p className="text-center md:text-left">© 2025 Hecho por CrissyjuanxD</p>
          </div>
          <div className="flex items-center">
            <span className="text-secondary">#MANUCUM</span>
            <img 
              src="https://res.cloudinary.com/dlcusrqqy/image/upload/v1749183649/manubaile_manuweb_i2xgf5.gif" 
              alt="Party emoji" 
              className="h-6 w-6 ml-2"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
