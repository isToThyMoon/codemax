import { useCallback, useId, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useTRPC } from '@/integrations/trpc/react'

export const Route = createFileRoute('/demo/trpc-todo')({
  component: TRPCTodos,
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(
      context.trpc.todos.list.queryOptions(),
    )
  },
})

function TRPCTodos() {
  const inputId = useId()
  const trpc = useTRPC()
  const { data, refetch } = useQuery(trpc.todos.list.queryOptions())

  const [todo, setTodo] = useState('')
  const { mutate: addTodo } = useMutation({
    ...trpc.todos.add.mutationOptions(),
    onSuccess: () => {
      refetch()
      setTodo('')
    },
  })

  const submitTodo = useCallback(() => {
    addTodo({ name: todo })
  }, [addTodo, todo])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-indigo-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-indigo-200/30 to-purple-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative flex items-center justify-center min-h-screen">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              tRPC Todos
            </h1>
            <p className="text-slate-500 text-lg">Manage your tasks with modern style</p>
          </div>

          {/* Main card */}
          <div className="backdrop-blur-xl bg-white/80 rounded-2xl shadow-2xl border border-white/30 overflow-hidden">
            <div className="p-8">
              {/* Input section */}
              <div className="mb-8">
                <label htmlFor={inputId} className="block text-sm font-semibold text-slate-700 mb-3">
                  Add a new task
                </label>
                <div className="flex gap-3">
                  <input
                    id={inputId}
                    type="text"
                    value={todo}
                    onChange={(e) => setTodo(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        submitTodo()
                      }
                    }}
                    placeholder="What needs to be done?"
                    className="flex-1 px-4 py-3 rounded-lg border border-slate-200 bg-white/90 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white transition-all"
                  />
                  <button
                    type="button"
                    disabled={todo.trim().length === 0}
                    onClick={submitTodo}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Todos list */}
              <div>
                <h2 className="text-lg font-semibold text-slate-700 mb-4">
                  Tasks ({data?.length || 0})
                </h2>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {data && data.length > 0 ? (
                    data.map((t, index) => (
                      <div
                        key={t.id}
                        className="group flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-white to-slate-50 border border-slate-200/50 hover:border-indigo-300 hover:shadow-md transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50"
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm">
                          {index + 1}
                        </div>
                        <span className="flex-1 text-slate-700 font-medium">{t.name}</span>
                        <div className="flex-shrink-0 w-2 h-2 rounded-full bg-indigo-400 group-hover:bg-indigo-500 transition-colors"></div>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center py-12 text-center">
                      <div>
                        <div className="text-4xl mb-2">✨</div>
                        <p className="text-slate-500">No tasks yet. Add one to get started!</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Stats footer */}
          <div className="mt-6 text-center text-slate-600 text-sm">
            <p>Powered by tRPC & React Query</p>
          </div>
        </div>
      </div>
    </div>
  )
}
