export default function ComicPanel({ children, variant, className, style }) {
  const variantClass = variant ? `comic-panel--${variant}` : ''
  return (
    <div className={`comic-panel ${variantClass} ${className || ''}`} style={style}>
      <div className="web-corner web-corner--tl" />
      <div className="web-corner web-corner--br" />
      {children}
    </div>
  )
}
