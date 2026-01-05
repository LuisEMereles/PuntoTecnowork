import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { session } = useAuth();

  // Redireccionar si ya hay sesión activa (Failsafe)
  useEffect(() => {
    if (session) {
      // Determinamos el rol después en AuthGuard, aquí solo mandamos a una ruta protegida genérica o client
      // AuthGuard redirigirá a la específica si es necesario
      navigate('/client/dashboard');
    }
  }, [session, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message === 'Invalid login credentials' 
          ? 'Correo o contraseña incorrectos.' 
          : error.message);
        setLoading(false);
      }
      // Si es exitoso, el listener de AuthContext detectará la sesión y el useEffect redirigirá.
    } catch (err) {
      console.error(err);
      setError('Ocurrió un error inesperado.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass-card w-full max-w-md p-10 rounded-2xl animate-fade-in-up">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-primary-blue rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">P</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
              Punto<span className="text-primary-blue">Tecnowork</span>
          </h1>
          <p className="text-gray-500 text-sm">Bienvenido de nuevo, ingresa tus credenciales.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-6 text-sm flex items-center gap-2">
             <span className="font-bold">Error:</span> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue outline-none transition-all text-gray-800"
                placeholder="nombre@empresa.com"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-gray-700">Contraseña</label>
                <Link to="/forgot-password" class="text-xs text-primary-blue hover:text-blue-700 font-medium">
                  ¿Olvidaste tu contraseña?
                </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue outline-none transition-all text-gray-800"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !!session}
            className="w-full bg-primary-blue text-white py-3.5 rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <p className="text-gray-500">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-primary-blue font-bold hover:underline">
              Crear cuenta nueva
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};