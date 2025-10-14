import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://irisnet.wiredleap.com';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization');
    const body = await request.json();
    const url = `${API_BASE_URL}/campaigns/${params.id}/monitor`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': token }),
      },
      body: JSON.stringify(body),
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
      { success: false, error: { message: 'Failed to start monitoring', code: 'FETCH_ERROR' } },
      { status: 500 }
    );
  }
}

