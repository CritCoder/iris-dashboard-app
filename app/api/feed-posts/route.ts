import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization');
    const { searchParams } = new URL(request.url);
    
    // Extract query parameters
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '20';

    // Use a fallback URL if API_BASE_URL is not set
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://irisnet.wiredleap.com';
    const url = `${baseUrl}/social/posts`;

    // Build query string
    const queryParams = new URLSearchParams({
      page,
      limit,
    });

    const fullUrl = `${url}?${queryParams.toString()}`;

    console.log('📊 FEED POSTS - Proxying request to:', fullUrl);
    console.log('🔑 Token present:', !!token);

    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': token }),
      },
    });

    console.log('📥 FEED POSTS - Response status:', response.status);

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
      console.error('❌ FEED POSTS - Error response:', error);
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    console.log('✅ FEED POSTS - Success:', {
      hasData: !!data.data,
      dataLength: Array.isArray(data.data) ? data.data.length : 'not array',
      success: data.success
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error('💥 FEED POSTS - API Proxy Error:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Failed to fetch posts', code: 'FETCH_ERROR' } },
      { status: 500 }
    );
  }
}

