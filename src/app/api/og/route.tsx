import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Dynamic params
    const hasTitle = searchParams.has('title');
    const title = hasTitle
      ? searchParams.get('title')?.slice(0, 100)
      : 'Rasyid Firdaus Harmaini';
    
    const subtitle = searchParams.get('subtitle') || 'Multidisciplinary Engineer';

    return new ImageResponse(
      (
        <div
          style={{
            backgroundImage: 'linear-gradient(to bottom right, #000000, #1a1a1a)',
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: '80px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '40px',
              padding: '10px 20px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '9999px',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            <span style={{ color: '#fff', fontSize: 32, fontWeight: 600 }}>
               RFH Portfolio
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
            }}
          >
            <h1
              style={{
                fontSize: 72,
                fontFamily: 'sans-serif',
                fontWeight: 900,
                letterSpacing: '-0.05em',
                lineHeight: 1.1,
                marginBottom: '20px',
                backgroundClip: 'text',
                color: 'transparent',
                backgroundImage: 'linear-gradient(135deg, #ffffff, #a3a3a3)',
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: 36,
                color: '#a3a3a3',
                fontFamily: 'sans-serif',
                maxWidth: '800px',
              }}
            >
              {subtitle}
            </p>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
