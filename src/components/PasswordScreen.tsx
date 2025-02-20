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
      background: '#111111',
      gap: '1rem',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div style={{
        fontSize: '3rem',
        marginBottom: '2rem',
        display: 'flex',
        gap: '1rem',
        animation: 'float 3s ease-in-out infinite'
      }}>
        <span role="img" aria-label="snake">🐍</span>
        <span role="img" aria-label="lamb">🐑</span>
      </div>
      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        alignItems: 'center',
        width: '100%',
        maxWidth: '300px'
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
            padding: '0.8rem 1.2rem',
            fontSize: '1.2rem',
            width: '100%',
            borderRadius: '8px',
            border: error ? '2px solid #ff6b6b' : '2px solid transparent',
            background: 'rgba(255,255,255,0.1)',
            color: 'white',
            textAlign: 'center',
            outline: 'none'
          }}
          autoFocus
        />
        {error && (
          <div style={{ 
            color: '#ff6b6b',
            fontSize: '0.9rem',
            opacity: 0.8
          }}>
            Incorrect password
          </div>
        )}
        <button type="submit" style={{
          padding: '0.8rem 2rem',
          fontSize: '1.2rem',
          background: 'rgba(255,255,255,0.1)',
          color: 'white',
          border: '2px solid transparent',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          width: '100%'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}>
          Enter
        </button>
      </form>
    </div>
  )
}
