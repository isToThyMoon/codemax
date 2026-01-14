import { useState } from 'react'

import { useChat, useMessages } from '@/hooks/demo.useChat'

import Messages from './demo.messages'

export default function ChatArea() {
  const { sendMessage } = useChat()

  const messages = useMessages()

  const [message, setMessage] = useState('')
  const [user, setUser] = useState('Alice')

  const postMessage = () => {
    if (message.trim().length) {
      sendMessage(message, user)
      setMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      postMessage()
    }
  }

  return (
    <>
      <div className="px-4 py-6 space-y-4">
        <Messages messages={messages} user={user} />
      </div>

      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <div className="flex items-center space-x-3">
          <select
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/5 shadow-sm"
          >
            <option value="Alice">Alice</option>
            <option value="Bob">Bob</option>
          </select>

          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/5 shadow-sm"
            />
          </div>

          <button
            onClick={postMessage}
            disabled={message.trim() === ''}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            Send
          </button>
        </div>
      </div>
    </>
  )
}
