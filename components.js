// Simple icon component using Lucide SVG paths
// For a full implementation, you'd load lucide-react, but for simplicity we'll use Unicode/Emoji fallbacks
const Icon = ({ name, size = 24, className = '' }) => {
  const iconMap = {
    'arrow-right': '→',
    'sparkles': '✨',
    'book-open': '📖',
    'plus': '+',
    'x': '×',
    'fingerprint': '👆',
    'loader-2': '⟳',
    'anchor': '⚓',
    'message-circle': '💬',
    'lightbulb': '💡',
    'globe': '🌐',
    'eye-off': '👁️'
  };
  
  return (
    <span className={`icon-svg ${className}`} style={{ fontSize: size, width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      {iconMap[name] || '•'}
    </span>
  );
};

