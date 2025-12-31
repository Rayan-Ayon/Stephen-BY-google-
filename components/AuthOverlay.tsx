
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleIcon, EyeIcon, EyeSlashIcon, XIcon } from './icons';
import { AuthType } from '../App';

interface AuthOverlayProps {
  type: 'login' | 'signup';
  setType: (type: AuthType) => void;
  onClose: () => void;
  onSuccess: () => void;
}

const AuthOverlay: React.FC<AuthOverlayProps> = ({ type, setType, onClose, onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isLogin = type === 'login';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.98 }}
        className="relative w-full max-w-[480px] bg-white rounded-[32px] p-10 md:p-12 shadow-2xl flex flex-col items-center text-center"
      >
        <button onClick={onClose} className="absolute top-8 right-8 text-gray-400 hover:text-black transition-colors">
          <XIcon className="w-6 h-6" />
        </button>

        {/* Logo */}
        <div className="mb-6">
           <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M45 20V80M35 25V75M55 35V65" stroke="black" strokeWidth="12" strokeLinecap="round"/>
           </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isLogin ? 'Welcome back' : 'Create an account'}
        </h1>
        <p className="text-gray-500 text-sm mb-10">
          {isLogin ? "Let's continue your learning journey." : "Let's get you learning journey started."}
        </p>

        {/* Google Button */}
        <button className="w-full flex items-center justify-center py-4 px-6 border border-gray-200 rounded-2xl bg-white hover:bg-gray-50 transition-colors mb-8 shadow-sm">
          <GoogleIcon className="w-5 h-5 mr-3" />
          <span className="text-gray-700 font-semibold text-base">
            {isLogin ? 'Continue with Google' : 'Sign in with Google'}
          </span>
        </button>

        {/* Divider */}
        <div className="w-full flex items-center mb-8">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="px-4 text-xs text-gray-400 font-medium bg-white">or continue with</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Form */}
        <div className="w-full space-y-4 mb-4">
          <div className="text-left">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-gray-400 focus:ring-0 outline-none text-gray-900 transition-all bg-gray-50/50"
            />
          </div>
          <div className="relative text-left">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-gray-400 focus:ring-0 outline-none text-gray-900 transition-all bg-gray-50/50"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
            >
              {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {isLogin && (
          <div className="w-full text-right mb-8">
            <button className="text-xs text-gray-500 hover:text-black font-medium transition-colors">
              Forgot password?
            </button>
          </div>
        )}

        <button
          onClick={onSuccess}
          className={`w-full py-4 rounded-2xl font-bold text-white text-lg mb-8 transition-colors ${
            email && password ? 'bg-neutral-900' : 'bg-neutral-400'
          }`}
        >
          {isLogin ? 'Login' : 'Sign In'}
        </button>

        <div className="text-sm text-gray-500 font-medium">
          {isLogin ? (
            <>
              Don't have an account?{' '}
              <button onClick={() => setType('signup')} className="text-black hover:underline font-bold">
                Sign in
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button onClick={() => setType('login')} className="text-black hover:underline font-bold">
                Login
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthOverlay;
