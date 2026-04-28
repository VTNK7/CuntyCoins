import { useEffect, useState, useCallback } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { Sticker } from '../lib/types'
import { Photocard } from './Photocard'
import { LockedCard } from './LockedCard'
import { StarShape } from './StarShape'
import { ScanScreen } from './ScanScreen'
import { ScanSuccess } from './ScanSuccess'

interface HomeScreenProps {
  session: Session
}

export function HomeScreen({ session }: HomeScreenProps) {
  const [scannedStickers, setScannedStickers] = useState<Sticker[]>([])
  const [totalCoins, setTotalCoins] = useState(0)
  const [todayCoins, setTodayCoins] = useState(0)
  const [scanning, setScanning] = useState(false)
  const [justScanned, setJustScanned] = useState<Sticker | null>(null)
  const [loading, setLoading] = useState(true)

  const userEmail = session.user.email ?? ''
  const userInitial = userEmail[0]?.toUpperCase() ?? '?'

  const fetchScans = useCallback(async () => {
    const { data } = await supabase
      .from('user_scans')
      .select('*, sticker:stickers(*)')
      .eq('user_id', session.user.id)
      .order('scanned_at', { ascending: false })

    if (data) {
      const stickers = data.map((s) => s.sticker as Sticker).filter(Boolean)
      setScannedStickers(stickers)
      setTotalCoins(stickers.reduce((sum, s) => sum + s.points, 0))

      const today = new Date().toISOString().slice(0, 10)
      const todayScans = data.filter((s) => s.scanned_at?.startsWith(today))
      setTodayCoins(
        todayScans.reduce((sum, s) => sum + ((s.sticker as Sticker)?.points ?? 0), 0),
      )
    }
    setLoading(false)
  }, [session.user.id])

  useEffect(() => {
    fetchScans()
  }, [fetchScans])

  const handleScan = useCallback(
    async (code: string) => {
      setScanning(false)

      // The QR code contains the sticker ID
      const stickerId = code.trim()

      // Check if already scanned
      const { data: existing } = await supabase
        .from('user_scans')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('sticker_id', stickerId)
        .maybeSingle()

      if (existing) return

      // Fetch sticker info
      const { data: sticker } = await supabase
        .from('stickers')
        .select('*')
        .eq('id', stickerId)
        .single()

      if (!sticker) return

      // Record scan
      await supabase.from('user_scans').insert({
        user_id: session.user.id,
        sticker_id: stickerId,
      })

      setJustScanned(sticker as Sticker)
      fetchScans()
    },
    [session.user.id, fetchScans],
  )

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  // Total sticker slots (show locked placeholders)
  const totalSlots = Math.max(9, scannedStickers.length + 1)
  const lockedCount = totalSlots - scannedStickers.length

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-paper">
        <div className="font-display text-2xl text-pink animate-pulse">Loading...</div>
      </div>
    )
  }

  return (
    <div className="h-full relative bg-paper overflow-hidden">
      {/* Top glow */}
      <div
        className="absolute top-0 left-0 right-0 h-[360px] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at top, rgba(255,46,147,0.18), transparent 60%), radial-gradient(ellipse at 80% 30%, rgba(201,168,255,0.22), transparent 55%)',
        }}
      />

      {/* Scrollable content */}
      <div className="absolute inset-0 pt-14 pb-[130px] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="px-6 pt-3 flex justify-between items-center">
          <div>
            <div className="font-hand text-[22px] leading-none text-ink">
              hey queen &hearts;
            </div>
            <div className="font-mono text-[11px] opacity-55 mt-0.5">
              {userEmail}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-11 h-11 rounded-full bg-lilac border-[2.5px] border-ink shadow-[2px_2px_0_var(--color-ink)] flex items-center justify-center font-display text-lg"
          >
            {userInitial}
          </button>
        </div>

        {/* Balance hero */}
        <div className="px-6 pt-7 relative">
          <div className="font-mono text-[10px] font-bold tracking-[0.18em] text-pink uppercase">
            &#9733; ur cuntycoins
          </div>
          <div className="font-display text-[80px] sm:text-[104px] text-ink mt-1 relative inline-block leading-none">
            {totalCoins.toLocaleString()}
            <div className="absolute -top-1.5 -right-10 rotate-[14deg]">
              <StarShape size={40} color="var(--color-yellow)" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-0">
            {todayCoins > 0 && (
              <div className="bg-mint border-2 border-ink rounded-full px-2.5 py-0.5 font-display text-[11px] tracking-wide shadow-[2px_2px_0_var(--color-ink)]">
                +{todayCoins} TODAY
              </div>
            )}
            <div className="font-hand text-lg">ate, no crumbs &#10022;</div>
          </div>
        </div>

        {/* Collection header */}
        <div className="px-6 pt-9 pb-3.5 flex justify-between items-end">
          <div>
            <div className="font-mono text-[10px] tracking-[0.15em] text-pink-deep font-bold">
              &#10022; MY COLLECTION
            </div>
            <div className="font-display text-[30px] mt-0.5 leading-none">
              ERA 01 &middot; PARIS
            </div>
          </div>
          <div className="font-mono text-[11px] font-bold text-ink opacity-65">
            {scannedStickers.length}/250
          </div>
        </div>

        {/* 3-col grid */}
        <div className="px-6 grid grid-cols-3 gap-3">
          {scannedStickers.map((sticker) => (
            <Photocard key={sticker.id} sticker={sticker} size="sm" />
          ))}
          {Array.from({ length: lockedCount }).map((_, i) => (
            <LockedCard key={`locked-${i}`} w={96} h={134} />
          ))}
        </div>

        {/* Bottom spacing */}
        <div className="h-8" />
      </div>

      {/* Floating SCAN button */}
      <div
        onClick={() => setScanning(true)}
        className="pulse-glow absolute bottom-8 left-1/2 -translate-x-1/2 bg-pink text-paper border-3 border-ink rounded-full px-9 py-4 font-display text-[22px] tracking-wide cursor-pointer flex items-center gap-2.5 z-50 select-none active:translate-y-[2px] active:shadow-[3px_3px_0_var(--color-ink)] transition-all"
      >
        <span className="text-[22px]">&#10022;</span>
        <span>SCAN A STICKER</span>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute left-0 right-0 bottom-0 h-[130px] pointer-events-none z-40"
        style={{
          background:
            'linear-gradient(to top, var(--color-paper) 30%, rgba(255,248,240,0.8) 70%, transparent)',
        }}
      />

      {/* Scanner overlay */}
      {scanning && (
        <ScanScreen onClose={() => setScanning(false)} onScan={handleScan} />
      )}

      {/* Scan success overlay */}
      {justScanned && (
        <ScanSuccess
          sticker={justScanned}
          onDone={() => setJustScanned(null)}
        />
      )}
    </div>
  )
}
