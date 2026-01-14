import { useCallback, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation } from '@tanstack/react-query'

export const Route = createFileRoute('/demo/tanstack-query')({
  component: TanStackQueryDemo,
})

type Todo = {
  id: number
  name: string
}

function TanStackQueryDemo() {
  const { data, refetch } = useQuery<Todo[]>({
    queryKey: ['todos'],
    queryFn: () => fetch('/demo/api/tq-todos').then((res) => res.json()),
    initialData: [],
  })

  const { mutate: addTodo } = useMutation({
    mutationFn: (todo: string) =>
      fetch('/demo/api/tq-todos', {
        method: 'POST',
        body: JSON.stringify(todo),
      }).then((res) => res.json()),
    onSuccess: () => refetch(),
  })

  const [todo, setTodo] = useState('')

  const submitTodo = useCallback(async () => {
    await addTodo(todo)
    setTodo('')
  }, [addTodo, todo])

  return (
    <div className="flex items-center justify-center min-h-screen bg-white p-4">
      <div className="w-full max-w-2xl p-8 rounded-xl bg-white border border-gray-200 shadow-xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          TanStack Query Todos list
        </h1>
        <ul className="mb-6 space-y-2">
          {data?.map((t) => (
            <li
              key={t.id}
              className="bg-gray-50 border border-gray-100 rounded-lg p-3 shadow-sm"
            >
              <span className="text-lg text-gray-700">{t.name}</span>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-3">
          <input
            type="text"
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                submitTodo()
              }
            }}
            placeholder="Enter a new todo..."
            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/5 shadow-sm"
          />
          <button
            disabled={todo.trim().length === 0}
            onClick={submitTodo}
            className="bg-black hover:bg-gray-800 disabled:bg-gray-100 disabled:text-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Add todo
          </button>
        </div>
      </div>
    </div>
  )
}
