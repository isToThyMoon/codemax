import { useQuery } from '@tanstack/react-query'

import { createFileRoute } from '@tanstack/react-router'

function getNames() {
  return fetch('/demo/api/names').then((res) => res.json() as Promise<string[]>)
}

export const Route = createFileRoute('/demo/start/api-request')({
  component: Home,
})

function Home() {
  const { data: names = [] } = useQuery({
    queryKey: ['names'],
    queryFn: getNames,
  })

  return (
    <div className="flex items-center justify-center min-h-screen bg-white p-4">
      <div className="w-full max-w-2xl p-8 rounded-xl bg-white border border-gray-200 shadow-xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Start API Request Demo - Names List
        </h1>
        <ul className="mb-4 space-y-2">
          {names.map((name) => (
            <li
              key={name}
              className="bg-gray-50 border border-gray-100 rounded-lg p-3 shadow-sm"
            >
              <span className="text-lg text-gray-700">{name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
