import type { Sticker } from '../lib/types'
import { Photocard } from './Photocard'
import { Confetti } from './Confetti'

interface ScanSuccessProps {
  sticker: Sticker
  onDone: () => void
}

export function ScanSuccess({ sticker, onDone }: ScanSuccessProps) {
  return (
    <div className="fixed inset-0 z-50 bg-ink/90 flex flex-col items-center justify-center screen-enter">
      <div className="relative">
        <Confetti />
        <Photocard sticker={sticker} size="lg" animate />
      </div>

      <div className="mt-6 text-center">
        <div className="font-display text-paper text-2xl uppercase">
          {sticker.name}
        </div>
        <div className="font-mono text-pink text-lg mt-1 font-bold">
          +{sticker.points} CuntyCoins!
        </div>
        <div className="font-hand text-paper/60 text-lg mt-1">
          slay, another one collected
        </div>
      </div>

      <button
        onClick={onDone}
        className="mt-8 bg-pink text-paper border-3 border-ink rounded-full px-8 py-3 font-display text-lg tracking-wide shadow-[5px_5px_0_var(--color-ink)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[3px_3px_0_var(--color-ink)] transition-all"
      >
        YASS, BACK HOME
      </button>
    </div>
  )
}
