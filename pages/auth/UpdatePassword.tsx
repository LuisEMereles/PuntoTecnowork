import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Lock, Loader2, CheckCircle, KeyRound, AlertCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export const UpdatePassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { updatePassword, session } = useAuth();
  const navigate = useNavigate();

  // Verificar si hay sesión válida para cambio de contraseña
  const [sessionChecked, setSessionChecked] = useState(false);
  const [hasValidSession, setHasValidSession] = useState(false);

  useEffect(() => {
    // Dar tiempo para que Supabase establezca la sesión
    const timer = setTimeout(() => {
      setHasValidSession(!!session);
      setSessionChecked(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: updateError } = await updatePassword(password);
      
      if (updateError) {
        throw updateError;
      }
      
      // Éxito!
      setSuccess(true);
      setLoading(false);
      
      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (err: any) {
      console.error('Error updating password:', err);
      setError(err.message || 'Error al actualizar la contraseña.');
      setLoading(false);
    }
  };

  // Pantalla de éxito
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="card p-8 md:p-10 max-w-md w-full text-center animate-fade-up">
          <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">¡Contraseña Actualizada!</h2>
          <p className="text-text-secondary mb-4">
            Tu contraseña ha sido cambiada exitosamente.
          </p>
          <p className="text-text-muted text-sm mb-6">
            Redirigiendo al login...
          </p>
          <Link 
            to="/login" 
            className="text-accent font-semibold hover:text-accent-light transition-colors"
          >
            Ir al Login ahora
          </Link>
        </div>
      </div>
    );
  }

  // Pantalla de carga mientras verifica sesión
  if (!sessionChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="card p-8 md:p-10 max-w-md w-full text-center">
          <Loader2 className="w-8 h-8 animate-spin text-accent mx-auto mb-4" />
          <p className="text-text-secondary">Verificando enlace de recuperación...</p>
        </div>
      </div>
    );
  }

  // Pantalla si no hay sesión válida
  if (!hasValidSession) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="card p-8 md:p-10 max-w-md w-full text-center animate-fade-up">
          <div className="w-16 h-16 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-warning" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Enlace Expirado</h2>
          <p className="text-text-secondary mb-6">
            El enlace de recuperación ha expirado o ya fue utilizado. Por favor solicita uno nuevo.
          </p>
          <Link 
            to="/forgot-password" 
            className="btn-primary inline-flex"
          >
            Solicitar nuevo enlace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-electric/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="card p-8 md:p-10 animate-fade-up">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-electric/10 rounded-2xl mb-4 border border-electric/20">
              <KeyRound className="w-7 h-7 text-electric" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Nueva Contraseña</h1>
            <p className="text-text-secondary text-sm">
              Ingresa tu nueva contraseña segura.
            </p>
          </div>

          {error && (
            <div className="bg-danger/10 border border-danger/20 text-danger p-4 rounded-xl mb-6 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Nueva Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-modern pl-12"
                  placeholder="Mínimo 6 caracteres"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-modern pl-12"
                  placeholder="Repite la contraseña"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                'Actualizar Contraseña'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link 
              to="/login" 
              className="text-sm text-text-secondary hover:text-accent transition-colors"
            >
              Volver al Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
