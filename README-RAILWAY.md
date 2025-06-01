# 🚀 Deploy CareAI no Railway

Este guia te ajudará a fazer o deploy completo da aplicação CareAI no Railway.

## 📋 Pré-requisitos

- Conta no [Railway](https://railway.app)
- Conta no [GitHub](https://github.com)
- Repositório da aplicação no GitHub
- Chave da API do OpenAI

## 🗄️ 1. Configurando o Banco de Dados

### 1.1 Criando o Banco PostgreSQL

1. Acesse [Railway](https://railway.app)
2. Clique em **"New Project"**
3. Selecione **"Provision PostgreSQL"**
4. Aguarde a criação do banco
5. Anote a `DATABASE_URL` nas variáveis de ambiente

## 🔧 2. Deploy da Aplicação

### 2.1 Conectando ao GitHub

1. No Railway, clique em **"New Service"**
2. Selecione **"GitHub Repo"**
3. Escolha o repositório `CareAI`
4. Railway detectará automaticamente que é uma aplicação Next.js

### 2.2 Configurando Variáveis de Ambiente

No painel do Railway, adicione as seguintes variáveis:

```bash
# Banco de Dados (copiado do serviço PostgreSQL)
DATABASE_URL=postgresql://postgres:password@hostname:port/database

# OpenAI
OPENAI_API_KEY=sk-proj-...

# Next.js
NEXTAUTH_SECRET=sua-chave-secreta-aqui-minimum-32-chars
NEXTAUTH_URL=https://seu-app.railway.app

# Railway
RAILWAY_ENVIRONMENT=production
NODE_ENV=production
```

### 2.3 Comandos de Build

O Railway usará automaticamente os comandos do `package.json`:

- **Build**: `npm run build` (inclui `prisma generate`)
- **Start**: `npm start`

## 🎯 3. Configuração do Domínio

### 3.1 Domínio Railway (Gratuito)

1. No painel do serviço, clique em **"Settings"**
2. Na seção **"Domains"**, Railway gerará automaticamente um domínio
3. Exemplo: `careai-production.railway.app`

### 3.2 Domínio Personalizado (Opcional)

1. Adicione seu domínio personalizado
2. Configure os DNS para apontar para Railway
3. Aguarde propagação (até 24h)

## 🗃️ 4. Inicializando o Banco

### 4.1 Executando Migrações

Após o primeiro deploy, execute no terminal local:

```bash
# Configurar DATABASE_URL localmente (usar a do Railway)
export DATABASE_URL="postgresql://..."

# Executar migrações
npx prisma db push

# Popular banco com dados iniciais
npx prisma db seed
```

### 4.2 Verificando o Banco

1. Acesse Railway
2. Clique no serviço PostgreSQL
3. Vá em **"Query"** para executar SQL
4. Verifique se as tabelas foram criadas

## 🎮 5. Testando a Aplicação

### 5.1 Health Check

Acesse: `https://seu-app.railway.app/api/health`

Deve retornar:

```json
{
  "status": "healthy",
  "timestamp": "2024-01-XX...",
  "database": "connected"
}
```

### 5.2 Testando APIs

```bash
# Testar chat
curl -X POST https://seu-app.railway.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Olá!"}]}'

# Testar tarefas (precisa de userId válido)
curl https://seu-app.railway.app/api/tasks?userId=exemplo
```

## 🔍 6. Monitoramento

### 6.1 Logs da Aplicação

1. No Railway, acesse seu serviço
2. Clique em **"Deployments"**
3. Veja logs em tempo real

### 6.2 Métricas do Banco

1. Acesse o serviço PostgreSQL
2. Veja **"Metrics"** para CPU, RAM, conexões

## 🛠️ 7. Solução de Problemas

### 7.1 Erro "Cannot connect to database"

- Verifique se `DATABASE_URL` está correta
- Confirme se o serviço PostgreSQL está rodando
- Teste conexão pelo Prisma Studio local

### 7.2 Erro "OpenAI API Key invalid"

- Verifique se `OPENAI_API_KEY` está configurada
- Confirme se a chave tem créditos disponíveis
- Teste a chave em requisição direta à OpenAI

### 7.3 Build Failures

- Verifique se todas as dependências estão no `package.json`
- Confirme se `prisma generate` está executando no build
- Veja logs detalhados no Railway

## 💰 8. Custos Estimados

### Railway Hobby Plan ($5/mês):

- **App**: ~$1-3/mês (depende do uso)
- **PostgreSQL**: ~$1-2/mês
- **Total estimado**: $2-5/mês

### Outros custos:

- **OpenAI API**: Varia por uso (~$0.10-1.00/mês para uso pessoal)

## 🔄 9. Atualizações Automáticas

O Railway fará deploy automaticamente a cada push no branch `main`:

1. Commit suas mudanças
2. Push para GitHub
3. Railway detecta automaticamente
4. Build e deploy automático

## 🎉 Pronto!

Sua aplicação CareAI está rodando no Railway! 🚀

### Links Úteis:

- **App**: https://seu-app.railway.app
- **Railway Dashboard**: https://railway.app/dashboard
- **Docs Railway**: https://docs.railway.app
- **Suporte**: https://railway.app/help
