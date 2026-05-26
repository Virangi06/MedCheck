function MedCheckLogo({ size = 'md', showText = true, showSubtitle = true }) {
  const sizes = {
    sm: 32,
    md: 44,
    lg: 64,
    xl: 80,
  };
  const px = sizes[size] || 44;

  const logoComponent = (
    <svg width={px} height={px} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* White background */}
      <rect width="44" height="44" rx="12" fill="white" />
      {/* Blue background for the icon area */}
      <rect width="44" height="44" rx="12" fill="#0EA5E9" />
      {/* White cross (vertical) */}
      <rect x="19" y="10" width="6" height="24" rx="3" fill="white" />
      {/* White cross (horizontal) */}
      <rect x="10" y="19" width="24" height="6" rx="3" fill="white" />
    </svg>
  );

  if (!showText) {
    return logoComponent;
  }

  const fontSizeMap = {
    sm: { main: 14, sub: 10 },
    md: { main: 18, sub: 12 },
    lg: { main: 24, sub: 14 },
    xl: { main: 32, sub: 16 },
  };

  const fontSize = fontSizeMap[size] || fontSizeMap.md;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: px / 3 }}>
      {logoComponent}
      <div>
        <div
          style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 800,
            fontSize: fontSize.main,
            color: '#0f172a',
            letterSpacing: '-0.3px',
            lineHeight: 1,
          }}
        >
          MedCheck
        </div>
        {showSubtitle && (
          <div
            style={{
              fontSize: fontSize.sub,
              color: '#0EA5E9',
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
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
