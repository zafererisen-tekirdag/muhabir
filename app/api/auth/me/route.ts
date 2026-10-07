import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    return NextResponse.json({ user: session });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Oturum bilgisi alınamadı.', user: null },
      { status: 500 }
    );
  }
}
