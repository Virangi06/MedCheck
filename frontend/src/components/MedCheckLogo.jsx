function MedCheckLogo({ size = 'md', showText = true, showSubtitle = true }) {
  const sizes = {
    sm: 40,
    md: 56,
    lg: 80,
    xl: 100,
  };
  const px = sizes[size] || 56;

  const logoComponent = (
    <svg width={px} height={px} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Blue circle background */}
      <circle cx="28" cy="28" r="28" fill="#0EA5E9" />
      {/* White cross (vertical) */}
      <rect x="24.5" y="12" width="7" height="32" rx="3.5" fill="white" />
      {/* White cross (horizontal) */}
      <rect x="12" y="24.5" width="32" height="7" rx="3.5" fill="white" />
    </svg>
  );

  if (!showText) {
    return logoComponent;
  }

  const fontSizeMap = {
    sm: { main: 16, sub: 11 },
    md: { main: 22, sub: 13 },
    lg: { main: 28, sub: 15 },
    xl: { main: 36, sub: 18 },
  };

  const fontSize = fontSizeMap[size] || fontSizeMap.md;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: px / 2.5 }}>
      {logoComponent}
      <div>
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700,
            fontSize: fontSize.main,
            color: '#0EA5E9',
            letterSpacing: '-0.5px',
            lineHeight: 1.2,
          }}
        >
          Med<span style={{ color: '#475569' }}>Check</span>
        </div>
        {showSubtitle && (
          <div
            style={{
              fontSize: fontSize.sub,
              color: '#94a3b8',
              fontWeight: 500,
              letterSpacing: '0.02em',
              marginTop: 2,
            }}
          >
            Medical Symptom Checker
          </div>
        )}
      </div>
    </div>
  );
}

export default MedCheckLogo;
