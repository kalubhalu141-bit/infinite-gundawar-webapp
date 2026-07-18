import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 55%, #2c5282 100%)',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 34,
            fontWeight: 700,
            color: '#d4a843',
            marginBottom: 24,
            letterSpacing: 1,
          }}
        >
          ♾ INFINITE GUNDAWAR
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 60,
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: 28,
            maxWidth: 980,
          }}
        >
          Building Tomorrow&apos;s Infrastructure, Trading Today
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 28,
            color: 'rgba(255,255,255,0.75)',
            maxWidth: 920,
            lineHeight: 1.4,
          }}
        >
          Infrastructure · Import/Export · Education · Digital Marketing · Free On-Device AI
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 40,
            fontSize: 24,
            color: 'rgba(212,168,67,0.95)',
            fontWeight: 600,
          }}
        >
          Maharashtra, India · Infinite Gundawar Business Private Limited
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
