'use client'

import { useState, useEffect, useRef } from 'react'
import { store } from '@/lib/store'
import { ChatMessage } from '@/types'
import { formatTime } from '@/lib/utils'
import { PaperAirplaneIcon, SparklesIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadMessages()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadMessages = () => {
    const chatMessages = store.getChatMessages()
    if (chatMessages.length === 0) {
      // Adicionar mensagem de boas-vindas
      const welcomeMessage = store.addChatMessage({
        content:
          'Olá! Eu sou o CareAI, seu assistente pessoal inteligente. Posso ajudá-lo a:\n\n✅ Criar e organizar tarefas\n📝 Adicionar notas importantes\n🎯 Definir e acompanhar metas\n📅 Agendar eventos\n📊 Analisar sua produtividade\n\nComo posso ajudá-lo hoje?',
        type: 'assistant',
      })
      setMessages([welcomeMessage])
    } else {
      setMessages(chatMessages)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Adicionar mensagem do usuário
    const userMessage = store.addChatMessage({
      content: input,
      type: 'user',
    })

    setMessages((prev) => [...prev, userMessage])
    const userInput = input
    setInput('')
    setIsTyping(true)

    // Simular processamento do AI
    setTimeout(() => {
      const response = processAIResponse(userInput)
      const aiMessage = store.addChatMessage({
        content: response.content,
        type: 'assistant',
        context: response.context,
      })

      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)

      // Executar ação se necessário
      if (response.context?.actionType) {
        executeAction(response.context)
      }
    }, 1500)
  }

  const processAIResponse = (
    userInput: string
  ): { content: string; context?: any } => {
    const input = userInput.toLowerCase()

    // Criar tarefa
    if (
      input.includes('criar tarefa') ||
      input.includes('nova tarefa') ||
      input.includes('adicionar tarefa')
    ) {
      return {
        content:
          'Vou criar uma nova tarefa para você! Que tarefa gostaria de adicionar?',
        context: {
          actionType: 'create_task',
          data: { pending: true },
        },
      }
    }

    // Criar nota
    if (
      input.includes('criar nota') ||
      input.includes('nova nota') ||
      input.includes('anotar')
    ) {
      return {
        content:
          'Perfeito! Vou criar uma nota para você. Qual o conteúdo da nota?',
        context: {
          actionType: 'add_note',
          data: { pending: true },
        },
      }
    }

    // Criar meta
    if (
      input.includes('criar meta') ||
      input.includes('nova meta') ||
      input.includes('objetivo')
    ) {
      return {
        content:
          'Excelente! Vou ajudá-lo a definir uma nova meta. Qual é seu objetivo?',
        context: {
          actionType: 'update_goal',
          data: { pending: true },
        },
      }
    }

    // Agendar evento
    if (
      input.includes('agendar') ||
      input.includes('evento') ||
      input.includes('reunião')
    ) {
      return {
        content:
          'Vou agendar um evento para você! Quando e qual evento gostaria de agendar?',
        context: {
          actionType: 'schedule_event',
          data: { pending: true },
        },
      }
    }

    // Status/Relatório
    if (
      input.includes('status') ||
      input.includes('relatório') ||
      input.includes('progresso')
    ) {
      const tasks = store.getTasks()
      const goals = store.getGoals()
      const completed = tasks.filter((t) => t.completed).length
      const total = tasks.length
      const activeGoals = goals.filter((g) => !g.completed).length

      return {
        content: `📊 **Relatório de Produtividade**\n\n✅ Tarefas: ${completed}/${total} concluídas\n🎯 Metas ativas: ${activeGoals}\n📈 Score de produtividade: ${
          Math.round((completed / total) * 100) || 0
        }%\n\nVocê está indo muito bem! Continue assim! 🚀`,
      }
    }

    // Ajuda
    if (
      input.includes('ajuda') ||
      input.includes('help') ||
      input.includes('comandos')
    ) {
      return {
        content:
          '🤖 **Comandos que entendo:**\n\n• "Criar tarefa" - Adiciona nova tarefa\n• "Nova nota" - Cria uma anotação\n• "Criar meta" - Define um objetivo\n• "Agendar evento" - Marca um compromisso\n• "Status" - Mostra relatório de produtividade\n• "Ajuda" - Mostra esta lista\n\nTambém posso responder perguntas sobre produtividade e organização!',
      }
    }

    // Saudações
    if (
      input.includes('olá') ||
      input.includes('oi') ||
      input.includes('hello')
    ) {
      return {
        content:
          'Olá! 👋 É ótimo falar com você! Como posso ajudá-lo a ser mais produtivo hoje?',
      }
    }

    // Despedida
    if (
      input.includes('tchau') ||
      input.includes('obrigado') ||
      input.includes('valeu')
    ) {
      return {
        content:
          'Foi um prazer ajudá-lo! 😊 Estou sempre aqui quando precisar. Tenha um dia produtivo!',
      }
    }

    // Resposta padrão inteligente
    const responses = [
      'Entendo! Posso ajudá-lo de várias formas. Que tal começarmos criando uma tarefa ou definindo uma meta?',
      'Interessante! Para ser mais específico, posso ajudá-lo a organizar tarefas, criar notas, definir metas ou agendar eventos. O que prefere?',
      'Perfeito! Sou especialista em produtividade. Posso criar tarefas, agendar eventos, fazer anotações ou acompanhar suas metas. Como posso ajudar?',
      'Ótima pergunta! Como seu assistente pessoal, posso organizar sua rotina de várias formas. Que tipo de ajuda você precisa hoje?',
    ]

    return {
      content: responses[Math.floor(Math.random() * responses.length)],
    }
  }

  const executeAction = (context: any) => {
    switch (context.actionType) {
      case 'create_task':
        toast.success(
          'Funcionalidade em desenvolvimento! Em breve você poderá criar tarefas diretamente do chat.'
        )
        break
      case 'add_note':
        toast.success(
          'Funcionalidade em desenvolvimento! Em breve você poderá criar notas diretamente do chat.'
        )
        break
      case 'update_goal':
        toast.success(
          'Funcionalidade em desenvolvimento! Em breve você poderá criar metas diretamente do chat.'
        )
        break
      case 'schedule_event':
        toast.success(
          'Funcionalidade em desenvolvimento! Em breve você poderá agendar eventos diretamente do chat.'
        )
        break
    }
  }

  return (
    <div className="flex flex-col h-full bg-gradient-main">
      {/* Header */}
      <div className="glass-card p-6 m-6 mb-0 rounded-3xl">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-accent flex items-center justify-center shadow-glow-blue">
            <SparklesIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">
              CareAI Assistant
            </h1>
            <p className="text-white/60 text-sm">
              Seu assistente pessoal inteligente
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 pt-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.type === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={
                message.type === 'user'
                  ? 'chat-message-user'
                  : 'chat-message-ai'
              }
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
              <div className="text-xs mt-2 text-white/50">
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="chat-message-ai">
              <div className="loading-dots">
                <div className="loading-dot"></div>
                <div
                  className="loading-dot"
                  style={{ animationDelay: '0.2s' }}
                ></div>
                <div
                  className="loading-dot"
                  style={{ animationDelay: '0.4s' }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 pt-0">
        <div className="glass-card p-4 rounded-2xl">
          <div className="flex space-x-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Digite sua mensagem..."
              className="flex-1 bg-transparent text-white placeholder-white/50 border-none outline-none text-sm"
              disabled={isTyping}
            />
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isTyping}
              className="w-10 h-10 bg-gradient-accent rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 shadow-glow-blue"
            >
              <PaperAirplaneIcon className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
