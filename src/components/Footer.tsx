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
              src="https://cdn.discordapp.com/attachments/1180691474262798495/1379592668115374110/1115486236723925012_1.gif?ex=6840cd4b&is=683f7bcb&hm=24419731e8d20215b2658c1d138a516bd0e13ed33cc2312bc2495c47763fad84&" 
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