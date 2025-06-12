'use client'

import { useState, useRef, useEffect } from 'react'
import {
  PaperAirplaneIcon,
  SparklesIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'
import { SparklesIcon as SparklesSolidIcon } from '@heroicons/react/24/solid'
import FreechAvatar from './FreechAvatar'

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
        'Olá! 👋 Eu sou o **Freech**, seu assistente inteligente. Posso ajudar você a:\n\n✅ **Criar tarefas** - "Preciso estudar Python"\n📝 **Fazer anotações** - "Anote que gostei do restaurante X"\n🎯 **Definir metas** - "Quero correr 5km por semana"\n📅 **Agendar compromissos** - "Marcar reunião amanhã às 14h"\n📋 **Organizar sua vida** - "Que tarefas tenho pendentes?"\n\nO que posso fazer por você hoje? 🚀',
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
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
          action.success
            ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
            : 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
        }`}
      >
        {action.success ? (
          <CheckCircleIcon className="w-3 h-3" />
        ) : (
          <XCircleIcon className="w-3 h-3" />
        )}
        <span>{icons[action.name as keyof typeof icons] || '⚡'}</span>
        <span className="capitalize">{action.name.replace(/_/g, ' ')}</span>
      </div>
    )
  }

  return (
    <div className="h-full bg-gradient-main flex flex-col">
      {/* Header */}
      <div className="glass-card m-6 mb-0 rounded-3xl overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-accent flex items-center justify-center shadow-glow-blue">
                <FreechAvatar size="lg" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">CareAI</h1>
                <p className="text-white/60 text-sm">Assistente Inteligente</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-glow-blue"></div>
              <span className="text-green-400 text-sm font-medium">
                Agente Ativo
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 mx-6 my-0 overflow-hidden">
        <div className="h-full dark-card rounded-3xl flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div className={`max-w-[80%] space-y-2`}>
                  {/* Avatar e Nome */}
                  {message.role === 'assistant' && (
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-2xl bg-gradient-accent flex items-center justify-center">
                        <FreechAvatar size="md" />
                      </div>
                      <span className="text-blue-400 text-sm font-semibold">
                        Freech
                      </span>
                    </div>
                  )}

                  {message.role === 'user' && (
                    <div className="flex items-center justify-end space-x-3">
                      <span className="text-white/80 text-sm font-semibold">
                        Você
                      </span>
                      <div className="w-8 h-8 rounded-2xl bg-white/10 flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}

                  {/* Balão da Mensagem */}
                  <div
                    className={`rounded-2xl px-5 py-4 transition-all duration-200 ${
                      message.role === 'user'
                        ? 'glass-active ml-8'
                        : 'dark-card-secondary mr-8'
                    }`}
                  >
                    <div className="text-white text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </div>

                    {/* Ações Executadas */}
                    {message.actions && message.actions.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="flex items-center space-x-2 text-white/60 text-xs mb-3">
                          <SparklesIcon className="w-3 h-3" />
                          <span className="font-medium">Ações executadas:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {message.actions.map((action, index) => (
                            <ActionBadge key={index} action={action} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Timestamp */}
                  <div
                    className={`flex items-center space-x-1 text-white/40 text-xs ${
                      message.role === 'user' ? 'justify-end mr-8' : 'ml-8'
                    }`}
                  >
                    <ClockIcon className="w-3 h-3" />
                    <span>
                      {message.timestamp.toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-2xl bg-gradient-accent flex items-center justify-center">
                      <FreechAvatar size="md" />
                    </div>
                    <span className="text-blue-400 text-sm font-semibold">
                      Freech
                    </span>
                  </div>
                  <div className="dark-card-secondary rounded-2xl px-5 py-4 mr-8">
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      </div>
                      <span className="text-white/60 text-sm">
                        Processando...
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="mx-6 my-6 mt-0">
        <div className="glass-card rounded-3xl p-6">
          <div className="flex items-end space-x-4">
            <div className="flex-1 relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite uma mensagem ou comando... (Ex: 'Crie uma tarefa para estudar React')"
                className="input-dark w-full resize-none min-h-[48px] max-h-32 pr-12"
                rows={1}
                disabled={isLoading}
              />
              {inputValue.length > 0 && (
                <div className="absolute right-3 top-3">
                  <div className="text-xs text-white/40">
                    {inputValue.length}
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={sendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)',
                color: '#ffffff',
              }}
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Sugestões Rápidas */}
          <div className="mt-4 flex flex-wrap gap-2">
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
                className="btn-ghost text-xs px-3 py-2 rounded-xl transition-all duration-200"
                disabled={isLoading}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
