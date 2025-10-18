import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    message: "Posts API working", 
    timestamp: new Date().toISOString() 
  });
}

