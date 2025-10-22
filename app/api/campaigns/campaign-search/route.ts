import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization');
    const body = await request.json();

    console.log('Campaign Search - Proxying request to:', `${API_BASE_URL}/campaigns/campaign-search`);
    console.log('Token present:', !!token);
    console.log('Request body:', JSON.stringify(body, null, 2));

    const response = await fetch(`${API_BASE_URL}/campaigns/campaign-search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': token }),
      },
      body: JSON.stringify(body),
    });

    console.log('Campaign Search - Response status:', response.status);

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
        error = { message: text || 'Campaign search failed', status: response.status };
      }
      console.error('Campaign Search - Error response:', error);
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    console.log('Campaign Search - Success:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Campaign Search - API Proxy Error:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Failed to create campaign search', code: 'FETCH_ERROR' } },
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

