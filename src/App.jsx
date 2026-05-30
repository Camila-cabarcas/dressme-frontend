import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import OnboardingPage from './pages/OnboardingPage';
import HomePage from './pages/HomePage';
import WardrobeUploadPage from './pages/WardrobeUploadPage';

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
      // Después de calibración → ir a wardrobeUpload
      return parsedUser.isCalibrated ? 'wardrobeUpload' : 'onboarding';
    }
    return 'landing';
  });

  const handleLoginSuccess = (userData) => {
    console.log('Login recibido:', userData);
    
    // Guardar tokens y usuario en LocalStorage para no perder sesión
    localStorage.setItem('authToken', userData.token);
    localStorage.setItem('dressme_user', JSON.stringify(userData));
    setUser(userData);

    // Redirigir según estado de calibración
    if (!userData.isCalibrated) {
      setCurrentView('onboarding');
    } else {
      // Después de calibración → ir a wardrobeUpload
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
          // Actualizar estado cuando finalice el onboarding
          setUser(updatedUser);
          localStorage.setItem('dressme_user', JSON.stringify(updatedUser));
          setCurrentView('wardrobeUpload');
        }}
      />
    );
  }

  // WardrobeUpload: Cargar prendas al armario virtual
  if (currentView === 'wardrobeUpload') {
    return (
      <WardrobeUploadPage 
        user={user} 
        onLogout={handleLogout} 
        onUploadComplete={() => {
          // Después de subir prenda (o continuar sin subir) → ir a home
          setCurrentView('home');
        }} 
      />
    );
  }

  // HOME: Dashboard principal (después de calibración y carga de prendas)
  if (currentView === 'home') {
    return (
      <HomePage 
        user={user} 
        onLogout={handleLogout} 
        onGoToOnboarding={() => setCurrentView('onboarding')}
        onGoToWardrobe={() => setCurrentView('wardrobeUpload')}
      />
    );
  }

  // Fallback por defecto
  return <LandingPage onGetStarted={() => setCurrentView('login')} />;
}

export default App;