import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { StarShape } from './StarShape'

export function AuthScreen() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    })

    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
  }

  return (
    <div className="h-full flex flex-col items-center justify-center px-8 bg-paper">
      {/* Top glow */}
      <div
        className="absolute top-0 left-0 right-0 h-[360px] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at top, rgba(255,46,147,0.18), transparent 60%), radial-gradient(ellipse at 80% 30%, rgba(201,168,255,0.22), transparent 55%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center">
        <div className="flex items-center gap-3 mb-2">
          <StarShape size={32} color="var(--color-yellow)" />
          <h1 className="font-display text-4xl text-ink">CuntyCoins</h1>
          <StarShape size={32} color="var(--color-pink)" />
        </div>

        <p className="font-hand text-xl text-ink/60 mb-10">collect stickers, earn coins</p>

        {sent ? (
          <div className="text-center">
            <div className="bg-mint border-2 border-ink rounded-2xl px-6 py-4 shadow-[3px_3px_0_var(--color-ink)]">
              <div className="font-display text-lg text-ink">CHECK UR EMAIL</div>
              <div className="font-mono text-xs text-ink/70 mt-1">
                magic link sent to {email}
              </div>
            </div>
            <p className="font-hand text-ink/50 mt-4">tap the link to get in</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full max-w-xs flex flex-col gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ur email babe"
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-ink bg-paper font-mono text-sm text-ink placeholder:text-ink/30 shadow-[3px_3px_0_var(--color-ink)] focus:outline-none focus:border-pink transition-colors"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink text-paper border-3 border-ink rounded-full py-3 font-display text-lg tracking-wide shadow-[5px_5px_0_var(--color-ink)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[3px_3px_0_var(--color-ink)] transition-all disabled:opacity-50"
            >
              {loading ? '...' : 'SEND MAGIC LINK'}
            </button>
            {error && (
              <p className="font-mono text-xs text-pink-deep text-center">{error}</p>
            )}
          </form>
        )}
      </div>
    </div>
  )
}
