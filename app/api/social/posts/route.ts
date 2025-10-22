import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization');
    const { searchParams } = new URL(request.url);
    
    // Extract query parameters
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '20';
    const platform = searchParams.get('platform');
    const sentiment = searchParams.get('sentiment');
    const isViral = searchParams.get('isViral');
    const isTrending = searchParams.get('isTrending');

    // Use a fallback URL if API_BASE_URL is not set
    const baseUrl = API_BASE_URL || 'https://irisnet.wiredleap.com';
    const url = `${baseUrl}/social/posts`;

    // Build query string
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...(platform && { platform }),
      ...(sentiment && { sentiment }),
      ...(isViral && { isViral }),
      ...(isTrending && { isTrending }),
    });

    const fullUrl = `${url}?${queryParams.toString()}`;

    console.log('📊 POSTS LIST - Proxying request to:', fullUrl);
    console.log('🔑 Token present:', !!token);

    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': token }),
      },
    });

    console.log('📥 POSTS LIST - Response status:', response.status);

    if (!response.ok) {
      let error;
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        try {
          error = await response.json();
        } catch {
          error = { message: 'Unknown error occurred' };
        }
      } else {
        const text = await response.text();
        error = { message: text || 'Failed to fetch posts', status: response.status };
      }
      console.error('❌ POSTS LIST - Error response:', error);
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    console.log('✅ POSTS LIST - Success:', {
      hasData: !!data.data,
      dataLength: Array.isArray(data.data) ? data.data.length : 'not array',
      success: data.success
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error('💥 POSTS LIST - API Proxy Error:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Failed to fetch posts', code: 'FETCH_ERROR' } },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS(request: NextRequest) {
  return NextResponse.json(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
