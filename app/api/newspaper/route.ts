import { NextRequest, NextResponse } from 'next/server';
import { ai } from '@/lib/gemini';
import { Type } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    const { documents, interviewLog } = await req.json();

    if (!documents || typeof documents !== 'string' || !documents.trim()) {
      return NextResponse.json(
        { error: 'Lütfen gazete sayfası oluşturmak için önce belgeleri giriniz.' },
        { status: 400 }
      );
    }

    const logSummary = interviewLog && Array.isArray(interviewLog) && interviewLog.length > 0
      ? interviewLog.map((item: { question: string; answer: string }, idx: number) => 
          `Soru ${idx + 1}: ${item.question}\nMuhabir Cevabı: ${item.answer}`
        ).join('\n\n')
      : 'Henüz röportaj sorusu sorulmadı. Gazete haberi doğrudan birincil belgeler üzerinden derlenecektir.';

    const prompt = `Aşağıdaki tarihî belgeleri ve yapılan röportajı inceleyerek 1919 dönemi gazetesi formatında profesyonel, arşiv niteliğinde bir gazete sayfası haberi hazırla.

BİRİNCİL TARİHÎ BELGELER:
---
${documents}
---

YAPILAN RÖPORTAJ KAYITLARI:
---
${logSummary}
---

KURALLAR:
1. manset: 1919 dönemi Türk basını (Hâkimiyet-i Milliye, İrâde-i Milliye, Tasvir-i Efkâr) üslubunda, vurucu, büyük harfli ve etkileyici bir başlık.
2. spot: Manşetin altında yer alacak, 2-3 cümlelik dikkat çekici özet.
3. haberMetni: Röportajdaki soru-cevapları ve belgelerdeki gerçekleri harmanlayan, üçüncü şahıs gözüyle yazılmış, 3-4 paragraflık derinlemesine gazete haber metni.
4. alintilar: YALNIZCA belgelerde geçen cümlelerden BİREBİR (verbatim) yapılmış alıntılar olmalı. Her alıntının hangi belgeden olduğu ("Belge 1", "Belge 2" gibi) tam belirtilmeli.
5. kontrolSorulari: Öğrencilerin belgeleri ve haberi eleştirel gözle analiz etmesini sağlayacak TAM 3 ADET pedagojik kontrol sorusu.
6. Asla tarihî kişilerin ağzından konuşma; bir gazeteci/muhabir dili kullan.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'Sen 1919 Milli Mücadele döneminin arşiv gazetesi editörüsün. Yalnızca verilen belgelerdeki hakikatlere dayalı, belgelerden birebir alıntı yapan, nesnel ve etkileyici bir gazete sayfası JSON verisi üretirsin.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            gazeteAdi: {
              type: Type.STRING,
              description: 'Gazetenin adı, örn: İRÂDE-İ MİLLİYE veya TARİH MUHABİRİ GAZETESİ',
            },
            tarih: {
              type: Type.STRING,
              description: 'Dönemin tarihi, örn: 22 Haziran 1919 (1335 Rumi)',
            },
            baskiBilgisi: {
              type: Type.STRING,
              description: 'Baskı ve fiyat detayı, örn: Fevkalade Nüsha - Sayı: 19 - Fiyatı: 10 Para',
            },
            sehir: {
              type: Type.STRING,
              description: 'Yayın merkezi / vilayet, örn: Amasya / Ankara',
            },
            manset: {
              type: Type.STRING,
              description: 'Gazetenin ana manşeti',
            },
            spot: {
              type: Type.STRING,
              description: 'Manşet altı spot / özet metni',
            },
            haberMetni: {
              type: Type.STRING,
              description: 'Muhabirin kaleme aldığı detaylı haber metni',
            },
            alintilar: {
              type: Type.ARRAY,
              description: 'Belgelerden birebir yapılmış alıntılar listesi',
              items: {
                type: Type.OBJECT,
                properties: {
                  metin: {
                    type: Type.STRING,
                    description: 'Belgeden birebir alıntılanan cümle',
                  },
                  belge: {
                    type: Type.STRING,
                    description: 'Hangi belgeden olduğu, örn: Belge 1 veya Belge 2',
                  },
                },
                required: ['metin', 'belge'],
              },
            },
            kontrolSorulari: {
              type: Type.ARRAY,
              description: 'Öğrenciler için tam 3 adet kontrol sorusu',
              items: {
                type: Type.STRING,
              },
            },
            muhabirNotu: {
              type: Type.STRING,
              description: 'Muhabirin tarihsel belge analizi ve ders notu',
            },
          },
          required: ['gazeteAdi', 'manset', 'spot', 'haberMetni', 'alintilar', 'kontrolSorulari'],
        },
      },
    });

    const rawJson = response.text?.trim() || '{}';
    const parsedData = JSON.parse(rawJson);

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error('Newspaper API error:', error);
    return NextResponse.json(
      { error: error?.message || 'Gazete sayfası oluşturulurken hata meydana geldi.' },
      { status: 500 }
    );
  }
}
