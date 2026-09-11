import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'

export function useProfile(username) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(Boolean(username))
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true

    if (!username) {
      setProfile(null)
      setError(new Error('Username is missing.'))
      setLoading(false)
      return undefined
    }

    setLoading(true)
    setError(null)
    setProfile(null)

    async function load() {
      const { data, error: queryError } = await supabase
        .from('profiles')
        .select('id, username, display_name, avatar_url, bio, created_at')
        .eq('username', username)
        .single()

      if (!active) return

      if (queryError) {
        setError(queryError)
      } else {
        setProfile(data)
      }
      setLoading(false)
    }

    load()
    return () => {
      active = false
    }
  }, [username])

  return { profile, loading, error }
}
