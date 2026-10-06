'use client';

import React from 'react';
import { X, BookOpen, Check, ArrowRight } from 'lucide-react';
import { SAMPLE_DOCUMENT_PACKS, SampleDocumentPack } from '@/lib/sample-documents';

interface SamplePacksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPack: (pack: SampleDocumentPack) => void;
  currentText: string;
}

export const SamplePacksModal: React.FC<SamplePacksModalProps> = ({
  isOpen,
  onClose,
  onSelectPack,
  currentText,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-stone-50 rounded-2xl max-w-2xl w-full border border-stone-300 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-stone-900 text-stone-100 p-5 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-serif font-bold text-lg text-amber-50">
                Tarih Dersi Örnek Belge Paketleri
              </h3>
              <p className="text-xs text-stone-400">
                Milli Mücadele dönemine ait doğrulanmış birincil belgeler
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {SAMPLE_DOCUMENT_PACKS.map((pack) => {
            const isSelected = currentText.includes(pack.title.slice(0, 10));

            return (
              <div
                key={pack.id}
                className={`p-4 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-amber-700 bg-amber-50/80 ring-2 ring-amber-600/20'
                    : 'border-stone-200 bg-white hover:border-amber-400 hover:bg-amber-50/30'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif font-bold text-stone-900 text-base">
                        {pack.title}
                      </h4>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                        {pack.period}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      {pack.description}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      onSelectPack(pack);
                      onClose();
                    }}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-amber-800 text-amber-50'
                        : 'bg-stone-200 hover:bg-amber-800 hover:text-amber-50 text-stone-800'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-amber-200" />
                        <span>Yüklü</span>
                      </>
                    ) : (
                      <>
                        <span>Bu Paketi Yükle</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>

                {/* Preview snippet */}
                <div className="mt-3 p-3 bg-stone-100/70 rounded-lg text-[11px] font-mono text-stone-700 max-h-24 overflow-hidden text-ellipsis border border-stone-200/60">
                  <pre className="whitespace-pre-wrap font-mono">
                    {pack.documentsText.slice(0, 260)}...
                  </pre>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg text-xs font-semibold"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
