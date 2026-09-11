import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'

export function useProfile(username) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!username) return
    let active = true
    setLoading(true)

    supabase
      .from('profiles')
      .select('id, username, avatar_url, bio, created_at')
      .eq('username', username)
      .single()
      .then(({ data, error }) => {
        if (!active) return
        if (error) setError(error)
        else setProfile(data)
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [username])

  return { profile, loading, error }
}
