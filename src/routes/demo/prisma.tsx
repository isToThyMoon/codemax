import { createFileRoute, useRouter } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { prisma } from '@/db'

const getTodos = createServerFn({
  method: 'GET',
}).handler(async () => {
  return await prisma.todo.findMany({
    orderBy: { createdAt: 'desc' },
  })
})

const createTodo = createServerFn({
  method: 'POST',
})
  .inputValidator((data: { title: string }) => data)
  .handler(async ({ data }) => {
    return await prisma.todo.create({
      data,
    })
  })

export const Route = createFileRoute('/demo/prisma')({
  component: DemoPrisma,
  loader: async () => await getTodos(),
})

function DemoPrisma() {
  const router = useRouter()
  const todos = Route.useLoaderData() ?? []

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const title = formData.get('title') as string

    if (!title) return

    try {
      await createTodo({ data: { title } })
      router.invalidate()
      ;(e.target as HTMLFormElement).reset()
    } catch (error) {
      console.error('Failed to create todo:', error)
    }
  }

  return (
    <div
      className="flex items-center justify-center min-h-screen p-4"
      style={{
        background:
          'linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 50%, #f5f8ff 100%)',
      }}
    >
      <div
        className="w-full max-w-2xl p-8 rounded-2xl shadow-xl border"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderColor: 'rgba(99, 102, 241, 0.1)',
          boxShadow: '0 20px 60px rgba(99, 102, 241, 0.08), 0 8px 16px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div
          className="flex items-center justify-center gap-4 mb-8 p-5 rounded-xl"
          style={{
            background:
              'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.15)',
          }}
        >
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-indigo-400 via-blue-400 to-indigo-400 rounded-xl blur-xl opacity-30 group-hover:opacity-50 transition duration-500"></div>
            <div className="relative bg-gradient-to-br from-indigo-500 to-blue-500 p-3 rounded-xl shadow-lg">
              <img
                src="/prisma.svg"
                alt="Prisma Logo"
                className="w-8 h-8 transform group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 text-transparent bg-clip-text">
            Prisma Database Demo
          </h1>
        </div>

        <h2 className="text-2xl font-bold mb-5 text-gray-800">Todos</h2>

        <ul className="space-y-3 mb-6">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="rounded-xl p-4 shadow-sm border transition-all hover:shadow-md hover:translate-y-[-2px] cursor-pointer group"
              style={{
                background:
                  'linear-gradient(135deg, rgba(99, 102, 241, 0.04) 0%, rgba(139, 92, 246, 0.04) 100%)',
                borderColor: 'rgba(99, 102, 241, 0.15)',
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-gray-800 group-hover:text-indigo-600 transition-colors">
                  {todo.title}
                </span>
                <span className="text-xs font-medium text-indigo-400 bg-indigo-50 px-2 py-1 rounded-full">#{todo.id}</span>
              </div>
            </li>
          ))}
          {todos.length === 0 && (
            <li className="text-center py-12 text-gray-400 text-sm">
              No todos yet. Create one below!
            </li>
          )}
        </ul>

        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            name="title"
            placeholder="Add a new todo..."
            className="flex-1 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all text-gray-800 placeholder-gray-400 bg-white shadow-sm"
            style={{
              borderColor: 'rgba(99, 102, 241, 0.2)',
            }}
          />
          <button
            type="submit"
            className="px-6 py-3 font-semibold rounded-xl shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-95 whitespace-nowrap"
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: 'white',
            }}
          >
            Add Todo
          </button>
        </form>

        <div
          className="mt-8 p-6 rounded-xl border"
          style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.03) 0%, rgba(139, 92, 246, 0.03) 100%)',
            borderColor: 'rgba(99, 102, 241, 0.15)',
          }}
        >
          <h3 className="text-lg font-semibold mb-2 text-gray-800">
            Powered by Prisma ORM
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Next-generation ORM for Node.js & TypeScript with PostgreSQL
          </p>
          <div className="space-y-2 text-sm">
            <p className="text-gray-700 font-medium">Setup Instructions:</p>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>
                Configure your{' '}
                <code className="px-2 py-1 rounded-lg bg-indigo-50 text-indigo-600 font-mono text-xs border border-indigo-100">
                  DATABASE_URL
                </code>{' '}
                in .env.local
              </li>
              <li>
                Run:{' '}
                <code className="px-2 py-1 rounded-lg bg-indigo-50 text-indigo-600 font-mono text-xs border border-indigo-100">
                  npx prisma generate
                </code>
              </li>
              <li>
                Run:{' '}
                <code className="px-2 py-1 rounded-lg bg-indigo-50 text-indigo-600 font-mono text-xs border border-indigo-100">
                  npx prisma db push
                </code>
              </li>
              <li>
                Optional:{' '}
                <code className="px-2 py-1 rounded-lg bg-indigo-50 text-indigo-600 font-mono text-xs border border-indigo-100">
                  npx prisma studio
                </code>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
