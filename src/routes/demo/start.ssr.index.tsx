import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/demo/start/ssr/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4 text-slate-900">
      <div className="w-full max-w-2xl p-8 rounded-2xl bg-white shadow-[0_20px_50px_rgb(0,0,0,0.05)] border border-slate-100">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
          SSR Demos
        </h1>
        <div className="flex flex-col gap-4">
          <Link
            to="/demo/start/ssr/spa-mode"
            className="group flex items-center justify-center text-xl font-bold py-6 px-8 rounded-xl bg-white border-2 border-pink-100 hover:border-pink-500 text-slate-700 hover:text-pink-600 shadow-sm hover:shadow-lg hover:shadow-pink-500/10 transform transition-all duration-300 hover:-translate-y-1"
          >
            SPA Mode
          </Link>
          <Link
            to="/demo/start/ssr/full-ssr"
            className="group flex items-center justify-center text-xl font-bold py-6 px-8 rounded-xl bg-white border-2 border-purple-100 hover:border-purple-500 text-slate-700 hover:text-purple-600 shadow-sm hover:shadow-lg hover:shadow-purple-500/10 transform transition-all duration-300 hover:-translate-y-1"
          >
            Full SSR
          </Link>
          <Link
            to="/demo/start/ssr/data-only"
            className="group flex items-center justify-center text-xl font-bold py-6 px-8 rounded-xl bg-white border-2 border-emerald-100 hover:border-emerald-500 text-slate-700 hover:text-emerald-600 shadow-sm hover:shadow-lg hover:shadow-emerald-500/10 transform transition-all duration-300 hover:-translate-y-1"
          >
            Data Only
          </Link>
        </div>
      </div>
    </div>
  )
}
