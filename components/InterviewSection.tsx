'use client';

import React, { useState } from 'react';
import { 
  Send, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Trash2, 
  HelpCircle, 
  FileText, 
  ShieldAlert, 
  ArrowRight,
  BookOpen,
  Newspaper,
  Loader2,
  CheckCircle,
  Copy,
  Check
} from 'lucide-react';
import { SAMPLE_DOCUMENT_PACKS } from '@/lib/sample-documents';
import { useAuth } from '@/contexts/AuthContext';

export interface QAPair {
  id: string;
  question: string;
  answer: string;
  timestamp: string;
}

interface InterviewSectionProps {
  documentsText: string;
  qaHistory: QAPair[];
  setQaHistory: React.Dispatch<React.SetStateAction<QAPair[]>>;
  onProceedToPublish: () => void;
  onGoToDocuments: () => void;
}

export const InterviewSection: React.FC<InterviewSectionProps> = ({
  documentsText,
  qaHistory,
  setQaHistory,
  onProceedToPublish,
  onGoToDocuments,
}) => {
  const { user, openLogin } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Suggested questions based on the loaded document content
  const currentPack = SAMPLE_DOCUMENT_PACKS.find(p => documentsText.includes(p.title.slice(0, 10))) || SAMPLE_DOCUMENT_PACKS[0];

  const handleAskQuestion = async (questionToAsk?: string) => {
    if (!user) {
      openLogin();
      setErrorMessage('Röportaj yapabilmek ve soru sorabilmek için lütfen giriş yapınız.');
      return;
    }

    const q = (questionToAsk || currentQuestion).trim();
    if (!q) return;

    if (!documentsText.trim()) {
      setErrorMessage('Lütfen önce "1. Belgeler" bölümüne en az bir tarihî belge metni yükleyiniz.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const historyContext = qaHistory.map(item => ({
        role: 'user',
        content: item.question,
      })).concat(qaHistory.map(item => ({
        role: 'model',
        content: item.answer,
      })));

      const response = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documents: documentsText,
          question: q,
          history: historyContext,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Cevap alınamadı.');
      }

      const newQA: QAPair = {
        id: Date.now().toString(),
        question: q,
        answer: data.answer,
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      };

      setQaHistory(prev => [...prev, newQA]);
      setCurrentQuestion('');
    } catch (err: any) {
      console.error('Soru sorma hatası:', err);
      setErrorMessage(err.message || 'Cevap oluşturulurken beklenmedik bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = (qa: QAPair) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (speakingId === qa.id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(qa.answer);
    utterance.lang = 'tr-TR';
    utterance.rate = 0.95;

    utterance.onend = () => {
      setSpeakingId(null);
    };

    utterance.onerror = () => {
      setSpeakingId(null);
    };

    setSpeakingId(qa.id);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = (qa: QAPair) => {
    navigator.clipboard.writeText(`Soru: ${qa.question}\n\nMuhabir: ${qa.answer}`);
    setCopiedId(qa.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteQA = (id: string) => {
    setQaHistory(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Reporter Ethics */}
      <div className="bg-stone-900 text-stone-100 rounded-xl p-5 border border-stone-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-600 text-amber-50 flex items-center justify-center text-xs font-bold font-mono">
                2
              </span>
              <h2 className="text-xl font-bold font-serif text-amber-100">
                Sınıf Röportaj Masası
              </h2>
            </div>
            <p className="text-sm text-stone-300 max-w-3xl">
              Öğretmen ve öğrencilerin sorularını yönelttiği araştırma alanı. Muhabirimiz birincil belgelere sıkı sıkıya bağlı kalarak yanıt verir.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {qaHistory.length > 0 && (
              <button
                onClick={() => setQaHistory([])}
                className="text-xs text-stone-400 hover:text-red-400 px-3 py-1.5 rounded-lg border border-stone-800 hover:border-red-800/40 transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Röportajı Temizle</span>
              </button>
            )}
            <button
              onClick={onProceedToPublish}
              className="text-xs font-semibold text-amber-300 bg-amber-950/70 hover:bg-amber-900 border border-amber-700/60 px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Newspaper className="w-3.5 h-3.5" />
              <span>Yayına Git (Gazete & Podcast)</span>
            </button>
          </div>
        </div>

        {/* 7 Strict Reporter Rules Badges */}
        <div className="mt-4 pt-3 border-t border-stone-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs text-stone-300">
          <div className="flex items-start gap-2 bg-stone-800/60 p-2 rounded-lg border border-stone-700/50">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span><strong>Üçüncü Şahıs:</strong> Tarihî kişileri canlandırmaz, üçüncü şahısla nesnel anlatır.</span>
          </div>
          <div className="flex items-start gap-2 bg-stone-800/60 p-2 rounded-lg border border-stone-700/50">
            <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span><strong>Belgeye Sadakat:</strong> Yalnızca yüklenen belgelerdeki bilgiyi kullanır, genel bilgi eklemez.</span>
          </div>
          <div className="flex items-start gap-2 bg-stone-800/60 p-2 rounded-lg border border-stone-700/50">
            <FileText className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span><strong>Kaynak İmzası:</strong> Her cevabın sonuna dayandığı belgeyi ekler: <em>[Belge 2]</em>.</span>
          </div>
          <div className="flex items-start gap-2 bg-stone-800/60 p-2 rounded-lg border border-stone-700/50">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span><strong>Birebir Alıntı:</strong> Bir söz aktarılırken belgedeki cümle tırnak içinde aynen verilir.</span>
          </div>
          <div className="flex items-start gap-2 bg-stone-800/60 p-2 rounded-lg border border-stone-700/50">
            <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span><strong>Belgede Yoksa:</strong> &quot;Bu belgelerde bu sorunun cevabı yok...&quot; diyerek uydurmayı reddeder.</span>
          </div>
          <div className="flex items-start gap-2 bg-stone-800/60 p-2 rounded-lg border border-stone-700/50">
            <BookOpen className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span><strong>Öğrenci Dili:</strong> En fazla 5 cümle, 7-12. sınıf düzeyinde açık anlatım.</span>
          </div>
        </div>
      </div>

      {/* No Documents Warning */}
      {!documentsText.trim() && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-amber-900">
          <div className="flex items-center gap-2.5 text-sm">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0" />
            <span>Röportaja başlayabilmek için önce 1. Bölümden tarihî belge yüklemelisiniz.</span>
          </div>
          <button
            onClick={onGoToDocuments}
            className="px-3.5 py-1.5 text-xs font-semibold bg-amber-700 text-amber-50 rounded-lg hover:bg-amber-800 transition-colors"
          >
            Belgeler Bölümüne Git
          </button>
        </div>
      )}

      {/* Auth required banner if logged out */}
      {!user && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-200 border border-amber-300 flex items-center justify-center text-amber-900 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-amber-950 font-serif">Röportaj İçin Giriş Gerekli</h4>
              <p className="text-xs text-amber-800">Belgeler üzerinden soru sorabilmek ve yapay zekâ muhabirle görüşebilmek için lütfen oturum açınız.</p>
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

      {/* Question Form & Suggestions */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-4">
        <div>
          <label htmlFor="question-input" className="block text-sm font-semibold text-stone-800 mb-1.5">
            Öğrenci veya Öğretmen Sorusu
          </label>
          <div className="flex gap-2">
            <input
              id="question-input"
              type="text"
              value={currentQuestion}
              onChange={(e) => setCurrentQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAskQuestion();
                }
              }}
              placeholder="Örn: Mustafa Kemal Paşa genelgede vatanın durumu hakkında ne bildirmiştir?"
              className="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-amber-700"
              disabled={loading}
            />
            <button
              onClick={() => handleAskQuestion()}
              disabled={loading || !currentQuestion.trim() || !documentsText.trim()}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
                loading || !currentQuestion.trim() || !documentsText.trim()
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  : 'bg-amber-800 hover:bg-amber-900 text-amber-50 shadow-sm cursor-pointer'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>İnceleniyor...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Sor</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
            {errorMessage}
          </div>
        )}

        {/* Suggested Student Questions */}
        <div>
          <div className="text-xs font-semibold text-stone-500 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Öğrenciler İçin Örnek Sorular (Kural Testleri & Belge Sorguları):</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {currentPack.suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleAskQuestion(q)}
                disabled={loading || !documentsText.trim()}
                className="text-left text-xs bg-stone-100 hover:bg-amber-50 text-stone-700 hover:text-amber-900 border border-stone-200 hover:border-amber-300 rounded-lg px-3 py-1.5 transition-colors disabled:opacity-50"
              >
                &quot;{q}&quot;
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Q&A Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-stone-900 text-lg flex items-center gap-2">
            <span>Röportaj Kayıtları</span>
            <span className="text-xs font-sans font-normal px-2 py-0.5 rounded-full bg-stone-200 text-stone-700">
              {qaHistory.length} Soru-Cevap
            </span>
          </h3>

          {qaHistory.length >= 2 && (
            <button
              onClick={onProceedToPublish}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 hover:text-amber-950 underline"
            >
              <span>Gazete Sayfası ve Podcast için Yeterli Kayıt Var →</span>
            </button>
          )}
        </div>

        {qaHistory.length === 0 ? (
          <div className="p-10 border-2 border-dashed border-stone-300 rounded-xl text-center bg-stone-50/50">
            <BookOpen className="w-8 h-8 text-stone-400 mx-auto mb-2" />
            <p className="text-stone-700 font-serif font-semibold text-base">Henüz Soru Sorulmadı</p>
            <p className="text-xs text-stone-500 max-w-md mx-auto mt-1">
              Yukarıdaki örnek sorulardan birine tıklayabilir ya da öğrencilerinizin ders sırasında sorduğu soruları yazabilirsiniz.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {qaHistory.map((item, index) => (
              <div
                key={item.id}
                className="border border-stone-200 bg-white rounded-xl p-5 shadow-sm space-y-3 transition-all hover:border-stone-300"
              >
                {/* Question Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-stone-200 text-stone-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      Ö{index + 1}
                    </span>
                    <div>
                      <div className="text-xs font-semibold text-stone-500">
                        Öğrenci Sorusu • {item.timestamp}
                      </div>
                      <div className="text-sm font-semibold text-stone-900 mt-0.5">
                        {item.question}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteQA(item.id)}
                    className="text-stone-400 hover:text-red-600 p-1 rounded-md transition-colors"
                    title="Bu soruyu sil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Reporter Answer */}
                <div className="bg-amber-50/70 border-l-4 border-amber-800 p-4 rounded-r-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-900">
                      <span className="w-2 h-2 rounded-full bg-amber-700 animate-pulse" />
                      <span>Tarih Muhabiri</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleSpeak(item)}
                        className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors ${
                          speakingId === item.id
                            ? 'bg-amber-200 text-amber-900'
                            : 'text-stone-600 hover:bg-amber-100 hover:text-stone-900'
                        }`}
                        title="Sesli Oku"
                      >
                        {speakingId === item.id ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-amber-900" />
                            <span className="text-[11px] font-medium">Durdur</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-medium">Seslendir</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleCopy(item)}
                        className="p-1.5 rounded-lg text-stone-600 hover:bg-amber-100 hover:text-stone-900 text-xs flex items-center gap-1 transition-colors"
                        title="Kopyala"
                      >
                        {copiedId === item.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-[11px] text-emerald-700">Kopyalandı</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span className="text-[11px]">Kopyala</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-stone-800 leading-relaxed font-serif">
                    {item.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA to publish */}
        <div className="pt-4 flex justify-end">
          <button
            onClick={onProceedToPublish}
            className="py-3 px-6 rounded-xl font-medium text-sm flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-amber-100 transition-all shadow-md"
          >
            <span>3. Yayın Bölümüne Geç (Gazete & Podcast)</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
