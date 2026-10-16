// Shared dot + pulse + hover tooltip for helmet hotspots.
// `color` is an RGB-triplet CSS var name, e.g. 'var(--accent)' or 'var(--music)'.
export default function HotspotDot({
  label,
  tooltip,
  color = 'var(--accent)',
  isActive,
  isMuted,
  pulse,
  showTooltip,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) {
  const classes = ['hotspot-btn', isActive && 'is-active', isMuted && 'is-muted'].filter(Boolean).join(' ')

  return (
    <>
      {pulse && !isActive && <span aria-hidden className="hotspot-pulse" style={{ '--hs': color }} />}
      <button
        className={classes}
        style={{ '--hs': color }}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        aria-label={label}
        aria-expanded={isActive}
      >
        <span aria-hidden className="hotspot-ring" />
        <span aria-hidden className="hotspot-core" />
        {showTooltip && !isActive && (
          <span className="hotspot-tooltip">{tooltip ?? label}</span>
        )}
      </button>
    </>
  )
}
