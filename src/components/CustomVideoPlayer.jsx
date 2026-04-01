import { useState, useRef, useEffect } from 'react'

export default function CustomVideoPlayer({ src, poster }) {
  const videoRef = useRef(null)
  const containerRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState('0:00')
  const [duration, setDuration] = useState('0:00')
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Format time in M:SS
  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return '0:00'
    const m = Math.floor(timeInSeconds / 60)
    const s = Math.floor(timeInSeconds % 60)
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  // Toggle Play/Pause
  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play()
      setIsPlaying(true)
    } else {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }

  // Update progress bar as video plays
  const handleTimeUpdate = () => {
    const video = videoRef.current
    if (!video) return
    const currentProgress = (video.currentTime / video.duration) * 100
    setProgress(currentProgress)
    setCurrentTime(formatTime(video.currentTime))
  }

  // Set duration once video metadata loads
  const handleLoadedMetadata = () => {
    setDuration(formatTime(videoRef.current.duration))
  }

  // Scrub video when clicking progress bar
  const handleProgressChange = (e) => {
    const video = videoRef.current
    const manualChange = Number(e.target.value)
    video.currentTime = (video.duration / 100) * manualChange
    setProgress(manualChange)
  }

  // Toggle Mute
  const toggleMute = () => {
    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  // Handle Volume Change
  const handleVolumeChange = (e) => {
    const newVolume = Number(e.target.value)
    videoRef.current.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  // Toggle Fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  // Listen to fullscreen changes to update icon state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  return (
    <div 
      ref={containerRef}
      className="custom-video-player"
      style={{
        position: 'relative',
        width: '100%',
        backgroundColor: '#000',
        borderRadius: isFullscreen ? '0' : '10px',
        overflow: 'hidden',
        border: isFullscreen ? 'none' : '4px solid var(--border-color)',
        boxShadow: isFullscreen ? 'none' : '4px 4px 0 var(--border-color)',
        fontFamily: 'var(--font-heading)',
      }}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        style={{
          width: '100%',
          height: '100%',
          maxHeight: isFullscreen ? '100vh' : 'auto',
          display: 'block',
          cursor: 'pointer'
        }}
        preload="metadata"
      />

      {/* Large Center Play Button (Visible when paused) */}
      {!isPlaying && (
        <div 
          onClick={togglePlay}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80px',
            height: '80px',
            backgroundColor: 'rgba(226, 54, 54, 0.8)', // Spidey red
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
            border: '4px solid white',
            zIndex: 10,
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)'}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="white" style={{ marginLeft: '6px' }}>
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
        </div>
      )}

      {/* Controls Overlay */}
      <div 
        className="video-controls"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
          padding: '20px 15px 15px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          opacity: isPlaying && !isFullscreen ? 0.8 : 1, // Optional: hide/fade controls if playing
          transition: 'opacity 0.3s',
        }}
      >
        {/* Progress Timeline */}
        <input
          type="range"
          min="0"
          max="100"
          value={isNaN(progress) ? 0 : progress}
          onChange={handleProgressChange}
          style={{
            width: '100%',
            cursor: 'pointer',
            height: '6px',
            accentColor: 'var(--spidey-red)',
            background: 'rgba(255,255,255,0.3)',
            borderRadius: '3px'
          }}
        />

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: 'white',
          fontSize: '0.9rem',
          letterSpacing: '1px'
        }}>
          {/* Left Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button 
              onClick={togglePlay}
              style={btnStyle}
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button 
                onClick={toggleMute}
                style={btnStyle}
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted || volume === 0 ? <MutedIcon /> : <VolumeIcon />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                style={{
                  width: '80px',
                  cursor: 'pointer',
                  accentColor: 'var(--spidey-red)',
                }}
              />
            </div>

            <span style={{ textShadow: '1px 1px 0 #000' }}>
              {currentTime} / {duration}
            </span>
          </div>

          {/* Right Controls */}
          <button 
            onClick={toggleFullscreen}
            style={btnStyle}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <ExitFullscreenIcon /> : <FullscreenIcon />}
          </button>
        </div>
      </div>
    </div>
  )
}

// Minimal Button Styles
const btnStyle = {
  background: 'transparent',
  border: 'none',
  padding: '6px',
  cursor: 'pointer',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '4px',
  transition: 'background 0.2s',
  filter: 'drop-shadow(2px 2px 0 rgba(0,0,0,0.8))'
}

// Icons
function PlayIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </svg>
  )
}
function PauseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="4" width="4" height="16"></rect>
      <rect x="14" y="4" width="4" height="16"></rect>
    </svg>
  )
}
function VolumeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
    </svg>
  )
}
function MutedIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
      <line x1="23" y1="9" x2="17" y2="15"></line>
      <line x1="17" y1="9" x2="23" y2="15"></line>
    </svg>
  )
}
function FullscreenIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15,3 21,3 21,9" />
      <polyline points="9,21 3,21 3,15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  )
}
function ExitFullscreenIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4,14 10,14 10,20" />
      <polyline points="20,10 14,10 14,4" />
      <line x1="14" y1="10" x2="21" y2="3" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  )
}
