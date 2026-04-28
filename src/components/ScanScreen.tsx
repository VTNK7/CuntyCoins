import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'

interface ScanScreenProps {
  onClose: () => void
  onScan: (code: string) => void
}

export function ScanScreen({ onClose, onScan }: ScanScreenProps) {
  const [error, setError] = useState<string | null>(null)
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let mounted = true
    const scanner = new Html5Qrcode('qr-reader')
    scannerRef.current = scanner

    scanner
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          if (mounted) {
            scanner.stop().catch(() => {})
            onScan(decodedText)
          }
        },
        () => {},
      )
      .catch((err) => {
        if (mounted) setError(`Camera: ${err}`)
      })

    return () => {
      mounted = false
      scanner.stop().catch(() => {})
    }
  }, [onScan])

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0a] screen-enter">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 pt-14 pb-4">
        <button
          onClick={onClose}
          className="font-display text-paper text-sm border-2 border-paper/30 rounded-full px-4 py-2 active:scale-95 transition-transform"
        >
          CLOSE
        </button>
        <div className="font-mono text-paper/60 text-xs tracking-widest uppercase">
          scanning...
        </div>
      </div>

      {/* Camera viewfinder */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div ref={containerRef} className="relative w-[280px] h-[280px]">
          <div id="qr-reader" className="w-full h-full rounded-2xl overflow-hidden" />

          {/* Corner brackets */}
          <div className="absolute top-0 left-0 w-10 h-10 border-t-3 border-l-3 border-pink rounded-tl-xl" />
          <div className="absolute top-0 right-0 w-10 h-10 border-t-3 border-r-3 border-pink rounded-tr-xl" />
          <div className="absolute bottom-0 left-0 w-10 h-10 border-b-3 border-l-3 border-pink rounded-bl-xl" />
          <div className="absolute bottom-0 right-0 w-10 h-10 border-b-3 border-r-3 border-pink rounded-br-xl" />

          {/* Laser sweep */}
          <div
            className="scan-laser absolute left-2 right-2 h-0.5 bg-pink rounded-full shadow-[0_0_12px_rgba(255,46,147,0.8)]"
          />
        </div>
      </div>

      {error && (
        <div className="absolute bottom-32 left-6 right-6 text-center">
          <div className="bg-ink/80 text-paper rounded-xl px-4 py-3 font-mono text-xs">
            {error}
          </div>
        </div>
      )}

      {/* Bottom hint */}
      <div className="absolute bottom-12 left-0 right-0 text-center">
        <div className="font-hand text-paper/70 text-lg">
          point at a cuntycoins sticker
        </div>
      </div>
    </div>
  )
}
