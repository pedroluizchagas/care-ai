import Groq from 'groq-sdk'
import { agentFunctions } from './agent-functions'

if (!process.env.GROQ_API_KEY) {
  throw new Error('Missing GROQ_API_KEY environment variable')
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export interface UserContext {
  name: string
  recentTasks: any[]
  recentNotes: any[]
  currentGoals: any[]
  preferences: any
}

// Função para obter data/hora atual (local do dispositivo)
function getBrazilDateTime() {
  const now = new Date()

  return {
    date: now.toISOString().split('T')[0], // YYYY-MM-DD
    time: now.toTimeString().split(' ')[0].substring(0, 5), // HH:MM
    full: now.toISOString().substring(0, 19), // YYYY-MM-DDTHH:MM:SS
    dayOfWeek: now.getDay(), // 0=domingo, 1=segunda, etc
    formatted: now.toLocaleDateString('pt-BR'), // DD/MM/YYYY
    weekDay: now.toLocaleDateString('pt-BR', { weekday: 'long' }),
  }
}

// Função para calcular datas relativas
function calculateRelativeDate(currentDate: string, relative: string) {
  const base = new Date(currentDate + 'T00:00:00')

  switch (relative.toLowerCase()) {
    case 'hoje':
      return base.toISOString().split('T')[0]
    case 'amanhã':
      base.setDate(base.getDate() + 1)
      return base.toISOString().split('T')[0]
    case 'depois de amanhã':
      base.setDate(base.getDate() + 2)
      return base.toISOString().split('T')[0]
    case 'próxima semana':
      base.setDate(base.getDate() + 7)
      return base.toISOString().split('T')[0]
    default:
      return base.toISOString().split('T')[0]
  }
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
    // Obter data/hora atual do Brasil
    const currentBrazil = getBrazilDateTime()
    const tomorrow = calculateRelativeDate(currentBrazil.date, 'amanhã')
    const dayAfterTomorrow = calculateRelativeDate(
      currentBrazil.date,
      'depois de amanhã'
    )

    // Criar o contexto do usuário para o sistema
    const systemMessage = `Você é o CareAI, um assistente pessoal inteligente em português brasileiro.

CONTEXTO DO USUÁRIO:
- Nome: ${context.name}
- Tarefas recentes: ${context.recentTasks?.length || 0} tarefas
- Notas recentes: ${context.recentNotes?.length || 0} notas  
- Metas ativas: ${context.currentGoals?.length || 0} metas

INFORMAÇÕES DE DATA/HORA ATUAIS (Brasília):
- Data atual: ${currentBrazil.date} (${currentBrazil.formatted}) 
- Hora atual: ${currentBrazil.time}
- Dia da semana: ${currentBrazil.weekDay}
- Amanhã será: ${tomorrow}
- Depois de amanhã: ${dayAfterTomorrow}

CAPACIDADES ESPECIAIS:
Você pode executar ações REAIS no sistema do usuário.

IMPORTANTE: Quando o usuário pedir para criar/fazer algo, você DEVE responder de forma natural E incluir uma chamada de função no formato:
[FUNCTION: nome_da_funcao {"parametro": "valor"}]

FUNÇÕES DISPONÍVEIS:
- create_task: Criar tarefas {"title": "string", "description": "string", "priority": "LOW|MEDIUM|HIGH|CRITICAL", "category": "string"}
- create_note: Salvar notas {"title": "string", "content": "string", "category": "string"}
- create_goal: Estabelecer metas {"title": "string", "description": "string", "target": number, "category": "string"}
- create_event: Agendar eventos/compromissos {"title": "string", "description": "string", "location": "string", "category": "Reunião|Consulta|Evento|Pessoal", "startDate": "YYYY-MM-DDTHH:mm:00", "priority": "LOW|MEDIUM|HIGH|CRITICAL"}
- list_tasks: Listar tarefas {"completed": boolean, "priority": "string", "limit": number}
- complete_task: Marcar como concluída {"taskId": "string"}
- update_goal_progress: Atualizar progresso {"goalId": "string", "current": number}

PALAVRAS-CHAVE PARA AGENDAR:
- "agendar", "marcar", "criar evento", "compromisso", "reunião", "consulta" = use create_event
- "tarefa", "fazer", "lembrar de" = use create_task

DATAS RELATIVAS - CALCULE CORRETAMENTE:
- "hoje" = ${currentBrazil.date}
- "amanhã" = ${tomorrow} 
- "depois de amanhã" = ${dayAfterTomorrow}
- Para outros dias da semana, calcule a partir de hoje (${currentBrazil.date})

EXEMPLOS COM DATAS CORRETAS:
Usuário: "Agendar reunião amanhã às 12:00"
Resposta: "📅 Vou agendar essa reunião! [FUNCTION: create_event {"title": "Reunião", "startDate": "${tomorrow}T12:00:00", "category": "Reunião", "priority": "MEDIUM"}]"

Usuário: "Marcar consulta médica hoje às 14h"
Resposta: "🏥 Consulta agendada! [FUNCTION: create_event {"title": "Consulta médica", "startDate": "${
      currentBrazil.date
    }T14:00:00", "category": "Consulta", "priority": "HIGH"}]"

Usuário: "Compromisso amanhã meio-dia na empresa" 
Resposta: "📅 Compromisso agendado! [FUNCTION: create_event {"title": "Compromisso", "location": "empresa", "startDate": "${tomorrow}T12:00:00", "category": "Reunião", "priority": "MEDIUM"}]"

DIRETRIZES PARA DATAS:
1. SEMPRE use a data correta baseada no contexto atual
2. "meio-dia" = 12:00, "manhã" = 09:00 (padrão), "tarde" = 14:00 (padrão), "noite" = 19:00 (padrão)
3. Se não especificar horário, use 09:00 como padrão
4. Use formato ISO: YYYY-MM-DDTHH:MM:00
5. Sempre confirme a data/hora na resposta

DIRETRIZES GERAIS:
1. SEMPRE use function calls quando apropriado
2. Use emojis: ✅ 📝 🎯 📅 🏥 📋 🚀 💡 ⏰
3. Seja conciso mas natural
4. Confirme as ações com data/hora corretas
5. Para datas, calcule corretamente baseado em hoje (${currentBrazil.formatted})

Seja natural e útil! Execute ações sempre que possível.`

    // Preparar mensagens da conversa
    const messages = [
      { role: 'system', content: systemMessage },
      ...conversationHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: 'user', content: message },
    ]

    // Chamada para Groq com Llama
    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: messages as any,
      temperature: 0.3, // Diminuindo para mais consistência
      max_tokens: 800,
    })

    const assistantMessage = completion.choices[0]?.message?.content || ''
    console.log('🤖 Resposta do Llama:', assistantMessage) // DEBUG LOG

    // Detectar function calls no texto
    const functionCalls: Array<{ name: string; parameters: any; result: any }> =
      []
    const functionRegex = /\[FUNCTION:\s*(\w+)\s*({[^}]*})\]/g
    let match

    while ((match = functionRegex.exec(assistantMessage)) !== null) {
      try {
        const functionName = match[1]
        const parameters = JSON.parse(match[2])

        console.log('🔧 Function call detectada:', functionName, parameters) // DEBUG LOG

        functionCalls.push({
          name: functionName,
          parameters,
          result: null, // Será preenchido pela API que chama
        })
      } catch (error) {
        console.error('❌ Erro ao parsear function call:', error)
      }
    }

    // Limpar a resposta removendo os function calls
    const cleanResponse = assistantMessage.replace(functionRegex, '').trim()

    console.log('📊 Function calls encontradas:', functionCalls.length) // DEBUG LOG

    return {
      response: cleanResponse || 'Como posso ajudar você hoje?',
      functionCalls: functionCalls.length > 0 ? functionCalls : undefined,
    }
  } catch (error) {
    console.error('❌ Erro na API Groq:', error)
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

    const messages = [
      {
        role: 'system',
        content: `Você é o CareAI. O usuário disse: "${originalMessage}"

AÇÕES EXECUTADAS:
${functionSummary}

Forneça uma resposta natural confirmando as ações e oferecendo mais ajuda se apropriado. Seja conciso e use emojis.`,
      },
      { role: 'user', content: originalMessage },
    ]

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: messages as any,
      temperature: 0.7,
      max_tokens: 300,
    })

    return (
      completion.choices[0]?.message?.content || 'Ação executada com sucesso!'
    )
  } catch (error) {
    console.error('❌ Erro ao gerar resposta pós-função:', error)
    return 'Ação executada com sucesso! Como posso ajudar mais?'
  }
}

export default groq
