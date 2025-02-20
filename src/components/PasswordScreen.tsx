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
      height: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#111111',
      gap: '1rem'
    }}>
      <div style={{
        fontSize: '2rem',
        marginBottom: '2rem',
        display: 'flex',
        gap: '1rem'
      }}>
        <span role="img" aria-label="snake">🐍</span>
        <span role="img" aria-label="lamb">🐑</span>
      </div>
      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        alignItems: 'center'
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
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            borderRadius: '4px',
            border: error ? '2px solid #ff6b6b' : '2px solid transparent',
            background: 'rgba(255,255,255,0.1)',
            color: 'white'
          }}
        />
        {error && <div style={{ color: '#ff6b6b' }}>Incorrect password</div>}
        <button type="submit" style={{
          padding: '0.5rem 2rem',
          fontSize: '1rem',
          background: '#4a4a4a',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          Enter
        </button>
      </form>
    </div>
  )
}
