import { useCallback, useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'

type Todo = {
  id: number
  title: string
}

export const Route = createFileRoute('/demo/mcp-todos')({
  component: ORPCTodos,
})

function ORPCTodos() {
  const [todos, setTodos] = useState<Todo[]>([])

  useEffect(() => {
    const eventSource = new EventSource('/demo/api/mcp-todos')
    eventSource.onmessage = (event) => {
      setTodos(JSON.parse(event.data))
    }
    return () => eventSource.close()
  }, [])

  const [todo, setTodo] = useState('')

  const submitTodo = useCallback(async () => {
    await fetch('/demo/api/mcp-todos', {
      method: 'POST',
      body: JSON.stringify({ title: todo }),
    })
    setTodo('')
  }, [todo])

  return (
    <div className="flex items-center justify-center min-h-screen bg-white p-4">
      <div className="w-full max-w-2xl p-8 rounded-xl bg-white border border-gray-200 shadow-xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          MCP Todos list
        </h1>
        <ul className="mb-6 space-y-2">
          {todos?.map((t) => (
            <li
              key={t.id}
              className="bg-gray-50 border border-gray-100 rounded-lg p-3 shadow-sm"
            >
              <span className="text-lg text-gray-700">{t.title}</span>
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
