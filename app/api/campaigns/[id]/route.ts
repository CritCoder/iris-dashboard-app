import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://irisnet.wiredleap.com';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader || `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWZncnUyN3YwMDZuejJ4dXM2c3FoNmE5Iiwib3JnYW5pemF0aW9uSWQiOiJjbWRpcmpxcjIwMDAwejI4cG8yZW9uMHlmIiwiaWF0IjoxNzYwNjk1NjE1LCJleHAiOjE3NjA3ODIwMTV9.DZLu5MV2y-yGcyS-pDoNT1IIsZZPnRH1mdVdlQAoy5s`;
    
    const url = `${API_BASE_URL}/campaigns/${params.id}`;

    console.log('📊 CAMPAIGN GET - Proxying request to:', url);
    console.log('🔑 Token present:', !!token);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
    });

    console.log('📥 CAMPAIGN GET - Response status:', response.status);

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
        error = { message: text || 'Failed to fetch campaign', status: response.status };
      }
      console.error('❌ CAMPAIGN GET - Error response:', error);
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    console.log('✅ CAMPAIGN GET - Success:', {
      hasData: !!data.data,
      success: data.success
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('💥 CAMPAIGN GET - API Proxy Error:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Failed to fetch campaign', code: 'FETCH_ERROR' } },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization');
    const url = `${API_BASE_URL}/campaigns/${params.id}`;

    const response = await fetch(url, {
      method: 'DELETE',
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
      { success: false, error: { message: 'Failed to delete campaign', code: 'FETCH_ERROR' } },
      { status: 500 }
    );
  }
}

