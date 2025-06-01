'use client'

import { useState, useRef, useEffect } from 'react'
import {
  IoSend,
  IoSparkles,
  IoCheckmarkCircle,
  IoCloseCircle,
} from 'react-icons/io5'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  actions?: Array<{
    name: string
    success: boolean
    message: string
  }>
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        'Olá! 👋 Eu sou o CareAI, seu assistente inteligente. Posso ajudar você a:\n\n✅ **Criar tarefas** - "Preciso estudar Python"\n📝 **Fazer anotações** - "Anote que gostei do restaurante X"\n🎯 **Definir metas** - "Quero correr 5km por semana"\n📅 **Agendar compromissos** - "Marcar reunião amanhã às 14h"\n📋 **Organizar sua vida** - "Que tarefas tenho pendentes?"\n\nO que posso fazer por você hoje? 🚀',
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId] = useState(() => crypto.randomUUID())
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          sessionId,
        }),
      })

      if (!response.ok) {
        throw new Error('Falha na comunicação')
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
        actions: data.actionsExecuted > 0 ? data.functions : undefined,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content:
          '❌ Desculpe, houve um erro na comunicação. Tente novamente em alguns instantes.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const ActionBadge = ({
    action,
  }: {
    action: { name: string; success: boolean; message: string }
  }) => {
    const icons = {
      create_task: '✅',
      create_note: '📝',
      create_goal: '🎯',
      create_event: '📅',
      list_tasks: '📋',
      complete_task: '✔️',
      update_goal_progress: '📊',
    }

    return (
      <div
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
          action.success
            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
            : 'bg-red-500/20 text-red-400 border border-red-500/30'
        }`}
      >
        {action.success ? <IoCheckmarkCircle /> : <IoCloseCircle />}
        <span>{icons[action.name as keyof typeof icons] || '⚡'}</span>
        <span className="capitalize">{action.name.replace('_', ' ')}</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-[#0f1419] text-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 bg-[#1a1f2e]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
            <IoSparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">CareAI</h1>
            <p className="text-sm text-gray-400">Assistente Inteligente</p>
          </div>
          <div className="ml-auto">
            <div className="flex items-center gap-2 text-xs text-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Agente Ativo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] ${
                message.role === 'user' ? 'order-2' : ''
              }`}
            >
              {message.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <IoSparkles className="w-3 h-3" />
                  </div>
                  <span className="text-xs text-gray-400">CareAI</span>
                </div>
              )}

              <div
                className={`rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'bg-[#1a1f2e] border border-gray-800'
                }`}
              >
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.content}
                </div>

                {/* Ações Executadas */}
                {message.actions && message.actions.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <div className="text-xs text-gray-400 mb-2">
                      🤖 Ações executadas:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {message.actions.map((action, index) => (
                        <ActionBadge key={index} action={action} />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="text-xs text-gray-500 mt-1 px-2">
                {message.timestamp.toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 bg-[#1a1f2e] border border-gray-800 rounded-2xl px-4 py-3">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <IoSparkles className="w-3 h-3" />
              </div>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
              </div>
              <span className="text-xs text-gray-400">Processando...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-800 bg-[#1a1f2e]">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite uma mensagem ou comando... (Ex: 'Crie uma tarefa para estudar React')"
              className="w-full bg-[#0f1419] border border-gray-700 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[48px] max-h-32"
              rows={1}
              disabled={isLoading}
            />
            {inputValue.length > 0 && (
              <div className="absolute right-3 top-3">
                <div className="text-xs text-gray-500">{inputValue.length}</div>
              </div>
            )}
          </div>
          <button
            onClick={sendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-xl p-3 transition-all duration-200 transform hover:scale-105 disabled:scale-100"
          >
            <IoSend className="w-5 h-5" />
          </button>
        </div>

        {/* Sugestões rápidas */}
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            '📋 Minhas tarefas',
            '🎯 Criar meta',
            '📝 Nova nota',
            '✅ Marcar tarefa concluída',
          ].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() =>
                setInputValue(suggestion.split(' ').slice(1).join(' '))
              }
              className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1 rounded-lg transition-colors"
              disabled={isLoading}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
