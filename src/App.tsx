import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import { AuthScreen } from './components/AuthScreen'
import { HomeScreen } from './components/HomeScreen'

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-paper">
        <div className="font-display text-3xl text-pink animate-pulse">
          CuntyCoins
        </div>
      </div>
    )
  }

  if (!session) {
    return <AuthScreen />
  }

  return <HomeScreen session={session} />
}

export default App
