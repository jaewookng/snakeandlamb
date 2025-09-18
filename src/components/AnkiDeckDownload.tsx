import { useState } from 'react'

interface AnkiDeck {
  id: string;
  name: string;
  file: File;
  uploadDate: Date;
  size: number;
}

interface AnkiDeckDownloadProps {
  onClose: () => void
  decks: AnkiDeck[]
  onDownload: (deck: AnkiDeck) => void
}

export const AnkiDeckDownload = ({ onClose, decks, onDownload }: AnkiDeckDownloadProps) => {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredDecks = decks.filter(deck => 
    deck.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

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
        maxWidth: '600px',
        width: '90%',
        maxHeight: '80vh',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(20px)',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px'
        }}>
          <h2 style={{ margin: 0, fontSize: '1.8rem' }}>
            📥 Download Anki Decks
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

        {decks.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            opacity: 0.7
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>
              📚
            </div>
            <div style={{ fontSize: '1.2rem', marginBottom: '10px' }}>
              No Anki decks available
            </div>
            <div style={{ fontSize: '0.9rem' }}>
              Upload some decks to get started!
            </div>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '20px' }}>
              <input
                type="text"
                placeholder="Search decks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{
              flex: 1,
              overflowY: 'auto',
              paddingRight: '10px'
            }}>
              {filteredDecks.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '20px',
                  opacity: 0.7
                }}>
                  No decks match your search
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {filteredDecks.map((deck) => (
                    <div
                      key={deck.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px'
                      }}>
                        <div style={{
                          fontSize: '1.1rem',
                          fontWeight: 'bold',
                          flex: 1,
                          marginRight: '10px'
                        }}>
                          {deck.name}
                        </div>
                        <button
                          onClick={() => onDownload(deck)}
                          style={{
                            background: 'rgba(76, 175, 80, 0.8)',
                            border: 'none',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = 'rgba(76, 175, 80, 1)'
                            e.currentTarget.style.transform = 'translateY(-1px)'
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = 'rgba(76, 175, 80, 0.8)'
                            e.currentTarget.style.transform = 'translateY(0)'
                          }}
                        >
                          <span>⬇️</span>
                          Download
                        </button>
                      </div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '0.85rem',
                        opacity: 0.7
                      }}>
                        <span>{formatFileSize(deck.size)}</span>
                        <span>{formatDate(deck.uploadDate)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        <div style={{
          marginTop: '20px',
          fontSize: '0.8rem',
          opacity: 0.6,
          textAlign: 'center'
        }}>
          {decks.length} deck{decks.length !== 1 ? 's' : ''} available
        </div>
      </div>
    </div>
  )
}
