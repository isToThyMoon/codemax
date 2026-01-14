import { Link } from '@tanstack/react-router'
import { Clock, User } from 'lucide-react'

import { type Talk } from 'content-collections'

import { Card, CardContent } from '@/components/ui/card'

interface TalkCardProps {
  talk: Talk
  featured?: boolean
}

export default function TalkCard({ talk, featured = false }: TalkCardProps) {
  return (
    <Link to={`/talks/${talk.slug}`} className="group relative block">
      <Card
        className={`relative overflow-hidden bg-white border border-gray-200 shadow-sm transition-all duration-300
          ${featured ? 'aspect-[16/10]' : 'aspect-[16/9]' }
          hover:border-gray-300 hover:shadow-lg hover:-translate-y-1`}
      >
        {/* Image */}
        <div className="absolute inset-0">
          <img
            src={`/${talk.image}`}
            alt={talk.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>

        {/* Content overlay */}
        <CardContent className="absolute bottom-0 left-0 right-0 p-6 z-10">
          <div className="space-y-3">
            {/* Topics */}
            <div className="flex flex-wrap gap-2">
              {talk.topics.slice(0, 2).map((topic) => (
                <span
                  key={topic}
                  className="px-2.5 py-0.5 text-xs font-medium tracking-wide uppercase bg-white/10 text-white border border-white/20 rounded-full backdrop-blur-sm"
                >
                  {topic}
                </span>
              ))}
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-white group-hover:text-gray-100 transition-colors leading-tight">
              {talk.title}
            </h3>

            {/* Speaker & Duration */}
            <div className="flex items-center gap-4 text-gray-300 text-sm">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span className="font-medium text-white">{talk.speaker}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{talk.duration}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
