# 🤖 CareAI - Assistente Pessoal Inteligente

CareAI é um assistente pessoal baseado em IA desenvolvido para ajudar você a gerenciar sua rotina diária de forma inteligente e eficiente. Ele organiza tarefas, notas, metas e eventos em um dashboard centralizado com chat interativo.

## ✨ Funcionalidades

### 🎯 **Dashboard Inteligente**

- Visão geral da produtividade diária
- Métricas de tarefas concluídas
- Score de produtividade personalizado
- Estatísticas de metas e eventos

### 💬 **Chat AI Interativo**

- Conversa natural com o assistente
- Comandos inteligentes para criar tarefas, notas e metas
- Relatórios de progresso via chat
- Respostas contextualizadas e personalizadas

### ✅ **Gerenciador de Tarefas**

- Criação e organização de tarefas
- Sistema de prioridades (baixa, média, alta, crítica)
- Categorização por contexto (Trabalho, Pessoal, Estudos, etc.)
- Filtros avançados e ordenação inteligente
- Data de vencimento e notificações

### 📝 **Sistema de Notas** (Em Desenvolvimento)

- Anotações organizadas por categorias
- Sistema de tags para busca rápida
- Notas fixadas para acesso rápido

### 🏆 **Metas e Objetivos** (Em Desenvolvimento)

- Definição de metas com prazos
- Tracking de progresso visual
- Marcos intermediários
- Análise de conquistas

### 📅 **Agenda Inteligente** (Em Desenvolvimento)

- Calendário integrado
- Agendamento via chat
- Lembretes automáticos

## 🛠️ Tecnologias Utilizadas

- **Frontend**: Next.js 14 + TypeScript
- **Styling**: Tailwind CSS + CSS personalizado
- **UI Components**: Headless UI + Hero Icons
- **Animations**: Framer Motion
- **State Management**: Classe personalizada com localStorage
- **Notifications**: React Hot Toast
- **Data Visualization**: Recharts (futuro)

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

1. **Clone o repositório**

```bash
git clone <url-do-repositorio>
cd care-ai
```

2. **Instale as dependências**

```bash
npm install
# ou
yarn install
```

3. **Execute em modo desenvolvimento**

```bash
npm run dev
# ou
yarn dev
```

4. **Acesse a aplicação**

```
http://localhost:3000
```

## 📱 Como Usar

### 1. **Dashboard**

- Ao abrir a aplicação, você verá o dashboard com estatísticas da sua produtividade
- Cards informativos mostram tarefas concluídas, eventos próximos e score de produtividade
- Ações rápidas para criar novos itens

### 2. **Chat AI**

Comandos que o CareAI entende:

- `"Criar tarefa"` - Inicia processo de criação de tarefa
- `"Nova nota"` - Cria uma anotação
- `"Criar meta"` - Define um novo objetivo
- `"Agendar evento"` - Marca um compromisso
- `"Status"` ou `"Relatório"` - Mostra relatório de produtividade
- `"Ajuda"` - Lista todos os comandos disponíveis

### 3. **Gerenciar Tarefas**

- Clique em "Tarefas" na sidebar
- Use "Nova Tarefa" para adicionar atividades
- Organize por prioridade e categoria
- Marque como concluído clicando no círculo
- Use filtros para visualizar apenas o que importa

### 4. **Dados Persistentes**

- Todos os dados são salvos automaticamente no localStorage
- Suas informações permanecem disponíveis entre sessões

## 🎨 Design System

### Cores Principais

- **Primary**: Azul (#0ea5e9) - Interface principal
- **Secondary**: Roxo (#d946ef) - Acentos e destaques
- **Success**: Verde - Ações positivas
- **Warning**: Amarelo - Alertas
- **Error**: Vermelho - Erros

### Componentes

- **Cards**: Elementos elevados com sombra suave
- **Botões**: Primários (azul) e secundários (cinza)
- **Modais**: Formulários centralizados com overlay
- **Sidebar**: Navegação lateral retrátil

## 🔮 Próximas Funcionalidades

### Versão 2.0

- [ ] Sistema completo de notas com editor rico
- [ ] Metas com marcos e gráficos de progresso
- [ ] Calendário integrado com visualização mensal
- [ ] Notificações push no navegador

### Versão 3.0

- [ ] Integração com APIs de calendário (Google, Outlook)
- [ ] Análise de produtividade com IA
- [ ] Sugestões automáticas de otimização
- [ ] Relatórios detalhados exportáveis

### Versão 4.0

- [ ] Aplicativo mobile (React Native)
- [ ] Sincronização em nuvem
- [ ] Colaboração em equipe
- [ ] Integrações com ferramentas de trabalho

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Estrutura do Projeto

```
care-ai/
├── src/
│   ├── app/                 # App Router do Next.js
│   │   ├── globals.css      # Estilos globais
│   │   ├── layout.tsx       # Layout principal
│   │   └── page.tsx         # Página inicial
│   ├── components/          # Componentes React
│   │   ├── Sidebar.tsx      # Navegação lateral
│   │   ├── Dashboard.tsx    # Dashboard principal
│   │   ├── Chat.tsx         # Chat AI
│   │   ├── Tasks.tsx        # Gerenciador de tarefas
│   │   ├── Notes.tsx        # Sistema de notas
│   │   ├── Goals.tsx        # Metas e objetivos
│   │   └── Calendar.tsx     # Agenda
│   ├── lib/                 # Utilitários e lógica
│   │   ├── store.ts         # Gerenciamento de estado
│   │   └── utils.ts         # Funções utilitárias
│   └── types/               # Definições TypeScript
│       └── index.ts         # Interfaces e tipos
├── public/                  # Arquivos estáticos
├── package.json             # Dependências
├── tailwind.config.js       # Configuração Tailwind
├── tsconfig.json           # Configuração TypeScript
└── README.md               # Este arquivo
```

## 📊 Performance e Otimização

- **Bundle Size**: Otimizado com code splitting automático do Next.js
- **Images**: Next.js Image component para otimização automática
- **CSS**: Tailwind com purge para reduzir tamanho final
- **TypeScript**: Type safety e melhor experiência de desenvolvimento

## 🔒 Privacidade

- **Dados Locais**: Todas as informações ficam no seu navegador
- **Sem Servidor**: Não enviamos dados para servidores externos
- **Código Aberto**: Transparência total sobre como funcionamos

## 📞 Suporte

Para dúvidas, sugestões ou reportar bugs:

- Abra uma issue no GitHub
- Entre em contato via email
- Contribua com código!

---

**CareAI** - Desenvolvido com ❤️ para melhorar sua produtividade diária.

_Versão 1.0.0 - 2024_
