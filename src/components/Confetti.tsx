import { useMemo } from 'react'

interface ConfettiProps {
  count?: number
}

export function Confetti({ count = 24 }: ConfettiProps) {
  const pieces = useMemo(() => {
    const colors = ['#ff2e93', '#c9a8ff', '#ffe600', '#6effc4', '#fff8f0']
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      color: colors[i % colors.length],
      dx: (Math.random() - 0.5) * 280,
      dy: -120 - Math.random() * 200,
      rot: (Math.random() - 0.5) * 720,
      delay: Math.random() * 0.2,
      size: 8 + Math.random() * 10,
      shape: (['circle', 'square', 'tri'] as const)[i % 3],
    }))
  }, [count])

  return (
    <div className="absolute inset-0 pointer-events-none">
      {pieces.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: '50%',
            top: '55%',
            width: p.size,
            height: p.size,
            background: p.color,
            border: '1.5px solid var(--color-ink)',
            borderRadius: p.shape === 'circle' ? '50%' : p.shape === 'square' ? '2px' : '0',
            clipPath: p.shape === 'tri' ? 'polygon(50% 0, 100% 100%, 0 100%)' : 'none',
            '--dx': `${p.dx}px`,
            '--dy': `${p.dy}px`,
            '--rot': `${p.rot}deg`,
            animation: `confetti-burst 1.4s ${p.delay}s cubic-bezier(0.2, 0.8, 0.3, 1) forwards`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}
