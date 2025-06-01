import OpenAI from 'openai'
import { agentFunctions } from './agent-functions'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable')
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface UserContext {
  name: string
  recentTasks: any[]
  recentNotes: any[]
  currentGoals: any[]
  preferences: any
}

export async function generateChatResponse(
  message: string,
  context: UserContext,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<{
  response: string
  functionCalls?: Array<{
    name: string
    parameters: any
    result: any
  }>
}> {
  try {
    // Criar o contexto do usuário para o sistema
    const systemMessage = `Você é o CareAI, um assistente pessoal inteligente em português brasileiro.

CONTEXTO DO USUÁRIO:
- Nome: ${context.name}
- Tarefas recentes: ${context.recentTasks?.length || 0} tarefas
- Notas recentes: ${context.recentNotes?.length || 0} notas  
- Metas ativas: ${context.currentGoals?.length || 0} metas

CAPACIDADES ESPECIAIS:
Você pode executar ações REAIS no sistema do usuário usando as seguintes funções:
- create_task: Criar tarefas com prioridades e prazos
- create_note: Salvar notas organizadas por categoria
- create_goal: Estabelecer metas com progresso rastreável
- list_tasks: Listar tarefas existentes com filtros
- complete_task: Marcar tarefas como concluídas
- update_goal_progress: Atualizar progresso das metas

DIRETRIZES:
1. Seja proativo e ofereça ajuda prática
2. Quando o usuário mencionar algo que pode virar tarefa/nota/meta, SUGIRA ou EXECUTE automaticamente
3. Use emojis apropriados: ✅ 📝 🎯 📋 🚀 💡 ⏰
4. Seja conciso mas informativo
5. Sempre confirme ações executadas
6. Contextualize suas respostas com dados do usuário

EXEMPLOS DE USO:
- "Preciso estudar Python" → Criar tarefa automaticamente
- "Anote que gostei do restaurante X" → Criar nota
- "Quero correr 5km por semana" → Criar meta
- "Que tarefas tenho pendentes?" → Listar tarefas

Seja natural e útil! Execute ações quando apropriado.`

    // Preparar mensagens da conversa
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemMessage },
      ...conversationHistory.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
      { role: 'user', content: message },
    ]

    // Primeira chamada: verificar se o assistente quer usar funções
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      functions: agentFunctions,
      function_call: 'auto',
      temperature: 0.7,
      max_tokens: 800,
    })

    const assistantMessage = completion.choices[0].message
    const functionCalls: Array<{ name: string; parameters: any; result: any }> =
      []

    // Se há function call, executar
    if (assistantMessage.function_call) {
      const functionName = assistantMessage.function_call.name
      const functionArgs = JSON.parse(
        assistantMessage.function_call.arguments || '{}'
      )

      functionCalls.push({
        name: functionName,
        parameters: functionArgs,
        result: null, // Será preenchido pela API que chama
      })
    }

    // Resposta do assistente (texto + function calls se houver)
    return {
      response: assistantMessage.content || 'Executando ação...',
      functionCalls: functionCalls.length > 0 ? functionCalls : undefined,
    }
  } catch (error) {
    console.error('Erro na API OpenAI:', error)
    throw new Error('Erro ao processar mensagem')
  }
}

// Função para gerar resposta após function call
export async function generateResponseAfterFunction(
  originalMessage: string,
  functionResults: Array<{ name: string; parameters: any; result: any }>,
  context: UserContext,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<string> {
  try {
    // Criar contexto com os resultados das funções
    const functionSummary = functionResults
      .map((fr) => `Função ${fr.name} executada: ${fr.result.message}`)
      .join('\n')

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: `Você é o CareAI. O usuário disse: "${originalMessage}"

AÇÕES EXECUTADAS:
${functionSummary}

Forneça uma resposta natural confirmando as ações e oferecendo mais ajuda se apropriado. Seja conciso e use emojis.`,
      },
      { role: 'user', content: originalMessage },
    ]

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 300,
    })

    return (
      completion.choices[0].message.content || 'Ação executada com sucesso!'
    )
  } catch (error) {
    console.error('Erro ao gerar resposta pós-função:', error)
    return 'Ação executada com sucesso! Como posso ajudar mais?'
  }
}

export default openai
