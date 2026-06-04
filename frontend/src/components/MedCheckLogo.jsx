import LogoTransparent from '../assets/Logo_transparent.png';
import LogoWhite from '../assets/Logo_white.png';

function MedCheckLogo({ size = 'md', showSubtitle = false, darkTheme = false }) {
  const sizes = {
    xs: 90,
    sm: 120,
    md: 130,
    lg: 180,
  };
  const px = sizes[size] || 110;

  // Select the appropriate transparent PNG logo based on darkTheme prop
  const logoSrc = darkTheme ? LogoWhite : LogoTransparent;

  return (
    <img
      src={logoSrc}
      alt="MedCheck Logo"
      style={{
        height: px,
        width: 'auto',
        objectFit: 'contain',
        display: 'block',
      }}
    />
  );
}

export default MedCheckLogo;

