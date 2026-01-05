import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/ui/StatCard';
import { Gift, ShoppingBag, TrendingUp, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ClientDashboard: React.FC = () => {
  const { profile } = useAuth();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Hola, {profile?.first_name} 👋</h2>
          <p className="text-gray-500 mt-1">Bienvenido a tu panel de impresión.</p>
        </div>
        <Link to="/client/new-order" className="bg-primary-blue text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all flex items-center gap-2">
          <Plus size={20} />
          Nuevo Pedido
        </Link>
      </div>

      {/* Points Progress */}
      <div className="bg-gray-900 text-white p-8 rounded-2xl relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-blue/30 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-secondary-yellow/20 rounded-full blur-2xl -ml-10 -mb-10"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
             <div>
               <p className="text-gray-400 text-sm font-medium mb-1">Saldo Disponible</p>
               <h3 className="text-2xl font-bold">Puntos Tecnowork</h3>
             </div>
             <div className="text-right">
                <span className="text-4xl font-bold text-secondary-yellow">{profile?.points || 0}</span>
                <span className="text-sm text-gray-300 block">pts</span>
             </div>
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span>Nivel Actual: Plata</span>
              <span>Siguiente: Oro (1000 pts)</span>
            </div>
            <div className="w-full bg-gray-700/50 rounded-full h-3 mb-2 backdrop-blur-sm">
              <div 
                className="bg-gradient-to-r from-secondary-yellow to-orange-400 h-3 rounded-full transition-all duration-1000" 
                style={{ width: `${Math.min(((profile?.points || 0) / 1000) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-400 mt-2">Te faltan <span className="text-white font-bold">{1000 - (profile?.points || 0)}</span> puntos para subir de nivel.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Pedidos Completados" 
          value="12" 
          icon={ShoppingBag} 
          color="text-primary-blue" 
        />
        <StatCard 
          title="Inversión Total" 
          value="$345.00" 
          icon={TrendingUp} 
          color="text-success-green" 
        />
        <StatCard 
          title="Canjes Realizados" 
          value="2" 
          icon={Gift} 
          color="text-purple-600" 
        />
      </div>

      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
           <h3 className="text-lg font-bold text-gray-900">Pedidos Recientes</h3>
           <Link to="/client/orders" className="text-sm text-primary-blue font-medium hover:underline">Ver todo</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">ID</th>
                <th className="pb-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Local</th>
                <th className="pb-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Fecha</th>
                <th className="pb-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Total</th>
                <th className="pb-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="group hover:bg-gray-50 transition-colors">
                <td className="py-4 font-medium text-gray-900">#ORD-001</td>
                <td className="py-4 text-gray-600">Sucursal Central</td>
                <td className="py-4 text-gray-500 text-sm">12 Oct, 2023</td>
                <td className="py-4 font-semibold text-gray-900">$15.50</td>
                <td className="py-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                    Completado
                  </span>
                </td>
              </tr>
              <tr className="group hover:bg-gray-50 transition-colors">
                <td className="py-4 font-medium text-gray-900">#ORD-002</td>
                <td className="py-4 text-gray-600">Sucursal Norte</td>
                <td className="py-4 text-gray-500 text-sm">15 Oct, 2023</td>
                <td className="py-4 font-semibold text-gray-900">$8.00</td>
                <td className="py-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                    En Proceso
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};