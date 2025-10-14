import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://irisnet.wiredleap.com';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = request.headers.get('authorization');

    // Build query string from search params
    const queryString = searchParams.toString();
    const url = `${API_BASE_URL}/campaigns/search${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': token }),
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Proxy Error:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Failed to search campaigns', code: 'FETCH_ERROR' } },
      { status: 500 }
    );
  }
}

