import type { NextApiRequest, NextApiResponse } from 'next'
import {
  generateChatResponse,
  generateResponseAfterFunction,
  UserContext,
} from '@/lib/groq'
import { executeFunction } from '@/lib/agent-functions'
import prisma from '@/lib/database'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { message, sessionId } = req.body

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' })
    }

    // Por enquanto usar usuário padrão (em produção seria do JWT/session)
    const userId = 'user_1'

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
    const [user, recentTasks, recentNotes, currentGoals] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        include: { preferences: true },
      }),
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
        where: { userId, completed: false },
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
    return res.status(200).json({
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
    return res.status(500).json({
      error: 'Erro interno do servidor',
      details: error.message,
    })
  }
}
