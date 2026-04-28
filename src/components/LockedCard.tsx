interface LockedCardProps {
  w: number
  h: number
}

export function LockedCard({ w, h }: LockedCardProps) {
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: 12,
        border: '2.5px dashed rgba(20,17,15,0.25)',
        background: 'rgba(20,17,15,0.04)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display)',
        fontSize: w / 3.5,
        color: 'rgba(20,17,15,0.25)',
      }}
    >
      ?
    </div>
  )
}
