import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/ui/StatCard';
import { Gift, ShoppingBag, TrendingUp, Plus, Loader2, AlertCircle, Sparkles, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

interface DashboardStats {
  completedOrders: number;
  totalSpent: number;
  recentOrders: any[];
}

export const ClientDashboard: React.FC = () => {
  const { profile, user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    completedOrders: 0,
    totalSpent: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        setError(null);
        const { data: allOrders, error: statsError } = await supabase
          .from('orders')
          .select('total_price, status')
          .eq('client_id', user.id);

        if (statsError) throw statsError;

        let completedCount = 0;
        let spent = 0;

        allOrders?.forEach(o => {
          if (o.status === 'completed') {
            completedCount++;
            spent += Number(o.total_price);
          }
        });

        const { data: recent, error: recentError } = await supabase
          .from('orders')
          .select('id, created_at, total_price, status, locals(name)')
          .eq('client_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (recentError) throw recentError;

        setStats({
          completedOrders: completedCount,
          totalSpent: spent,
          recentOrders: recent || []
        });

      } catch (err: any) {
        console.error('Error loading client dashboard:', JSON.stringify(err, null, 2));
        setError(err.message || 'Error cargando datos. Ver consola.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { class: string; label: string }> = {
      completed: { class: 'badge-success', label: 'Completado' },
      processing: { class: 'badge-info', label: 'Imprimiendo' },
      pending: { class: 'badge-warning', label: 'Pendiente' },
    };
    const s = statusMap[status] || { class: 'badge-pending', label: status };
    return <span className={`badge ${s.class}`}>{s.label}</span>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="animate-spin w-8 h-8 text-accent mx-auto mb-3" />
          <p className="text-text-secondary text-sm">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
            Hola, {profile?.first_name}
            <span className="text-2xl">👋</span>
          </h2>
          <p className="text-text-secondary mt-1">Bienvenido a tu panel de impresión.</p>
        </div>
        <Link 
          to="/client/new-order" 
          className="btn-primary flex items-center gap-2 justify-center"
        >
          <Plus size={20} />
          Nuevo Pedido
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-danger/10 border border-danger/20 text-danger p-4 rounded-xl flex items-center gap-3">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}

      {/* Points Hero Card */}
      <div className="card p-6 md:p-8 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-electric/15 rounded-full blur-2xl -ml-24 -mb-24"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-accent" />
                <p className="text-text-secondary text-sm font-medium">Saldo Disponible</p>
              </div>
              <h3 className="text-xl font-bold text-white">Puntos Tecnowork</h3>
            </div>
            <div className="text-left md:text-right">
              <span className="text-5xl font-bold bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
                {profile?.points || 0}
              </span>
              <span className="text-text-muted text-lg ml-2">pts</span>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-8">
            <div className="flex justify-between text-xs text-text-muted mb-3">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-accent"></div>
                Nivel Actual: Plata
              </span>
              <span>Siguiente: Oro (1000 pts)</span>
            </div>
            <div className="w-full bg-surface-subtle rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-accent to-accent-light h-2 rounded-full transition-all duration-1000" 
                style={{ width: `${Math.min(((profile?.points || 0) / 1000) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-sm text-text-secondary mt-3">
              Te faltan <span className="text-white font-semibold">{Math.max(0, 1000 - (profile?.points || 0))}</span> puntos para subir de nivel.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <StatCard 
          title="Pedidos Completados" 
          value={stats.completedOrders} 
          icon={ShoppingBag} 
          color="accent" 
        />
        <StatCard 
          title="Inversión Total" 
          value={`$${stats.totalSpent.toFixed(2)}`} 
          icon={TrendingUp} 
          color="electric" 
        />
        <StatCard 
          title="Canjes Realizados" 
          value="0" 
          icon={Gift} 
          color="purple"
          description="Próximamente" 
        />
      </div>

      {/* Recent Orders */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">Pedidos Recientes</h3>
          <Link 
            to="/client/orders" 
            className="text-sm text-accent font-medium hover:text-accent-light transition-colors flex items-center gap-1"
          >
            Ver todo
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="table-modern">
            <thead>
              <tr>
                <th>ID</th>
                <th>Local</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <div className="text-text-muted">
                      <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-40" />
                      <p>No hay pedidos recientes.</p>
                      <Link to="/client/new-order" className="text-accent text-sm mt-2 inline-block">
                        Crear tu primer pedido →
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                stats.recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="font-mono text-sm text-white">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="text-text-secondary">
                      {Array.isArray(order.locals) ? order.locals[0]?.name : order.locals?.name || '---'}
                    </td>
                    <td className="text-text-muted text-sm">
                      {new Date(order.created_at).toLocaleDateString('es-AR')}
                    </td>
                    <td className="font-semibold text-white">${order.total_price}</td>
                    <td>{getStatusBadge(order.status)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
