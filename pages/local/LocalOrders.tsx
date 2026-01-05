import React, { useEffect, useState } from 'react';
import { Download, Printer, CheckCircle, Loader2, AlertCircle, Archive } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

interface OrderItem {
  id: string;
  created_at: string;
  status: string;
  total_price: number;
  profiles: {
    first_name: string;
    last_name: string;
  } | null;
}

export const LocalOrders: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [localId, setLocalId] = useState<string | null>(null);

  const fetchOrders = async () => {
    if (!user) return;
    try {
        setLoading(true);
        // 1. Determine Local ID
        let currentLocalId = localId;
        if (!currentLocalId) {
             const { data: local } = await supabase.from('locals').select('id').eq('manager_id', user.id).single();
             if (local) {
                 setLocalId(local.id);
                 currentLocalId = local.id;
             } else {
                 setLoading(false);
                 return; 
             }
        }

        // 2. Fetch Orders
        const { data } = await supabase
            .from('orders')
            .select('id, created_at, status, total_price, profiles(first_name, last_name)')
            .eq('local_id', currentLocalId)
            .order('created_at', { ascending: false }); // Newest first

        if (data) setOrders(data as unknown as OrderItem[]);
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const updateStatus = async (orderId: string, newStatus: string) => {
      // Optimistic Update
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));

      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);
      
      if (error) {
          alert('Error actualizando estado');
          fetchOrders(); // Revert
      }
  };

  if (loading && !localId) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-white" /></div>;

  if (!localId && !loading) return (
      <div className="glass-card p-8 text-center rounded-2xl">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />
          <h2 className="text-xl font-bold">Sin Local Asignado</h2>
          <p>No tienes permisos de gestión para ningún local.</p>
      </div>
  );

  const pending = orders.filter(o => o.status === 'pending');
  const processing = orders.filter(o => o.status === 'processing');
  const ready = orders.filter(o => o.status === 'ready');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <h2 className="text-3xl font-bold text-white drop-shadow-md">Gestión de Pedidos</h2>
         <button onClick={fetchOrders} className="text-white text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg">Actualizar</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Pending Column */}
        <div className="space-y-4">
          <h3 className="font-bold text-white drop-shadow-md flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-400"></span> Pendientes ({pending.length})
          </h3>
          {pending.length === 0 && <div className="glass-card p-4 rounded-xl opacity-60 text-center text-sm">Sin pedidos pendientes</div>}
          {pending.map(order => (
            <div key={order.id} className="glass-card p-4 rounded-xl border-l-4 border-yellow-400">
              <div className="flex justify-between mb-2">
                <span className="font-bold text-gray-800 text-xs uppercase">#{order.id.slice(0, 8)}</span>
                <span className="text-xs text-gray-500">{new Date(order.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
              </div>
              <p className="text-sm text-gray-700 mb-2 font-bold">{order.profiles?.first_name} {order.profiles?.last_name}</p>
              <p className="text-xs text-gray-500 mb-4">Total: ${order.total_price}</p>
              <div className="flex gap-2">
                <button className="flex-1 bg-gray-100 text-gray-400 py-2 rounded-lg text-sm font-semibold cursor-not-allowed flex items-center justify-center gap-2" title="Descarga de archivos pendiente de implementar">
                  <Download size={14} /> Archivos
                </button>
                <button 
                  onClick={() => updateStatus(order.id, 'processing')}
                  className="flex-1 bg-primary-blue text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 shadow-md"
                >
                  Aceptar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Processing Column */}
        <div className="space-y-4">
          <h3 className="font-bold text-white drop-shadow-md flex items-center gap-2">
             <span className="w-3 h-3 rounded-full bg-blue-400"></span> En Proceso ({processing.length})
          </h3>
          {processing.length === 0 && <div className="glass-card p-4 rounded-xl opacity-60 text-center text-sm">Nada en impresión</div>}
          {processing.map(order => (
            <div key={order.id} className="glass-card p-4 rounded-xl border-l-4 border-blue-400">
               <div className="flex justify-between mb-2">
                <span className="font-bold text-gray-800 text-xs uppercase">#{order.id.slice(0, 8)}</span>
                <span className="text-xs text-gray-500">{new Date(order.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
              </div>
              <p className="text-sm text-gray-700 mb-4 font-bold">{order.profiles?.first_name} {order.profiles?.last_name}</p>
              <button 
                onClick={() => updateStatus(order.id, 'ready')}
                className="w-full bg-green-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-green-600 flex items-center justify-center gap-2 shadow-md"
              >
                <CheckCircle size={14} /> Marcar Listo
              </button>
            </div>
          ))}
        </div>

        {/* Ready Column */}
        <div className="space-y-4">
          <h3 className="font-bold text-white drop-shadow-md flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-400"></span> Listos para Retiro ({ready.length})
          </h3>
          {ready.length === 0 && <div className="glass-card p-4 rounded-xl opacity-60 text-center text-sm">Cola de retiro vacía</div>}
          {ready.map(order => (
            <div key={order.id} className="glass-card p-4 rounded-xl border-l-4 border-green-400 opacity-90">
               <div className="flex justify-between mb-2">
                <span className="font-bold text-gray-800 text-xs uppercase">#{order.id.slice(0, 8)}</span>
                <span className="text-xs text-gray-500">{new Date(order.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
              </div>
              <p className="text-sm text-gray-700 mb-4 font-bold">{order.profiles?.first_name} {order.profiles?.last_name}</p>
              <button 
                onClick={() => updateStatus(order.id, 'completed')}
                className="w-full border border-gray-300 text-gray-600 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 flex items-center justify-center gap-2"
              >
                <Archive size={14} /> Entregar / Archivar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};