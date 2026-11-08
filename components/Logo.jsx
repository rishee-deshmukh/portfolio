// "RD" monogram: the two initials drawn as geometric shapes inside an arch,
// the same shape as the portrait frame. Fixed brand colors (caramel arch,
// sangria letters) so it reads the same in both themes. Keep in sync with
// app/icon.svg (the favicon).
export default function Logo() {
  return (
    <svg viewBox="0 0 60 68" role="img" aria-label="RD">
      <path fill="#B28558" d="M0 68V30a30 30 0 0 1 60 0v38z" />
      <g fill="none" stroke="#2C0E11" strokeWidth="4.5" strokeLinejoin="miter" strokeMiterlimit="4">
        <path d="M10.25 56.25V26H20a8 8 0 0 1 0 16h-9.75" />
        <path d="M35.25 54V26H40a10.5 14 0 0 1 0 28z" />
      </g>
      <path fill="#2C0E11" d="M15.7 40h5.22l9.65 16.25h-5.22z" />
    </svg>
  )
}
