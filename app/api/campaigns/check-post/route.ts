import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = request.headers.get('authorization');

    // Build query string from search params
    const queryString = searchParams.toString();
    const url = `${API_BASE_URL}/campaigns/check-post${queryString ? `?${queryString}` : ''}`;

    console.log('Check Post Campaign - Proxying request to:', url);
    console.log('Token present:', !!token);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': token }),
      },
    });

    console.log('Check Post Campaign - Response status:', response.status);

    if (!response.ok) {
      // Try to parse JSON error, fallback to text if not JSON
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
        error = { message: text || 'Check post campaign failed', status: response.status };
      }
      console.error('Check Post Campaign - Error response:', error);
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    console.log('Check Post Campaign - Success:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Check Post Campaign - API Proxy Error:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Failed to check post campaign', code: 'FETCH_ERROR' } },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

