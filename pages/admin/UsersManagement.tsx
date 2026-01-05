import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Profile, Role } from '../../types';
import { Search, Edit2, Trash2, User, Loader2, Save, X, Phone } from 'lucide-react';

export const UsersManagement: React.FC = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempRole, setTempRole] = useState<Role>('client');

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setUsers(data as Profile[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditClick = (user: Profile) => {
    setEditingId(user.id);
    setTempRole(user.role);
  };

  const handleSaveClick = async (id: string) => {
    // Optimistic UI update
    const previousUsers = [...users];
    setUsers(users.map(u => u.id === id ? { ...u, role: tempRole } : u));
    setEditingId(null);

    const { error } = await supabase
      .from('profiles')
      .update({ role: tempRole })
      .eq('id', id);

    if (error) {
      alert('Error al actualizar rol');
      setUsers(previousUsers); // Revert
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white drop-shadow-md">Gestión de Usuarios</h2>
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Buscar por email o nombre..." 
            className="pl-10 pr-4 py-2 rounded-xl border-none focus:ring-2 focus:ring-primary-blue outline-none bg-white/90 shadow-sm w-64"
          />
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden min-h-[300px]">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="animate-spin text-primary-blue w-8 h-8" />
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600">Usuario</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Email</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Teléfono</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Rol</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Puntos</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                         {user.first_name?.[0] || <User size={16} />}
                      </div>
                      <span className="font-medium text-gray-800">
                        {user.first_name || 'Sin nombre'} {user.last_name || ''}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {user.phone_number ? (
                      <div className="flex items-center gap-1">
                        <Phone size={14} className="text-gray-400" />
                        {user.phone_number}
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">--</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === user.id ? (
                      <select 
                        value={tempRole} 
                        onChange={(e) => setTempRole(e.target.value as Role)}
                        className="p-1 border rounded"
                      >
                        <option value="client">Cliente</option>
                        <option value="local">Local</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                        user.role === 'local' ? 'bg-orange-100 text-orange-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {user.role}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-mono text-gray-600">{user.points}</td>
                  <td className="px-6 py-4 text-right">
                    {editingId === user.id ? (
                      <div className="flex justify-end gap-2">
                         <button onClick={() => handleSaveClick(user.id)} className="text-green-600 hover:bg-green-50 p-2 rounded">
                           <Save size={18} />
                         </button>
                         <button onClick={() => setEditingId(null)} className="text-gray-500 hover:bg-gray-100 p-2 rounded">
                           <X size={18} />
                         </button>
                      </div>
                    ) : (
                      <button onClick={() => handleEditClick(user)} className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors mr-2">
                        <Edit2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};