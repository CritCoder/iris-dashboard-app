import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const token = request.headers.get('authorization');

    const url = `${API_BASE_URL}/social/profiles/${id}/aianalysis`;

    console.log('Profile AI Analysis - Proxying request to:', url);
    console.log('Token present:', !!token);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': token }),
      },
    });

    console.log('Profile AI Analysis - Response status:', response.status);

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
        error = { message: text || 'Failed to fetch AI analysis', status: response.status };
      }
      console.error('Profile AI Analysis - Error response:', error);
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    console.log('Profile AI Analysis - Success');
    return NextResponse.json(data);
  } catch (error) {
    console.error('Profile AI Analysis - API Proxy Error:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Failed to fetch AI analysis', code: 'FETCH_ERROR' } },
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

