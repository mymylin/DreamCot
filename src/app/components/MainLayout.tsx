import { Outlet, Link, useNavigate, useLocation } from 'react-router';
import { Home, ShirtIcon, PlusCircle, Sparkles, BookMarked, Filter, TrendingUp, ShoppingBag, Info, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { storage } from '../utils/storage';

export function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!storage.isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);

  const navItems = [
    { path: '/app', icon: Home, label: 'Painel' },
    { path: '/app/closet', icon: ShirtIcon, label: 'Meu Guarda-Roupa' },
    { path: '/app/add-item', icon: PlusCircle, label: 'Adicionar Peça' },
    { path: '/app/look-builder', icon: Sparkles, label: 'Criador de Look' },
    { path: '/app/looks', icon: BookMarked, label: 'Meus Looks' },
    { path: '/app/filters', icon: Filter, label: 'Filtros' },
    { path: '/app/trends', icon: TrendingUp, label: 'Tendências' },
    { path: '/app/conscious-buyer', icon: ShoppingBag, label: 'Compra Inteligente' },
    { path: '/app/about', icon: Info, label: 'Sobre' },
  ];

  const isActive = (path: string) => {
    if (path === '/app') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col">
      <header className="bg-[#733D26] text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold tracking-widest">DREAMCLOSET</h1>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <div className="flex-1 flex">
        <nav
          className={`
            fixed lg:static inset-0 top-[64px] lg:top-0 z-40
            bg-[#FAF9F6] border-r border-pink-100
            w-64 lg:w-64 transition-transform duration-300
            ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
          aria-label="Navegação principal"
        >
          <ul className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg
                      transition-colors min-h-[44px]
                      ${active
                        ? 'bg-[#FFB6C1] text-[#733D26] font-medium'
                        : 'text-gray-700 hover:bg-pink-50'
                      }
                    `}
                    aria-current={active ? 'page' : undefined}
                  >
                    <Icon size={20} aria-hidden="true" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}

        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-4 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
