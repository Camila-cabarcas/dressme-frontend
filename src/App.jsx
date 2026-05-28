import { useState } from 'react';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';

function App() {
  const [currentView, setCurrentView] = useState('landing');

  return currentView === 'login' ? (
    <LoginPage onBack={() => setCurrentView('landing')} />
  ) : (
    <LandingPage onGetStarted={() => setCurrentView('login')} />
  );
}

export default App;
