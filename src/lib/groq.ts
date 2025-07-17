import Groq from 'groq-sdk'
import { ChatMessage } from '@/types'

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
    const systemMessage = `Você é o CareAI, um assistente pessoal inteligente em português brasileiro que ajuda com produtividade, organização e gestão financeira.

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
- create_financial_transaction: Registrar uma transação financeira (receita ou despesa)
- create_financial_category: Criar uma nova categoria financeira

PALAVRAS-CHAVE PARA IDENTIFICAR:
- "agendar", "marcar", "compromisso", "reunião", "consulta", "evento" = create_event
- "rotina semanal", "agenda semanal", "cronograma" = create_event (criar vários eventos)
- "tarefa", "fazer", "lembrar de" = create_task

DATAS RELATIVAS - CALCULE CORRETAMENTE:
- "hoje" = ${currentBrazil.date}
- "amanhã" = ${tomorrow} 
- "depois de amanhã" = ${dayAfterTomorrow}
- Para outros dias da semana, calcule a partir de hoje (${currentBrazil.date})

EXEMPLOS DE USO:

**EVENTO ÚNICO:**
Usuário: "Agendar reunião amanhã às 12:00"
Resposta: "📅 Vou agendar essa reunião! [FUNCTION: create_event {"title": "Reunião", "startDate": "${tomorrow}T12:00:00", "category": "Reunião", "priority": "MEDIUM"}]"

**AGENDA SEMANAL (múltiplos eventos):**
Usuário: "Crie uma agenda semanal de treino"
Resposta: "💪 Vou criar sua agenda de treino semanal! [FUNCTION: create_event {"title": "Academia - Treino Superior", "startDate": "${tomorrow}T07:00:00", "category": "Pessoal", "priority": "MEDIUM"}]"

(Note: Para agenda semanal, crie um evento por vez ou sugira ao usuário agendar cada dia)

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
6. Para "agenda semanal", sugira criar eventos individuais para cada dia

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

// Adicionar as novas funções financeiras na lista de funções
const agentFunctions = [
  {
    name: 'create_task',
    description: 'Criar uma nova tarefa para o usuário',
    parameters: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Título da tarefa',
        },
        description: {
          type: 'string',
          description: 'Descrição detalhada da tarefa',
        },
        priority: {
          type: 'string',
          enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
          description: 'Prioridade da tarefa',
        },
        category: {
          type: 'string',
          description: 'Categoria da tarefa (ex: Trabalho, Pessoal, Estudos)',
        },
        dueDate: {
          type: 'string',
          description: 'Data de vencimento no formato ISO (opcional)',
        },
      },
      required: ['title', 'priority', 'category'],
    },
  },
  {
    name: 'create_note',
    description: 'Criar uma nova nota/anotação',
    parameters: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Título da nota',
        },
        content: {
          type: 'string',
          description: 'Conteúdo da nota',
        },
        category: {
          type: 'string',
          description: 'Categoria da nota (ex: Ideias, Reuniões, Lembretes)',
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Tags para organizar a nota',
        },
      },
      required: ['title', 'content', 'category'],
    },
  },
  {
    name: 'create_goal',
    description: 'Criar uma nova meta/objetivo',
    parameters: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Título da meta',
        },
        description: {
          type: 'string',
          description: 'Descrição da meta',
        },
        target: {
          type: 'number',
          description: 'Valor alvo da meta',
        },
        category: {
          type: 'string',
          description: 'Categoria da meta (ex: Saúde, Carreira, Financeiro)',
        },
        deadline: {
          type: 'string',
          description: 'Data limite no formato ISO (opcional)',
        },
      },
      required: ['title', 'target', 'category'],
    },
  },
  {
    name: 'create_event',
    description: 'Criar um novo evento na agenda',
    parameters: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Título do evento',
        },
        description: {
          type: 'string',
          description: 'Descrição do evento',
        },
        location: {
          type: 'string',
          description: 'Local do evento',
        },
        category: {
          type: 'string',
          description: 'Categoria do evento (ex: Reunião, Consulta, Lazer)',
        },
        startDate: {
          type: 'string',
          description: 'Data e hora de início no formato ISO',
        },
        endDate: {
          type: 'string',
          description: 'Data e hora de fim no formato ISO (opcional)',
        },
        allDay: {
          type: 'boolean',
          description: 'Se o evento dura o dia todo',
        },
        priority: {
          type: 'string',
          enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
          description: 'Prioridade do evento',
        },
        reminder: {
          type: 'string',
          enum: ['5min', '10min', '15min', '30min', '1hour', '2hours', '1day'],
          description: 'Lembrete antes do evento',
        },
      },
      required: ['title', 'startDate', 'category', 'priority'],
    },
  },
  {
    name: 'create_financial_transaction',
    description: 'Registrar uma transação financeira (receita ou despesa)',
    parameters: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Título da transação',
        },
        description: {
          type: 'string',
          description: 'Descrição da transação',
        },
        amount: {
          type: 'number',
          description: 'Valor da transação',
        },
        type: {
          type: 'string',
          enum: ['INCOME', 'EXPENSE'],
          description: 'Tipo: INCOME para receitas, EXPENSE para despesas',
        },
        categoryName: {
          type: 'string',
          description:
            'Nome da categoria (ex: Alimentação, Salário, Transporte)',
        },
        paymentMethod: {
          type: 'string',
          enum: ['CASH', 'DEBIT', 'CREDIT', 'PIX', 'TRANSFER'],
          description: 'Forma de pagamento',
        },
        date: {
          type: 'string',
          description:
            'Data da transação no formato ISO (opcional, usa hoje se omitido)',
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Tags para organizar a transação',
        },
      },
      required: ['title', 'amount', 'type', 'categoryName'],
    },
  },
  {
    name: 'create_financial_category',
    description: 'Criar uma nova categoria financeira',
    parameters: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Nome da categoria',
        },
        type: {
          type: 'string',
          enum: ['INCOME', 'EXPENSE'],
          description: 'Tipo: INCOME para receitas, EXPENSE para despesas',
        },
        icon: {
          type: 'string',
          description: 'Emoji representativo da categoria',
        },
        color: {
          type: 'string',
          description: 'Cor da categoria em hexadecimal (ex: #3B82F6)',
        },
      },
      required: ['name', 'type'],
    },
  },
]

export default groq
