'use client';

import React, { useRef } from 'react';
import { Printer, Download, Share2, Sparkles, BookOpen, CheckCircle, Quote, HelpCircle } from 'lucide-react';

export interface NewspaperData {
  gazeteAdi: string;
  tarih: string;
  baskiBilgisi: string;
  sehir: string;
  manset: string;
  spot: string;
  haberMetni: string;
  alintilar: Array<{
    metin: string;
    belge: string;
  }>;
  kontrolSorulari: string[];
  muhabirNotu?: string;
}

interface NewspaperViewProps {
  data: NewspaperData;
}

export const NewspaperView: React.FC<NewspaperViewProps> = ({ data }) => {
  const paperRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between bg-stone-900 text-stone-200 p-4 rounded-xl no-print">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-sm font-semibold text-stone-100 font-serif">
            1919 Dönemi Arşiv Gazetesi Hazır
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-amber-700 hover:bg-amber-600 text-amber-50 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Sayfayı Yazdır / PDF Kaydet</span>
          </button>
        </div>
      </div>

      {/* 1919 Newspaper Authenticity Canvas */}
      <div
        ref={paperRef}
        className="newspaper-paper text-[#1d1712] p-6 sm:p-10 rounded-2xl shadow-2xl border-4 border-[#2b2219] max-w-5xl mx-auto space-y-6 transition-all"
      >
        {/* Top Header Bar / Tarih & Fiyat */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm font-newspaper-title tracking-wider border-b-2 border-[#2b2219] pb-2 text-[#3b2d22]">
          <div>{data.sehir || 'AMASYA / SİVAS / ANKARA'}</div>
          <div className="font-bold">{data.tarih || '22 HAZİRAN 1919 / 1335 RUMİ'}</div>
          <div>{data.baskiBilgisi || 'FEVKALÂDE NÜSHA • FİYATI: 10 PARA'}</div>
        </div>

        {/* Vintage Masthead (Gazete Başlığı) */}
        <div className="text-center py-4 border-b-4 double border-[#2b2219]">
          <div className="text-xs sm:text-sm tracking-[0.25em] uppercase text-[#614b38] font-bold font-newspaper-title mb-1">
            MİLLİ İRÂDE VE İSTİKLÂL MÜDAFAASI
          </div>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-newspaper-title text-[#140e09] uppercase drop-shadow-sm">
            {data.gazeteAdi || 'TARİH MUHABİRİ GAZETESİ'}
          </h1>
          <div className="text-xs sm:text-sm tracking-widest text-[#4a3a2c] font-serif italic mt-2">
            &quot;Hâkimiyet bilâkaydü şart milletindir • Birincil Vesikalar Işığında Hakikatler&quot;
          </div>
        </div>

        {/* Thick divider with archival stamp */}
        <div className="newspaper-border-thick py-1 text-center text-[11px] font-newspaper-title tracking-widest uppercase text-[#544131]">
          TARİH MUHABİRİ ÖZEL BASIMI — BİRİNCİL BELGELERE SADIK RESMÎ BÜLTEN
        </div>

        {/* MANŞET (Headline) */}
        <div className="text-center space-y-3 py-2">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black font-newspaper-title uppercase leading-tight text-[#140e09] tracking-tight">
            {data.manset}
          </h2>

          {/* SPOT (Subheadline) */}
          <div className="max-w-4xl mx-auto px-4 py-2 border-y border-[#544131]/40">
            <p className="text-base sm:text-xl font-newspaper-body font-semibold italic text-[#2c2219] leading-relaxed text-center">
              {data.spot}
            </p>
          </div>
        </div>

        {/* Multi-Column Article & Quotes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
          {/* Main News Article (haberMetni) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="text-xs uppercase font-newspaper-title tracking-wider text-[#614b38] border-b border-[#2b2219] pb-1 flex items-center justify-between">
              <span>MUHABİRİMİZİN TELGRAF RAPORU</span>
              <span>BİRİNCİL KAYNAK İNCELEMESİ</span>
            </div>

            <div className="newspaper-dropcap font-newspaper-body text-base sm:text-lg leading-relaxed text-[#1a140f] text-justify space-y-4">
              {data.haberMetni.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="indent-6">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Reporter analysis note */}
            {data.muhabirNotu && (
              <div className="mt-6 p-4 bg-[#ede4cf] rounded-lg border border-[#a89578] font-newspaper-body text-sm sm:text-base italic text-[#2e2318]">
                <strong>Muhabirin Ders Notu:</strong> {data.muhabirNotu}
              </div>
            )}
          </div>

          {/* Sidebar: Verbatim Quotes (alintilar) & Period Stamp */}
          <div className="lg:col-span-4 space-y-6">
            {/* Authentic Quotes Callout Box */}
            <div className="border-2 border-[#2b2219] p-4 bg-[#f2ecdc] shadow-sm rounded-lg space-y-3">
              <div className="flex items-center gap-2 border-b-2 border-[#2b2219] pb-2 text-[#1a140f]">
                <Quote className="w-5 h-5 text-[#822a1f]" />
                <h3 className="font-newspaper-title font-bold text-sm tracking-wide uppercase">
                  Belgelerden Birebir Alıntılar
                </h3>
              </div>

              <div className="space-y-4">
                {data.alintilar && data.alintilar.map((alinti, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#fbf8f0] border-l-4 border-[#822a1f] shadow-xs text-xs sm:text-sm font-newspaper-body text-[#1e1711] space-y-1.5"
                  >
                    <p className="italic font-medium">
                      &quot;{alinti.metin}&quot;
                    </p>
                    <div className="text-right text-[11px] font-newspaper-title font-bold text-[#822a1f]">
                      [{alinti.belge}]
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Archival Stamp */}
            <div className="p-4 border-2 border-dashed border-[#822a1f]/80 rounded-xl text-center text-[#822a1f] space-y-1">
              <div className="text-[10px] tracking-widest uppercase font-newspaper-title">
                MİLLİ MÜCADELE MATBAASI
              </div>
              <div className="text-sm font-bold font-newspaper-title uppercase">
                BİRİNCİL TARİHÎ VESİKA ONAYLI
              </div>
              <div className="text-[10px] font-mono">
                ARŞİV KAYIT NO: 1919-MM-01
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: 3 Critical Evaluation Questions (kontrolSorulari) */}
        <div className="mt-8 pt-6 border-t-2 border-[#2b2219] space-y-4">
          <div className="flex items-center justify-between border-b border-[#2b2219]/60 pb-2">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#822a1f]" />
              <h3 className="font-newspaper-title font-bold text-base sm:text-lg uppercase text-[#140e09]">
                Öğrenciler İçin Kontrol ve Değerlendirme Soruları (3 Soru)
              </h3>
            </div>
            <span className="text-xs font-newspaper-title text-[#614b38] hidden sm:block">
              Pedagojik Analiz
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.kontrolSorulari && data.kontrolSorulari.map((soru, index) => (
              <div
                key={index}
                className="bg-[#f2ebdc] border border-[#3b2d22]/40 rounded-xl p-4 shadow-sm space-y-2"
              >
                <div className="w-6 h-6 rounded-full bg-[#2b2219] text-[#f7f3e8] flex items-center justify-center text-xs font-bold font-newspaper-title">
                  {index + 1}
                </div>
                <p className="font-newspaper-body text-sm sm:text-base font-semibold text-[#1f1710] leading-snug">
                  {soru}
                </p>
                <p className="text-[11px] font-newspaper-body italic text-[#614b38]">
                  Cevabı gazetede ve belgelerdeki maddeler ışığında tartışınız.
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Vintage Footer */}
        <div className="text-center pt-4 border-t border-[#2b2219]/40 text-[11px] font-newspaper-title tracking-wider text-[#614b38]">
          Tarih Dersi Öğretim Materyali • &quot;Tarih Muhabiri&quot; 1919 Basını İle Hazırlanmıştır
        </div>
      </div>
    </div>
  );
};
