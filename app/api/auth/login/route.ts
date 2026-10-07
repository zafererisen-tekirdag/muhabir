import { NextRequest, NextResponse } from 'next/server';
import { getDbPool, ensureDbSchema } from '@/lib/db';
import { verifyPassword, signSessionToken, setSessionCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Lütfen e-posta ve şifrenizi giriniz.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Ensure database table exists
    await ensureDbSchema();
    const db = getDbPool();

    // Find user
    const result = await db.query(
      'SELECT id, name, email, password_hash FROM users WHERE email = $1 LIMIT 1',
      [normalizedEmail]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Geçersiz e-posta veya şifre.' },
        { status: 401 }
      );
    }

    const user = result.rows[0];

    // Verify password
    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Geçersiz e-posta veya şifre.' },
        { status: 401 }
      );
    }

    // Sign session token and set cookie
    const token = await signSessionToken({
      id: user.id,
      name: user.name,
      email: user.email,
    });

    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      message: 'Giriş başarılı.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error?.message || 'Giriş yapılırken bir hata oluştu.' },
      { status: 500 }
    );
  }
}
