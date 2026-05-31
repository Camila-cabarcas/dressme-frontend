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
  ShoppingBag,
} from 'lucide-react';

const WardrobePage = ({
  user,
  onLogout,
  onAddCloth,
  onGoToHome,
  onGoToOutfits,
  onGoToFavorites,
  onGoToConfig,
  prendas = [],
  estilos = [],
  ocasiones = [],
  colores = [],
  climas = [],
  tiposPrenda = [],
  categorias = []
}) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const emptyFilters = { estilo: '', ocasion: '', color: '', clima: '', tipoPrenda: '', categoria: '' };
  const [filters, setFilters] = useState(emptyFilters);
  const [appliedFilters, setAppliedFilters] = useState(emptyFilters);
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

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => setAppliedFilters({ ...filters });

  const handleClearFilters = () => {
    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
  };

  const prendasFiltradas = prendas.filter((p) => {
    if (appliedFilters.estilo     && p.style    !== appliedFilters.estilo)     return false;
    if (appliedFilters.ocasion    && p.ocasion  !== appliedFilters.ocasion)    return false;
    if (appliedFilters.color      && p.color    !== appliedFilters.color)      return false;
    if (appliedFilters.clima      && p.clima    !== appliedFilters.clima)      return false;
    if (appliedFilters.tipoPrenda && p.type     !== appliedFilters.tipoPrenda) return false;
    if (appliedFilters.categoria  && p.category !== appliedFilters.categoria)  return false;
    return true;
  });

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
              onClick={() => onGoToOutfits && onGoToOutfits()}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-sm font-medium text-brand-dark hover:bg-brand-sand/40"
            >
              <Zap className="w-5 h-5" />
              Outfits
            </button>
            <button
              onClick={() => onGoToFavorites && onGoToFavorites()}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-sm font-medium text-brand-dark hover:bg-brand-sand/40"
            >
              <Heart className="w-5 h-5" />
              Favoritos
            </button>
            <button
              onClick={() => onGoToConfig && onGoToConfig()}
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
          <div className="flex items-end gap-6">
            <div>
              <h1 className="text-4xl font-serif font-bold text-brand-dark mb-2">Mis Prendas</h1>
              <p className="text-sm text-brand-dark/60">{prendas.length} prendas</p>
            </div>
            <button
              onClick={() => onAddCloth && onAddCloth()}
              className="btn-shimmer inline-flex items-center gap-2 rounded-full bg-brand-charcoal px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:opacity-90"
            >
              <Plus className="w-4 h-4" />
              Agregar Prenda
            </button>
          </div>

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
        </header>

        <section className="px-8 py-8 space-y-8">
          {/* Filtros */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-end gap-4">
              {/* Estilo */}
              <div className="flex-1 min-w-[120px]">
                <label className="text-xs font-semibold text-brand-dark mb-2 block">Estilo</label>
                <div className="relative">
                  <select
                    value={filters.estilo}
                    onChange={(e) => handleFilterChange('estilo', e.target.value)}
                    className="w-full appearance-none rounded-3xl border border-brand-sand bg-white px-3 py-2 pr-8 text-xs text-brand-dark outline-none transition-all duration-200 hover:border-brand-dark/30"
                  >
                    <option value="">— Todas —</option>
                    {estilos.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-brand-dark/40" />
                </div>
              </div>

              {/* Ocasión */}
              <div className="flex-1 min-w-[120px]">
                <label className="text-xs font-semibold text-brand-dark mb-2 block">Ocasión</label>
                <div className="relative">
                  <select
                    value={filters.ocasion}
                    onChange={(e) => handleFilterChange('ocasion', e.target.value)}
                    className="w-full appearance-none rounded-3xl border border-brand-sand bg-white px-3 py-2 pr-8 text-xs text-brand-dark outline-none transition-all duration-200 hover:border-brand-dark/30"
                  >
                    <option value="">— Todas —</option>
                    {ocasiones.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-brand-dark/40" />
                </div>
              </div>

              {/* Color */}
              <div className="flex-1 min-w-[120px]">
                <label className="text-xs font-semibold text-brand-dark mb-2 block">Color</label>
                <div className="relative">
                  <select
                    value={filters.color}
                    onChange={(e) => handleFilterChange('color', e.target.value)}
                    className="w-full appearance-none rounded-3xl border border-brand-sand bg-white px-3 py-2 pr-8 text-xs text-brand-dark outline-none transition-all duration-200 hover:border-brand-dark/30"
                  >
                    <option value="">— Todas —</option>
                    {colores.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-brand-dark/40" />
                </div>
              </div>

              {/* Clima */}
              <div className="flex-1 min-w-[120px]">
                <label className="text-xs font-semibold text-brand-dark mb-2 block">Clima</label>
                <div className="relative">
                  <select
                    value={filters.clima}
                    onChange={(e) => handleFilterChange('clima', e.target.value)}
                    className="w-full appearance-none rounded-3xl border border-brand-sand bg-white px-3 py-2 pr-8 text-xs text-brand-dark outline-none transition-all duration-200 hover:border-brand-dark/30"
                  >
                    <option value="">— Todas —</option>
                    {climas.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-brand-dark/40" />
                </div>
              </div>

              {/* Tipo de Prenda */}
              <div className="flex-1 min-w-[120px]">
                <label className="text-xs font-semibold text-brand-dark mb-2 block">Tipo de Prenda</label>
                <div className="relative">
                  <select
                    value={filters.tipoPrenda}
                    onChange={(e) => handleFilterChange('tipoPrenda', e.target.value)}
                    className="w-full appearance-none rounded-3xl border border-brand-sand bg-white px-3 py-2 pr-8 text-xs text-brand-dark outline-none transition-all duration-200 hover:border-brand-dark/30"
                  >
                    <option value="">— Todas —</option>
                    {tiposPrenda.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-brand-dark/40" />
                </div>
              </div>

              {/* Categoría */}
              <div className="flex-1 min-w-[120px]">
                <label className="text-xs font-semibold text-brand-dark mb-2 block">Categoría</label>
                <div className="relative">
                  <select
                    value={filters.categoria}
                    onChange={(e) => handleFilterChange('categoria', e.target.value)}
                    className="w-full appearance-none rounded-3xl border border-brand-sand bg-white px-3 py-2 pr-8 text-xs text-brand-dark outline-none transition-all duration-200 hover:border-brand-dark/30"
                  >
                    <option value="">— Todas —</option>
                    {categorias.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-brand-dark/40" />
                </div>
              </div>

            </div>

            <div className="flex items-center justify-end gap-4">
              <button
                onClick={handleClearFilters}
                className="text-xs font-medium text-brand-dark/60 hover:text-brand-dark transition-colors hover:underline"
              >
                Limpiar filtros
              </button>
              <button
                onClick={handleApplyFilters}
                className="btn-shimmer relative inline-flex items-center rounded-full bg-brand-charcoal px-6 py-2 text-sm font-medium text-white transition-all duration-300 hover:opacity-90 overflow-hidden"
              >
                <span className="relative z-10">Buscar</span>
              </button>
            </div>
          </div>

          {/* Grid de prendas o estado vacío */}
          {prendas.length > 0 ? (
            <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
              {prendasFiltradas.map((prenda) => (
                <div key={prenda.id} className="rounded-3xl bg-white shadow-[0_12px_40px_rgba(44,42,41,0.08)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_18px_60px_rgba(44,42,41,0.1)] overflow-hidden">
                  <div className="h-64 overflow-hidden bg-brand-sand/30">
                    <img src={prenda.image} alt={prenda.name} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-semibold text-brand-dark mb-1">{prenda.name}</p>
                    <p className="text-xs text-brand-dark/60">{prenda.style} — {prenda.type}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl glass-effect p-16 text-center">
              <div className="flex items-center justify-center mb-4">
                <ShoppingBag className="w-16 h-16 text-brand-dark/40" />
              </div>
              <h3 className="text-3xl font-serif font-bold text-brand-dark mb-2">Tu armario está vacío</h3>
              <p className="text-sm text-brand-dark/60 mb-6">Aún no has subido ninguna prenda. ¡Comienza ahora!</p>
              <button
                onClick={() => onAddCloth && onAddCloth()}
                className="btn-shimmer inline-flex items-center gap-2 rounded-full bg-brand-charcoal px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:opacity-90"
              >
                <Plus className="w-4 h-4" />
                Agregar Prenda
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default WardrobePage;
