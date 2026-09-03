import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile } from "../types";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isDemo: boolean;
  login: (email: string, password?: string) => Promise<{ error?: string }>;
  register: (
    email: string,
    password?: string,
    name?: string,
  ) => Promise<{ error?: string }>;
  resendConfirmation: (email: string) => Promise<{ error?: string }>;
  loginAsDemo: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER: UserProfile = {
  id: "demo-user-123",
  email: "dfaalt@moneytracker.app",
  name: "Dfaalt",
  avatar_url:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
};

const AUTH_STORAGE_KEY = "money_tracker_auth_user";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    // Check saved session
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    // Default to null so user lands on Sign In / Register page first
    return null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isDemo = user?.id.startsWith("demo-") || false;

  useEffect(() => {
    const initAuth = async () => {
      if (isSupabaseConfigured && supabase) {
        try {
          const {
            data: { session },
          } = await supabase.auth.getSession();
          if (session?.user) {
            const authUser: UserProfile = {
              id: session.user.id,
              email: session.user.email || "",
              name:
                session.user.user_metadata?.name ||
                session.user.email?.split("@")[0],
            };
            setUser(authUser);
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
          }
        } catch (err) {
          console.error("Supabase session load error:", err);
        }
      }
      setIsLoading(false);
    };

    initAuth();

    if (isSupabaseConfigured && supabase) {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const authUser: UserProfile = {
            id: session.user.id,
            email: session.user.email || "",
            name:
              session.user.user_metadata?.name ||
              session.user.email?.split("@")[0],
          };
          setUser(authUser);
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
        } else if (!isDemo) {
          setUser(null);
          localStorage.removeItem(AUTH_STORAGE_KEY);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [isDemo]);

  const login = async (email: string, password?: string) => {
    if (isSupabaseConfigured && supabase && password) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) return { error: error.message };
      if (data.user) {
        const authUser: UserProfile = {
          id: data.user.id,
          email: data.user.email || email,
          name: data.user.user_metadata?.name || email.split("@")[0],
        };
        setUser(authUser);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
      }
      return {};
    }

    // Local / Demo mode sign-in
    const localUser: UserProfile = {
      id: "usr-" + btoa(email).slice(0, 10),
      email,
      name: email.split("@")[0],
    };
    setUser(localUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(localUser));
    return {};
  };

  const register = async (email: string, password?: string, name?: string) => {
    if (isSupabaseConfigured && supabase && password) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });
      if (error) return { error: error.message };
      // Do not auto-login here; user needs to see the email confirmation screen
      return {};
    }

    // Local / Demo mode fallback
    return {};
  };

  const resendConfirmation = async (email: string) => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
      });
      if (error) return { error: error.message };
      return {};
    }
    return {};
  };

  const loginAsDemo = () => {
    setUser(DEMO_USER);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(DEMO_USER));
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase && !isDemo) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isDemo,
        login,
        register,
        resendConfirmation,
        loginAsDemo,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
