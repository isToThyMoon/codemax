import { useEffect, useRef, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  Send,
  Square,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Loader2,
  Sparkles,
  ArrowUp,
  Paperclip,
  X,
} from 'lucide-react'
import { Streamdown } from 'streamdown'

import { useGuitarRecommendationChat } from '@/lib/demo-ai-hook'
import type { ChatMessages } from '@/lib/demo-ai-hook'
import { useAudioRecorder } from '@/hooks/demo-useAudioRecorder'
import { useTTS } from '@/hooks/demo-useTTS'

import GuitarRecommendation from '@/components/demo-GuitarRecommendation'

import './ai-chat.css'

const SUGGESTIONS = [
  { title: 'Recommend a guitar', subtitle: 'for a beginner playing rock' },
  { title: 'Explain music theory', subtitle: 'basic chords and scales' },
  { title: 'Write a song', subtitle: 'about a rainy day in London' },
  { title: 'Compare', subtitle: 'Fender Stratocaster vs Telecaster' },
]

function InitialLayout({
  children,
  onSuggestionClick,
}: {
  children: React.ReactNode
  onSuggestionClick: (text: string) => void
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 min-h-full">
      <div className="flex flex-col items-center mb-8">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-gray-100">
          <Sparkles className="w-6 h-6 text-gray-800" />
        </div>
        <h1 className="text-3xl font-medium text-gray-800">
          How can I help you today?
        </h1>
      </div>

      <div className="max-w-3xl w-full mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SUGGESTIONS.map((suggestion, index) => (
            <button
              key={index}
              onClick={() =>
                onSuggestionClick(`${suggestion.title} ${suggestion.subtitle}`)
              }
              className="text-left p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors bg-white group"
            >
              <div className="font-medium text-gray-900 group-hover:text-black">
                {suggestion.title}
              </div>
              <div className="text-gray-500 text-sm opacity-80 group-hover:opacity-100">
                {suggestion.subtitle}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="w-full max-w-3xl">{children}</div>
    </div>
  )
}

function ChattingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="sticky bottom-0 left-0 right-0 z-10 pb-6 pt-2">
      <div className="max-w-3xl mx-auto w-full px-4">{children}</div>
      <div className="text-center mt-2">
        <p className="text-xs text-gray-400">
          AI can make mistakes. Check important info.
        </p>
      </div>
    </div>
  )
}

function Messages({
  messages,
  playingId,
  onSpeak,
  onStopSpeak,
}: {
  messages: ChatMessages
  playingId: string | null
  onSpeak: (text: string, id: string) => void
  onStopSpeak: () => void
}) {
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight
    }
  }, [messages])

  if (!messages.length) {
    return null
  }

  // Extract text content from message parts
  const getTextContent = (
    parts: ChatMessages[number]['parts'],
  ): string | null => {
    for (const part of parts) {
      if (part.type === 'text' && part.content) {
        return part.content
      }
    }
    return null
  }

  return (
    <div
      ref={messagesContainerRef}
      className="flex-1 overflow-y-auto pb-4 min-h-0"
    >
      <div className="max-w-3xl mx-auto w-full px-4 pt-8">
        {messages.map((message) => {
          const textContent = getTextContent(message.parts)
          const isPlaying = playingId === message.id

          return (
            <div key={message.id} className="py-5 text-base">
              <div
                className={`flex gap-4 max-w-3xl mx-auto w-full ${
                  message.role === 'user' ? 'justify-end' : ''
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-gray-800" />
                    </div>
                  </div>
                )}
                <div
                  className={`min-w-0 max-w-[85%] ${
                    message.role === 'user'
                      ? 'bg-[#f4f4f4] px-5 py-2.5 rounded-[26px] text-gray-900'
                      : 'text-gray-900 pl-1'
                  }`}
                >
                  {message.parts.map((part, index) => {
                    if (part.type === 'text' && part.content) {
                      return (
                        <div
                          className="flex-1 min-w-0 prose max-w-none prose-neutral prose-p:leading-relaxed prose-pre:bg-gray-50 prose-pre:border prose-pre:border-gray-200"
                          key={index}
                        >
                          <Streamdown>{part.content}</Streamdown>
                        </div>
                      )
                    }
                    // Guitar recommendation card
                    if (
                      part.type === 'tool-call' &&
                      part.name === 'recommendGuitar' &&
                      part.output
                    ) {
                      return (
                        <div key={part.id} className="max-w-[80%] mx-auto mt-4">
                          <GuitarRecommendation id={String(part.output?.id)} />
                        </div>
                      )
                    }
                    return null
                  })}
                </div>
                {/* TTS button for assistant messages */}
                {message.role === 'assistant' && textContent && (
                  <button
                    onClick={() =>
                      isPlaying
                        ? onStopSpeak()
                        : onSpeak(textContent, message.id)
                    }
                    className="flex-shrink-0 p-1.5 text-gray-300 hover:text-black transition-colors self-start mt-1 rounded-md hover:bg-gray-100"
                    title={isPlaying ? 'Stop speaking' : 'Read aloud'}
                  >
                    {isPlaying ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ChatPage() {
  const [input, setInput] = useState('')
  const [isErrorHidden, setIsErrorHidden] = useState(false)

  const { isRecording, isTranscribing, startRecording, stopRecording } =
    useAudioRecorder()
  const { playingId, speak, stop: stopTTS } = useTTS()

  const { messages, sendMessage, isLoading, stop, error, reload } =
    useGuitarRecommendationChat()

  useEffect(() => {
    if (error) {
      setIsErrorHidden(false)
    }
  }, [error])

  const handleMicClick = async () => {
    if (isRecording) {
      const transcribedText = await stopRecording()
      if (transcribedText) {
        setInput((prev) =>
          prev ? `${prev} ${transcribedText}` : transcribedText,
        )
      }
    } else {
      await startRecording()
    }
  }

  const handleSuggestionClick = (text: string) => {
    setInput(text)
    // Optional: auto send? Let's just fill for now, mimicking standard behavior
    // sendMessage(text)
  }

  const inputForm = (
    <div className="space-y-3">
      {error && !isErrorHidden && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-sm font-medium text-red-900">请求失败</div>
              <div className="mt-1 text-sm text-red-800 break-words">
                {error.message || 'Unknown error'}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsErrorHidden(true)}
              className="p-1.5 text-red-700 hover:text-red-900 hover:bg-red-100 rounded-md transition-colors"
              title="Hide error"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => reload()}
              disabled={isLoading}
              className="px-3 py-1.5 bg-white border border-red-200 hover:bg-red-100 text-red-800 rounded-full text-sm font-medium transition-colors disabled:opacity-50"
            >
              重试
            </button>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center">
          <button
            onClick={stop}
            className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-full text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
          >
            <Square className="w-3 h-3 fill-current" />
            Stop generating
          </button>
        </div>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (input.trim()) {
            sendMessage(input)
            setInput('')
          }
        }}
      >
        <div className="relative max-w-3xl mx-auto bg-[#f4f4f4] rounded-[26px] p-3">
          <div className="flex flex-col">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message..."
              className="w-full bg-transparent px-2 py-1 text-base text-gray-900 placeholder-gray-500 focus:outline-none resize-none overflow-hidden max-h-[200px]"
              rows={1}
              style={{ minHeight: '24px' }}
              disabled={isLoading}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement
                target.style.height = 'auto'
                target.style.height = Math.min(target.scrollHeight, 200) + 'px'
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && input.trim()) {
                  e.preventDefault()
                  sendMessage(input)
                  setInput('')
                }
              }}
            />
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-full transition-colors"
                  title="Attach file"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleMicClick}
                  disabled={isLoading || isTranscribing}
                  className={`p-2 rounded-full transition-colors ${
                    isRecording
                      ? 'bg-red-50 text-red-500'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200'
                  } disabled:opacity-50`}
                  title={isRecording ? 'Stop recording' : 'Start recording'}
                >
                  {isTranscribing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : isRecording ? (
                    <MicOff className="w-5 h-5" />
                  ) : (
                    <Mic className="w-5 h-5" />
                  )}
                </button>
              </div>
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2 bg-black text-white rounded-full hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 transition-colors focus:outline-none"
              >
                <ArrowUp className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )

  return (
    <div className="relative flex h-[calc(100vh-80px)] bg-white">
      <div className="flex-1 flex flex-col min-h-0">
        {messages.length > 0 ? (
          <>
            <Messages
              messages={messages}
              playingId={playingId}
              onSpeak={speak}
              onStopSpeak={stopTTS}
            />
            <ChattingLayout>{inputForm}</ChattingLayout>
          </>
        ) : (
          <InitialLayout onSuggestionClick={handleSuggestionClick}>
            {inputForm}
          </InitialLayout>
        )}
      </div>
    </div>
  )
}

export const Route = createFileRoute('/demo/ai-chat')({
  component: ChatPage,
})
