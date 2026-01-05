import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Lock, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const UpdatePassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { updatePassword, session } = useAuth();
  const navigate = useNavigate();

  // Verificamos la sesión. En el flujo de recuperación, Supabase inicia sesión automáticamente
  // antes de llegar a esta página gracias al evento PASSWORD_RECOVERY manejado en AuthContext.
  useEffect(() => {
    // Damos un pequeño margen para que la sesión se establezca si viene de un redirect rápido
    const checkSession = setTimeout(() => {
       if (!session) {
           // Si no hay sesión, el link expiró o es inválido.
           // Opcional: navigate('/login');
       }
    }, 1500);
    return () => clearTimeout(checkSession);
  }, [session, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!session) {
        throw new Error('La sesión de recuperación ha expirado. Solicita un nuevo enlace.');
      }

      const { error } = await updatePassword(password);
      if (error) throw error;
      
      // Éxito
      alert('Contraseña actualizada correctamente.');
      navigate('/client/dashboard'); // O al dashboard correspondiente
    } catch (err: any) {
      setError(err.message || 'Error al actualizar la contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass-card w-full max-w-md p-8 rounded-2xl animate-fade-in-up">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-primary-blue mb-2">Nueva Contraseña</h1>
          <p className="text-gray-500 text-sm">Ingresa tu nueva contraseña segura.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-emphasis-red p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue outline-none"
                placeholder="Mínimo 6 caracteres"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-blue text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30 flex items-center justify-center"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Actualizar Contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
};