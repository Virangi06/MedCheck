function MedCheckLogo({ size = 'md', showSubtitle = false }) {
  const sizes = {
    xs: 32,
    sm: 40,
    md: 56,
    lg: 80,
  };
  const px = sizes[size] || 56;

  const fontSizeMap = {
    xs: { main: 14, sub: 10 },
    sm: { main: 18, sub: 11 },
    md: { main: 24, sub: 12 },
    lg: { main: 32, sub: 15 },
  };

  const fontSize = fontSizeMap[size] || fontSizeMap.md;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: px / 2 }}>
      {/* Blue circle with white cross */}
      <svg width={px} height={px} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="28" cy="28" r="28" fill="#0EA5E9" />
        <rect x="24.5" y="12" width="7" height="32" rx="3.5" fill="white" />
        <rect x="12" y="24.5" width="32" height="7" rx="3.5" fill="white" />
      </svg>

      {/* Text */}
      <div>
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700,
            fontSize: fontSize.main,
            lineHeight: 1.2,
            letterSpacing: '-0.3px',
          }}
        >
          <span style={{ color: '#0EA5E9' }}>Med</span>
          <span style={{ color: '#0f172a' }}>Check</span>
        </div>
        {showSubtitle && (
          <div
            style={{
              fontSize: fontSize.sub,
              color: '#94a3b8',
              fontWeight: 500,
              lineHeight: 1,
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
