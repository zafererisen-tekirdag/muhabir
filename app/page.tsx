'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { DocumentsSection } from '@/components/DocumentsSection';
import { InterviewSection, QAPair } from '@/components/InterviewSection';
import { PublicationSection } from '@/components/PublicationSection';
import { NewspaperData } from '@/components/NewspaperView';
import { PodcastData } from '@/components/PodcastView';
import { SamplePacksModal } from '@/components/SamplePacksModal';
import { SAMPLE_DOCUMENT_PACKS, SampleDocumentPack } from '@/lib/sample-documents';
import { ScrollText, Sparkles, Newspaper, Radio, ArrowRight, BookOpen, Quote } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'documents' | 'interview' | 'publish'>('documents');
  const [documentsText, setDocumentsText] = useState<string>(SAMPLE_DOCUMENT_PACKS[0].documentsText);
  const [qaHistory, setQaHistory] = useState<QAPair[]>([
    {
      id: 'init-1',
      question: 'Amasya Genelgesi\'nde vatanın ve bağımsızlığın durumu hakkında ne belirtilmiştir?',
      answer: 'Amasya Genelgesi\'nin birinci ve ikinci maddelerinde, vatanın bütünlüğünün ve milletin bağımsızlığının tehlikede olduğu açıkça ifade edilmiştir. Ayrıca belgede İstanbul Hükûmeti\'nin üzerine aldığı sorumluluğun gereklerini yerine getiremediği ve bu durumun milleti yok olmuş gibi gösterdiği bildirilmiştir. [Belge 1]',
      timestamp: '09:15',
    },
    {
      id: 'init-2',
      question: 'Milletin bağımsızlığını ne kurtaracaktır?',
      answer: 'Genelgede "Milletin bağımsızlığını, yine milletin azim ve kararı kurtaracaktır." hükmü yer almaktadır. Ayrıca milletin haklarını dünyaya duyurmak için her türlü denetimden uzak millî bir heyetin varlığının zaruri olduğu vurgulanmıştır. [Belge 2]',
      timestamp: '09:18',
    }
  ]);
  const [newspaperData, setNewspaperData] = useState<NewspaperData | null>(null);
  const [podcastData, setPodcastData] = useState<PodcastData | null>(null);
  const [isSamplePacksOpen, setIsSamplePacksOpen] = useState(false);

  // Compute document count based on "Belge X:" tags
  const documentMatches = Array.from(documentsText.matchAll(/Belge\s*\d+[\s*:]+/gi));
  const documentCount = documentMatches.length > 0 ? documentMatches.length : (documentsText.trim() ? 1 : 0);

  const handleSelectPack = (pack: SampleDocumentPack) => {
    setDocumentsText(pack.documentsText);
    setQaHistory([]);
    setNewspaperData(null);
    setPodcastData(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-100 text-stone-900 font-sans">
      {/* Top Header & Main Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        documentCount={documentCount}
        qaCount={qaHistory.length}
        hasNewspaper={!!newspaperData}
        hasPodcast={!!podcastData}
        onOpenSamplePacks={() => setIsSamplePacksOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Dynamic Section Rendering */}
        {activeTab === 'documents' && (
          <DocumentsSection
            documentsText={documentsText}
            setDocumentsText={setDocumentsText}
            onProceedToInterview={() => setActiveTab('interview')}
          />
        )}

        {activeTab === 'interview' && (
          <InterviewSection
            documentsText={documentsText}
            qaHistory={qaHistory}
            setQaHistory={setQaHistory}
            onProceedToPublish={() => setActiveTab('publish')}
            onGoToDocuments={() => setActiveTab('documents')}
          />
        )}

        {activeTab === 'publish' && (
          <PublicationSection
            documentsText={documentsText}
            qaHistory={qaHistory}
            newspaperData={newspaperData}
            setNewspaperData={setNewspaperData}
            podcastData={podcastData}
            setPodcastData={setPodcastData}
            onGoToDocuments={() => setActiveTab('documents')}
            onGoToInterview={() => setActiveTab('interview')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 border-t border-stone-800 text-xs py-6 mt-12 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-amber-200">Tarih Muhabiri</span>
            <span>• Tarih Dersi İçin Belgeye Dayalı Yapay Zekâ Eğitimi</span>
          </div>
          <div className="text-center sm:text-right text-stone-500">
            <span>Model: Gemini 3.8 Flash • Türkçe TTS Çift-Sesli Stüdyo • 1919 Matbaası</span>
          </div>
        </div>
      </footer>

      {/* Sample Packs Modal */}
      <SamplePacksModal
        isOpen={isSamplePacksOpen}
        onClose={() => setIsSamplePacksOpen(false)}
        onSelectPack={handleSelectPack}
        currentText={documentsText}
      />
    </div>
  );
}
