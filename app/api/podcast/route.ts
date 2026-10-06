import { NextRequest, NextResponse } from 'next/server';
import { ai } from '@/lib/gemini';
import { Type } from '@google/genai';

interface DialogueTurn {
  speaker: 'Muhabir' | 'Tarihçi';
  text: string;
  style?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { newsData, documents } = await req.json();

    if (!newsData && !documents) {
      return NextResponse.json(
        { error: 'Podcast oluşturmak için gazete haberi veya belge metni gereklidir.' },
        { status: 400 }
      );
    }

    const newsContext = newsData
      ? `MANŞET: ${newsData.manset}\nSPOT: ${newsData.spot}\nHABER METNİ:\n${newsData.haberMetni}\nALINTILAR:\n${JSON.stringify(newsData.alintilar || [])}`
      : `BELGELER:\n${documents}`;

    // Adım 1: "Muhabir" ve "Tarihçi" arasında yaklaşık 1 dakikalık (120-150 kelime) Türkçe podcast diyaloğu üret.
    const scriptPrompt = `Aşağıdaki gazete haberini ve tarihî belgeleri temel alarak "Muhabir" ve "Tarihçi" arasında yaklaşık 1 dakikalık (toplam yaklaşık 120-160 kelimelik, 6-8 repliklik) canlı, akıcı ve öğretici bir Türkçe podcast söyleşisi hazırla.

BAĞLAM:
${newsContext}

KESİN KURALLAR:
1. Konuşmacılar: "Muhabir" ve "Tarihçi".
2. Muhabir meraklı, soru soran, belgeden alıntı yapan bir gazetecidir.
3. Tarihçi bilgili, sakin bir uzmandır. TARİHÇİ DE TARİHÎ KİŞİLERİ ASLA CANLANDIRMAZ; ONLARI VE BELGELERİ ANLATIR.
4. Yalnızca verilen belgelerdeki gerçeklerden bahsedin.
5. Konuşma dili Türkçe, doğal ve ortaokul/lise öğrencileri için son derece ilgi çekici olmalıdır.
6. Toplam konuşma süresi yaklaşık 1 dakika (ortalama 6 ila 8 replik).`;

    const scriptResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: scriptPrompt,
      config: {
        systemInstruction: 'Sen profesyonel bir eğitim podcast yapımcısısın. Tarih dersleri için Muhabir ve Tarihçi rolleri arasında kaliteli, belgeye sadık diyaloglar üretirsin.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: 'Podcast bölüm başlığı',
            },
            summary: {
              type: Type.STRING,
              description: 'Kısa bölüm açıklaması',
            },
            dialogue: {
              type: Type.ARRAY,
              description: 'Konuşma replikleri listesi',
              items: {
                type: Type.OBJECT,
                properties: {
                  speaker: {
                    type: Type.STRING,
                    description: 'Muhabir veya Tarihçi',
                  },
                  text: {
                    type: Type.STRING,
                    description: 'Konuşma metni',
                  },
                  style: {
                    type: Type.STRING,
                    description: 'Ses tonu ve duygu kılavuzu (örn: Meraklı, Açıklayıcı)',
                  },
                },
                required: ['speaker', 'text'],
              },
            },
          },
          required: ['title', 'summary', 'dialogue'],
        },
      },
    });

    const scriptJsonText = scriptResponse.text?.trim() || '{}';
    const podcastScript = JSON.parse(scriptJsonText);
    const dialogueList: DialogueTurn[] = Array.isArray(podcastScript.dialogue)
      ? podcastScript.dialogue
      : [];

    // Adım 2: Gemini TTS ile iki farklı sesle seslendir
    let audioBase64: string | null = null;
    let ttsError: string | null = null;

    try {
      // Çoklu konuşmacı için replikleri hazırla
      const parts = dialogueList.map((turn) => {
        const speakerName = turn.speaker.toLowerCase().includes('tarih') ? 'Tarihçi' : 'Muhabir';
        return {
          text: `${speakerName}: ${turn.text}`,
          speechMetadata: {
            speaker: speakerName,
            style: speakerName === 'Muhabir'
              ? 'Energetic, inquisitive news reporter'
              : 'Scholarly, authoritative, calm historian',
          },
        };
      });

      if (parts.length > 0) {
        const ttsResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash-tts',
          contents: [
            {
              role: 'user',
              parts: parts,
            },
          ],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              multiSpeakerVoiceConfig: {
                speakerVoiceConfigs: [
                  {
                    speaker: 'Muhabir',
                    voiceConfig: {
                      prebuiltVoiceConfig: { voiceName: 'Puck' },
                    },
                  },
                  {
                    speaker: 'Tarihçi',
                    voiceConfig: {
                      prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                  },
                ],
              },
            },
          },
        });

        // Unary default returns complete WAV file as base64
        const generatedAudio = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (generatedAudio) {
          audioBase64 = generatedAudio;
        }
      }
    } catch (err: any) {
      console.warn('Gemini TTS audio synthesis fallback notice:', err?.message || err);
      ttsError = err?.message || 'TTS sentezlenemedi, tarayıcı seslendiricisi devrede.';
    }

    return NextResponse.json({
      title: podcastScript.title || 'Tarih Muhabiri Özel Yayını',
      summary: podcastScript.summary || 'Belgelerin ışığında 1 dakikalık tarih podcaste.',
      dialogue: dialogueList,
      audioBase64,
      mimeType: audioBase64 ? 'audio/wav' : null,
      ttsError,
    });
  } catch (error: any) {
    console.error('Podcast API error:', error);
    return NextResponse.json(
      { error: error?.message || 'Podcast oluşturulurken bir hata oluştu.' },
      { status: 500 }
    );
  }
}
