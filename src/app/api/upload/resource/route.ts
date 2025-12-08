import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { prismaClient } from '@/lib/prismaClient';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const webinarId = formData.get('webinarId') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string | null;

    if (!file || !webinarId || !title) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate file size (100MB max for resources)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 100MB.' },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'resources');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}-${safeFileName}`;
    const filepath = join(uploadsDir, filename);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Save to database
    const publicUrl = `/uploads/resources/${filename}`;
    
    const resource = await prismaClient.webinarResource.create({
      data: {
        webinarId,
        title,
        description,
        fileUrl: publicUrl,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      },
    });

    return NextResponse.json({
      success: true,
      resource,
    });
  } catch (error: any) {
    console.error('Error uploading resource:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload resource' },
      { status: 500 }
    );
  }
}

// Get resources for a webinar
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const webinarId = searchParams.get('webinarId');

    if (!webinarId) {
      return NextResponse.json(
        { error: 'Webinar ID is required' },
        { status: 400 }
      );
    }

    const resources = await prismaClient.webinarResource.findMany({
      where: { webinarId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ resources });
  } catch (error: any) {
    console.error('Error fetching resources:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch resources' },
      { status: 500 }
    );
  }
}

// Delete a resource
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const resourceId = searchParams.get('resourceId');

    if (!resourceId) {
      return NextResponse.json(
        { error: 'Resource ID is required' },
        { status: 400 }
      );
    }

    await prismaClient.webinarResource.delete({
      where: { id: resourceId },
    });

    return NextResponse.json({
      success: true,
      message: 'Resource deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting resource:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete resource' },
      { status: 500 }
    );
  }
}
