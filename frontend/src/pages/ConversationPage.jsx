import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { listMessages, sendMessage } from '../lib/api'
import ConversationSidebar from '../components/conversations/ConversationSidebar'
import MessageBubble from '../components/chat/MessageBubble'
import MessageComposer from '../components/chat/MessageComposer'
import ThinkingIndicator from '../components/chat/ThinkingIndicator'

export default function ConversationPage() {
  const { conversationId } = useParams()
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    setIsLoading(true)
    listMessages(conversationId)
      .then(setMessages)
      .finally(() => setIsLoading(false))
  }, [conversationId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isSending])

  async function handleSend(content) {
    const optimisticMessage = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content,
      citations: [],
    }
    setMessages((prev) => [...prev, optimisticMessage])
    setIsSending(true)
    setError(null)
    try {
      const assistantMessage = await sendMessage(conversationId, content)
      setMessages((prev) => [...prev, assistantMessage])
    } catch {
      setError('Message failed to send. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-57px)]">
      <ConversationSidebar />

      <div className="flex flex-1 flex-col">
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {isLoading ? (
            <p className="text-sm text-slate-500">Loading…</p>
          ) : messages.length === 0 ? (
            <p className="text-sm text-slate-500">Ask your first question below.</p>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {isSending ? <ThinkingIndicator /> : null}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {error ? <p className="px-6 text-sm text-red-400">{error}</p> : null}
        <MessageComposer onSend={handleSend} isSending={isSending} />
      </div>
    </div>
  )
}
