import React, { useEffect, useState } from 'react';
import { StatCard } from '../../components/ui/StatCard';
import { DollarSign, ShoppingBag, Users, Store, Loader2, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '../../lib/supabase';

interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalClients: number;
  activeLocals: number;
}

interface ActivityItem {
  id: string;
  created_at: string;
  status: string;
  profiles: {
    first_name: string;
    last_name: string;
  } | null;
}

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalClients: 0,
    activeLocals: 0
  });
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const { count: ordersCount, data: ordersData } = await supabase.from('orders').select('total_price, created_at');
        const { count: clientsCount } = await supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'client');
        const { count: localsCount } = await supabase.from('locals').select('id', { count: 'exact', head: true });

        const totalRevenue = ordersData?.reduce((acc, curr) => acc + Number(curr.total_price), 0) || 0;

        const last7Days: Record<string, number> = {};
        const days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
        
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const key = days[d.getDay()];
          if(!last7Days[key]) last7Days[key] = 0; 
        }

        ordersData?.forEach(o => {
          const d = new Date(o.created_at);
          const key = days[d.getDay()];
          if (last7Days[key] !== undefined) {
            last7Days[key] += Number(o.total_price);
          }
        });

        const chartDataArray = Object.keys(last7Days).map(key => ({
          name: key,
          ventas: last7Days[key]
        }));

        const { data: recentActivity } = await supabase
          .from('orders')
          .select('id, created_at, status, profiles(first_name, last_name)')
          .order('created_at', { ascending: false })
          .limit(5);

        setStats({
          totalRevenue,
          totalOrders: ordersCount || 0,
          totalClients: clientsCount || 0,
          activeLocals: localsCount || 0
        });

        setActivity(recentActivity as unknown as ActivityItem[] || []);
        setChartData(chartDataArray);

      } catch (error) {
        console.error('Error loading admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="animate-spin w-8 h-8 text-accent mx-auto mb-3" />
          <p className="text-text-secondary text-sm">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-up">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Panel de Administrador</h2>
        <p className="text-text-secondary mt-1">Visión general del rendimiento del negocio</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard 
          title="Ingresos Totales" 
          value={`$${stats.totalRevenue.toFixed(2)}`} 
          icon={DollarSign} 
          color="success"
          description="Global histórico" 
        />
        <StatCard 
          title="Pedidos Totales" 
          value={stats.totalOrders} 
          icon={ShoppingBag} 
          color="accent" 
        />
        <StatCard 
          title="Clientes" 
          value={stats.totalClients} 
          icon={Users} 
          color="purple" 
        />
        <StatCard 
          title="Locales Activos" 
          value={stats.activeLocals} 
          icon={Store} 
          color="electric" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">Tendencia de Ventas</h3>
              <p className="text-text-muted text-sm">Últimos 7 días</p>
            </div>
            <div className="flex items-center gap-2 text-electric text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              <span>+12%</span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#71717a', fontSize: 12 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#71717a', fontSize: 12 }} 
                  tickFormatter={(value) => `$${value}`} 
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  contentStyle={{ 
                    backgroundColor: '#1a1a24', 
                    borderRadius: '12px', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    boxShadow: '0 4px 24px rgba(0,0,0,0.4)' 
                  }}
                  itemStyle={{ color: '#ffffff' }}
                  labelStyle={{ color: '#a1a1aa' }}
                />
                <Bar 
                  dataKey="ventas" 
                  fill="url(#barGradient)" 
                  radius={[6, 6, 0, 0]} 
                  barSize={32} 
                />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff6b35" />
                    <stop offset="100%" stopColor="#ff8c5a" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity */}
        <div className="card p-6">
          <h3 className="text-lg font-bold text-white mb-6">Actividad Reciente</h3>
          <div className="space-y-5">
            {activity.length === 0 ? (
              <p className="text-text-muted text-sm">No hay actividad reciente.</p>
            ) : (
              activity.map((item, index) => (
                <div 
                  key={item.id} 
                  className="flex items-start gap-4"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-sm font-bold text-accent shrink-0 uppercase">
                    {item.profiles?.first_name?.[0] || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">
                      Nuevo pedido <span className="text-accent font-bold">#{item.id.slice(0, 4)}</span>
                    </p>
                    <p className="text-xs text-text-muted mt-1 truncate">
                      {item.profiles?.first_name} {item.profiles?.last_name}
                    </p>
                    <p className="text-xs text-text-muted mt-1">
                      {new Date(item.created_at).toLocaleString('es-AR')}
                    </p>
                  </div>
                  <span className="badge badge-success text-[10px] px-2 py-1">
                    {item.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
