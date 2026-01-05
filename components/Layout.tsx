import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  ShoppingCart, 
  Gift, 
  BarChart3, 
  LogOut,
  FileText,
  CreditCard,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { NavItem } from '../types';

export const Layout: React.FC = () => {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const getNavItems = (): NavItem[] => {
    if (!profile) return [];

    switch (profile.role) {
      case 'admin':
        return [
          { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
          { label: 'Usuarios', path: '/admin/users', icon: Users },
          { label: 'Locales', path: '/admin/locals', icon: Store },
          { label: 'Pedidos', path: '/admin/orders', icon: ShoppingCart },
          { label: 'Recompensas', path: '/admin/rewards', icon: Gift },
          { label: 'Precios', path: '/admin/global-prices', icon: CreditCard },
          { label: 'Reportes', path: '/admin/reports', icon: BarChart3 },
        ];
      case 'local':
        return [
          { label: 'Dashboard', path: '/local/dashboard', icon: LayoutDashboard },
          { label: 'Pedidos', path: '/local/orders', icon: ShoppingCart },
          { label: 'Precios', path: '/local/prices', icon: CreditCard },
          { label: 'Reportes', path: '/local/reports', icon: BarChart3 },
        ];
      case 'client':
        return [
          { label: 'Inicio', path: '/client/dashboard', icon: LayoutDashboard },
          { label: 'Nuevo Pedido', path: '/client/new-order', icon: FileText },
          { label: 'Mis Pedidos', path: '/client/orders', icon: ShoppingCart },
          { label: 'Mis Puntos', path: '/client/points', icon: Users },
          { label: 'Canjear', path: '/client/rewards', icon: Gift },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    // Eliminamos el bg-[#F8FAFC] para que se vea el gradiente del body
    <div className="flex h-screen w-full overflow-hidden">
      {/* Mobile Menu Button */}
      <button 
        className="fixed top-4 left-4 z-50 md:hidden p-2 bg-white rounded-lg shadow-md border border-gray-100"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={20} className="text-gray-600" /> : <Menu size={20} className="text-gray-600" />}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Usamos glass-sidebar para el efecto translúcido */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 glass-sidebar transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 flex flex-col shadow-xl md:shadow-none
      `}>
        <div className="p-8 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-primary-blue rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              Punto<span className="text-primary-blue">Tecnowork</span>
            </h1>
          </div>
          <p className="text-xs text-gray-500 font-medium pl-10 uppercase tracking-widest mt-1">
            {profile?.role === 'admin' ? 'Administración' : profile?.role === 'local' ? 'Gestión Local' : 'Panel Cliente'}
          </p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium
                  ${isActive 
                    ? 'bg-primary-blue text-white shadow-md' 
                    : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'}
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight size={14} className="text-white" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 m-4 bg-white/50 rounded-2xl border border-white/60 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-primary-blue font-bold shadow-sm">
              {profile?.first_name?.[0]}{profile?.last_name?.[0]}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-gray-900 truncate">
                {profile?.first_name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {profile?.email}
              </p>
            </div>
          </div>
          
          {profile?.role === 'client' && (
             <div className="mb-3 px-3 py-2 bg-white/80 rounded-lg border border-gray-100 shadow-sm flex justify-between items-center">
               <span className="text-xs text-gray-500 font-medium">Mis Puntos</span>
               <span className="text-sm font-bold text-secondary-yellow">{profile.points}</span>
             </div>
          )}

          <button
            onClick={() => signOut()}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-white/80 border border-gray-200 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-colors text-sm font-medium shadow-sm"
          >
            <LogOut size={16} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative h-full">
        <div className="p-6 md:p-10 max-w-7xl mx-auto pb-20 animate-fade-in-up">
          <Outlet />
        </div>
      </main>
    </div>
  );
};