import type { Sticker, Tier } from '../lib/types'

const TIER_LABEL: Record<Tier, string> = {
  common: 'COMMON',
  rare: 'RARE',
  ultra: 'ULTRA RARE',
}

interface PhotocardProps {
  sticker: Sticker
  size?: 'xs' | 'sm' | 'md' | 'lg'
  animate?: boolean
  onClick?: () => void
}

const sizes = {
  xs: { w: 70, h: 100, fs: 10, badgeFs: 7 },
  sm: { w: 96, h: 134, fs: 11, badgeFs: 7 },
  md: { w: 200, h: 280, fs: 16, badgeFs: 10 },
  lg: { w: 260, h: 364, fs: 22, badgeFs: 11 },
}

export function Photocard({ sticker, size = 'md', animate = false, onClick }: PhotocardProps) {
  const s = sizes[size]
  const isUltra = sticker.tier === 'ultra'

  const cardBg = isUltra
    ? undefined
    : sticker.tier === 'rare'
    ? 'linear-gradient(160deg, var(--color-lilac) 0%, var(--color-pink) 100%)'
    : sticker.color === '#ff2e93'
    ? 'var(--color-pink)'
    : sticker.color === '#ffe600'
    ? 'var(--color-yellow)'
    : sticker.color === '#6effc4'
    ? 'var(--color-mint)'
    : sticker.color === '#c9a8ff'
    ? 'var(--color-lilac)'
    : 'var(--color-cream)'

  const textColor =
    isUltra ||
    sticker.color === '#ffe600' ||
    sticker.color === '#6effc4' ||
    sticker.color === '#c9a8ff' ||
    (sticker.tier === 'common' && sticker.color !== '#ff2e93')
      ? 'var(--color-ink)'
      : 'var(--color-paper)'

  return (
    <div
      onClick={onClick}
      className={animate ? 'card-flip-in' : ''}
      style={{
        width: s.w,
        height: s.h,
        borderRadius: 12,
        border: '2.5px solid var(--color-ink)',
        background: cardBg || 'var(--color-paper)',
        boxShadow: size === 'lg' ? '6px 6px 0 var(--color-ink)' : '3px 3px 0 var(--color-ink)',
        position: 'relative',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        color: textColor,
      }}
    >
      {isUltra && (
        <>
          <div className="holo-bg" style={{ position: 'absolute', inset: 0 }} />
          <div className="holo-shimmer" />
        </>
      )}

      {/* Inner border */}
      <div
        style={{
          position: 'absolute',
          inset: s.w / 14,
          border: `1.5px ${isUltra ? 'solid' : 'dashed'} ${isUltra ? 'rgba(20,17,15,0.5)' : 'rgba(255,248,240,0.5)'}`,
          borderRadius: 6,
          pointerEvents: 'none',
        }}
      />

      {/* Top tier tag */}
      <div
        style={{
          position: 'absolute',
          top: s.w / 14 + 4,
          left: s.w / 14 + 4,
          right: s.w / 14 + 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: s.badgeFs,
          fontWeight: 700,
          letterSpacing: '0.1em',
          color: isUltra ? 'var(--color-ink)' : textColor,
          opacity: 0.9,
        }}
      >
        <span>{TIER_LABEL[sticker.tier]}</span>
        <span>#{String(sticker.id).slice(0, 3).padStart(3, '0')}/250</span>
      </div>

      {/* Visual area */}
      <div
        style={{
          position: 'absolute',
          top: s.h * 0.16,
          left: s.w * 0.12,
          right: s.w * 0.12,
          bottom: s.h * 0.32,
          borderRadius: 4,
          background: isUltra ? 'rgba(255,248,240,0.35)' : 'rgba(255,255,255,0.2)',
          border: isUltra ? '1.5px solid rgba(20,17,15,0.5)' : '1.5px solid rgba(255,255,255,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-display)',
          fontSize: s.w * 0.35,
          color: isUltra ? 'var(--color-pink)' : 'rgba(255,255,255,0.9)',
          textShadow: isUltra ? '2px 2px 0 var(--color-paper)' : 'none',
          backdropFilter: 'blur(2px)',
          overflow: 'hidden',
        }}
      >
        {sticker.image_url ? (
          <img
            src={sticker.image_url}
            alt={sticker.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          sticker.icon
        )}
      </div>

      {/* Bottom name + loc */}
      <div
        style={{
          position: 'absolute',
          bottom: s.w / 14 + 4,
          left: s.w / 14 + 6,
          right: s.w / 14 + 6,
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: s.fs,
            lineHeight: 0.95,
            color: isUltra ? 'var(--color-ink)' : textColor,
            textShadow: isUltra ? '1px 1px 0 var(--color-paper)' : 'none',
            textTransform: 'uppercase',
            letterSpacing: '0.01em',
          }}
        >
          {sticker.name}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: s.badgeFs,
            opacity: 0.75,
            marginTop: 2,
            color: isUltra ? 'var(--color-ink)' : textColor,
          }}
        >
          {sticker.location}
        </div>
      </div>
    </div>
  )
}
