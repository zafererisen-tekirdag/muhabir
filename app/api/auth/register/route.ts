import { NextRequest, NextResponse } from 'next/server';
import { getDbPool, ensureDbSchema } from '@/lib/db';
import { hashPassword, signSessionToken, setSessionCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Ad Soyad en az 2 karakter olmalıdır.' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Geçerli bir e-posta adresi giriniz.' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { error: 'Şifre en az 6 karakter olmalıdır.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Ensure database table exists
    await ensureDbSchema();
    const db = getDbPool();

    // Check if user already exists
    const existing = await db.query(
      'SELECT id FROM users WHERE email = $1 LIMIT 1',
      [normalizedEmail]
    );

    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: 'Bu e-posta adresi ile kayıtlı bir hesap zaten var.' },
        { status: 409 }
      );
    }

    // Hash password and insert
    const passwordHash = await hashPassword(password);
    const insertResult = await db.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name.trim(), normalizedEmail, passwordHash]
    );

    const user = insertResult.rows[0];

    // Create session token and set cookie
    const token = await signSessionToken({
      id: user.id,
      name: user.name,
      email: user.email,
    });

    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      message: 'Kayıt başarılı.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: error?.message || 'Kayıt işlemi sırasında bir hata oluştu.' },
      { status: 500 }
    );
  }
}
