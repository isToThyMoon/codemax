import { createFileRoute } from '@tanstack/react-router'
import { useStore } from '@tanstack/react-store'

import { fullName, store } from '@/lib/demo-store'

export const Route = createFileRoute('/demo/store')({
  component: DemoStore,
})

function FirstName() {
  const firstName = useStore(store, (state) => state.firstName)
  return (
    <input
      type="text"
      value={firstName}
      onChange={(e) =>
        store.setState((state) => ({ ...state, firstName: e.target.value }))
      }
      className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/5 shadow-sm"
    />
  )
}

function LastName() {
  const lastName = useStore(store, (state) => state.lastName)
  return (
    <input
      type="text"
      value={lastName}
      onChange={(e) =>
        store.setState((state) => ({ ...state, lastName: e.target.value }))
      }
      className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/5 shadow-sm"
    />
  )
}

function FullName() {
  const fName = useStore(fullName)
  return (
    <div className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 font-medium">
      {fName}
    </div>
  )
}

function DemoStore() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-white p-4">
      <div className="w-full max-w-lg p-8 rounded-xl bg-white border border-gray-200 shadow-xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Store Example</h1>
        <div className="flex flex-col gap-4">
          <FirstName />
          <LastName />
          <FullName />
        </div>
      </div>
    </div>
  )
}
