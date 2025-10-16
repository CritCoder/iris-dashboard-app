import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = request.headers.get('authorization');

    // Build query string from search params
    const queryString = searchParams.toString();
    const url = `${API_BASE_URL}/campaigns${queryString ? `?${queryString}` : ''}`;

    console.log('Proxying request to:', url);
    console.log('Token present:', !!token);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': token }),
      },
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

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
        error = { message: text || 'Request failed', status: response.status };
      }
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Proxy Error:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Failed to fetch campaigns', code: 'FETCH_ERROR' } },
      { status: 500 }
    );
  }
}

