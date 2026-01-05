import React from 'react';
import { StatCard } from '../../components/ui/StatCard';
import { ShoppingBag, Clock, DollarSign, Award } from 'lucide-react';

export const LocalDashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white drop-shadow-md mb-2">Panel de Local</h2>
        <p className="text-white/80">Gestión de sucursal: Centro Comercial</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Ingresos del Día" 
          value="$450.00" 
          icon={DollarSign} 
          color="text-success-green" 
        />
        <StatCard 
          title="Pedidos Pendientes" 
          value="8" 
          icon={Clock} 
          color="text-secondary-yellow" 
        />
        <StatCard 
          title="Pedidos Completados" 
          value="24" 
          icon={ShoppingBag} 
          color="text-primary-blue" 
        />
        <StatCard 
          title="Premios Activos" 
          value="12" 
          icon={Award} 
          color="text-emphasis-red" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-gray-800">Cola de Pedidos</h3>
             <button className="text-sm text-primary-blue font-medium hover:underline">Ver todos</button>
          </div>
          <div className="space-y-4">
            <div className="p-4 border border-gray-100 rounded-xl bg-white hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-gray-800">#ORD-9923</h4>
                  <p className="text-sm text-gray-500">Juan Cliente • Hace 5 min</p>
                </div>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded font-bold">Pendiente</span>
              </div>
              <div className="mt-3 flex gap-2">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">2 Archivos</span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Color</span>
              </div>
            </div>

            <div className="p-4 border border-gray-100 rounded-xl bg-white hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-gray-800">#ORD-9922</h4>
                  <p className="text-sm text-gray-500">Maria Lopez • Hace 15 min</p>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-bold">Imprimiendo</span>
              </div>
              <div className="mt-3 flex gap-2">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">1 Archivo</span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">B/N</span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Acciones Rápidas</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-blue-50 text-primary-blue rounded-xl font-semibold hover:bg-blue-100 transition-colors flex flex-col items-center justify-center gap-2">
              <ShoppingBag />
              Procesar Pedidos
            </button>
            <button className="p-4 bg-purple-50 text-purple-600 rounded-xl font-semibold hover:bg-purple-100 transition-colors flex flex-col items-center justify-center gap-2">
              <DollarSign />
              Ajustar Precios
            </button>
            <button className="p-4 bg-green-50 text-green-600 rounded-xl font-semibold hover:bg-green-100 transition-colors flex flex-col items-center justify-center gap-2">
              <Award />
              Entregar Premio
            </button>
            <button className="p-4 bg-gray-50 text-gray-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors flex flex-col items-center justify-center gap-2">
              <Clock />
              Ver Historial
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};