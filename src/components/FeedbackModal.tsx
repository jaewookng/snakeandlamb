import { useState } from 'react'

interface Props {
  onClose: () => void;
}

export function FeedbackModal({ onClose }: Props) {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you can implement the logic to save the feedback
    console.log({ name, message })
    onClose()
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      backdropFilter: 'blur(5px)',
    }}>
      <div style={{
        background: '#1a1a1a',
        padding: '2rem',
        borderRadius: '15px',
        width: '90%',
        maxWidth: '400px',
        position: 'relative',
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            right: '1rem',
            top: '1rem',
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: '1.5rem',
            cursor: 'pointer',
            padding: '0.5rem',
          }}
        >
          ×
        </button>
        <h2 style={{ marginBottom: '1.5rem', color: '#fff' }}>Leave a Message to the Developer (your bf 🥰)</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            style={{
              padding: '0.8rem',
              borderRadius: '8px',
              border: '1px solid #333',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
            }}
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message..."
            rows={5}
            style={{
              padding: '0.8rem',
              borderRadius: '8px',
              border: '1px solid #333',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              resize: 'vertical',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '0.8rem',
              borderRadius: '8px',
              border: 'none',
              background: '#4488ff',
              color: '#fff',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  )
}
