const VALID_STYLES = new Set(['casual', 'business', 'creative']);
const VALID_HAIR = new Set(['short', 'long', 'curly', 'bald']);
const HEX_COLOR_REGEX = /^#[0-9a-fA-F]{6}$/;

export function sanitizePlayerInfo(info = {}) {
  const name = typeof info.name === 'string' && info.name.trim() 
    ? info.name.trim().slice(0, 24) 
    : 'Anonymous';
    
  const color = typeof info.color === 'string' && HEX_COLOR_REGEX.test(info.color)
    ? info.color
    : '#3182ce';
    
  const style = typeof info.style === 'string' && VALID_STYLES.has(info.style)
    ? info.style
    : 'casual';
    
  const hair = typeof info.hair === 'string' && VALID_HAIR.has(info.hair)
    ? info.hair
    : 'short';

  return { name, color, style, hair };
}

export function isValidCoordinate(val) {
  return typeof val === 'number' && Number.isFinite(val);
}
