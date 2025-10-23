import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Fallback token for development/testing
const FALLBACK_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWZncnUyN3YwMDZuejJ4dXM2c3FoNmE5Iiwib3JnYW5pemF0aW9uSWQiOiJjbWRpcmpxcjIwMDAwejI4cG8yZW9uMHlmIiwiaWF0IjoxNzYwNjk1NjE1LCJleHAiOjE3NjA3ODIwMTV9.DZLu5MV2y-yGcyS-pDoNT1IIsZZPnRH1mdVdlQAoy5s';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const authHeader = request.headers.get('authorization');

    // Use authorization header if present, otherwise use fallback token
    const token = authHeader || `Bearer ${FALLBACK_TOKEN}`;

    // Use a fallback URL if API_BASE_URL is not set
    const baseUrl = API_BASE_URL || 'https://irisnet.wiredleap.com';

    // Build query string from search params
    const queryString = searchParams.toString();
    const url = `${baseUrl}/api/campaigns${queryString ? `?${queryString}` : ''}`;

    console.log('📊 CAMPAIGNS - Proxying request to:', url);
    console.log('🔑 Token present:', !!token);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
    });

    console.log('📥 CAMPAIGNS - Response status:', response.status);

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
        error = { message: text || 'Failed to fetch campaigns', status: response.status };
      }
      console.error('❌ CAMPAIGNS - Error response:', error);
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    console.log('✅ CAMPAIGNS - Success:', {
      hasData: !!data.data,
      dataLength: Array.isArray(data.data) ? data.data.length : 'not array',
      success: data.success
    });

    // Return with no-cache headers for instant loading
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
      }
    });
  } catch (error) {
    console.error('💥 CAMPAIGNS - API Proxy Error:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Failed to fetch campaigns', code: 'FETCH_ERROR' } },
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

