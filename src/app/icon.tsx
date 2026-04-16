import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
 
export const size = {
  width: 32,
  height: 32,
}
 
export const contentType = 'image/png'
 
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: 'transparent',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Crown shape */}
          <path
            d="M4 12L8 20L16 16L24 20L28 12L26 22H6L4 12Z"
            fill="#EAB308"
            stroke="#000000"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Crown jewels/decorations */}
          <circle cx="8" cy="12" r="2" fill="#EAB308" stroke="#000000" strokeWidth="1"/>
          <circle cx="16" cy="10" r="2" fill="#EAB308" stroke="#000000" strokeWidth="1"/>
          <circle cx="24" cy="12" r="2" fill="#EAB308" stroke="#000000" strokeWidth="1"/>
          {/* Crown base */}
          <rect x="6" y="22" width="20" height="4" fill="#EAB308" stroke="#000000" strokeWidth="1.5"/>
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
