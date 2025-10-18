import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = request.headers.get('authorization');

    // Use a fallback URL if API_BASE_URL is not set
    const baseUrl = API_BASE_URL || 'https://irisnet.wiredleap.com';
    const url = `${baseUrl}/social/posts/${id}`;

    console.log('📊 POST DETAILS - Proxying request to:', url);
    console.log('🔑 Token present:', !!token);
    console.log('🆔 Post ID:', id);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': token }),
      },
    });

    console.log('📥 POST DETAILS - Response status:', response.status);

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
        error = { message: text || 'Failed to fetch post details', status: response.status };
      }
      console.error('❌ POST DETAILS - Error response:', error);
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    console.log('✅ POST DETAILS - Success:', {
      hasData: !!data.data,
      dataType: typeof data.data,
      success: data.success
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error('💥 POST DETAILS - API Proxy Error:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Failed to fetch post details', code: 'FETCH_ERROR' } },
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
