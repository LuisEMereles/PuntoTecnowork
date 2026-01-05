import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass-card w-full max-w-md p-8 rounded-2xl animate-fade-in-up">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-primary-blue mb-2">Recuperar Acceso</h1>
          <p className="text-gray-500 text-sm">Ingresa tu email y te enviaremos un enlace.</p>
        </div>

        {success ? (
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-success-green" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">¡Correo Enviado!</h3>
            <p className="text-gray-600 mb-6">
              Revisa tu bandeja de entrada (y spam). Sigue el enlace para crear una nueva contraseña.
            </p>
            <Link to="/login" className="text-primary-blue font-bold hover:underline">
              Volver al Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-emphasis-red p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Registrado</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue outline-none"
                  placeholder="ejemplo@correo.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-blue text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30 flex items-center justify-center"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Enviar Enlace'}
            </button>

            <div className="text-center">
              <Link to="/login" className="inline-flex items-center text-sm text-gray-500 hover:text-primary-blue transition-colors">
                <ArrowLeft size={16} className="mr-1" /> Volver a Iniciar Sesión
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};