import { ImageResponse } from 'next/og'

export const alt = 'Rishee Deshmukh, software engineer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Social preview card in the Golden heritage palette (cream, sangria, caramel).
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#F2E8D9',
          color: '#2C0E11',
          padding: '72px 80px',
        }}
      >
        <div style={{ display: 'flex', fontSize: 26, letterSpacing: 4, color: '#7A5428', textTransform: 'uppercase' }}>
          Software engineer
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 148, lineHeight: 1, fontWeight: 700 }}>Rishee</div>
          <div style={{ display: 'flex', fontSize: 148, lineHeight: 1, fontWeight: 700 }}>Deshmukh</div>
          <div style={{ display: 'flex', width: 120, height: 6, background: '#B28558', marginTop: 36 }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 28, color: '#5E5247' }}>
          <span>Backend, security and AI systems</span>
          <span>risheedeshmukh.com</span>
        </div>
      </div>
    ),
    size
  )
}
