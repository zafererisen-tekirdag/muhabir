'use client';

import React from 'react';
import { Newspaper, Radio, ScrollText, Sparkles, BookOpen, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface NavbarProps {
  activeTab: 'documents' | 'interview' | 'publish';
  setActiveTab: (tab: 'documents' | 'interview' | 'publish') => void;
  documentCount: number;
  qaCount: number;
  hasNewspaper: boolean;
  hasPodcast: boolean;
  onOpenSamplePacks: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  documentCount,
  qaCount,
  hasNewspaper,
  hasPodcast,
  onOpenSamplePacks,
}) => {
  const { user, isLoading, openLogin, openRegister, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-stone-900 border-b border-stone-800 text-stone-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-amber-700/80 border border-amber-600/50 flex items-center justify-center text-amber-100 shadow-inner">
              <Newspaper className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg sm:text-2xl font-bold tracking-tight font-serif text-amber-50">
                  Tarih Muhabiri
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-amber-950/80 text-amber-300 border border-amber-800/80">
                  1919 Arşiv & Basın Masası
                </span>
              </div>
              <p className="text-xs text-stone-400 font-sans hidden sm:block">
                Birincil Belgelere Dayalı Sınıf Röportajı, 1919 Gazetesi ve İki Sesli Podcast
              </p>
            </div>
          </div>

          {/* Right Action buttons: Presets + Auth */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenSamplePacks}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-200 bg-amber-950/50 hover:bg-amber-900/60 border border-amber-800/60 rounded-md transition-colors"
              title="Örnek tarihî belge paketlerini gör"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Örnek Belgeler</span>
            </button>

            {isLoading ? (
              <div className="w-20 h-8 bg-stone-800/50 rounded-md animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-800/80 border border-stone-700/60 text-xs text-stone-200">
                  <UserIcon className="w-3.5 h-3.5 text-amber-400" />
                  <span className="max-w-[120px] sm:max-w-[160px] truncate font-medium">
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-stone-400 hover:text-red-400 hover:bg-stone-800/60 rounded-md border border-stone-800 transition"
                  title="Oturumu Kapat"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Çıkış</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={openLogin}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-stone-200 hover:text-white bg-stone-800 hover:bg-stone-700/80 rounded-md border border-stone-700 transition"
                >
                  <LogIn className="w-3.5 h-3.5 text-stone-400" />
                  <span>Giriş Yap</span>
                </button>
                <button
                  onClick={openRegister}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-amber-100 bg-amber-700 hover:bg-amber-600 rounded-md border border-amber-600 shadow-sm transition"
                >
                  <span>Kayıt Ol</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 3 Main Sections Navigation */}
        <div className="flex border-t border-stone-800/80 overflow-x-auto scrollbar-none py-1">
          <button
            onClick={() => setActiveTab('documents')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'documents'
                ? 'border-amber-500 text-amber-400 bg-stone-800/60'
                : 'border-transparent text-stone-300 hover:text-stone-100 hover:bg-stone-800/30'
            }`}
          >
            <ScrollText className="w-4 h-4" />
            <span>1. Belgeler</span>
            {documentCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-[11px] rounded-full bg-amber-900/70 text-amber-200 border border-amber-700/50">
                {documentCount} Belge
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('interview')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'interview'
                ? 'border-amber-500 text-amber-400 bg-stone-800/60'
                : 'border-transparent text-stone-300 hover:text-stone-100 hover:bg-stone-800/30'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>2. Röportaj</span>
            {qaCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-[11px] rounded-full bg-stone-700 text-stone-200">
                {qaCount} Soru
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('publish')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'publish'
                ? 'border-amber-500 text-amber-400 bg-stone-800/60'
                : 'border-transparent text-stone-300 hover:text-stone-100 hover:bg-stone-800/30'
            }`}
          >
            <div className="flex items-center gap-1">
              <Newspaper className="w-4 h-4" />
              <Radio className="w-4 h-4" />
            </div>
            <span>3. Yayın (Gazete & Podcast)</span>
            {(hasNewspaper || hasPodcast) && (
              <span className="ml-1 px-1.5 py-0.5 text-[11px] rounded-full bg-emerald-900/80 text-emerald-300 border border-emerald-700/50">
                Yayında
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
