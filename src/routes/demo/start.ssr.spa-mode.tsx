import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { getPunkSongs } from '@/data/demo.punk-songs'

export const Route = createFileRoute('/demo/start/ssr/spa-mode')({
  ssr: false,
  component: RouteComponent,
})

function RouteComponent() {
  const [punkSongs, setPunkSongs] = useState<
    Awaited<ReturnType<typeof getPunkSongs>>
  >([])

  useEffect(() => {
    getPunkSongs().then(setPunkSongs)
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4 text-slate-900">
      <div className="w-full max-w-2xl p-8 rounded-2xl bg-white shadow-[0_20px_50px_rgb(0,0,0,0.05)] border border-slate-100">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
          SPA Mode - Punk Songs
        </h1>
        <ul className="space-y-3">
          {punkSongs.map((song) => (
            <li
              key={song.id}
              className="bg-slate-50 border border-slate-100 rounded-xl p-4 hover:border-pink-200 hover:shadow-lg hover:shadow-pink-500/5 transition-all duration-300"
            >
              <div className="text-lg text-slate-800 font-semibold mb-1">
                {song.name}
              </div>
              <div className="text-slate-500 text-sm font-medium">
                {song.artist}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
