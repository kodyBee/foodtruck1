import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Crown Majestic Kitchen';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom, #000000, #1a1a1a)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui',
        }}
      >
        <div
          style={{
            fontSize: 80,
            fontWeight: 'bold',
            background: 'linear-gradient(to right, #fef08a, #facc15, #eab308)',
            backgroundClip: 'text',
            color: 'transparent',
            marginBottom: 20,
          }}
        >
          Crown Majestic Kitchen
        </div>
        <div
          style={{
            fontSize: 32,
            color: '#9ca3af',
            textAlign: 'center',
          }}
        >
          Royal Flavors on Wheels
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
