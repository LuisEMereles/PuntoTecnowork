import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Reward } from '../../types';
import { Plus, Gift, Trash2, Loader2, Save } from 'lucide-react';

export const RewardsManagement: React.FC = () => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newReward, setNewReward] = useState({ name: '', description: '', points_cost: 0 });

  const fetchRewards = async () => {
    setLoading(true);
    const { data } = await supabase.from('rewards').select('*').order('points_cost');
    if (data) setRewards(data as Reward[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  const handleAdd = async () => {
    if (!newReward.name || newReward.points_cost <= 0) return;
    const { error } = await supabase.from('rewards').insert([newReward]);
    if (!error) {
      setNewReward({ name: '', description: '', points_cost: 0 });
      setIsAdding(false);
      fetchRewards();
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Eliminar este premio?')) return;
    const { error } = await supabase.from('rewards').delete().eq('id', id);
    if (!error) fetchRewards();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white drop-shadow-md">Gestión de Recompensas</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-white text-primary-blue px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:shadow-lg transition-all"
        >
          <Plus size={18} /> Nuevo Premio
        </button>
      </div>

      {isAdding && (
        <div className="glass-card p-6 rounded-2xl animate-fade-in-up">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
             <input 
               type="text" 
               placeholder="Nombre del Premio" 
               className="p-2 border rounded-lg"
               value={newReward.name}
               onChange={e => setNewReward({...newReward, name: e.target.value})}
             />
             <input 
               type="text" 
               placeholder="Descripción corta" 
               className="p-2 border rounded-lg"
               value={newReward.description}
               onChange={e => setNewReward({...newReward, description: e.target.value})}
             />
             <input 
               type="number" 
               placeholder="Costo en Puntos" 
               className="p-2 border rounded-lg"
               value={newReward.points_cost}
               onChange={e => setNewReward({...newReward, points_cost: parseInt(e.target.value)})}
             />
           </div>
           <div className="flex gap-2">
             <button onClick={handleAdd} className="bg-success-green text-white px-4 py-2 rounded-lg font-bold flex gap-2 items-center">
               <Save size={16} /> Guardar Premio
             </button>
             <button onClick={() => setIsAdding(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-bold">
               Cancelar
             </button>
           </div>
        </div>
      )}

      <div className="glass-card rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-600">Nombre</th>
              <th className="px-6 py-4 font-semibold text-gray-600">Descripción</th>
              <th className="px-6 py-4 font-semibold text-gray-600">Costo (Puntos)</th>
              <th className="px-6 py-4 font-semibold text-gray-600 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? <tr><td colSpan={4} className="p-8 text-center"><Loader2 className="animate-spin inline" /></td></tr> : rewards.map((reward) => (
              <tr key={reward.id} className="hover:bg-gray-50/30 transition-colors">
                <td className="px-6 py-4 flex items-center gap-3 font-bold text-gray-800">
                   <div className="p-2 bg-yellow-100 rounded-full text-secondary-yellow"><Gift size={16} /></div>
                   {reward.name}
                </td>
                <td className="px-6 py-4 text-gray-500">{reward.description}</td>
                <td className="px-6 py-4 font-bold text-primary-blue">{reward.points_cost} pts</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleDelete(reward.id)} className="text-red-400 hover:text-red-600 p-2">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};