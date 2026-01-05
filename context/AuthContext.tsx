import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Profile, Role } from '../types';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  isPasswordRecovery: boolean;
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
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);

  const fetchProfile = async (currentUser: User) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .maybeSingle();
      
      if (error) {
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
        // Verificar si ESTA pestaña fue la que solicitó la recuperación
        const thisTabRequestedRecovery = sessionStorage.getItem('password_recovery_requested');
        
        if (thisTabRequestedRecovery) {
          // Esta pestaña SOLICITÓ la recuperación - NO redirigir
          // Solo limpiar la bandera y quedarse donde está
          console.log('Password recovery event ignored - this tab requested the recovery');
          sessionStorage.removeItem('password_recovery_requested');
          // No hacer nada más, el usuario puede cerrar esta pestaña manualmente
          return;
        }
        
        // Esta pestaña viene del LINK del correo - SÍ redirigir
        console.log('Password recovery from email link - redirecting to update-password');
        setSession(session);
        setIsPasswordRecovery(true);
        
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
    setIsPasswordRecovery(false);
    window.location.hash = '/login';
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user);
  };

  const resetPassword = async (email: string) => {
    const redirectTo = window.location.origin; 
    
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectTo,
    });
  };

  const updatePassword = async (password: string) => {
    const result = await supabase.auth.updateUser({ password });
    if (!result.error) {
      setIsPasswordRecovery(false);
    }
    return result;
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      profile, 
      loading,
      isPasswordRecovery,
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
