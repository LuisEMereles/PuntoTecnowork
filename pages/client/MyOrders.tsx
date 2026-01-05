import React from 'react';
import { FileText, Clock, MapPin } from 'lucide-react';

export const MyOrders: React.FC = () => {
  // Mock data
  const orders = [
    { id: 'ORD-001', date: '2023-10-24', status: 'completed', total: 12.50, local: 'Sucursal Central', files: 2 },
    { id: 'ORD-002', date: '2023-10-25', status: 'processing', total: 4.50, local: 'Sucursal Norte', files: 1 },
    { id: 'ORD-003', date: '2023-10-26', status: 'pending', total: 8.00, local: 'Sucursal Central', files: 3 },
  ];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'completed': return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Completado</span>;
      case 'processing': return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">Imprimiendo</span>;
      case 'pending': return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">Pendiente</span>;
      default: return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white drop-shadow-md">Mis Pedidos</h2>
      
      <div className="glass-card rounded-2xl overflow-hidden">
        {orders.map((order) => (
          <div key={order.id} className="p-6 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-primary-blue">
                  <FileText />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">Pedido #{order.id}</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Clock size={14} /> {order.date}</span>
                    <span className="flex items-center gap-1"><MapPin size={14} /> {order.local}</span>
                    <span>{order.files} archivo(s)</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                <div className="text-right">
                  <p className="text-sm text-gray-400">Total</p>
                  <p className="font-bold text-gray-800 text-lg">${order.total.toFixed(2)}</p>
                </div>
                {getStatusBadge(order.status)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};