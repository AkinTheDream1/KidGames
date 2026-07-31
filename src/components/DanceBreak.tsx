import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ExternalLink, Heart, LogIn, Music2, Pause, Play, X } from 'lucide-react'
import { useSpotifyAuth } from '../hooks/useSpotifyAuth'
import { useGameStore } from '../stores/gameStore'
import { NumberCharacter } from './NumberCharacter'

interface SpotifyTrack {
  id: string
  name: string
  artists: { name: string }[]
  album: { images: { url: string }[] }
  external_urls: { spotify: string }
  preview_url: string | null
}

const FALLBACK_TRACK = {
  name: 'Numberblocks Dance Party',
  artist: 'Find a favorite counting song',
  url: 'https://open.spotify.com/search/Numberblocks',
}

export function DanceBreak() {
  const completeDance = useGameStore((state) => state.completeDance)
  const [countdown, setCountdown] = useState(3)
  const [track, setTrack] = useState<SpotifyTrack | null>(null)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const { token, isConfigured, login } = useSpotifyAuth()

  useEffect(() => {
    if (countdown <= 0) return
    const timer = window.setTimeout(() => setCountdown((value) => value - 1), 900)
    return () => window.clearTimeout(timer)
  }, [countdown])

  useEffect(() => {
    if (!token) return
    const loadTrack = async () => {
      const response = await fetch(
        `https://api.spotify.com/v1/search?${new URLSearchParams({ q: 'Numberblocks', type: 'track', limit: '10' })}`,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      if (!response.ok) return
      const result = await response.json() as { tracks: { items: SpotifyTrack[] } }
      const items = result.tracks.items
      if (items.length) setTrack(items[Math.floor(Math.random() * Math.min(items.length, 5))])
    }
    void loadTrack()
  }, [token])

  useEffect(() => () => audio?.pause(), [audio])

  const togglePreview = async () => {
    if (!track?.preview_url) return
    if (audio && playing) {
      audio.pause()
      setPlaying(false)
      return
    }
    const player = audio ?? new Audio(track.preview_url)
    player.onended = () => setPlaying(false)
    setAudio(player)
    try {
      await player.play()
      setPlaying(true)
    } catch {
      setPlaying(false)
    }
  }

  const finish = () => {
    audio?.pause()
    completeDance()
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#38336f]/75 p-4 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label="Dance break"
    >
      <motion.div
        initial={{ y: 30, scale: 0.95 }}
        animate={{ y: 0, scale: 1 }}
        className="relative flex max-h-[94vh] w-full max-w-3xl flex-col overflow-auto rounded-[2.5rem] bg-[#fffaf2] p-6 shadow-2xl sm:p-10"
      >
        <button onClick={finish} className="icon-button absolute right-5 top-5 z-10 bg-white text-slate-700" aria-label="Close dance break">
          <X size={22} />
        </button>

        <AnimatePresence mode="wait">
          {countdown > 0 ? (
            <motion.div key="countdown" exit={{ opacity: 0, scale: 1.4 }} className="grid min-h-[460px] place-items-center text-center">
              <div>
                <p className="mb-3 font-extrabold uppercase tracking-[0.2em] text-[#7768d2]">Wiggle time</p>
                <h2 className="font-display text-4xl font-bold text-slate-900 sm:text-6xl">Time to DANCE!</h2>
                <motion.div
                  key={countdown}
                  initial={{ scale: 0.3, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="mx-auto my-8 grid h-36 w-36 place-items-center rounded-full bg-[#f5b83b] font-display text-8xl font-bold text-white shadow-[0_10px_0_#d79014]"
                >
                  {countdown}
                </motion.div>
                <p className="text-xl font-bold text-[#6c7390]">Stand up and find some space!</p>
              </div>
            </motion.div>
          ) : (
            <motion.div key="party" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center">
              <div className="mb-5 rounded-full bg-[#efeaff] px-4 py-2 text-sm font-extrabold uppercase tracking-[0.16em] text-[#6453c4]">Dance break</div>
              <h2 className="text-center font-display text-4xl font-bold text-slate-900 sm:text-5xl">Shake, count, smile!</h2>
              <div className="my-3 h-48">
                <NumberCharacter number={5} mood="dancing" />
              </div>

              <div className="flex w-full max-w-xl items-center gap-4 rounded-3xl bg-white p-4 shadow-[0_8px_30px_rgba(71,61,117,.12)]">
                {track?.album.images[0] ? (
                  <img src={track.album.images[0].url} alt="" className="h-16 w-16 rounded-2xl object-cover" />
                ) : (
                  <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-[#1ed760] text-white"><Music2 size={28} /></div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-lg font-bold text-slate-900">{track?.name ?? FALLBACK_TRACK.name}</p>
                  <p className="truncate text-sm font-bold text-[#6c7390]">{track?.artists.map((artist) => artist.name).join(', ') ?? FALLBACK_TRACK.artist}</p>
                </div>
                {track?.preview_url ? (
                  <button onClick={togglePreview} className="grid h-13 w-13 shrink-0 place-items-center rounded-full bg-[#1ed760] text-white" aria-label={playing ? 'Pause song preview' : 'Play song preview'}>
                    {playing ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}
                  </button>
                ) : (
                  <a href={track?.external_urls.spotify ?? FALLBACK_TRACK.url} target="_blank" rel="noreferrer" className="grid h-13 w-13 shrink-0 place-items-center rounded-full bg-[#1ed760] text-white" aria-label="Open song in Spotify">
                    <ExternalLink size={21} />
                  </a>
                )}
              </div>

              {!token && (
                <div className="mt-3 text-center">
                  {isConfigured ? (
                    <button onClick={login} className="inline-flex min-h-11 items-center gap-2 px-4 font-extrabold text-[#176c48]">
                      <LogIn size={18} /> Connect Spotify for Numberblocks songs
                    </button>
                  ) : (
                    <p className="text-sm font-bold text-[#6c7390]">Add a Spotify client ID to choose songs in the app.</p>
                  )}
                </div>
              )}

              <button onClick={finish} className="primary-button mt-6">
                <Heart size={22} fill="currentColor" /> Great moves! Keep learning
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
