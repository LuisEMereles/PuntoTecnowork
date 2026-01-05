import React, { useEffect, useState } from 'react';
import { FileText, Clock, MapPin, Loader2, AlertCircle, ShoppingBag } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

interface OrderWithLocal {
  id: string;
  created_at: string;
  status: string;
  total_price: number;
  points_earned: number;
  locals: {
    name: string;
  } | null;
}

export const MyOrders: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderWithLocal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        setError(null);
        const { data, error } = await supabase
          .from('orders')
          .select('id, created_at, status, total_price, points_earned, locals(name)')
          .eq('client_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data as unknown as OrderWithLocal[]);
      } catch (err: any) {
        console.error('Error fetching orders:', err.message || err);
        setError(err.message || 'No se pudieron cargar los pedidos.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { class: string; label: string }> = {
      completed: { class: 'badge-success', label: 'Completado' },
      processing: { class: 'badge-info', label: 'Imprimiendo' },
      pending: { class: 'badge-warning', label: 'Pendiente' },
      ready: { class: 'bg-purple-500/15 text-purple-400 border border-purple-500/20', label: 'Listo para Retiro' },
      cancelled: { class: 'bg-danger/15 text-danger border border-danger/20', label: 'Cancelado' },
    };
    const s = statusMap[status] || { class: 'badge-pending', label: status };
    return <span className={`badge ${s.class}`}>{s.label}</span>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="animate-spin w-8 h-8 text-accent mx-auto mb-3" />
          <p className="text-text-secondary text-sm">Cargando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Mis Pedidos</h2>
      
      {error && (
        <div className="card p-6 border-l-4 border-danger flex items-center gap-4">
          <AlertCircle className="text-danger w-8 h-8 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-bold text-white">Error</h3>
            <p className="text-text-secondary">{error}</p>
          </div>
        </div>
      )}

      {!error && orders.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 bg-surface-subtle rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="text-text-muted w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No tienes pedidos aún</h3>
          <p className="text-text-secondary mb-6">Cuando realices una impresión, aparecerá aquí.</p>
          <Link to="/client/new-order" className="btn-primary inline-flex">
            Crear primer pedido
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, index) => (
            <div 
              key={order.id} 
              className="card p-6 hover:border-white/10 transition-all group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">
                      Pedido #{order.id.slice(0, 8).toUpperCase()}
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1 text-sm text-text-muted">
                      <span className="flex items-center gap-1">
                        <Clock size={14} className="text-text-muted" /> 
                        {formatDate(order.created_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={14} className="text-text-muted" /> 
                        {Array.isArray(order.locals) ? order.locals[0]?.name : order.locals?.name || 'Local desconocido'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right">
                    <p className="text-xs text-text-muted uppercase font-semibold tracking-wider mb-1">Total</p>
                    <p className="font-bold text-white text-lg">${order.total_price}</p>
                  </div>
                  {getStatusBadge(order.status)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
