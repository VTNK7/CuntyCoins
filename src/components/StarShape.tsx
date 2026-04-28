interface StarShapeProps {
  size?: number
  color?: string
  stroke?: string
}

export function StarShape({ size = 24, color = 'var(--color-pink)', stroke = 'var(--color-ink)' }: StarShapeProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={{ display: 'block' }}>
      <path
        d="M12 1.5 L14.4 8.6 L21.8 9 L16 13.6 L18 21 L12 16.7 L6 21 L8 13.6 L2.2 9 L9.6 8.6 Z"
        fill={color}
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}
