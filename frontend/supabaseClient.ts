import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables in .env.local');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

function isNetworkError(err: any): boolean {
    if (!err) return false;
    if (err instanceof TypeError) return true;
    const msg = String(err?.message || err || '').toLowerCase();
    return (
        msg.includes('failed to fetch') ||
        msg.includes('fetch failed') ||
        msg.includes('networkerror') ||
        msg.includes('network error') ||
        msg.includes('cannot connect') ||
        msg.includes('load failed')
    );
}

export function getAuthErrorMessage(err: any): string {
    if (isNetworkError(err)) return 'Network Error: Cannot connect to backend server';
    const code = err?.code;
    switch (code) {
        case 'invalid_credentials':
            return 'Invalid email or password.';
        case 'user_already_exists':
            return 'An account with this email already exists.';
        case 'email_not_confirmed':
            return 'Please confirm your email address before signing in.';
        case 'weak_password':
            return 'Password is too weak. Use at least 6 characters.';
        case 'validation_failed':
            return 'Please enter a valid email address and password.';
        default:
            break;
    }
    if (typeof err?.message === 'string' && err.message) return err.message;
    return 'An authentication error occurred. Please try again.';
}