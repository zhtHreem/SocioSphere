import React, { useId } from 'react';

// The SocioSphere mark: a sphere with an S cut through it by negative space.
// Two halves, one seam that is also the initial. Keep this in sync with public/logo.svg.
// mono: a single flat colour (currentColor), for one-colour contexts.
const LogoMark = ({ size = 36, mono = false, title = 'SocioSphere' }) => {
  const uid = useId().replace(/:/g, '');
  const seam = 'M50 0C12 16 16 44 50 50S88 84 50 100';
  const left = `${seam}H0V0Z`;
  const right = `${seam}H100V0Z`;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={title} style={{ display: 'block', flexShrink: 0 }}>
      {!mono && (
        <defs>
          <linearGradient id={`a${uid}`} x1="10" y1="4" x2="50" y2="96" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#2f5cff" />
            <stop offset="1" stopColor="#5c8dff" />
          </linearGradient>
          <linearGradient id={`b${uid}`} x1="50" y1="4" x2="92" y2="96" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#ff9aa2" />
            <stop offset="1" stopColor="#ff4d5e" />
          </linearGradient>
        </defs>
      )}
      <defs>
        <clipPath id={`c${uid}`}><circle cx="50" cy="50" r="47" /></clipPath>
        <mask id={`m${uid}`} maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
          <rect width="100" height="100" fill="#fff" />
          <path d={seam} fill="none" stroke="#000" strokeWidth="7.5" />
        </mask>
      </defs>
      <g clipPath={`url(#c${uid})`} mask={`url(#m${uid})`}>
        <path d={left} fill={mono ? 'currentColor' : `url(#a${uid})`} />
        <path d={right} fill={mono ? 'currentColor' : `url(#b${uid})`} />
      </g>
    </svg>
  );
};

export default LogoMark;
