import { Link } from '@tanstack/react-router'
import { MapPin } from 'lucide-react'

import { type Speaker } from 'content-collections'

import { Card, CardContent } from '@/components/ui/card'

interface SpeakerCardProps {
  speaker: Speaker
  featured?: boolean
}

export default function SpeakerCard({
  speaker,
  featured = false,
}: SpeakerCardProps) {
  return (
    <Link to={`/speakers/${speaker.slug}`} className="group relative block">
      <Card
        className={`relative overflow-hidden bg-white border border-gray-200 shadow-sm transition-all duration-300
          ${featured ? 'aspect-square' : 'aspect-square'}
          hover:border-gray-300 hover:shadow-lg hover:-translate-y-1`}
      >
        {/* Headshot */}
        <div className="absolute inset-0">
          <img
            src={`/${speaker.headshot}`}
            alt={speaker.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
        </div>

        {/* Content overlay */}
        <CardContent className="absolute bottom-0 left-0 right-0 p-6 z-10">
          <div className="space-y-2">
            {/* Specialty tag */}
            <span className="inline-block px-3 py-1 text-xs font-medium tracking-wide uppercase bg-white/90 text-gray-900 rounded-lg backdrop-blur-sm shadow-sm">
              {speaker.specialty}
            </span>

            {/* Name */}
            <h3 className="text-2xl font-bold text-white group-hover:text-white/90 transition-colors">
              {speaker.name}
            </h3>

            {/* Title & Restaurant */}
            <p className="text-gray-200 text-sm font-medium">{speaker.title}</p>

            {/* Location */}
            <div className="flex items-center gap-2 text-gray-300 text-xs">
              <MapPin className="w-3.5 h-3.5" />
              <span>
                {speaker.restaurant}, {speaker.location}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
