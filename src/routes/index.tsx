import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowRight,
  Bot,
  Database,
  ImageIcon,
  LayoutTemplate,
  MessageSquare,
  Zap,
} from 'lucide-react'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-24 px-6 border-b border-gray-100">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full bg-gray-100 border border-gray-200 text-gray-600 text-sm font-medium">
            <span className="flex h-2 w-2 rounded-full bg-black"></span>
            <span>v1.0.0 Alpha</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
            Modern Full-Stack <span className="text-gray-400">Starter</span>
          </h1>

          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            A production-ready template featuring TanStack Router, React Query,
            and AI integrations. Built for speed and scalability.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/demo/ai-chat"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-black text-white font-medium hover:bg-gray-800 transition-colors"
            >
              <Bot className="w-5 h-5" />
              Try AI Chat
            </Link>
            <Link
              to="/demo/start/server-funcs"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-200 text-gray-900 font-medium hover:bg-gray-50 transition-colors"
            >
              <Zap className="w-5 h-5" />
              Explore Features
            </Link>
          </div>
        </div>
      </section>

      {/* Demos Grid */}
      <section className="py-20 px-6 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center tracking-tight">
            Explore Capabilities
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DemoCard
              to="/demo/ai-chat"
              title="AI Chat"
              description="Real-time streaming chat interface with markdown support and tool calling."
              icon={<MessageSquare className="w-6 h-6" />}
            />
            <DemoCard
              to="/demo/ai-image"
              title="Image Generation"
              description="Generate images using DALL-E 3 with prompt revision and download."
              icon={<ImageIcon className="w-6 h-6" />}
            />
            <DemoCard
              to="/demo/db-chat"
              title="Database Chat"
              description="Interact with your database using natural language queries."
              icon={<Database className="w-6 h-6" />}
            />
            <DemoCard
              to="/demo/start/server-funcs"
              title="Server Functions"
              description="Type-safe RPC calls directly from your components."
              icon={<Zap className="w-6 h-6" />}
            />
            <DemoCard
              to="/demo/start/ssr"
              title="SSR & Streaming"
              description="Full server-side rendering with suspense and streaming."
              icon={<LayoutTemplate className="w-6 h-6" />}
            />
            <DemoCard
              to="/demo/table"
              title="Data Tables"
              description="Powerful tables with sorting, filtering, and pagination."
              icon={<Database className="w-6 h-6" />}
            />
          </div>
        </div>
      </section>
    </div>
  )
}

function DemoCard({
  to,
  title,
  description,
  icon,
}: {
  to: string
  title: string
  description: string
  icon: React.ReactNode
}) {
  return (
    <Link
      to={to}
      className="group p-6 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200"
    >
      <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center text-gray-900 mb-4 group-hover:bg-black group-hover:text-white transition-colors">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
        {title}
        <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
      </h3>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    </Link>
  )
}
