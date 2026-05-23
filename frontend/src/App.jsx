import { useState } from 'react'
import apiClient from './lib/apiClient'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const starterMessages = [
  {
    id: 1,
    role: 'bot',
    text: 'Hi, I am Car Expert Chatbot. Ask me about cars, SUVs, mileage, safety, or maintenance.',
  },
]

// Small prompt chips make the UI feel polished and help with quick testing.
const quickPrompts = [
  'Best SUV under 15 lakh?',
  'Which is the best family car in India?',
  'Which is better for highway driving: SUV or sedan?',
  'What is ABS in cars?',
  'What is turbo engine in cars?',
  'What is horsepower in a car?',
  'EV vs petrol for city use?',
  'How often should I service my car?',
  'Best mileage car under 10 lakh?',
  'Which car is best for beginners?',
  'What is the difference between petrol and diesel cars?',
  'Best electric car under 20 lakh?',
  'Which hatchback has low maintenance?',
  'What are airbags in cars?',
  'Manual vs automatic transmission?',
  'Which SUV has best safety features?',
  'How to improve car mileage?',
  'Best sedan for long drives?',
  'When should car tyres be replaced?',
  'Which car is best for daily office use?'
]

// Pick a few prompts at random so the UI stays compact and fresh.
const getRandomPrompts = (prompts, count) => {
  const shuffledPrompts = [...prompts].sort(() => Math.random() - 0.5)
  return shuffledPrompts.slice(0, count)
}

export default function App() {
  const [messages, setMessages] = useState(starterMessages)
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [visiblePrompts, setVisiblePrompts] = useState(() => getRandomPrompts(quickPrompts, 3))

  // This handler sends the message to the FastAPI backend, waits for the
  // response, and then adds the bot reply to the chat history.
  const handleSendMessage = async (event) => {
    event.preventDefault()

    const trimmedMessage = inputValue.trim()
    if (!trimmedMessage || isLoading) {
      return
    }

    const userMessage = {
      id: Date.now(),
      role: 'user',
      text: trimmedMessage,
    }

    setMessages((currentMessages) => [...currentMessages, userMessage])
    setInputValue('')
    setIsLoading(true)
    setVisiblePrompts(getRandomPrompts(quickPrompts, 3))

    try {
      const response = await apiClient.post('/chat', {
        message: trimmedMessage,
      })

      const botReply = response.data?.response || 'No response received from the assistant.'

      const botMessage = {
        id: Date.now() + 1,
        role: 'bot',
        text: botReply,
      }

      setMessages((currentMessages) => [...currentMessages, botMessage])
    } catch (error) {
      const errorMessage =
        error?.response?.data?.detail ||
        error?.response?.data ||
        'Something went wrong while connecting to the backend.'

      const botMessage = {
        id: Date.now() + 1,
        role: 'bot',
        text: errorMessage,
      }

      setMessages((currentMessages) => [...currentMessages, botMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearChat = () => {
    setMessages(starterMessages)
    setInputValue('')
    setIsLoading(false)
  }

  return (
    <main className="min-h-screen px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-4xl items-center justify-center">
        <section className="flex w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
          <header className="border-b border-slate-200 bg-white px-5 py-5 text-slate-900 sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-slate-900 sm:text-[1.7rem]">
                  Car Expert Chatbot
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Ask car-related questions only.
                </p>
              </div>

              <button
                type="button"
                onClick={handleClearChat}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Clear chat
              </button>
            </div>
          </header>

          <div className="flex-1 space-y-4 overflow-y-auto bg-blue-50/70 px-5 py-5 sm:px-6" style={{ minHeight: '28rem', maxHeight: '25rem' }}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm sm:text-base ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'border border-blue-100 bg-blue-100/70 text-slate-800'
                  }`}
                >
                  {message.role === 'user' ? (
                    <p className="whitespace-pre-wrap">{message.text}</p>
                  ) : (
                    <div className="space-y-3 [&_*]:m-0 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 [&_a]:text-blue-700 [&_a]:underline">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.text}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading ? (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-blue-100 bg-blue-100/70 px-4 py-3 text-sm text-slate-600 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.2s]" />
                    <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.1s]" />
                    <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-blue-500" />
                  </div>
                  <p className="mt-2">Bot is typing...</p>
                </div>
              </div>
            ) : null}
          </div>

          <footer className="border-t border-slate-200 bg-white p-4 sm:p-5">
            <form onSubmit={handleSendMessage} className="space-y-3">
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="message"
                  type="text"
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  placeholder="Ask something like: Best sedan for city driving?"
                  className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-full bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  Send
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
                {visiblePrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => setInputValue(prompt)}
                    className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-900 transition hover:border-blue-300 hover:bg-blue-100"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </form>
          </footer>
        </section>
      </div>
    </main>
  )
}
