import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import OnboardingPage from './pages/OnboardingPage';
// 1. IMPORTAR HOMEPAGE
import HomePage from './pages/HomePage'; 

function App() {
  // 2. RECUPERAR SESIÓN AL RECARGAR LA PÁGINA
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
    
    // Guardar tokens y usuario en LocalStorage para no perder sesión
    localStorage.setItem('authToken', userData.token);
    localStorage.setItem('dressme_user', JSON.stringify(userData));
    setUser(userData);

    // Redirigir según estado de calibración
    if (!userData.isCalibrated) {
      setCurrentView('onboarding');
    } else {
      setCurrentView('home');
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
          setCurrentView('home');
        }}
      />
    );
  }

  // 3. EL BLOQUE FALTANTE PARA MOSTRAR EL HOME
  if (currentView === 'home') {
    return (
      <HomePage 
        user={user} 
        onLogout={handleLogout} 
        onGoToOnboarding={() => setCurrentView('onboarding')} 
      />
    );
  }

  // Fallback por defecto
  return <LandingPage onGetStarted={() => setCurrentView('login')} />;
}

export default App;