import type {Metadata} from 'next';
import './globals.css'; // Global styles
import { AuthProvider } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/AuthModal';

export const metadata: Metadata = {
  title: 'Tarih Muhabiri - Tarih Dersi İçin Belgeye Dayalı Röportaj ve Gazete',
  description: 'Tarih dersleri için birincil belgelere dayalı yapay zekâ röportajı, 1919 dönemi gazete sayfası ve iki sesli Türkçe podcast stüdyosu.',
  openGraph: {
    title: 'Tarih Muhabiri - Tarih Dersi İçin Belgeye Dayalı Röportaj ve Gazete',
    description: 'Tarih dersleri için birincil belgelere dayalı yapay zekâ röportajı, 1919 dönemi gazete sayfası ve iki sesli Türkçe podcast stüdyosu.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tarih Muhabiri - Tarih Dersi İçin Belgeye Dayalı Röportaj ve Gazete',
    description: 'Tarih dersleri için birincil belgelere dayalı yapay zekâ röportajı, 1919 dönemi gazete sayfası ve iki sesli Türkçe podcast stüdyosu.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="tr">
      <body suppressHydrationWarning className="min-h-screen bg-stone-100 text-stone-900 antialiased selection:bg-amber-200 selection:text-amber-950 font-sans">
        <AuthProvider>
          {children}
          <AuthModal />
        </AuthProvider>
      </body>
    </html>
  );
}
