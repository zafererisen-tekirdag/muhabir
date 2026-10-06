'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  Volume2, 
  Mic, 
  BookOpen, 
  Sparkles, 
  Radio, 
  AlertCircle,
  CheckCircle2,
  Headphones
} from 'lucide-react';

export interface DialogueTurn {
  speaker: 'Muhabir' | 'Tarihçi' | string;
  text: string;
  style?: string;
}

export interface PodcastData {
  title: string;
  summary: string;
  dialogue: DialogueTurn[];
  audioBase64?: string | null;
  mimeType?: string | null;
  ttsError?: string | null;
}

interface PodcastViewProps {
  data: PodcastData;
  onRegenerate: () => void;
}

export const PodcastView: React.FC<PodcastViewProps> = ({ data, onRegenerate }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(60);
  const [activeTurnIndex, setActiveTurnIndex] = useState<number | null>(null);
  const [isBrowserSpeaking, setIsBrowserSpeaking] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Setup Gemini TTS audio element if base64 audio is provided
  useEffect(() => {
    if (data.audioBase64) {
      const audioUrl = `data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`;
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onloadedmetadata = () => {
        setDuration(audio.duration || 60);
      };

      audio.ontimeupdate = () => {
        setCurrentTime(audio.currentTime);
        // Compute which dialogue turn is roughly speaking
        if (data.dialogue.length > 0) {
          const totalTurns = data.dialogue.length;
          const turnDuration = (audio.duration || 60) / totalTurns;
          const currentIndex = Math.min(
            Math.floor(audio.currentTime / turnDuration),
            totalTurns - 1
          );
          setActiveTurnIndex(currentIndex);
        }
      };

      audio.onended = () => {
        setIsPlaying(false);
        setCurrentTime(0);
        setActiveTurnIndex(null);
      };

      return () => {
        audio.pause();
        audioRef.current = null;
      };
    }
  }, [data.audioBase64, data.mimeType, data.dialogue]);

  const togglePlayAudio = () => {
    if (audioRef.current && data.audioBase64) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch((err) => {
          console.error('Audio play error:', err);
          fallbackToBrowserSpeech();
        });
      }
    } else {
      fallbackToBrowserSpeech();
    }
  };

  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      fallbackToBrowserSpeech();
    }
  };

  // Browser speech synthesis fallback for multi-speaker simulation
  const fallbackToBrowserSpeech = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isBrowserSpeaking) {
      window.speechSynthesis.cancel();
      setIsBrowserSpeaking(false);
      setActiveTurnIndex(null);
      return;
    }

    window.speechSynthesis.cancel();
    setIsBrowserSpeaking(true);

    const turns = data.dialogue;
    let turnIdx = 0;

    const speakNext = () => {
      if (turnIdx >= turns.length) {
        setIsBrowserSpeaking(false);
        setActiveTurnIndex(null);
        return;
      }

      const turn = turns[turnIdx];
      setActiveTurnIndex(turnIdx);

      const utterance = new SpeechSynthesisUtterance(turn.text);
      utterance.lang = 'tr-TR';

      // Vary pitch and rate to differentiate Muhabir vs Tarihçi
      if (turn.speaker.toLowerCase().includes('tarih')) {
        utterance.pitch = 0.85; // Calmer, slightly deeper voice for Historian
        utterance.rate = 0.95;
      } else {
        utterance.pitch = 1.15; // Brighter reporter voice
        utterance.rate = 1.05;
      }

      utterance.onend = () => {
        turnIdx++;
        speakNext();
      };

      utterance.onerror = () => {
        setIsBrowserSpeaking(false);
        setActiveTurnIndex(null);
      };

      window.speechSynthesis.speak(utterance);
    };

    speakNext();
  };

  const handleDownload = () => {
    if (!data.audioBase64) return;
    const link = document.createElement('a');
    link.href = `data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`;
    link.download = `tarih-muhabiri-podcast-${Date.now()}.wav`;
    link.click();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Studio Header Card */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-850 to-amber-950 text-stone-100 rounded-2xl p-6 shadow-xl border border-stone-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-600/30 border border-amber-500/40 flex items-center justify-center text-amber-300 shadow-inner">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-900/80 text-amber-300 border border-amber-700/60 uppercase tracking-wider">
                  Gemini TTS • İki Sesli Stüdyo
                </span>
                <span className="text-xs text-stone-400 font-mono">
                  ~1 Dakikalık Bölüm
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-amber-100 mt-1">
                {data.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {data.audioBase64 && (
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-300 bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors border border-stone-700"
                title="WAV Ses Dosyasını İndir"
              >
                <Download className="w-3.5 h-3.5" />
                <span>İndir (.wav)</span>
              </button>
            )}
          </div>
        </div>

        <p className="text-sm text-stone-300 font-sans leading-relaxed">
          {data.summary}
        </p>

        {/* Dual Voices Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-stone-800/80">
          <div className="flex items-center gap-2.5 bg-stone-800/50 p-2.5 rounded-xl border border-stone-700/40">
            <div className="w-8 h-8 rounded-lg bg-sky-900/60 border border-sky-600/50 flex items-center justify-center text-sky-300 font-bold text-xs">
              🎙️
            </div>
            <div>
              <div className="text-xs font-semibold text-sky-200">Muhabir (Hazır Ses 1: Puck)</div>
              <div className="text-[11px] text-stone-400">Meraklı, gazeteci dili, belgeleri sorar</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-stone-800/50 p-2.5 rounded-xl border border-stone-700/40">
            <div className="w-8 h-8 rounded-lg bg-amber-900/60 border border-amber-600/50 flex items-center justify-center text-amber-300 font-bold text-xs">
              📜
            </div>
            <div>
              <div className="text-xs font-semibold text-amber-200">Tarihçi (Hazır Ses 2: Kore)</div>
              <div className="text-[11px] text-stone-400">Uzman anlatıcı, kişileri canlandırmaz, belgeleri açıklar</div>
            </div>
          </div>
        </div>

        {/* Player Controls */}
        <div className="pt-4 border-t border-stone-800 flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={togglePlayAudio}
            className="w-14 h-14 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer shrink-0"
            title={isPlaying || isBrowserSpeaking ? 'Durdur' : 'Oynat'}
          >
            {isPlaying || isBrowserSpeaking ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current ml-1" />
            )}
          </button>

          <button
            onClick={handleRestart}
            className="p-2.5 rounded-xl text-stone-300 hover:text-stone-100 hover:bg-stone-800 transition-colors"
            title="Başa Sar"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {/* Progress bar */}
          <div className="flex-1 w-full space-y-1">
            <div className="w-full bg-stone-800 h-2.5 rounded-full overflow-hidden relative">
              <div
                className="bg-gradient-to-r from-amber-500 to-amber-400 h-full transition-all duration-300 rounded-full"
                style={{ width: `${Math.min(100, (currentTime / (duration || 60)) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-stone-400 font-mono">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Animated audio waves */}
          {(isPlaying || isBrowserSpeaking) && (
            <div className="flex items-center gap-1 h-6 shrink-0">
              <span className="w-1 h-3 bg-amber-400 rounded-full animate-bounce" />
              <span className="w-1 h-6 bg-amber-300 rounded-full animate-bounce [animation-delay:0.15s]" />
              <span className="w-1 h-4 bg-amber-400 rounded-full animate-bounce [animation-delay:0.3s]" />
              <span className="w-1 h-5 bg-amber-200 rounded-full animate-bounce [animation-delay:0.45s]" />
            </div>
          )}
        </div>

        {/* TTS Status banner */}
        {data.audioBase64 ? (
          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded-lg">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Gemini TTS Türkçe çift-sesli model kaydı hazır.</span>
          </div>
        ) : (
          <div className="flex items-center justify-between text-xs text-amber-300 bg-amber-950/40 border border-amber-800/40 px-3 py-1.5 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Etkileşimli tarayıcı Türkçe çift-ses motoru ile dinleyebilirsiniz.</span>
            </div>
            <button
              onClick={fallbackToBrowserSpeech}
              className="underline font-semibold hover:text-white"
            >
              {isBrowserSpeaking ? 'Durdur' : 'Seslendir'}
            </button>
          </div>
        )}
      </div>

      {/* Episode Dialogue Script */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <Headphones className="w-5 h-5 text-amber-800" />
            <h3 className="font-serif font-bold text-stone-900 text-lg">
              Podcast Diyalog Metni (Replikler)
            </h3>
          </div>
          <span className="text-xs text-stone-500 font-mono">
            {data.dialogue.length} Replik
          </span>
        </div>

        <div className="space-y-3.5">
          {data.dialogue.map((turn, index) => {
            const isHistorian = turn.speaker.toLowerCase().includes('tarih');
            const isActive = activeTurnIndex === index;

            return (
              <div
                key={index}
                className={`p-4 rounded-xl border transition-all ${
                  isActive
                    ? 'border-amber-600 bg-amber-50 shadow-md ring-2 ring-amber-500/20'
                    : isHistorian
                    ? 'border-stone-200 bg-stone-50/80 hover:bg-stone-50'
                    : 'border-sky-100 bg-sky-50/50 hover:bg-sky-50/80'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-xs font-bold rounded-md ${
                      isHistorian
                        ? 'bg-amber-800 text-amber-100'
                        : 'bg-sky-800 text-sky-100'
                    }`}>
                      {isHistorian ? '📜 Tarihçi' : '🎙️ Muhabir'}
                    </span>
                    {turn.style && (
                      <span className="text-[11px] text-stone-500 italic">
                        ({turn.style})
                      </span>
                    )}
                  </div>

                  {isActive && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 animate-pulse">
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Konuşuluyor</span>
                    </span>
                  )}
                </div>

                <p className="text-sm sm:text-base font-serif text-stone-800 leading-relaxed pl-1">
                  {turn.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
