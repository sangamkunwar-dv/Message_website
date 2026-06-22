import { put } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const file = await request.arrayBuffer()
    const contentType = request.headers.get('content-type') || 'application/octet-stream'
    
    // Generate unique filename
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    
    const blob = await put(filename, file, {
      contentType,
      access: 'public',
    })

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    )
  }
}
