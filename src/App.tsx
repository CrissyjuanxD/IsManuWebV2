import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ModsPage from './pages/ModsPage';
import VipsPage from './pages/VipsPage';
import AdminPage from './pages/AdminPage';
import NewWishPage from './pages/NewWishPage';
import PageTransition from './components/PageTransition';
import { DataProvider } from './context/DataContext';

function App() {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const handleRouteChange = () => {
      setIsTransitioning(true);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 1000);
    };

    handleRouteChange();
  }, [location.pathname]);

  return (
    <DataProvider>
      <div className="flex flex-col min-h-screen relative">
        <Navbar className="sticky top-0 z-50" />
        
        {isTransitioning && <PageTransition />}
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mods" element={<ModsPage />} />
            <Route path="/vips" element={<VipsPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/new-wish" element={<NewWishPage />} />
          </Routes>
        </main>
        
        <Footer className="sticky bottom-0 z-40" />
      </div>
    </DataProvider>
  );
}

export default App;