import React from 'react';

const PageTransition: React.FC = () => {
  return (
    <div className="page-transition-overlay fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="flex flex-col items-center">
        <img 
          src="https://cdn.discordapp.com/attachments/1180691474262798495/1379592668115374110/1115486236723925012_1.gif?ex=6840cd4b&is=683f7bcb&hm=24419731e8d20215b2658c1d138a516bd0e13ed33cc2312bc2495c47763fad84&" 
          alt="Loading" 
          className="h-24 w-24 spin-element"
        />
        <p className="text-white mt-4 text-xl">Cargando...</p>
      </div>
    </div>
  );
};

export default PageTransition;