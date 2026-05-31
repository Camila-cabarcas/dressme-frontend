import { useState } from 'react';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import OnboardingPage from './pages/OnboardingPage';
import HomePage from './pages/HomePage';
import WardrobeUploadPage from './pages/WardrobeUploadPage';
import WardrobePage from './pages/WardrobePage';
import OutfitsPage from './pages/OutfitsPage';
import FavoritesPage from './pages/FavoritesPage';
import ConfigPage from './pages/ConfigPage';

function App() {
  // RECUPERAR SESIÓN AL RECARGAR LA PÁGINA
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('dressme_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [currentView, setCurrentView] = useState(() => {
    const savedUser = localStorage.getItem('dressme_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      return parsedUser.isCalibrated ? 'home' : 'onboarding';
    }
    return 'landing';
  });

  const handleLoginSuccess = (userData) => {
    console.log('Login recibido:', userData);
    localStorage.setItem('authToken', userData.token);
    localStorage.setItem('dressme_user', JSON.stringify(userData));
    setUser(userData);
    if (!userData.isCalibrated) {
      setCurrentView('onboarding');
    } else {
      setCurrentView('wardrobeUpload');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('dressme_user');
    setUser(null);
    setCurrentView('landing');
  };

  if (currentView === 'login') {
    return (
      <LoginPage
        onBack={() => setCurrentView('landing')}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  if (currentView === 'onboarding') {
    return (
      <OnboardingPage
        user={user}
        onCalibrationCompleted={(updatedUser) => {
          setUser(updatedUser);
          localStorage.setItem('dressme_user', JSON.stringify(updatedUser));
          setCurrentView('wardrobeUpload');
        }}
      />
    );
  }

  if (currentView === 'wardrobeUpload') {
    return (
      <WardrobeUploadPage
        user={user}
        onLogout={handleLogout}
        onUploadComplete={() => setCurrentView('home')}
      />
    );
  }

  if (currentView === 'home') {
    return (
      <HomePage
        user={user}
        onLogout={handleLogout}
        onGoToOnboarding={() => setCurrentView('onboarding')}
        onGoToWardrobe={() => setCurrentView('wardrobeUpload')}
        onGoToWardrobePage={() => setCurrentView('wardrobePage')}
        onGoToOutfits={() => setCurrentView('outfits')}
        onGoToFavorites={() => setCurrentView('favorites')}
        onGoToConfig={() => setCurrentView('config')}
      />
    );
  }

  if (currentView === 'wardrobePage') {
    return (
      <WardrobePage
        user={user}
        onLogout={handleLogout}
        onAddCloth={() => setCurrentView('wardrobeUpload')}
        onGoToHome={() => setCurrentView('home')}
        onGoToWardrobePage={() => setCurrentView('wardrobePage')}
        onGoToOutfits={() => setCurrentView('outfits')}
        onGoToFavorites={() => setCurrentView('favorites')}
        onGoToConfig={() => setCurrentView('config')}
        prendas={[]}
        estilos={[]}
        ocasiones={[]}
        colores={[]}
        climas={[]}
        tiposPrenda={[]}
        categorias={[]}
      />
    );
  }

  if (currentView === 'outfits') {
    return (
      <OutfitsPage
        user={user}
        onLogout={handleLogout}
        onGoToHome={() => setCurrentView('home')}
        onGoToWardrobe={() => setCurrentView('wardrobeUpload')}
        onGoToWardrobePage={() => setCurrentView('wardrobePage')}
        onGoToOutfits={() => setCurrentView('outfits')}
        onGoToFavorites={() => setCurrentView('favorites')}
        onGoToConfig={() => setCurrentView('config')}
        ocasiones={[]}
        climas={[]}
        dressCodes={[]}
        hasPrendas={false}
      />
    );
  }

  if (currentView === 'favorites') {
    return (
      <FavoritesPage
        user={user}
        onLogout={handleLogout}
        onGoToHome={() => setCurrentView('home')}
        onGoToWardrobePage={() => setCurrentView('wardrobePage')}
        onGoToOutfits={() => setCurrentView('outfits')}
        onGoToFavorites={() => setCurrentView('favorites')}
        onGoToWardrobe={() => setCurrentView('wardrobeUpload')}
        onGoToConfig={() => setCurrentView('config')}
        ocasiones={[]}
        climas={[]}
        dressCodes={[]}
        favoritosData={[]}
      />
    );
  }

  if (currentView === 'config') {
    return (
      <ConfigPage
        user={user}
        onLogout={handleLogout}
        onGoToHome={() => setCurrentView('home')}
        onGoToWardrobePage={() => setCurrentView('wardrobePage')}
        onGoToOutfits={() => setCurrentView('outfits')}
        onGoToFavorites={() => setCurrentView('favorites')}
        onGoToOnboarding={() => setCurrentView('onboarding')}
      />
    );
  }

  // Fallback por defecto
  return <LandingPage onGetStarted={() => setCurrentView('login')} />;
}

export default App;
