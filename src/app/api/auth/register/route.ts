import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { getDatabase } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    console.log('=== REGISTER API CALLED ===');
    
    const { name, email, password } = await request.json();
    console.log('Received data:', { name, email, password: '*' });

    if (!name || !email || !password) {
      console.log('Missing required fields');
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    console.log('Attempting to connect to MongoDB...');
    const db = await getDatabase();
    console.log('MongoDB connected successfully');

    // Check if user already exists
    console.log('Checking for existing user:', email);
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      console.log('User already exists');
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      );
    }

    // Hash password
    console.log('Hashing password...');
    const hashedPassword = await hash(password, 12);

    // Create user
    console.log('Creating user...');
    const result = await db.collection('users').insertOne({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    console.log('User created successfully:', result.insertedId);
    return NextResponse.json(
      { message: 'User created successfully', userId: result.insertedId },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('=== REGISTRATION ERROR ===');
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    } else {
      console.error('Error:', error);
    }
    console.error('=== END ERROR ===');
    
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}