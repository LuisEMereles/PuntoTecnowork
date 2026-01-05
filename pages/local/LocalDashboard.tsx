import React, { useEffect, useState } from 'react';
import { StatCard } from '../../components/ui/StatCard';
import { ShoppingBag, Clock, DollarSign, Award, Loader2, AlertCircle, ArrowUpRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export const LocalDashboard: React.FC = () => {
  const { user } = useAuth();
  const [localData, setLocalData] = useState<any>(null);
  const [stats, setStats] = useState({
    incomeToday: 0,
    pending: 0,
    completed: 0,
    rewards: 0
  });
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchLocalData = async () => {
      try {
        const { data: local, error: localError } = await supabase
          .from('locals')
          .select('id, name')
          .eq('manager_id', user.id)
          .single();

        if (localError || !local) {
          setError('No tienes un local asignado. Contacta al administrador.');
          setLoading(false);
          return;
        }

        setLocalData(local);

        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select('id, created_at, status, total_price, profiles(first_name, last_name)')
          .eq('local_id', local.id)
          .order('created_at', { ascending: false });

        if (ordersError) throw ordersError;

        let income = 0;
        let pendingCount = 0;
        let completedCount = 0;
        const today = new Date().toDateString();

        orders?.forEach(o => {
          if (o.status === 'completed') completedCount++;
          if (o.status === 'pending' || o.status === 'processing') pendingCount++;
          
          if (new Date(o.created_at).toDateString() === today) {
            income += Number(o.total_price);
          }
        });

        setStats({
          incomeToday: income,
          pending: pendingCount,
          completed: completedCount,
          rewards: 0
        });

        const activeQueue = orders?.filter(o => o.status === 'pending' || o.status === 'processing').slice(0, 5) || [];
        setQueue(activeQueue);

      } catch (err) {
        console.error(err);
        setError('Error cargando datos del local.');
      } finally {
        setLoading(false);
      }
    };

    fetchLocalData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="animate-spin w-8 h-8 text-accent mx-auto mb-3" />
          <p className="text-text-secondary text-sm">Cargando datos del local...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="card p-8 text-center">
        <AlertCircle className="w-12 h-12 text-danger mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white">{error}</h3>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-up">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-2">Panel de Local</h2>
        <p className="text-text-secondary">
          Gestión de sucursal: <span className="font-semibold text-electric">{localData?.name}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard 
          title="Ingresos del Día" 
          value={`$${stats.incomeToday.toFixed(2)}`} 
          icon={DollarSign} 
          color="success" 
        />
        <StatCard 
          title="Pedidos Pendientes" 
          value={stats.pending} 
          icon={Clock} 
          color="accent" 
        />
        <StatCard 
          title="Pedidos Completados" 
          value={stats.completed} 
          icon={ShoppingBag} 
          color="electric" 
        />
        <StatCard 
          title="Premios Entregados" 
          value={stats.rewards} 
          icon={Award} 
          color="purple" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Queue */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Cola de Pedidos Activa</h3>
            <Link 
              to="/local/orders" 
              className="text-sm text-accent font-medium hover:text-accent-light transition-colors flex items-center gap-1"
            >
              Ver todos
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {queue.length === 0 ? (
              <p className="text-text-muted text-sm italic py-4">No hay pedidos pendientes en este momento.</p>
            ) : (
              queue.map((order, index) => (
                <div 
                  key={order.id} 
                  className="p-4 bg-surface-subtle border border-white/5 rounded-xl hover:border-white/10 transition-all cursor-pointer"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-white">#{order.id.slice(0, 8).toUpperCase()}</h4>
                      <p className="text-sm text-text-muted">
                        {order.profiles?.first_name} {order.profiles?.last_name} • {new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                    <span className={`badge ${
                      order.status === 'pending' ? 'badge-warning' : 'badge-info'
                    }`}>
                      {order.status === 'pending' ? 'Pendiente' : 'Imprimiendo'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card p-6">
          <h3 className="text-lg font-bold text-white mb-6">Acciones Rápidas</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link 
              to="/local/orders" 
              className="p-4 bg-accent/10 border border-accent/20 text-accent rounded-xl font-semibold hover:bg-accent/20 transition-all flex flex-col items-center justify-center gap-2"
            >
              <ShoppingBag className="w-6 h-6" />
              <span className="text-sm">Procesar Pedidos</span>
            </Link>
            <button 
              disabled 
              className="p-4 bg-surface-subtle border border-white/5 text-text-muted rounded-xl font-semibold flex flex-col items-center justify-center gap-2 opacity-50 cursor-not-allowed"
            >
              <DollarSign className="w-6 h-6" />
              <span className="text-sm">Ajustar Precios</span>
            </button>
            <button 
              disabled 
              className="p-4 bg-surface-subtle border border-white/5 text-text-muted rounded-xl font-semibold flex flex-col items-center justify-center gap-2 opacity-50 cursor-not-allowed"
            >
              <Award className="w-6 h-6" />
              <span className="text-sm">Entregar Premio</span>
            </button>
            <button 
              disabled 
              className="p-4 bg-surface-subtle border border-white/5 text-text-muted rounded-xl font-semibold flex flex-col items-center justify-center gap-2 opacity-50 cursor-not-allowed"
            >
              <Clock className="w-6 h-6" />
              <span className="text-sm">Ver Historial</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
