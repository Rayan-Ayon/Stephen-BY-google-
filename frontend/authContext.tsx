import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';

interface AuthContextType {
    session: Session | null;
    user: User | null;
    userId: string;
    userEmail: string;
    isLoading: boolean;
    isAuthenticated: boolean;
    signOut: () => Promise<void>;
    refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const user = session?.user ?? null;
    const userId = user?.id ?? '';
    const userEmail = user?.email ?? '';
    const isAuthenticated = !!session;

    const refreshSession = useCallback(async () => {
        try {
            const { data: { session: newSession } } = await supabase.auth.getSession();
            setSession(newSession);
        } catch {
            setSession(null);
        }
    }, []);

    const signOut = useCallback(async () => {
        try {
            const currentUserId = user?.id;
            if (currentUserId && typeof window !== 'undefined') {
                Object.keys(localStorage).forEach(key => {
                    if (
                        key.includes(currentUserId) ||
                        key.startsWith('stephen_') ||
                        key.startsWith('exam_attempts_') ||
                        key.startsWith('reading_results_') ||
                        key.startsWith('listening_attempt_') ||
                        key.startsWith('writing_attempts_')
                    ) {
                        localStorage.removeItem(key);
                    }
                });
            }
            await supabase.auth.signOut();
            setSession(null);
            localStorage.removeItem('stephen_auth_token');
            localStorage.removeItem('stephen_auth_email');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    }, [user?.id]);

    useEffect(() => {
        // Get initial session
        const getInitialSession = async () => {
            try {
                const { data: { session: initialSession } } = await supabase.auth.getSession();
                setSession(initialSession);
            } catch {
                setSession(null);
            }
            setIsLoading(false);
        };

        getInitialSession();

        // Listen for auth state changes (token refresh, sign-in, sign-out in other tabs)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, newSession) => {
                setSession(newSession);
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const value: AuthContextType = {
        session,
        user,
        userId,
        userEmail,
        isLoading,
        isAuthenticated,
        signOut,
        refreshSession,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
