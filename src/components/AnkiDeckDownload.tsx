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
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '500px',
        width: '90%',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(20px)',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px'
        }}>
          <h2 style={{ margin: 0, fontSize: '1.8rem' }}>
            📥 Download Anki Deck
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '5px',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ×
          </button>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '30px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '30px'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>
            📚
          </div>
          <div style={{
            fontSize: '1.3rem',
            fontWeight: 'bold',
            marginBottom: '10px'
          }}>
            Anatomy KIN424
          </div>
          <div style={{
            fontSize: '0.9rem',
            opacity: 0.7,
            marginBottom: '20px'
          }}>
            Anki deck for anatomy studies
          </div>
          <button
            onClick={onDownload}
            style={{
              background: 'rgba(76, 175, 80, 0.8)',
              border: 'none',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '1rem',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              margin: '0 auto'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(76, 175, 80, 1)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(76, 175, 80, 0.8)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <span>⬇️</span>
            Download Deck
          </button>
        </div>

        <div style={{
          fontSize: '0.8rem',
          opacity: 0.6,
          textAlign: 'center'
        }}>
          Click download to get the Anki deck file (.apkg)
        </div>
      </div>
    </div>
  )
}
