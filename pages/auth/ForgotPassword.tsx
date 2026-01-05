import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Mail, ArrowLeft, Loader2, CheckCircle, KeyRound } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await resetPassword(email);
      if (error) throw error;
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Error al enviar el correo de recuperación.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="card p-8 md:p-10 animate-fade-up">
          {success ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">¡Correo Enviado!</h3>
              <p className="text-text-secondary mb-6">
                Revisa tu bandeja de entrada (y spam). Sigue el enlace para crear una nueva contraseña.
              </p>
              <Link 
                to="/login" 
                className="text-accent font-semibold hover:text-accent-light transition-colors"
              >
                Volver al Login
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-surface-subtle rounded-2xl mb-4 border border-white/5">
                  <KeyRound className="w-7 h-7 text-accent" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Recuperar Acceso</h1>
                <p className="text-text-secondary text-sm">
                  Ingresa tu email y te enviaremos un enlace de recuperación.
                </p>
              </div>

              {error && (
                <div className="bg-danger/10 border border-danger/20 text-danger p-4 rounded-xl mb-6 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Email Registrado
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-modern pl-12"
                      placeholder="ejemplo@correo.com"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Enviar Enlace'}
                </button>

                <div className="text-center pt-2">
                  <Link 
                    to="/login" 
                    className="inline-flex items-center text-sm text-text-secondary hover:text-accent transition-colors"
                  >
                    <ArrowLeft size={16} className="mr-1" /> 
                    Volver a Iniciar Sesión
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
