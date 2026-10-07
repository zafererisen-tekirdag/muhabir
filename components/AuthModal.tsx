'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { X, Lock, Mail, User as UserIcon, LogIn, UserPlus, AlertCircle, Loader2 } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, authModalMode, closeAuthModal, login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(authModalMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Sync mode when modal opens
  React.useEffect(() => {
    if (isAuthModalOpen) {
      setMode(authModalMode);
      setError(null);
    }
  }, [isAuthModalOpen, authModalMode]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (mode === 'login') {
        const res = await login(email, password);
        if (!res.success) {
          setError(res.error || 'Giriş yapılamadı.');
        } else {
          setName('');
          setEmail('');
          setPassword('');
        }
      } else {
        const res = await register(name, email, password);
        if (!res.success) {
          setError(res.error || 'Kayıt yapılamadı.');
        } else {
          setName('');
          setEmail('');
          setPassword('');
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-stone-900 border border-stone-700/80 rounded-xl shadow-2xl overflow-hidden text-stone-100">
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 px-6 py-5 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-700/70 border border-amber-600/50 flex items-center justify-center text-amber-100 shadow-inner">
              {mode === 'login' ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-amber-100">
                {mode === 'login' ? 'Muhabir Masasına Giriş' : 'Yeni Muhabir Kaydı'}
              </h2>
              <p className="text-xs text-stone-400">
                {mode === 'login'
                  ? 'Sistemi kullanmak için giriş yapın'
                  : 'Öğrenci veya araştırmacı hesabı oluşturun'}
              </p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="text-stone-400 hover:text-stone-100 p-1 rounded-md hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="grid grid-cols-2 border-b border-stone-800 bg-stone-950/60">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`py-3 text-sm font-medium transition ${
              mode === 'login'
                ? 'text-amber-400 border-b-2 border-amber-500 bg-stone-900'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Giriş Yap
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`py-3 text-sm font-medium transition ${
              mode === 'register'
                ? 'text-amber-400 border-b-2 border-amber-500 bg-stone-900'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Kayıt Ol
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-950/70 border border-red-800 rounded-lg flex items-start gap-2.5 text-xs text-red-200">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5">
                Ad Soyad
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Örn: Ahmet Yılmaz"
                  className="w-full pl-9 pr-3 py-2 bg-stone-950 border border-stone-700 rounded-lg text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1.5">
              E-posta Adresi
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@posta.com"
                className="w-full pl-9 pr-3 py-2 bg-stone-950 border border-stone-700 rounded-lg text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1.5">
              Şifre
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
                className="w-full pl-9 pr-3 py-2 bg-stone-950 border border-stone-700 rounded-lg text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>
            {mode === 'register' && (
              <span className="text-[11px] text-stone-400 mt-1 block">
                En az 6 karakter olmalıdır.
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 py-2.5 px-4 bg-amber-600 hover:bg-amber-500 active:bg-amber-700 disabled:opacity-50 text-amber-50 font-medium rounded-lg text-sm shadow-md transition flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>İşleniyor...</span>
              </>
            ) : mode === 'login' ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>Giriş Yap</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Kayıt Ol ve Başla</span>
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="px-6 py-3.5 bg-stone-950/80 border-t border-stone-800 text-center text-xs text-stone-400">
          {mode === 'login' ? (
            <span>
              Hesabınız yok mu?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError(null);
                }}
                className="text-amber-400 hover:underline font-medium"
              >
                Hemen Kaydolun
              </button>
            </span>
          ) : (
            <span>
              Zaten hesabınız var mı?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                className="text-amber-400 hover:underline font-medium"
              >
                Giriş Yapın
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
