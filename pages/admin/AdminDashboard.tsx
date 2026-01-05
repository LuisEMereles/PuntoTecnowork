import React from 'react';
import { StatCard } from '../../components/ui/StatCard';
import { DollarSign, ShoppingBag, Users, Store } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Lun', ventas: 4000 },
  { name: 'Mar', ventas: 3000 },
  { name: 'Mie', ventas: 2000 },
  { name: 'Jue', ventas: 2780 },
  { name: 'Vie', ventas: 1890 },
  { name: 'Sab', ventas: 2390 },
  { name: 'Dom', ventas: 3490 },
];

export const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Panel de Administrador</h2>
        <p className="text-gray-500 mt-1">Visión general del rendimiento del negocio</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Ingresos Totales" 
          value="$12,450" 
          icon={DollarSign} 
          color="text-success-green"
          description="+15% vs mes anterior" 
        />
        <StatCard 
          title="Pedidos Totales" 
          value="1,234" 
          icon={ShoppingBag} 
          color="text-primary-blue"
          description="32 activos ahora" 
        />
        <StatCard 
          title="Clientes" 
          value="856" 
          icon={Users} 
          color="text-purple-600" 
          description="+45 esta semana"
        />
        <StatCard 
          title="Locales Activos" 
          value="5" 
          icon={Store} 
          color="text-secondary-yellow" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Tendencia de Ventas</h3>
            <select className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg p-2 outline-none">
              <option>Esta semana</option>
              <option>Este mes</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B'}} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  cursor={{fill: '#F1F5F9'}}
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: '#1E293B' }}
                />
                <Bar dataKey="ventas" fill="#4285F4" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Actividad Reciente</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-sm font-bold text-blue-600 shrink-0 border border-blue-100">
                  JD
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Nuevo pedido <span className="text-primary-blue font-bold">#10{i}</span></p>
                  <p className="text-xs text-gray-500 mt-1">Usuario envió archivos para impresión color.</p>
                  <p className="text-xs text-gray-400 mt-2">Hace {i * 10} minutos</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};