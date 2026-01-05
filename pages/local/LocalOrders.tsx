import React from 'react';
import { Download, Printer, CheckCircle } from 'lucide-react';

export const LocalOrders: React.FC = () => {
  const orders = [
    { id: 'ORD-9923', client: 'Juan Cliente', time: '10:30 AM', items: '2 PDFs (Color)', status: 'pending' },
    { id: 'ORD-9922', client: 'Maria Lopez', time: '10:15 AM', items: '1 DOC (B/N)', status: 'processing' },
    { id: 'ORD-9921', client: 'Carlos Ruiz', time: '09:45 AM', items: '5 JPGs (Color)', status: 'ready' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white drop-shadow-md">Gestión de Pedidos</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Pending Column */}
        <div className="space-y-4">
          <h3 className="font-bold text-white drop-shadow-md flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-400"></span> Pendientes
          </h3>
          {orders.filter(o => o.status === 'pending').map(order => (
            <div key={order.id} className="glass-card p-4 rounded-xl border-l-4 border-yellow-400">
              <div className="flex justify-between mb-2">
                <span className="font-bold text-gray-800">{order.id}</span>
                <span className="text-xs text-gray-500">{order.time}</span>
              </div>
              <p className="text-sm text-gray-700 mb-4">{order.client}</p>
              <p className="text-xs bg-gray-100 p-2 rounded mb-4">{order.items}</p>
              <div className="flex gap-2">
                <button className="flex-1 bg-primary-blue text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 flex items-center justify-center gap-2">
                  <Download size={14} /> Descargar
                </button>
                <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200">
                  Aceptar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Processing Column */}
        <div className="space-y-4">
          <h3 className="font-bold text-white drop-shadow-md flex items-center gap-2">
             <span className="w-3 h-3 rounded-full bg-blue-400"></span> En Proceso
          </h3>
          {orders.filter(o => o.status === 'processing').map(order => (
            <div key={order.id} className="glass-card p-4 rounded-xl border-l-4 border-blue-400">
               <div className="flex justify-between mb-2">
                <span className="font-bold text-gray-800">{order.id}</span>
                <span className="text-xs text-gray-500">{order.time}</span>
              </div>
              <p className="text-sm text-gray-700 mb-4">{order.client}</p>
              <p className="text-xs bg-gray-100 p-2 rounded mb-4">{order.items}</p>
              <button className="w-full bg-green-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-green-600 flex items-center justify-center gap-2">
                <CheckCircle size={14} /> Marcar Listo
              </button>
            </div>
          ))}
        </div>

        {/* Ready Column */}
        <div className="space-y-4">
          <h3 className="font-bold text-white drop-shadow-md flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-400"></span> Listos para Retiro
          </h3>
          {orders.filter(o => o.status === 'ready').map(order => (
            <div key={order.id} className="glass-card p-4 rounded-xl border-l-4 border-green-400 opacity-80">
               <div className="flex justify-between mb-2">
                <span className="font-bold text-gray-800">{order.id}</span>
                <span className="text-xs text-gray-500">{order.time}</span>
              </div>
              <p className="text-sm text-gray-700 mb-4">{order.client}</p>
              <button className="w-full border border-gray-300 text-gray-500 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50">
                Archivar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};