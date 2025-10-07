import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log('=== DELETE ROUTE STARTED ===');
  
  try {
    // Get session with type assertion
    const session = await getServerSession(authOptions) as any;
    console.log('Session user ID:', session?.user?.id);

    if (!session?.user?.id) {
      console.log('No session - returning 401');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the ID from params
    const { id } = await params;
    console.log('Deleting item with ID:', id);

    // Validate ID
    if (!id || !ObjectId.isValid(id)) {
      console.log('Invalid ID format');
      return NextResponse.json({ error: 'Invalid item ID' }, { status: 400 });
    }

    // Connect to database
    console.log('Connecting to database...');
    const db = await getDatabase();
    console.log('Database connected');

    // First, check if item exists without user filter
    const itemExists = await db.collection('vaultitems').findOne({
      _id: new ObjectId(id)
    });

    console.log('Item exists check:', !!itemExists);
    
    if (!itemExists) {
      console.log('Item not found in database at all');
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    console.log('Item belongs to userId:', itemExists.userId);
    console.log('Session userId:', session.user.id);

    // Try to delete with user filter
    const deleteResult = await db.collection('vaultitems').deleteOne({
      _id: new ObjectId(id),
      userId: session.user.id
    });

    console.log('Delete result:', deleteResult);

    if (deleteResult.deletedCount === 0) {
      console.log('Delete failed - userId mismatch or other issue');
      
      // Check if it's a userId mismatch
      if (itemExists.userId !== session.user.id) {
        console.log('UserId mismatch - item belongs to different user');
        return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
      }
      
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    console.log('=== DELETE SUCCESSFUL ===');
    return NextResponse.json({ 
      success: true,
      message: 'Item deleted successfully' 
    });

  } catch (error) {
    console.error('DELETE route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}