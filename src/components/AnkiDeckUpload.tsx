import { useState, useRef, useCallback } from 'react'

interface AnkiDeckUploadProps {
  onClose: () => void
}

export const AnkiDeckUpload = ({ onClose }: AnkiDeckUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = useCallback((file: File) => {
    if (file.type === 'application/apkg' || file.name.endsWith('.apkg')) {
      setUploadedFile(file)
      setIsUploading(true)
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval)
            setIsUploading(false)
            return 100
          }
          return prev + 10
        })
      }, 200)
    } else {
      alert('Please select a valid Anki deck file (.apkg)')
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }, [handleFileSelect])

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }, [handleFileSelect])

  const handleClickUpload = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleReset = useCallback(() => {
    setUploadedFile(null)
    setUploadProgress(0)
    setIsUploading(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

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
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px'
        }}>
          <h2 style={{ margin: 0, fontSize: '1.8rem' }}>
            📚 Upload Anki Deck
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

        {!uploadedFile ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClickUpload}
            style={{
              border: `2px dashed ${isDragOver ? '#4CAF50' : 'rgba(255, 255, 255, 0.3)'}`,
              borderRadius: '15px',
              padding: '60px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              background: isDragOver ? 'rgba(76, 175, 80, 0.1)' : 'transparent'
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>
              📁
            </div>
            <div style={{ fontSize: '1.2rem', marginBottom: '10px' }}>
              {isDragOver ? 'Drop your Anki deck here' : 'Drag & drop your .apkg file here'}
            </div>
            <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>
              or click to browse files
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>
              ✅
            </div>
            <div style={{ fontSize: '1.2rem', marginBottom: '10px' }}>
              {uploadedFile.name}
            </div>
            <div style={{ fontSize: '0.9rem', opacity: 0.7, marginBottom: '20px' }}>
              {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
            </div>
            
            {isUploading && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '10px',
                  height: '8px',
                  overflow: 'hidden',
                  marginBottom: '10px'
                }}>
                  <div style={{
                    background: 'linear-gradient(90deg, #4CAF50, #8BC34A)',
                    height: '100%',
                    width: `${uploadProgress}%`,
                    transition: 'width 0.3s ease'
                  }} />
                </div>
                <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                  Uploading... {uploadProgress}%
                </div>
              </div>
            )}

            {!isUploading && uploadProgress === 100 && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '1rem', color: '#4CAF50', marginBottom: '20px' }}>
                  🎉 Upload successful!
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={handleReset}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                }}
              >
                Upload Another
              </button>
              <button
                onClick={onClose}
                style={{
                  background: 'rgba(76, 175, 80, 0.8)',
                  border: 'none',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(76, 175, 80, 1)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(76, 175, 80, 0.8)'
                }}
              >
                Done
              </button>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".apkg"
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />

        <div style={{
          marginTop: '20px',
          fontSize: '0.8rem',
          opacity: 0.6,
          textAlign: 'center'
        }}>
          Supported format: .apkg (Anki Package)
        </div>
      </div>
    </div>
  )
}
