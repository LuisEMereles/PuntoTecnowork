import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Local } from '../../types';
import { Plus, Store, Trash2, Loader2, Save, X } from 'lucide-react';

export const LocalsManagement: React.FC = () => {
  const [locals, setLocals] = useState<Local[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newLocal, setNewLocal] = useState({ name: '', address: '' });

  const fetchLocals = async () => {
    setLoading(true);
    const { data } = await supabase.from('locals').select('*').order('created_at');
    if (data) setLocals(data as Local[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchLocals();
  }, []);

  const handleAdd = async () => {
    if (!newLocal.name || !newLocal.address) return;
    const { error } = await supabase.from('locals').insert([newLocal]);
    if (!error) {
      setNewLocal({ name: '', address: '' });
      setIsAdding(false);
      fetchLocals();
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar este local?')) return;
    const { error } = await supabase.from('locals').delete().eq('id', id);
    if (!error) fetchLocals();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white drop-shadow-md">Gestión de Locales</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-white text-primary-blue px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:shadow-lg transition-all"
        >
          <Plus size={18} /> Nuevo Local
        </button>
      </div>

      {isAdding && (
        <div className="glass-card p-6 rounded-2xl animate-fade-in-up">
           <h3 className="font-bold text-gray-700 mb-4">Agregar Nuevo Local</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
             <input 
               type="text" 
               placeholder="Nombre de Sucursal" 
               className="p-2 border rounded-lg"
               value={newLocal.name}
               onChange={e => setNewLocal({...newLocal, name: e.target.value})}
             />
             <input 
               type="text" 
               placeholder="Dirección Física" 
               className="p-2 border rounded-lg"
               value={newLocal.address}
               onChange={e => setNewLocal({...newLocal, address: e.target.value})}
             />
           </div>
           <div className="flex gap-2">
             <button onClick={handleAdd} className="bg-success-green text-white px-4 py-2 rounded-lg font-bold flex gap-2 items-center">
               <Save size={16} /> Guardar
             </button>
             <button onClick={() => setIsAdding(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-bold">
               Cancelar
             </button>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? <Loader2 className="animate-spin text-white w-8 h-8" /> : locals.map(local => (
          <div key={local.id} className="glass-card p-6 rounded-2xl relative group">
            <button 
              onClick={() => handleDelete(local.id)}
              className="absolute top-4 right-4 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={18} />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-primary-blue flex items-center justify-center">
                <Store />
              </div>
              <h3 className="font-bold text-lg text-gray-800">{local.name}</h3>
            </div>
            <p className="text-gray-500 text-sm mb-2">{local.address}</p>
            <div className="flex gap-2 mt-4">
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-bold">Activo</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};