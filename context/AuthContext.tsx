import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Profile, Role } from '../types';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (password: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (currentUser: User) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .maybeSingle();
      
      if (error) {
        // Manejo silencioso de error si la tabla no está lista o hay problemas de permisos
        console.warn('Error fetching profile, using fallback data.');
        const fallbackProfile: Profile = {
          id: currentUser.id,
          email: currentUser.email,
          first_name: currentUser.user_metadata?.first_name || 'Usuario',
          last_name: currentUser.user_metadata?.last_name || '',
          phone_number: currentUser.user_metadata?.phone_number,
          role: 'client',
          points: 0
        };
        setProfile(fallbackProfile);
      } else if (data) {
        setProfile(data as Profile);
      } else {
        // Perfil no encontrado, crear fallback temporal
        setProfile({
            id: currentUser.id,
            email: currentUser.email,
            first_name: currentUser.user_metadata?.first_name || 'Usuario',
            last_name: currentUser.user_metadata?.last_name || '',
            phone_number: currentUser.user_metadata?.phone_number,
            role: 'client',
            points: 0
        });
      }
    } catch (err) {
      console.error('Unexpected error fetching profile:', err);
    }
  };

  useEffect(() => {
    // 1. Verificar sesión activa al inicio
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchProfile(session.user);
      }
      setLoading(false);
    };

    initAuth();

    // 2. Escuchar cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth Event:', event);
      
      if (event === 'PASSWORD_RECOVERY') {
        setSession(session);
        // Redirigir específicamente a la ruta de actualización
        // setTimeout asegura que esto ocurra después de que el Router se monte
        setTimeout(() => {
           window.location.hash = '/update-password';
        }, 100);
        return; 
      }

      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchProfile(session.user);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setSession(null);
    setUser(null);
    window.location.hash = '/login';
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user);
  };

  const resetPassword = async (email: string) => {
    // Redirigir al origen actual (sea localhost o Vercel)
    const redirectTo = window.location.origin; 
    
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectTo,
    });
  };

  const updatePassword = async (password: string) => {
    return await supabase.auth.updateUser({ password });
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      profile, 
      loading, 
      signOut, 
      refreshProfile, 
      resetPassword,
      updatePassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};