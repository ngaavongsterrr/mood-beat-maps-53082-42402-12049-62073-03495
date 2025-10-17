interface CustomEmojiProps {
  type: 'love' | 'happy' | 'content' | 'disappointed' | 'sad' | 'angry' | 'neutral' | 'curious';
  size?: number;
  className?: string;
}

const CustomEmoji = ({ type, size = 64, className = '' }: CustomEmojiProps) => {
  const getSvgPath = () => {
    switch (type) {
      case 'love': // 😍
        return (
          <>
            {/* Heart eyes */}
            <path d="M20 24 L15 28 L20 32 L25 28 Z" fill="currentColor" />
            <path d="M44 24 L39 28 L44 32 L49 28 Z" fill="currentColor" />
            {/* Smile */}
            <path d="M22 42 Q32 50 42 42" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </>
        );
      case 'happy': // 😄
        return (
          <>
            {/* Eyes */}
            <circle cx="22" cy="26" r="3" fill="currentColor" />
            <circle cx="42" cy="26" r="3" fill="currentColor" />
            {/* Big smile with teeth */}
            <path d="M20 38 Q32 48 44 38" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <rect x="30" y="42" width="4" height="3" fill="white" />
          </>
        );
      case 'content': // 😊
        return (
          <>
            {/* Closed happy eyes */}
            <path d="M18 26 Q22 22 26 26" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M38 26 Q42 22 46 26" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {/* Gentle smile */}
            <path d="M24 40 Q32 46 40 40" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {/* Blush */}
            <circle cx="14" cy="34" r="4" fill="#FF9999" opacity="0.4" />
            <circle cx="50" cy="34" r="4" fill="#FF9999" opacity="0.4" />
          </>
        );
      case 'disappointed': // ☹️
        return (
          <>
            {/* Eyes */}
            <circle cx="22" cy="26" r="3" fill="currentColor" />
            <circle cx="42" cy="26" r="3" fill="currentColor" />
            {/* Frown */}
            <path d="M22 44 Q32 38 42 44" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </>
        );
      case 'sad': // 😢
        return (
          <>
            {/* Eyes */}
            <circle cx="22" cy="26" r="3" fill="currentColor" />
            <circle cx="42" cy="26" r="3" fill="currentColor" />
            {/* Frown */}
            <path d="M22 44 Q32 38 42 44" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {/* Tear */}
            <path d="M44 32 Q44 38 42 40" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
            <circle cx="42" cy="42" r="2" fill="currentColor" opacity="0.6" />
          </>
        );
      case 'angry': // 😡
        return (
          <>
            {/* Angry eyebrows */}
            <path d="M16 22 L26 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M48 22 L38 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            {/* Eyes */}
            <circle cx="22" cy="28" r="3" fill="currentColor" />
            <circle cx="42" cy="28" r="3" fill="currentColor" />
            {/* Frown */}
            <path d="M22 44 Q32 38 42 44" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </>
        );
      case 'neutral': // 😐
        return (
          <>
            {/* Eyes */}
            <circle cx="22" cy="26" r="3" fill="currentColor" />
            <circle cx="42" cy="26" r="3" fill="currentColor" />
            {/* Straight line mouth */}
            <line x1="24" y1="42" x2="40" y2="42" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </>
        );
      case 'curious': // 🧐
        return (
          <>
            {/* Monocle */}
            <circle cx="42" cy="26" r="8" stroke="currentColor" strokeWidth="2.5" fill="none" />
            {/* Eye in monocle */}
            <circle cx="42" cy="26" r="3" fill="currentColor" />
            {/* Other eye */}
            <circle cx="22" cy="26" r="3" fill="currentColor" />
            {/* Slight smile */}
            <path d="M26 40 Q32 44 38 40" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      style={{ color: '#2C2C2C' }}
    >
      {/* Face circle */}
      <circle cx="32" cy="32" r="30" fill="#F5B942" />
      {/* Facial features */}
      {getSvgPath()}
    </svg>
  );
};

export default CustomEmoji;
