import { useEffect, useRef, useState } from 'react';
import {
  Home,
  Shirt,
  Zap,
  Heart,
  Settings,
  HelpCircle,
  ChevronDown,
  LogOut,
  Plus,
} from 'lucide-react';

const filtersConfig = [
  { label: 'Estilo', options: ['Casual', 'Formal', 'Sport', 'Minimalista'] },
  { label: 'Ocasión', options: ['Trabajo', 'Fiesta', 'Diaria', 'Noche'] },
  { label: 'Color', options: ['Negro', 'Blanco', 'Beige', 'Azul'] },
  { label: 'Clima', options: ['Templado', 'Frío', 'Caluroso', 'Lluvioso'] },
  { label: 'Tipo de Prenda', options: ['Abrigo', 'Vestido', 'Camisa', 'Pantalón'] },
  { label: 'Categoría', options: ['Exterior', 'Interior', 'Accesorios', 'Calzado'] },
];

const garmentsMock = [
  {
    id: 1,
    name: 'Chaqueta Denim',
    style: 'Casual',
    type: 'Abrigo',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 2,
    name: 'Blazer Negro',
    style: 'Formal',
    type: 'Saco',
    image: 'https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 3,
    name: 'Vestido Midi',
    style: 'Elegant',
    type: 'Vestido',
    image: 'https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 4,
    name: 'Camisa Blanca',
    style: 'Minimalista',
    type: 'Camisa',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 5,
    name: 'Pantalón Cargo',
    style: 'Street',
    type: 'Pantalón',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80&sat=-20',
  },
  {
    id: 6,
    name: 'Abrigo Camel',
    style: 'Chic',
    type: 'Abrigo',
    image: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 7,
    name: 'Falda Plisada',
    style: 'Femenino',
    type: 'Falda',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 8,
    name: 'Suéter Beige',
    style: 'Cálido',
    type: 'Jersey',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
  },
];

const WardrobePage = ({ user, onLogout, onAddCloth, onGoToHome }) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [filters, setFilters] = useState({
    Estilo: 'Casual',
    Ocasión: 'Trabajo',
    Color: 'Negro',
    Clima: 'Templado',
    'Tipo de Prenda': 'Abrigo',
    Categoría: 'Exterior',
  });
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const userData = localStorage.getItem('dressme_user');
    if (!authToken || !userData) {
      window.location.href = '/login';
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name) => {
    if (!name) return 'DM';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  };

  const handleFilterChange = (label, value) => {
    setFilters((prev) => ({ ...prev, [label]: value }));
  };

  return (
    <div className="min-h-screen bg-brand-cream">
      <aside className="fixed left-0 top-0 w-64 h-screen bg-brand-cream border-r border-brand-sand flex flex-col justify-between p-6 z-50">
        <div>
          <div className="font-serif italic text-2xl font-normal text-brand-dark tracking-wide select-none cursor-pointer">
            DressMe
          </div>

          <nav className="flex flex-col gap-3 mt-12">
            <button
              onClick={() => onGoToHome && onGoToHome()}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-sm font-medium text-brand-dark hover:bg-brand-sand/40"
            >
              <Home className="w-5 h-5" />
              Inicio
            </button>
            <button
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-brand-charcoal text-white text-sm font-medium"
            >
              <Shirt className="w-5 h-5" />
              Mi Armario
            </button>
            <button
              className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-sm font-medium text-brand-dark hover:bg-brand-sand/40"
            >
              <Zap className="w-5 h-5" />
              Outfits
            </button>
            <button
              className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-sm font-medium text-brand-dark hover:bg-brand-sand/40"
            >
              <Heart className="w-5 h-5" />
              Favoritos
            </button>
            <button
              className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-sm font-medium text-brand-dark hover:bg-brand-sand/40"
            >
              <Settings className="w-5 h-5" />
              Configuración
            </button>
          </nav>
        </div>

        <button className="flex items-center gap-3 px-4 py-3 rounded-2xl text-brand-dark/60 hover:text-brand-dark hover:bg-brand-sand/40 transition-all duration-200 text-sm font-medium">
          <HelpCircle className="w-5 h-5" />
          Ayuda
        </button>
      </aside>

      <main className="ml-64">
        <header className="bg-brand-cream border-b border-brand-sand px-8 py-8 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-serif font-bold text-brand-dark mb-2">Mis Prendas</h1>
            <p className="text-sm text-brand-dark/60">{garmentsMock.length} prendas</p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
            <button
              onClick={() => onAddCloth && onAddCloth()}
              className="btn-shimmer inline-flex items-center gap-2 rounded-full bg-brand-charcoal px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:opacity-90"
            >
              <Plus className="w-4 h-4" />
              + Agregar Prenda
            </button>

            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.displayName}
                    className="w-12 h-12 rounded-full object-cover border border-brand-dark/10"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-brand-charcoal text-white flex items-center justify-center text-sm font-semibold">
                    {getInitials(user?.displayName)}
                  </div>
                )}
                <div className="text-left hidden lg:block">
                  <p className="text-sm font-semibold text-brand-dark">{user?.displayName || 'Usuario'}</p>
                  <p className="text-xs text-brand-dark/60">Entusiasta de la Moda</p>
                </div>
                <ChevronDown className="w-4 h-4 text-brand-dark/40" />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 glass-effect rounded-2xl shadow-lg z-50 overflow-hidden">
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-brand-dark hover:bg-brand-sand/40 transition-colors text-sm font-medium text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <section className="px-8 py-8 space-y-8">
          <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none">
            {filtersConfig.map((filter) => (
              <div key={filter.label} className="relative min-w-[180px]">
                <select
                  value={filters[filter.label]}
                  onChange={(e) => handleFilterChange(filter.label, e.target.value)}
                  className="w-full appearance-none rounded-3xl border border-brand-sand bg-white px-4 py-3 pr-10 text-sm text-brand-dark outline-none transition-all duration-200 hover:border-brand-dark/30"
                >
                  {filter.options.map((option) => (
                    <option key={option} value={option} className="bg-white text-brand-dark">
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-dark/40" />
              </div>
            ))}
          </div>

          {garmentsMock.length > 0 ? (
            <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
              {garmentsMock.map((garment) => (
                <div key={garment.id} className="rounded-3xl bg-white shadow-[0_12px_40px_rgba(44,42,41,0.08)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_18px_60px_rgba(44,42,41,0.1)] overflow-hidden">
                  <div className="h-64 overflow-hidden bg-brand-sand/30">
                    <img src={garment.image} alt={garment.name} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-semibold text-brand-dark mb-1">{garment.name}</p>
                    <p className="text-xs text-brand-dark/60">{garment.style} — {garment.type}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl glass-effect p-12 text-center">
              <div className="flex items-center justify-center mb-4">
                <Shirt className="w-16 h-16 text-brand-dark/40" />
              </div>
              <h3 className="text-3xl font-serif font-bold text-brand-dark mb-2">Tu armario está vacío</h3>
              <p className="text-sm text-brand-dark/60 mb-6">Comienza subiendo tu primera prenda</p>
              <button
                onClick={() => onAddCloth && onAddCloth()}
                className="btn-shimmer inline-flex items-center gap-2 rounded-full bg-brand-charcoal px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:opacity-90"
              >
                <Plus className="w-4 h-4" />
                + Agregar Prenda
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default WardrobePage;
