import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://irisnet.wiredleap.com';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader || `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWZncnUyN3YwMDZuejJ4dXM2c3FoNmE5Iiwib3JnYW5pemF0aW9uSWQiOiJjbWRpcmpxcjIwMDAwejI4cG8yZW9uMHlmIiwiaWF0IjoxNzYwNjk1NjE1LCJleHAiOjE3NjA3ODIwMTV9.DZLu5MV2y-yGcyS-pDoNT1IIsZZPnRH1mdVdlQAoy5s`;
    
    const url = `${API_BASE_URL}/campaigns/${params.id}/original-post`;

    console.log('📊 ORIGINAL POST - Proxying request to:', url);
    console.log('🔑 Token present:', !!token);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
    });

    console.log('📥 ORIGINAL POST - Response status:', response.status);

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
        error = { message: text || 'Failed to fetch original post', status: response.status };
      }
      console.error('❌ ORIGINAL POST - Error response:', error);
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    console.log('✅ ORIGINAL POST - Success:', {
      hasData: !!data.data,
      success: data.success
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('💥 ORIGINAL POST - API Proxy Error:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Failed to fetch original post', code: 'FETCH_ERROR' } },
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
