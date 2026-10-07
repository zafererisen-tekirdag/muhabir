import { NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/auth';

export async function POST() {
  try {
    await clearSessionCookie();
    return NextResponse.json({ success: true, message: 'Çıkış yapıldı.' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Çıkış yapılırken bir hata oluştu.' },
      { status: 500 }
    );
  }
}
