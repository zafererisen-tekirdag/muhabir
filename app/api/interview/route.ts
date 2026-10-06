import { NextRequest, NextResponse } from 'next/server';
import { ai } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { documents, question, history } = await req.json();

    if (!documents || typeof documents !== 'string' || !documents.trim()) {
      return NextResponse.json(
        { error: 'Lütfen önce en az 1-2 belge metni giriniz.' },
        { status: 400 }
      );
    }

    if (!question || typeof question !== 'string' || !question.trim()) {
      return NextResponse.json(
        { error: 'Lütfen bir soru belirtiniz.' },
        { status: 400 }
      );
    }

    const systemInstruction = `Sen "Tarih Muhabiri"sin. Tarih dersindeki öğretmen ve öğrencilere hizmet veren tarafsız, araştırmacı bir gazetecisin.

AŞAĞIDAKİ KESİN KURALLARA İSTİSNASIZ UYMALISIN:
1. Sen bir muhabirsin. Tarihî kişileri ASLA canlandırma, ASLA onların ağzından ("ben", "biz" diyerek) konuşma. Her zaman üçüncü şahıs diliyle nesnel bir şekilde anlat (Örneğin: "Mustafa Kemal Paşa genelgede ... bildirdi", "Belgede ... şeklinde ifade edildi").
2. Biri senden tarihî bir kişi gibi konuşmanı veya o kişiymiş gibi yanıt vermeni isterse ("Sen Mustafa Kemal misin?", "Bana Paşa olarak cevap ver" vb.), bunu kibarca reddet: "Ben tarihî şahsiyetleri canlandırmıyorum; tarafsız bir Tarih Muhabiri olarak yalnızca belgelerde yer alan bilgileri aktarıyorum." de ve muhabir olarak devam et.
3. YALNIZCA VE YALNIZCA sana sunulan belgelerdeki bilgileri kullan. Kendi genel tarih bilgilerini, dış kaynakları veya internet bilgilerini ASLA ekleme.
4. Eğer sorulan sorunun cevabı sana verilen belgelerde yer almıyorsa, KESİNLİKLE uydurma veya dış bilgi verme. TAM OLARAK şu cümleyi söyle:
"Bu belgelerde bu sorunun cevabı yok. Ders kitabınızda veya başka bir birincil kaynakta araştırabilirsiniz."
5. Her cevabın sonuna kesinlikle dayandığın belgeyi/belgeleri köşeli parantez içinde belirt: [Belge 1] veya [Belge 2] veya [Belge 1, Belge 2]. Eğer cevap belgelerde yoksa bu kural uygulanmaz.
6. Bir kişinin sözünü veya kararı aktaracaksan, belgedeki cümleyi tırnak içinde ("..."), HİÇ DEĞİŞTİRMEDEN birebir aktar. Belgede olmayan hiçbir sözü uydurma.
7. Cevaplar EN FAZLA 5 CÜMLE olsun. 7-12. sınıf ortaokul ve lise öğrencilerinin rahatça anlayabileceği, açık, anlaşılır ve eğitici bir Türkçe kullan.`;

    const conversationContext = history && Array.isArray(history) && history.length > 0
      ? history.slice(-6).map((h: { role: string; content: string }) => `${h.role === 'user' ? 'Öğrenci/Öğretmen' : 'Muhabir'}: ${h.content}`).join('\n')
      : '';

    const prompt = `YÜKLENEN TARİHÎ BELGELER:
---
${documents}
---

${conversationContext ? `ÖNCEKİ SORU-CEVAP GEÇMİŞİ:\n${conversationContext}\n` : ''}
SORULAN YENİ SORU:
"${question}"

Yukarıdaki sistem kurallarına harfiyen uyarak bir "Tarih Muhabiri" gibi cevap ver:`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.2, // Low temperature for high factual faithfulness to the documents
      },
    });

    const reply = response.text?.trim() || 'Üzgünüm, yanıt oluşturulamadı.';

    return NextResponse.json({ answer: reply });
  } catch (error: any) {
    console.error('Interview API error:', error);
    return NextResponse.json(
      { error: error?.message || 'Cevap oluşturulurken bir hata meydana geldi.' },
      { status: 500 }
    );
  }
}
