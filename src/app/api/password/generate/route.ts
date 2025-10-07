import { NextRequest, NextResponse } from 'next/server';
import { generatePassword, PasswordOptions } from '@/utils/passwordGenerator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const options: PasswordOptions = body;

    const password = generatePassword(options);

    return NextResponse.json({ password });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate password' },
      { status: 500 }
    );
  }
}