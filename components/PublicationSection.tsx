'use client';

import React, { useState } from 'react';
import { 
  Newspaper, 
  Radio, 
  Sparkles, 
  Loader2, 
  AlertCircle, 
  ArrowLeft,
  RefreshCw,
  FileText
} from 'lucide-react';
import { NewspaperView, NewspaperData } from './NewspaperView';
import { PodcastView, PodcastData } from './PodcastView';
import { QAPair } from './InterviewSection';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldAlert } from 'lucide-react';

interface PublicationSectionProps {
  documentsText: string;
  qaHistory: QAPair[];
  newspaperData: NewspaperData | null;
  setNewspaperData: (data: NewspaperData | null) => void;
  podcastData: PodcastData | null;
  setPodcastData: (data: PodcastData | null) => void;
  onGoToDocuments: () => void;
  onGoToInterview: () => void;
}

export const PublicationSection: React.FC<PublicationSectionProps> = ({
  documentsText,
  qaHistory,
  newspaperData,
  setNewspaperData,
  podcastData,
  setPodcastData,
  onGoToDocuments,
  onGoToInterview,
}) => {
  const { user, openLogin } = useAuth();
  const [activePubTab, setActivePubTab] = useState<'newspaper' | 'podcast'>('newspaper');
  const [generatingNewspaper, setGeneratingNewspaper] = useState(false);
  const [generatingPodcast, setGeneratingPodcast] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGenerateNewspaper = async () => {
    if (!user) {
      openLogin();
      setErrorMessage('Gazete sayfası basabilmek için lütfen giriş yapınız veya kayıt olunuz.');
      return;
    }

    if (!documentsText.trim()) {
      setErrorMessage('Gazete sayfası oluşturmak için önce 1. Bölümden tarihî belge yüklemelisiniz.');
      return;
    }

    setGeneratingNewspaper(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/newspaper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documents: documentsText,
          interviewLog: qaHistory.map(q => ({ question: q.question, answer: q.answer })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gazete sayfası oluşturulamadı.');
      }

      setNewspaperData(data);
      setActivePubTab('newspaper');
    } catch (err: any) {
      console.error('Gazete oluşturma hatası:', err);
      setErrorMessage(err.message || 'Gazete sayfası oluşturulurken beklenmedik bir hata oluştu.');
    } finally {
      setGeneratingNewspaper(false);
    }
  };

  const handleGeneratePodcast = async () => {
    if (!user) {
      openLogin();
      setErrorMessage('Podcast yayını oluşturabilmek için lütfen giriş yapınız veya kayıt olunuz.');
      return;
    }

    if (!documentsText.trim()) {
      setErrorMessage('Podcast oluşturmak için önce 1. Bölümden tarihî belge yüklemelisiniz.');
      return;
    }

    setGeneratingPodcast(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/podcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newsData: newspaperData,
          documents: documentsText,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Podcast oluşturulamadı.');
      }

      setPodcastData(data);
      setActivePubTab('podcast');
    } catch (err: any) {
      console.error('Podcast oluşturma hatası:', err);
      setErrorMessage(err.message || 'Podcast oluşturulurken beklenmedik bir hata oluştu.');
    } finally {
      setGeneratingPodcast(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Auth required banner if logged out */}
      {!user && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-stone-800 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-200 border border-amber-300 flex items-center justify-center text-amber-900 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-amber-950 font-serif">Yayın Masası İçin Giriş Gerekli</h4>
              <p className="text-xs text-amber-800">1919 gazete sayfası basabilmek ve iki sesli podcast yayını üretebilmek için lütfen oturum açınız.</p>
            </div>
          </div>
          <button
            onClick={openLogin}
            className="px-4 py-2 text-xs font-semibold bg-amber-800 hover:bg-amber-900 text-amber-50 rounded-lg transition-colors whitespace-nowrap shadow-sm"
          >
            Giriş Yap / Kayıt Ol
          </button>
        </div>
      )}

      {/* Publication Hub Header */}
      <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 border border-stone-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-600 text-amber-50 flex items-center justify-center text-xs font-bold font-mono">
                3
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-amber-100">
                Yayın Masası
              </h2>
            </div>
            <p className="text-sm text-stone-300 max-w-2xl">
              Röportajı ve birincil belgeleri 1919 dönemi gazete sayfasına dönüştürün veya Muhabir ile Tarihçi arasında 1 dakikalık iki sesli Türkçe podcast yayınlayın.
            </p>
          </div>

          {/* TWO MANDATORY ACTION BUTTONS: "Gazete Sayfası Yap" and "Podcast Yap" */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleGenerateNewspaper}
              disabled={generatingNewspaper || !documentsText.trim()}
              className={`px-4 sm:px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-md ${
                generatingNewspaper
                  ? 'bg-amber-950 text-amber-300 cursor-wait'
                  : !documentsText.trim()
                  ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
                  : 'bg-amber-700 hover:bg-amber-600 text-amber-50 cursor-pointer active:scale-95'
              }`}
            >
              {generatingNewspaper ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                  <span>Matbaada Basılıyor...</span>
                </>
              ) : (
                <>
                  <Newspaper className="w-4 h-4" />
                  <span>Gazete Sayfası Yap</span>
                </>
              )}
            </button>

            <button
              onClick={handleGeneratePodcast}
              disabled={generatingPodcast || !documentsText.trim()}
              className={`px-4 sm:px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-md ${
                generatingPodcast
                  ? 'bg-purple-950 text-purple-300 cursor-wait'
                  : !documentsText.trim()
                  ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
                  : 'bg-purple-800 hover:bg-purple-700 text-purple-100 cursor-pointer active:scale-95'
              }`}
            >
              {generatingPodcast ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-purple-300" />
                  <span>Stüdyo Kaydediyor...</span>
                </>
              ) : (
                <>
                  <Radio className="w-4 h-4" />
                  <span>Podcast Yap</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error notification */}
        {errorMessage && (
          <div className="p-3.5 bg-red-950/80 border border-red-800/80 rounded-xl text-xs text-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Sub-tabs when outputs are ready */}
        {(newspaperData || podcastData) && (
          <div className="flex border-t border-stone-800 pt-3 gap-2">
            <button
              onClick={() => setActivePubTab('newspaper')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activePubTab === 'newspaper'
                  ? 'bg-amber-800/80 text-amber-100 border border-amber-600/50'
                  : 'bg-stone-800/40 text-stone-400 hover:text-stone-200'
              }`}
            >
              <Newspaper className="w-3.5 h-3.5" />
              <span>1919 Gazete Sayfası {newspaperData && '✓'}</span>
            </button>

            <button
              onClick={() => setActivePubTab('podcast')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activePubTab === 'podcast'
                  ? 'bg-purple-900/80 text-purple-100 border border-purple-700/50'
                  : 'bg-stone-800/40 text-stone-400 hover:text-stone-200'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>1 Dakikalık Podcast Stüdyosu {podcastData && '✓'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {!newspaperData && !podcastData ? (
        <div className="bg-white border-2 border-dashed border-stone-300 rounded-2xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-800">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="font-serif font-bold text-stone-900 text-lg">
              Yayın İçeriği Hazırlanmayı Bekliyor
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
              Yukarıdaki <strong>&quot;Gazete Sayfası Yap&quot;</strong> düğmesiyle 1919 dönemi tarihî gazetesini basabilir, 
              <strong>&quot;Podcast Yap&quot;</strong> düğmesiyle Muhabir ve Tarihçi&apos;nin 1 dakikalık iki sesli sohbetini dinleyebilirsiniz.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <button
              onClick={handleGenerateNewspaper}
              disabled={generatingNewspaper || !documentsText.trim()}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-amber-800 text-amber-50 hover:bg-amber-900 shadow-sm"
            >
              Hemen Gazete Sayfası Yap
            </button>
            <button
              onClick={handleGeneratePodcast}
              disabled={generatingPodcast || !documentsText.trim()}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-purple-800 text-purple-50 hover:bg-purple-900 shadow-sm"
            >
              Hemen Podcast Yap
            </button>
          </div>
        </div>
      ) : activePubTab === 'newspaper' ? (
        newspaperData ? (
          <NewspaperView data={newspaperData} />
        ) : (
          <div className="p-8 text-center bg-white rounded-xl border border-stone-200 space-y-3">
            <p className="text-sm text-stone-600 font-serif">Henüz gazete sayfası basılmadı.</p>
            <button
              onClick={handleGenerateNewspaper}
              className="px-4 py-2 bg-amber-800 text-amber-50 text-xs font-semibold rounded-lg"
            >
              Gazete Sayfası Yap
            </button>
          </div>
        )
      ) : (
        podcastData ? (
          <PodcastView data={podcastData} onRegenerate={handleGeneratePodcast} />
        ) : (
          <div className="p-8 text-center bg-white rounded-xl border border-stone-200 space-y-3">
            <p className="text-sm text-stone-600 font-serif">Henüz podcast kaydı oluşturulmadı.</p>
            <button
              onClick={handleGeneratePodcast}
              className="px-4 py-2 bg-purple-800 text-purple-50 text-xs font-semibold rounded-lg"
            >
              Podcast Yap
            </button>
          </div>
        )
      )}
    </div>
  );
};
