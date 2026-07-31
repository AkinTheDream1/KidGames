import { useCallback, useEffect, useState } from 'react'

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string | undefined
const REDIRECT_URI = (import.meta.env.VITE_SPOTIFY_REDIRECT_URI as string | undefined) || `${window.location.origin}/callback`
const TOKEN_KEY = 'scoop-spotify-token'
const VERIFIER_KEY = 'scoop-spotify-verifier'

interface StoredToken {
  accessToken: string
  expiresAt: number
}

const encode = (bytes: ArrayBuffer) =>
  btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

const randomVerifier = () => encode(crypto.getRandomValues(new Uint8Array(64)).buffer)

export function useSpotifyAuth() {
  const [token, setToken] = useState<string | null>(() => {
    const stored = sessionStorage.getItem(TOKEN_KEY)
    if (!stored) return null
    const parsed = JSON.parse(stored) as StoredToken
    return parsed.expiresAt > Date.now() ? parsed.accessToken : null
  })
  const [isConfigured] = useState(Boolean(CLIENT_ID))

  const login = useCallback(async () => {
    if (!CLIENT_ID) return
    const verifier = randomVerifier()
    const challenge = encode(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier)))
    sessionStorage.setItem(VERIFIER_KEY, verifier)
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      response_type: 'code',
      redirect_uri: REDIRECT_URI,
      code_challenge_method: 'S256',
      code_challenge: challenge,
      scope: 'user-read-private streaming user-read-playback-state user-modify-playback-state',
    })
    window.location.assign(`https://accounts.spotify.com/authorize?${params}`)
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY)
    setToken(null)
  }, [])

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code')
    const verifier = sessionStorage.getItem(VERIFIER_KEY)
    if (!code || !verifier || !CLIENT_ID) return

    const exchange = async () => {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: CLIENT_ID,
          grant_type: 'authorization_code',
          code,
          redirect_uri: REDIRECT_URI,
          code_verifier: verifier,
        }),
      })
      if (!response.ok) return
      const data = await response.json() as { access_token: string; expires_in: number }
      sessionStorage.setItem(TOKEN_KEY, JSON.stringify({
        accessToken: data.access_token,
        expiresAt: Date.now() + data.expires_in * 1000,
      }))
      sessionStorage.removeItem(VERIFIER_KEY)
      setToken(data.access_token)
      window.history.replaceState({}, '', '/')
    }
    void exchange()
  }, [])

  return { token, isConfigured, login, logout }
}
