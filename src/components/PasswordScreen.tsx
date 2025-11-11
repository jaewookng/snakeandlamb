import { useState } from 'react'

interface Props {
  onCorrectPassword: () => void;
}

export function PasswordScreen({ onCorrectPassword }: Props) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === '32617') {
      onCorrectPassword()
    } else {
      setError(true)
      setPassword('')
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
      gap: '1rem',
      minHeight: '100vh',
      padding: '20px'
    }}>
      {/* Animated background orbs */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none'
      }}>
        <div style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at center, rgba(120, 119, 198, 0.3), transparent)',
          filter: 'blur(60px)',
          top: '20%',
          left: '10%',
          animation: 'float 8s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at center, rgba(255, 119, 198, 0.2), transparent)',
          filter: 'blur(50px)',
          bottom: '10%',
          right: '15%',
          animation: 'float 10s ease-in-out infinite reverse'
        }} />
      </div>

      {/* Glass card container */}
      <div style={{
        position: 'relative',
        padding: '3rem 2.5rem',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), inset 0 1px 3px rgba(255, 255, 255, 0.1)',
        maxWidth: '400px',
        width: '100%',
        animation: 'slideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}>
        {/* Top gradient highlight */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
          borderRadius: '24px 24px 0 0'
        }} />

        <div style={{
          fontSize: '3.5rem',
          marginBottom: '2.5rem',
          display: 'flex',
          gap: '1.2rem',
          justifyContent: 'center',
          animation: 'float 3s ease-in-out infinite',
          filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3))'
        }}>
          <span role="img" aria-label="snake">🐍</span>
          <span role="img" aria-label="lamb">🐑</span>
        </div>

        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.2rem',
          alignItems: 'center',
          width: '100%'
        }}>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError(false)
            }}
            placeholder="Enter password"
            style={{
              padding: '1rem 1.4rem',
              fontSize: '1.1rem',
              width: '100%',
              borderRadius: '12px',
              border: error ? '1px solid rgba(255, 59, 48, 0.6)' : '1px solid rgba(255, 255, 255, 0.15)',
              background: error
                ? 'linear-gradient(135deg, rgba(255, 59, 48, 0.08), rgba(255, 59, 48, 0.03))'
                : 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              color: 'rgba(255, 255, 255, 0.95)',
              textAlign: 'center',
              outline: 'none',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: error
                ? '0 0 0 3px rgba(255, 59, 48, 0.15), inset 0 1px 3px rgba(0, 0, 0, 0.2)'
                : 'inset 0 1px 3px rgba(0, 0, 0, 0.2)',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
              fontWeight: '500',
              letterSpacing: '0.5px'
            }}
            onFocus={(e) => {
              if (!error) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                e.currentTarget.style.borderColor = 'rgba(0, 122, 255, 0.5)';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 122, 255, 0.15), inset 0 1px 3px rgba(0, 0, 0, 0.2)';
              }
            }}
            onBlur={(e) => {
              if (!error) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.boxShadow = 'inset 0 1px 3px rgba(0, 0, 0, 0.2)';
              }
            }}
            autoFocus
          />
          {error && (
            <div style={{
              color: 'rgba(255, 59, 48, 0.9)',
              fontSize: '0.9rem',
              fontWeight: '500',
              padding: '0.5rem',
              background: 'rgba(255, 59, 48, 0.1)',
              borderRadius: '8px',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 59, 48, 0.2)',
              animation: 'slideUp 0.3s ease'
            }}>
              Incorrect password
            </div>
          )}
          <button type="submit" style={{
            padding: '1rem 2.5rem',
            fontSize: '1.1rem',
            background: 'linear-gradient(135deg, rgba(0, 122, 255, 0.15), rgba(0, 122, 255, 0.08))',
            backdropFilter: 'blur(15px) saturate(150%)',
            WebkitBackdropFilter: 'blur(15px) saturate(150%)',
            color: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid rgba(0, 122, 255, 0.3)',
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            width: '100%',
            fontWeight: '600',
            letterSpacing: '0.5px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            boxShadow: '0 4px 12px rgba(0, 122, 255, 0.15), inset 0 1px 3px rgba(255, 255, 255, 0.1)',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0, 122, 255, 0.25), rgba(0, 122, 255, 0.15))';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 122, 255, 0.25), inset 0 1px 3px rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.borderColor = 'rgba(0, 122, 255, 0.5)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0, 122, 255, 0.15), rgba(0, 122, 255, 0.08))';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 122, 255, 0.15), inset 0 1px 3px rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(0, 122, 255, 0.3)';
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 122, 255, 0.15), inset 0 1px 3px rgba(0, 0, 0, 0.2)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 122, 255, 0.25), inset 0 1px 3px rgba(255, 255, 255, 0.15)';
          }}>
            Enter
          </button>
        </form>
      </div>

      {/* Add keyframe animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
