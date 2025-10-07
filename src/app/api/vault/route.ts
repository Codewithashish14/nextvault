import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Handle POST requests (Create new vault item)
export async function POST(request: NextRequest) {
  console.log('=== VAULT POST ROUTE STARTED ===');
  
  try {
    const session = await getServerSession(authOptions as any);
    console.log('Session user ID:', session?.user?.id);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('Request body:', body);

    const { title, encryptedData, iv, salt } = body;

    if (!title || !encryptedData || !iv || !salt) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    
    const result = await db.collection('vaultitems').insertOne({
      title,
      encryptedData,
      iv,
      salt,
      userId: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log('Insert result:', result);

    return NextResponse.json({
      success: true,
      message: 'Item saved successfully',
      itemId: result.insertedId.toString()
    });

  } catch (error) {
    console.error('Vault POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle GET requests (Get all vault items)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions as any);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDatabase();
    const items = await db.collection('vaultitems')
      .find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ 
      items: items.map(item => ({
        ...item,
        _id: item._id.toString()
      }))
    });

  } catch (error) {
    console.error('Vault GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}