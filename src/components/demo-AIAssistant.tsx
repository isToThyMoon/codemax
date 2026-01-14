import { useEffect, useRef, useState } from 'react'
import { useStore } from '@tanstack/react-store'
import { Store } from '@tanstack/store'

import { Send, X, ChevronRight, BotIcon } from 'lucide-react'
import { Streamdown } from 'streamdown'

import { useGuitarRecommendationChat } from '@/lib/demo-ai-hook'
import type { ChatMessages } from '@/lib/demo-ai-hook'

import GuitarRecommendation from './demo-GuitarRecommendation'

export const showAIAssistant = new Store(false)

function Messages({ messages }: { messages: ChatMessages }) {
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight
    }
  }, [messages])

  if (!messages.length) {
    return (
    <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
      Ask me anything! I'm here to help.
    </div>
    )
  }

  return (
    <div ref={messagesContainerRef} className="flex-1 overflow-y-auto">
      {messages.map(({ id, role, parts }) => (
        <div
          key={id}
          className={`py-3 ${
            role === 'assistant'
              ? 'bg-slate-50'
              : 'bg-transparent'
          }`}
        >
          {parts.map((part, index) => {
            if (part.type === 'text' && part.content) {
              return (
                <div key={index} className="flex items-start gap-3 px-4">
                  {role === 'assistant' ? (
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-medium text-white flex-shrink-0 shadow-sm">
                      AI
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-600 flex-shrink-0">
                      Y
                    </div>
                  )}
                  <div className="flex-1 min-w-0 text-slate-700 prose prose-slate prose-sm max-w-none">
                    <Streamdown>{part.content}</Streamdown>
                  </div>
                </div>
              )
            }
            if (
              part.type === 'tool-call' &&
              part.name === 'recommendGuitar' &&
              part.output
            ) {
              return (
                <div key={part.id} className="max-w-[80%] mx-auto">
                  <GuitarRecommendation id={String(part.output?.id)} />
                </div>
              )
            }
          })}
        </div>
      ))}
    </div>
  )
}

export default function AIAssistant() {
  const isOpen = useStore(showAIAssistant)
  const { messages, sendMessage } = useGuitarRecommendationChat()
  const [input, setInput] = useState('')

  return (
    <div className="relative z-50">
      <button
        onClick={() => showAIAssistant.setState((state) => !state)}
        className="group w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-white border border-blue-100 text-slate-700 hover:border-blue-500 hover:text-blue-600 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
            <BotIcon size={20} />
          </div>
          <span className="font-semibold text-sm">AI Assistant</span>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
      </button>

      {isOpen && (
        <div className="absolute bottom-0 left-full ml-4 w-[700px] h-[600px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-white/80 backdrop-blur-sm">
            <h3 className="font-semibold text-slate-800">AI Assistant</h3>
            <button
              onClick={() => showAIAssistant.setState((state) => !state)}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-100 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <Messages messages={messages} />

          <div className="p-4 border-t border-slate-100 bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (input.trim()) {
                  sendMessage(input)
                  setInput('')
                }
              }}
            >
              <div className="relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-4 pr-12 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 resize-none overflow-hidden transition-all"
                  rows={1}
                  style={{ minHeight: '44px', maxHeight: '120px' }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement
                    target.style.height = 'auto'
                    target.style.height =
                      Math.min(target.scrollHeight, 120) + 'px'
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey && input.trim()) {
                      e.preventDefault()
                      sendMessage(input)
                      setInput('')
                    }
                  }}
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-600 hover:text-blue-700 disabled:text-slate-300 transition-colors focus:outline-none hover:bg-blue-50 rounded-lg"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
