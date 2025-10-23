import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization');
    const body = await request.json();

    // Use a fallback URL if API_BASE_URL is not set
    const baseUrl = API_BASE_URL || 'https://irisnet.wiredleap.com';
    const url = `${baseUrl}/api/osint/breached-data-search`;

    console.log('🔍 BREACHED DATA SEARCH - Proxying request to:', url);
    console.log('🔑 Token present:', !!token);
    console.log('📄 Request body:', body);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': token }),
      },
      body: JSON.stringify(body),
    });

    console.log('📥 BREACHED DATA SEARCH - Response status:', response.status);

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
        error = { message: text || 'Failed to search breached data', status: response.status };
      }
      console.error('❌ BREACHED DATA SEARCH - Error response:', error);
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    console.log('✅ BREACHED DATA SEARCH - Success:', {
      hasData: !!data.data,
      success: data.success
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error('💥 BREACHED DATA SEARCH - API Proxy Error:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Failed to search breached data', code: 'FETCH_ERROR' } },
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