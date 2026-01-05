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
  Zap
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

  const getRoleLabel = () => {
    switch (profile?.role) {
      case 'admin': return 'Administración';
      case 'local': return 'Gestión Local';
      default: return 'Panel Cliente';
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-surface">
      {/* Mobile Menu Button */}
      <button 
        className="fixed top-4 left-4 z-50 md:hidden p-3 bg-surface-raised rounded-xl border border-white/5 shadow-card"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? (
          <X size={20} className="text-white" />
        ) : (
          <Menu size={20} className="text-white" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 sidebar transform transition-transform duration-300 ease-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 flex flex-col
      `}>
        {/* Logo */}
        <div className="p-6 pb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent-light rounded-xl flex items-center justify-center shadow-glow-accent">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">
                Punto<span className="text-accent">Tecnowork</span>
              </h1>
              <p className="text-[10px] text-text-muted font-medium uppercase tracking-widest">
                {getRoleLabel()}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium
                  ${isActive 
                    ? 'bg-accent text-white shadow-glow-accent' 
                    : 'text-text-secondary hover:bg-surface-subtle hover:text-white'}
                `}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Icon size={18} className={isActive ? 'text-white' : 'text-text-muted group-hover:text-accent'} />
                <span>{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Section */}
        <div className="p-4">
          <div className="bg-surface-subtle rounded-2xl p-4 border border-white/5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-electric to-electric-light flex items-center justify-center text-white font-bold text-sm shadow-glow-electric">
                {profile?.first_name?.[0]}{profile?.last_name?.[0]}
              </div>
              <div className="overflow-hidden flex-1">
                <p className="text-sm font-semibold text-white truncate">
                  {profile?.first_name} {profile?.last_name}
                </p>
                <p className="text-xs text-text-muted truncate">
                  {profile?.email}
                </p>
              </div>
            </div>
            
            {profile?.role === 'client' && (
              <div className="mb-3 px-3 py-2.5 bg-surface-raised rounded-lg border border-white/5 flex justify-between items-center">
                <span className="text-xs text-text-muted font-medium">Puntos</span>
                <span className="text-sm font-bold text-accent">{profile.points || 0}</span>
              </div>
            )}

            <button
              onClick={() => signOut()}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-surface-raised border border-white/5 text-text-secondary rounded-xl hover:bg-danger/10 hover:text-danger hover:border-danger/20 transition-all text-sm font-medium"
            >
              <LogOut size={16} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative h-full">
        <div className="p-4 md:p-8 max-w-7xl mx-auto pb-20">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
