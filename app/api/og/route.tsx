import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FAFAFA',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
        }}
      >
        {/* Subtle background pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.02,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23010101' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Main content container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            maxWidth: 1000,
            padding: '0 60px',
          }}
        >
          {/* Logo/Icon */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 100,
              height: 100,
              backgroundColor: '#FF4A15',
              borderRadius: 20,
              marginBottom: 40,
              boxShadow: '0 10px 25px rgba(255, 74, 21, 0.25)',
            }}
          >
            <svg
              width="50"
              height="50"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 18L22 12L16 6M8 6L2 12L8 18"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Brand name */}
          <div
            style={{
              fontSize: 80,
              fontWeight: 800,
              color: '#010101',
              marginBottom: 20,
              letterSpacing: '-2px',
            }}
          >
            MKWeb
          </div>

          {/* Main tagline */}
          <div
            style={{
              fontSize: 36,
              color: '#FF4A15',
              fontWeight: 600,
              marginBottom: 30,
              lineHeight: 1.2,
            }}
          >
            Développement Web & Applications
          </div>

          {/* Services */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 50,
              fontSize: 22,
              color: '#010101',
              fontWeight: 500,
              marginBottom: 40,
              opacity: 0.7,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  backgroundColor: '#FF4A15',
                  borderRadius: '50%',
                }}
              />
              Sites Web Modernes
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  backgroundColor: '#FF4A15',
                  borderRadius: '50%',
                }}
              />
              Applications Web
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  backgroundColor: '#FF4A15',
                  borderRadius: '50%',
                }}
              />
              Optimisation SEO
            </div>
          </div>

          {/* Tech stack indicators */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 30,
            }}
          >
            {/* React */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 50,
                height: 50,
                backgroundColor: '#010101',
                borderRadius: 12,
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#FF4A15">
                <circle cx="12" cy="12" r="2" />
                <path d="M12 1C15.5 1 18.5 2.5 20.5 5.5C18.5 8.5 15.5 10 12 10C8.5 10 5.5 8.5 3.5 5.5C5.5 2.5 8.5 1 12 1Z" />
                <path d="M12 14C15.5 14 18.5 15.5 20.5 18.5C18.5 21.5 15.5 23 12 23C8.5 23 5.5 21.5 3.5 18.5C5.5 15.5 8.5 14 12 14Z" />
              </svg>
            </div>

            {/* Next.js */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 50,
                height: 50,
                backgroundColor: '#010101',
                borderRadius: 12,
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  backgroundColor: '#FF4A15',
                  borderRadius: 4,
                }}
              />
            </div>

            {/* TypeScript */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 50,
                height: 50,
                backgroundColor: '#010101',
                borderRadius: 12,
                color: '#FF4A15',
                fontSize: 18,
                fontWeight: 700,
              }}
            >
              TS
            </div>
          </div>
        </div>

        {/* Website URL */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            fontSize: 20,
            color: '#010101',
            fontWeight: 500,
            opacity: 0.6,
          }}
        >
          mk-web.fr
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
