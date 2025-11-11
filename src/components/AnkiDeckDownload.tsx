interface AnkiDeckDownloadProps {
  onClose: () => void
  onDownload: () => void
}

export const AnkiDeckDownload = ({ onClose, onDownload }: AnkiDeckDownloadProps) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(15px) saturate(150%)',
      WebkitBackdropFilter: 'blur(15px) saturate(150%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      animation: 'fadeIn 0.3s ease'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0.07))',
        borderRadius: '24px',
        padding: '45px',
        maxWidth: '520px',
        width: '90%',
        border: '1px solid rgba(255, 255, 255, 0.25)',
        backdropFilter: 'blur(30px) saturate(200%)',
        WebkitBackdropFilter: 'blur(30px) saturate(200%)',
        color: 'rgba(255, 255, 255, 0.95)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
        textAlign: 'center',
        boxShadow: '0 25px 70px rgba(0, 0, 0, 0.35), inset 0 1px 4px rgba(255, 255, 255, 0.12)',
        position: 'relative',
        animation: 'slideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}>
        {/* Top gradient highlight */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent)',
          borderRadius: '24px 24px 0 0'
        }} />

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '35px'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '1.9rem',
            fontWeight: '600',
            letterSpacing: '-0.02em',
            textShadow: '0 2px 5px rgba(0, 0, 0, 0.2)'
          }}>
            📥 Download Anki Deck
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              color: 'rgba(255, 255, 255, 0.85)',
              fontSize: '1.4rem',
              cursor: 'pointer',
              padding: '0',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.25s ease',
              fontWeight: '300',
              lineHeight: '0',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.1)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 59, 48, 0.25)';
              e.currentTarget.style.borderColor = 'rgba(255, 59, 48, 0.4)';
              e.currentTarget.style.transform = 'scale(1.1) rotate(90deg)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 59, 48, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.18)';
              e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.1)';
            }}
          >
            ×
          </button>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04))',
          borderRadius: '16px',
          padding: '35px',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          marginBottom: '35px',
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1), inset 0 1px 3px rgba(255, 255, 255, 0.08)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Animated shimmer effect */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.1) 50%, transparent 60%)',
            animation: 'shimmer 4s infinite'
          }} />

          <div style={{
            fontSize: '3.5rem',
            marginBottom: '25px',
            filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.25))',
            animation: 'bounce 2s ease-in-out infinite'
          }}>
            📚
          </div>
          <div style={{
            fontSize: '1.4rem',
            fontWeight: '600',
            marginBottom: '12px',
            letterSpacing: '-0.01em',
            textShadow: '0 1px 3px rgba(0, 0, 0, 0.15)'
          }}>
            Anatomy KIN424
          </div>
          <div style={{
            fontSize: '0.95rem',
            color: 'rgba(255, 255, 255, 0.65)',
            marginBottom: '25px',
            fontWeight: '400'
          }}>
            Anki deck for anatomy studies
          </div>
          <button
            onClick={onDownload}
            style={{
              background: 'linear-gradient(135deg, rgba(48, 209, 88, 0.25), rgba(48, 209, 88, 0.15))',
              backdropFilter: 'blur(15px) saturate(150%)',
              WebkitBackdropFilter: 'blur(15px) saturate(150%)',
              border: '1px solid rgba(48, 209, 88, 0.4)',
              color: 'rgba(255, 255, 255, 0.95)',
              padding: '14px 28px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '1.05rem',
              fontWeight: '600',
              letterSpacing: '0.3px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              margin: '0 auto',
              boxShadow: '0 4px 15px rgba(48, 209, 88, 0.25), inset 0 1px 3px rgba(255, 255, 255, 0.15)',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(48, 209, 88, 0.35), rgba(48, 209, 88, 0.25))';
              e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(48, 209, 88, 0.35), inset 0 1px 3px rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(48, 209, 88, 0.6)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(48, 209, 88, 0.25), rgba(48, 209, 88, 0.15))';
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(48, 209, 88, 0.25), inset 0 1px 3px rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.borderColor = 'rgba(48, 209, 88, 0.4)';
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px) scale(0.98)';
              e.currentTarget.style.boxShadow = '0 2px 10px rgba(48, 209, 88, 0.2), inset 0 1px 3px rgba(0, 0, 0, 0.2)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(48, 209, 88, 0.35), inset 0 1px 3px rgba(255, 255, 255, 0.2)';
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>⬇️</span>
            Download Deck
          </button>
        </div>

        <div style={{
          fontSize: '0.85rem',
          color: 'rgba(255, 255, 255, 0.5)',
          textAlign: 'center',
          fontWeight: '400'
        }}>
          Click download to get the Anki deck file (.apkg)
        </div>
      </div>

      {/* Add keyframe animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shimmer {
          0% {
            left: -100%;
          }
          100% {
            left: 200%;
          }
        }
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  )
}
