import { useState } from 'react'
import emailjs from '@emailjs/browser'

interface Props {
  onClose: () => void;
}

export function FeedbackModal({ onClose }: Props) {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)

    try {
      await emailjs.send(
        'service_iapgrin', // Replace with your EmailJS service ID
        'template_xrvsztb', // Replace with your EmailJS template ID
        {
          from_name: name,
          message: message,
          to_name: 'Jaewoo',
          reply_to: 'jaewookang17@gmail.com',
        },
        'amhOGymuxFq1lyZNp' // Replace with your EmailJS public key
      )

      setName('')
      setMessage('')
      onClose()
    } catch (error) {
      console.error('Failed to send email:', error)
    } finally {
      setSending(false)
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(10px) saturate(150%)',
      WebkitBackdropFilter: 'blur(10px) saturate(150%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      animation: 'fadeIn 0.3s ease',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.06))',
        backdropFilter: 'blur(25px) saturate(180%)',
        WebkitBackdropFilter: 'blur(25px) saturate(180%)',
        padding: '2.5rem',
        borderRadius: '20px',
        width: '90%',
        maxWidth: '450px',
        position: 'relative',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), inset 0 1px 3px rgba(255, 255, 255, 0.1)',
        animation: 'slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>
        {/* Top gradient highlight */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
          borderRadius: '20px 20px 0 0',
        }} />

        {/* Close button with glass effect */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            right: '1.2rem',
            top: '1.2rem',
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '50%',
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '1.3rem',
            cursor: 'pointer',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            padding: '0',
            fontWeight: '300',
            lineHeight: '0',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255, 59, 48, 0.2)';
            e.currentTarget.style.borderColor = 'rgba(255, 59, 48, 0.3)';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          ×
        </button>

        <h2 style={{
          marginBottom: '2rem',
          color: 'rgba(255, 255, 255, 0.95)',
          fontSize: '1.8rem',
          fontWeight: '600',
          letterSpacing: '-0.02em',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        }}>Leave a Message 💌</h2>

        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.2rem'
        }}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            disabled={sending}
            required
            style={{
              padding: '1rem',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              color: 'rgba(255, 255, 255, 0.95)',
              fontSize: '1rem',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
              transition: 'all 0.3s ease',
              boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.2)',
              opacity: sending ? 0.5 : 1,
              outline: 'none',
            }}
            onFocus={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
              e.currentTarget.style.borderColor = 'rgba(94, 172, 255, 0.5)';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(94, 172, 255, 0.15), inset 0 1px 3px rgba(0, 0, 0, 0.2)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.boxShadow = 'inset 0 1px 3px rgba(0, 0, 0, 0.2)';
            }}
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message..."
            rows={5}
            disabled={sending}
            required
            style={{
              padding: '1rem',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              color: 'rgba(255, 255, 255, 0.95)',
              fontSize: '1rem',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
              resize: 'vertical',
              minHeight: '120px',
              maxHeight: '300px',
              transition: 'all 0.3s ease',
              boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.2)',
              opacity: sending ? 0.5 : 1,
              outline: 'none',
            }}
            onFocus={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
              e.currentTarget.style.borderColor = 'rgba(94, 172, 255, 0.5)';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(94, 172, 255, 0.15), inset 0 1px 3px rgba(0, 0, 0, 0.2)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.boxShadow = 'inset 0 1px 3px rgba(0, 0, 0, 0.2)';
            }}
          />
          <button
            type="submit"
            disabled={sending}
            style={{
              padding: '1rem',
              borderRadius: '12px',
              border: sending ? '1px solid rgba(94, 172, 255, 0.2)' : '1px solid rgba(94, 172, 255, 0.3)',
              background: sending
                ? 'linear-gradient(135deg, rgba(94, 172, 255, 0.1), rgba(94, 172, 255, 0.05))'
                : 'linear-gradient(135deg, rgba(94, 172, 255, 0.2), rgba(94, 172, 255, 0.1))',
              backdropFilter: 'blur(15px) saturate(150%)',
              WebkitBackdropFilter: 'blur(15px) saturate(150%)',
              color: 'rgba(255, 255, 255, 0.95)',
              fontSize: '1rem',
              fontWeight: '600',
              letterSpacing: '0.3px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
              cursor: sending ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              opacity: sending ? 0.7 : 1,
              boxShadow: sending
                ? '0 2px 8px rgba(94, 172, 255, 0.1), inset 0 1px 3px rgba(0, 0, 0, 0.1)'
                : '0 4px 12px rgba(94, 172, 255, 0.2), inset 0 1px 3px rgba(255, 255, 255, 0.1)',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseOver={(e) => {
              if (!sending) {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(94, 172, 255, 0.3), rgba(94, 172, 255, 0.15))';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(94, 172, 255, 0.3), inset 0 1px 3px rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(94, 172, 255, 0.5)';
              }
            }}
            onMouseOut={(e) => {
              if (!sending) {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(94, 172, 255, 0.2), rgba(94, 172, 255, 0.1))';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(94, 172, 255, 0.2), inset 0 1px 3px rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(94, 172, 255, 0.3)';
              }
            }}
            onMouseDown={(e) => {
              if (!sending) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(94, 172, 255, 0.15), inset 0 1px 3px rgba(0, 0, 0, 0.2)';
              }
            }}
            onMouseUp={(e) => {
              if (!sending) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(94, 172, 255, 0.3), inset 0 1px 3px rgba(255, 255, 255, 0.15)';
              }
            }}
          >
            {sending ? 'Sending...' : 'Send Message'}
          </button>
        </form>
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
