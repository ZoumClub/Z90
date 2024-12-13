import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { signInWithEmail, signOut as authSignOut, getCurrentUser } from '@/lib/auth';
import type { Profile } from '@/lib/types/auth';

interface AuthState {
  user: any;
  profile: Profile | null;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    isLoading: true
  });
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const result = await getCurrentUser();
      if (result) {
        setState({
          user: result.user,
          profile: result.profile as Profile,
          isLoading: false
        });
      } else {
        setState({
          user: null,
          profile: null,
          isLoading: false
        });
      }
    } catch (error) {
      console.error('Error checking user:', error);
      setState({
        user: null,
        profile: null,
        isLoading: false
      });
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const { user, profile } = await signInWithEmail(email, password);
      setState({
        user,
        profile,
        isLoading: false
      });
      router.push('/admin/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async function signOut() {
    try {
      await authSignOut();
      setState({
        user: null,
        profile: null,
        isLoading: false
      });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  const value = {
    ...state,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}