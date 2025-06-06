import React from 'react';

const PageTransition: React.FC = () => {
  return (
    <div className="page-transition-overlay fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="flex flex-col items-center">
        <img 
          src="https://res.cloudinary.com/dlcusrqqy/image/upload/v1749183649/manubaile_manuweb_i2xgf5.gif" 
          alt="Loading" 
          className="h-24 w-24 spin-element"
        />
        <p className="text-white mt-4 text-xl">Cargando...</p>
      </div>
    </div>
  );
};

export default PageTransition;
