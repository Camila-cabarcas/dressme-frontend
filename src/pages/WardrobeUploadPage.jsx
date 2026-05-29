import { useState, useRef, useEffect } from 'react';
import { Cloud, LogOut, ChevronDown, Loader2, AlertCircle } from 'lucide-react';
import GlassContainer from '../components/GlassContainer';

const WardrobeUploadPage = ({ user, onLogout, onUploadComplete }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const fileInputRef = useRef(null);
  const profileMenuRef = useRef(null);

  // Validar autenticación al cargar
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const userData = localStorage.getItem('dressme_user');
    
    if (!authToken || !userData) {
      window.location.href = '/login';
    }
  }, []);

  // Cerrar menú de perfil al hacer click afuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const MAX_SIZE = 8 * 1024 * 1024; // 8MB

  const validateFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      setUploadError('Solo se permiten imágenes (JPG, PNG, GIF, WebP)');
      return false;
    }
    if (file.size > MAX_SIZE) {
      setUploadError('El archivo no puede superar 8MB');
      return false;
    }
    setUploadError('');
    return true;
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      setUploadError('Por favor selecciona una imagen o usa Continuar para saltar este paso');
      return;
    }

    setIsUploading(true);
    setUploadError('');
    setUploadSuccess(true);

    window.setTimeout(() => {
      if (onUploadComplete) {
        onUploadComplete(selectedFile);
      }
      setSelectedFile(null);
      setIsUploading(false);
    }, 700);
  };

  const handleLogout = () => {
    onLogout();
  };

  return (
    <div className="min-h-screen bg-[#F4F0EA] flex flex-col">
      {/* HEADER */}
      <header className="relative z-10 px-6 py-6 md:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="font-serif italic text-2xl font-normal text-brand-dark tracking-wide select-none">
            DressMe
          </div>

          {/* Progress Indicator */}
          <div className="text-center text-sm md:text-base text-brand-dark/70 font-sans font-medium">
            <span className="text-brand-bronze">Paso 3 de 3:</span> Tu Armario Virtual
          </div>

          {/* Profile Section */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-3 hover:opacity-75 transition-opacity"
            >
              {user?.profilePicture && (
                <img
                  src={user.profilePicture}
                  alt={user.displayName}
                  className="w-10 h-10 rounded-full object-cover border border-brand-dark/10"
                />
              )}
              <div className="hidden md:flex flex-col items-end">
                <p className="text-sm font-semibold text-brand-dark">
                  {user?.displayName || 'Usuario'}
                </p>
                <p className="text-xs text-brand-dark/60">
                  {user?.email?.split('@')[0] || ''}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-brand-dark/60" />
            </button>

            {/* Profile Dropdown Menu */}
            {profileMenuOpen && (
              <div className="absolute right-0 top-full mt-2 glass-effect rounded-2xl shadow-xl p-4 w-48 border border-white/40 animate-slide-up z-20">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-brand-dark hover:bg-brand-dark/5 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 py-12 md:py-16">
        <div className="max-w-2xl w-full">
          {/* HERO TEXT */}
          <div className="text-center mb-12 md:mb-16 animate-slide-up">
            <h1 className="text-4xl md:text-5xl font-serif italic font-normal text-brand-dark mb-4">
              Lleva tu armario al mundo digital
            </h1>
            <p className="text-lg md:text-xl text-brand-dark/70 font-sans font-normal">
              Subir tus prendas es el primer paso para crear outfits inteligentes. Nuestra IA las analizará automáticamente.
            </p>
          </div>

          {/* DROPZONE */}
          {!uploadSuccess ? (
            <GlassContainer className="p-8 md:p-12 mb-8 animate-slide-up-delay">
              <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  flex flex-col items-center justify-center py-16 md:py-20 px-6 rounded-3xl
                  border-2 border-dashed transition-all duration-300 cursor-pointer
                  ${isDragging 
                    ? 'border-brand-bronze bg-brand-bronze/5' 
                    : 'border-brand-dark/20 hover:border-brand-bronze/50'
                  }
                `}
              >
                {/* Upload Icon Circle */}
                <div className={`
                  w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center mb-6
                  transition-all duration-300
                  ${isDragging ? 'bg-brand-bronze/20' : 'bg-brand-dark/5'}
                `}>
                  <Cloud className={`
                    w-10 h-10 md:w-12 md:h-12
                    ${isDragging ? 'text-brand-bronze' : 'text-brand-dark/60'}
                  `} />
                </div>

                {/* Upload Text */}
                {selectedFile ? (
                  <div className="text-center">
                    <p className="text-lg font-semibold text-brand-dark mb-1">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-brand-dark/60">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-lg md:text-xl font-semibold text-brand-dark mb-2 text-center">
                      Arrastra tus prendas aquí o haz clic para seleccionar
                    </p>
                    <p className="text-sm text-brand-dark/60 text-center">
                      Formatos permitidos: JPG, PNG, GIF, WebP (máximo 8MB)
                    </p>
                  </>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* AI Benefits Card */}
              <div className="mt-8 p-6 rounded-2xl bg-brand-dark/5 border border-brand-dark/10">
                <p className="text-sm font-semibold text-brand-dark mb-4">
                  Lo que nuestra IA analizará:
                </p>
                <ul className="space-y-3 text-sm text-brand-dark/70">
                  <li className="flex items-start gap-3">
                    <span className="text-brand-bronze font-bold">•</span>
                    <span>Identificación de Color</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-brand-bronze font-bold">•</span>
                    <span>Tipo de prenda</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-brand-bronze font-bold">•</span>
                    <span>Categoría y Estilo</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-brand-bronze font-bold">•</span>
                    <span>Análisis de Estilo Único</span>
                  </li>
                </ul>
              </div>

              {/* Error Message */}
              {uploadError && (
                <div className="mt-6 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{uploadError}</p>
                </div>
              )}
            </GlassContainer>
          ) : (
            // Success State
            <GlassContainer className="p-12 mb-8 text-center animate-slide-up-delay">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 md:w-10 md:h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-serif italic text-brand-dark mb-2">
                ¡Prenda subida con éxito!
              </h3>
              <p className="text-brand-dark/70 mb-6">
                Nuestra IA está analizando tu prenda. Te redireccionaremos en breve...
              </p>
              <div className="flex justify-center">
                <Loader2 className="w-6 h-6 text-brand-bronze animate-spin" />
              </div>
            </GlassContainer>
          )}

          {/* ACTION BUTTONS */}
          {!uploadSuccess && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up-delay-more">
              <button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className={`
                  px-8 py-4 rounded-full font-semibold text-base md:text-lg transition-all duration-300
                  flex items-center justify-center gap-2 min-w-[200px]
                  ${selectedFile && !isUploading
                    ? 'bg-brand-dark text-white hover:opacity-90'
                    : 'bg-brand-dark/50 text-white/70 cursor-not-allowed'
                  }
                `}
              >
                {isUploading && <Loader2 className="w-5 h-5 animate-spin" />}
                Sube tu prenda →
              </button>

              <button
                onClick={() => {
                  // Redirigir a la siguiente vista sin subir
                  if (onUploadComplete) {
                    onUploadComplete(null);
                  }
                }}
                className="px-8 py-4 rounded-full font-semibold text-base md:text-lg transition-all duration-300 border-2 border-brand-dark text-brand-dark hover:bg-brand-dark/5"
              >
                Continuar
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default WardrobeUploadPage;
