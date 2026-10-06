'use client';

import React from 'react';
import { ScrollText, Plus, CheckCircle2, AlertCircle, Sparkles, FileText, ArrowRight, BookOpen, Trash2 } from 'lucide-react';
import { SAMPLE_DOCUMENT_PACKS, SampleDocumentPack } from '@/lib/sample-documents';

interface DocumentsSectionProps {
  documentsText: string;
  setDocumentsText: (text: string) => void;
  onProceedToInterview: () => void;
}

export const DocumentsSection: React.FC<DocumentsSectionProps> = ({
  documentsText,
  setDocumentsText,
  onProceedToInterview,
}) => {
  // Parse detected documents based on "Belge 1:", "Belge 2:", etc.
  const detectedDocMatches = Array.from(
    documentsText.matchAll(/Belge\s*(\d+)[\s*:]+([\s\S]*?)(?=(?:Belge\s*\d+[\s*:]+)|$)/gi)
  );

  const detectedDocuments = detectedDocMatches.map((match) => ({
    number: match[1],
    content: match[2].trim(),
  }));

  const handleInsertDocumentTemplate = () => {
    const nextNumber = detectedDocuments.length > 0
      ? Math.max(...detectedDocuments.map(d => parseInt(d.number, 10) || 0)) + 1
      : 1;

    const newDocBlock = `\n\nBelge ${nextNumber}:\n"..." (Belgenin kaynağı ve maddesi)`;
    setDocumentsText((documentsText.trim() ? documentsText + newDocBlock : `Belge ${nextNumber}:\n"..."`));
  };

  const handleSelectPack = (pack: SampleDocumentPack) => {
    setDocumentsText(pack.documentsText);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-amber-950/20 border border-amber-900/40 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-700 text-amber-100 flex items-center justify-center text-xs font-bold font-mono">
                1
              </span>
              <h2 className="text-xl font-bold font-serif text-stone-900">
                Tarihî Birincil Belgeleri Yükleme Masası
              </h2>
            </div>
            <p className="text-sm text-stone-600">
              Öğretmen olarak derste inceleyeceğiniz <strong>2-3 tarihî belge metnini</strong> aşağıya yapıştırın.
              Muhabirimiz yalnızca bu belgelere sadık kalacak, dışarıdan hiçbir bilgi eklemeyecektir.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleInsertDocumentTemplate}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-stone-800 bg-stone-200 hover:bg-stone-300 rounded-lg transition-colors border border-stone-300"
            >
              <Plus className="w-3.5 h-3.5 text-stone-700" />
              <span>Yeni Belge Ekle</span>
            </button>
            <button
              onClick={() => setDocumentsText('')}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              title="Metin alanını temizle"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Temizle</span>
            </button>
          </div>
        </div>

        {/* Sample Packs Quick Buttons */}
        <div className="mt-4 pt-4 border-t border-amber-900/20">
          <div className="text-xs font-medium text-stone-500 mb-2 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-amber-700" />
            <span>Hazır Örnek Belge Paketleri ile Hızlı Deneme:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {SAMPLE_DOCUMENT_PACKS.map((pack) => (
              <button
                key={pack.id}
                onClick={() => handleSelectPack(pack)}
                className="text-left p-2.5 rounded-lg border border-amber-900/20 bg-amber-50/70 hover:bg-amber-100/80 hover:border-amber-700/50 transition-all text-xs group"
              >
                <div className="font-semibold text-stone-900 group-hover:text-amber-900">
                  {pack.title}
                </div>
                <div className="text-[11px] text-stone-500 truncate mt-0.5">
                  {pack.period}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Textarea and Detected Document Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Editor Area */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="docs-input" className="text-sm font-semibold text-stone-800 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-800" />
              <span>Belge Metinleri (Etiketli: &quot;Belge 1:&quot;, &quot;Belge 2:&quot;)</span>
            </label>
            <span className="text-xs font-mono text-stone-500">
              {documentsText.length} karakter • {documentsText.trim().split(/\s+/).filter(Boolean).length} kelime
            </span>
          </div>

          <div className="relative">
            <textarea
              id="docs-input"
              value={documentsText}
              onChange={(e) => setDocumentsText(e.target.value)}
              placeholder={`Örnek Format:

Belge 1:
"Vatanın bütünlüğü, milletin bağımsızlığı tehlikededir..." (Amasya Tamimi Madde 1)

Belge 2:
"Milletin bağımsızlığını, yine milletin azim ve kararı kurtaracaktır..." (Amasya Tamimi Madde 3)

Belge 3:
"Sivas'ta millî bir kongrenin acele toplanması kararlaştırılmıştır..." (Amasya Tamimi Madde 5)`}
              rows={16}
              className="w-full p-4 rounded-xl border border-stone-300 bg-white text-stone-900 font-mono text-xs sm:text-sm leading-relaxed shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-amber-700"
            />
          </div>

          <div className="text-xs text-stone-500 flex items-center justify-between">
            <span>💡 İpucu: Her belgenin başına <strong>Belge 1:</strong>, <strong>Belge 2:</strong> yazmanız alıntıların doğruluğunu artırır.</span>
          </div>
        </div>

        {/* Live Analysis and Next Step */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-serif font-bold text-stone-900 flex items-center gap-2">
                <ScrollText className="w-4 h-4 text-amber-800" />
                <span>Belge Denetim Masası</span>
              </h3>
              <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                detectedDocuments.length >= 2
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}>
                {detectedDocuments.length >= 2 ? 'Hazır' : 'Belge Eksik'}
              </span>
            </div>

            {/* Validation Notice */}
            {detectedDocuments.length === 0 ? (
              <div className="p-3.5 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Henüz belge etiketi algılanmadı.</p>
                  <p className="mt-0.5 text-amber-800">
                    Lütfen sol taraftaki metne &quot;Belge 1:&quot; ve &quot;Belge 2:&quot; etiketleri ekleyin veya yukarıdaki örnek paketlerden birini seçin.
                  </p>
                </div>
              </div>
            ) : detectedDocuments.length === 1 ? (
              <div className="p-3.5 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">1 Belge algılandı (Öneri: 2-3 Belge).</p>
                  <p className="mt-0.5 text-amber-800">
                    Öğretmenlerimizin karşılaştırmalı tarihî analiz yapabilmesi için en az 2 belge girilmesi tavsiye edilir.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Harika! <strong>{detectedDocuments.length} adet tarihî belge</strong> başarıyla ayrıştırıldı.</span>
              </div>
            )}

            {/* Detected List */}
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {detectedDocuments.map((doc, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg border border-stone-200 bg-white hover:border-amber-700/40 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-stone-800 mb-1">
                    <span className="font-serif text-amber-900">Belge {doc.number}</span>
                    <span className="text-[11px] font-mono text-stone-500">
                      {doc.content.length} karakter
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 line-clamp-3 italic font-serif">
                    {doc.content || '(İçerik boş)'}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA to Interview */}
            <div className="pt-3 border-t border-stone-200">
              <button
                onClick={onProceedToInterview}
                disabled={!documentsText.trim()}
                className={`w-full py-3 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${
                  documentsText.trim()
                    ? 'bg-amber-800 hover:bg-amber-900 text-amber-50 cursor-pointer'
                    : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                }`}
              >
                <span>2. Röportaj Bölümüne Geç</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-center text-[11px] text-stone-500 mt-2">
                Öğrencilerinizin sorularını muhabirimize yöneltmeye hazırsınız.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
