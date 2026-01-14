import { createFileRoute } from '@tanstack/react-router'

import { allTalks } from 'content-collections'

import TalkCard from '@/components/TalkCard'
import RemyAssistant from '@/components/RemyAssistant'

export const Route = createFileRoute('/talks/')({
  component: TalksPage,
})

function TalksPage() {
  return (
    <>
      <RemyAssistant />
      <div className="min-h-screen bg-white">
        {/* Hero section */}
        <div className="relative py-16 px-6 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
              Conference <span className="text-gray-400 italic">Sessions</span>
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Immerse yourself in masterclasses and demonstrations covering
              every aspect of artisan baking and pastry.
            </p>
          </div>
        </div>

        {/* Talks grid */}
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {allTalks.map((talk) => (
              <TalkCard key={talk.slug} talk={talk} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
