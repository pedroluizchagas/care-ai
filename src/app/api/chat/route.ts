import { NextRequest } from 'next/server'
import {
  generateChatResponse,
  generateResponseAfterFunction,
  UserContext,
} from '@/lib/groq'
import { executeFunction } from '@/lib/agent-functions'
import prisma from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId } = await request.json()

    if (!message || typeof message !== 'string') {
      return Response.json({ error: 'Message is required' }, { status: 400 })
    }

    // Por enquanto usar usuário padrão (em produção seria do JWT/session)
    const userId = 'user_1'

    // Garantir que o usuário existe antes de criar sessão
    let user = await prisma.user.findUnique({
      where: { id: userId },
      include: { preferences: true },
    })

    if (!user) {
      // Criar usuário padrão se não existir
      user = await prisma.user.create({
        data: {
          id: userId,
          email: 'user@careai.com',
          name: 'Usuário CareAI',
          phone: '+55 (11) 99999-9999',
          location: 'São Paulo, SP',
          position: 'Usuário',
          company: 'CareAI',
          bio: 'Usuário padrão do sistema CareAI',
          preferences: {
            create: {
              theme: 'dark',
              language: 'pt-BR',
              emailNotifications: true,
              pushNotifications: true,
              soundNotifications: false,
            },
          },
        },
        include: { preferences: true },
      })
      console.log('✅ Usuário padrão criado:', user.id)
    }

    // 1. Buscar ou criar sessão de chat
    let chatSession = await prisma.chatSession.findFirst({
      where: { id: sessionId, userId },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    })

    if (!chatSession) {
      chatSession = await prisma.chatSession.create({
        data: {
          id: sessionId || crypto.randomUUID(),
          title: message.slice(0, 50) + (message.length > 50 ? '...' : ''),
          userId,
        },
        include: { messages: true },
      })
    }

    // 2. Buscar contexto do usuário
    const [recentTasks, recentNotes, currentGoals] = await Promise.all([
      prisma.task.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.note.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 3,
      }),
      prisma.goal.findMany({
        where: { userId, isCompleted: false },
        orderBy: { createdAt: 'desc' },
      }),
    ])

    const context: UserContext = {
      name: user?.name || 'Usuário',
      recentTasks,
      recentNotes,
      currentGoals,
      preferences: user?.preferences,
    }

    // 3. Preparar histórico da conversa
    const conversationHistory = chatSession.messages.map((msg: any) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }))

    // 4. Gerar resposta do agente (com possível function calling)
    const aiResponse = await generateChatResponse(
      message,
      context,
      conversationHistory
    )

    let finalResponse = aiResponse.response
    const functionResults: Array<{
      name: string
      parameters: any
      result: any
    }> = []

    // 5. Executar function calls se existirem
    if (aiResponse.functionCalls && aiResponse.functionCalls.length > 0) {
      for (const functionCall of aiResponse.functionCalls) {
        try {
          // Executar a função
          const result = await executeFunction(
            functionCall.name,
            functionCall.parameters,
            userId
          )

          functionResults.push({
            ...functionCall,
            result,
          })
        } catch (error: any) {
          console.error(`Erro ao executar função ${functionCall.name}:`, error)
          functionResults.push({
            ...functionCall,
            result: {
              success: false,
              message: `❌ Erro ao executar ${functionCall.name}: ${error.message}`,
            },
          })
        }
      }

      // 6. Gerar resposta final considerando os resultados das funções
      if (functionResults.length > 0) {
        finalResponse = await generateResponseAfterFunction(
          message,
          functionResults,
          context,
          conversationHistory
        )
      }
    }

    // 7. Salvar mensagens no banco
    await prisma.chatMessage.createMany({
      data: [
        {
          sessionId: chatSession.id,
          role: 'user',
          content: message,
        },
        {
          sessionId: chatSession.id,
          role: 'assistant',
          content: finalResponse,
          functionCalls:
            functionResults.length > 0 ? JSON.stringify(functionResults) : null,
        },
      ],
    })

    // 8. Resposta final com ações executadas
    return Response.json({
      message: finalResponse,
      sessionId: chatSession.id,
      actionsExecuted: functionResults.length,
      functions: functionResults.map((fr) => ({
        name: fr.name,
        success: fr.result.success,
        message: fr.result.message,
      })),
    })
  } catch (error: any) {
    console.error('Erro na API do chat:', error)
    return Response.json(
      {
        error: 'Erro interno do servidor',
        details: error.message,
      },
      { status: 500 }
    )
  }
}
