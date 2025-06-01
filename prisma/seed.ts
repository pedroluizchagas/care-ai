import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Criar conquistas padrão
  const achievements = [
    {
      title: 'Primeira Semana',
      description: 'Complete sua primeira semana de uso',
      icon: '🎯',
      category: 'Início',
      points: 10,
    },
    {
      title: 'Produtivo',
      description: 'Complete 100 tarefas',
      icon: '✅',
      category: 'Tarefas',
      points: 50,
    },
    {
      title: 'Conversador',
      description: 'Tenha 50 conversas com a IA',
      icon: '💬',
      category: 'Chat',
      points: 30,
    },
    {
      title: 'Organizador',
      description: 'Crie 25 notas',
      icon: '📝',
      category: 'Notas',
      points: 25,
    },
    {
      title: 'Mestre das Metas',
      description: 'Alcance 50 metas',
      icon: '🏆',
      category: 'Metas',
      points: 75,
    },
    {
      title: 'Usuário Avançado',
      description: 'Use todos os recursos do app',
      icon: '⭐',
      category: 'Geral',
      points: 100,
    },
    {
      title: 'Sequência de 7 dias',
      description: 'Use o app por 7 dias consecutivos',
      icon: '🔥',
      category: 'Consistência',
      points: 35,
    },
    {
      title: 'Sequência de 30 dias',
      description: 'Use o app por 30 dias consecutivos',
      icon: '🚀',
      category: 'Consistência',
      points: 150,
    },
  ]

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { title: achievement.title },
      update: {},
      create: achievement,
    })
  }

  console.log('✅ Conquistas criadas com sucesso!')

  // Criar usuário de exemplo (opcional para desenvolvimento)
  if (process.env.NODE_ENV === 'development') {
    const exampleUser = await prisma.user.upsert({
      where: { email: 'user@example.com' },
      update: {},
      create: {
        email: 'user@example.com',
        name: 'Usuário Exemplo',
        phone: '+55 (11) 99999-9999',
        location: 'São Paulo, SP',
        position: 'Desenvolvedor',
        company: 'Exemplo Corp',
        bio: 'Usuário de exemplo para demonstração do sistema',
      },
    })

    // Criar algumas tarefas de exemplo
    await prisma.task.createMany({
      data: [
        {
          title: 'Revisar código do projeto',
          description: 'Fazer code review das alterações da semana',
          priority: 'HIGH',
          category: 'Trabalho',
          userId: exampleUser.id,
        },
        {
          title: 'Exercitar-se',
          description: 'Ir à academia ou fazer exercícios em casa',
          priority: 'MEDIUM',
          category: 'Saúde',
          userId: exampleUser.id,
        },
        {
          title: 'Estudar TypeScript',
          description: 'Continuar curso de TypeScript avançado',
          priority: 'MEDIUM',
          category: 'Educação',
          userId: exampleUser.id,
        },
      ],
    })

    // Criar algumas notas de exemplo
    await prisma.note.createMany({
      data: [
        {
          title: 'Ideias para o projeto',
          content:
            'Lista de funcionalidades que podem ser implementadas no futuro...',
          category: 'Trabalho',
          tags: ['projeto', 'ideias', 'desenvolvimento'],
          userId: exampleUser.id,
        },
        {
          title: 'Receita de café especial',
          content: 'Método V60: 20g de café, 300ml de água a 92°C...',
          category: 'Pessoal',
          tags: ['café', 'receita'],
          userId: exampleUser.id,
        },
      ],
    })

    // Criar algumas metas de exemplo
    await prisma.goal.createMany({
      data: [
        {
          title: 'Ler 12 livros este ano',
          description: 'Meta de leitura para desenvolvimento pessoal',
          target: 12,
          current: 3,
          category: 'Educação',
          userId: exampleUser.id,
        },
        {
          title: 'Fazer exercícios 3x por semana',
          description: 'Manter rotina regular de exercícios',
          target: 156, // 3x por semana * 52 semanas
          current: 24,
          category: 'Saúde',
          userId: exampleUser.id,
        },
      ],
    })

    // Criar preferências do usuário
    await prisma.userPreferences.upsert({
      where: { userId: exampleUser.id },
      update: {},
      create: {
        userId: exampleUser.id,
        theme: 'dark',
        language: 'pt-BR',
        emailNotifications: true,
        pushNotifications: true,
        soundNotifications: false,
      },
    })

    console.log('✅ Dados de exemplo criados com sucesso!')
  }

  console.log('🎉 Seed concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
