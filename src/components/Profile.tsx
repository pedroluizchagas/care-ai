'use client'

import {
  UserCircleIcon,
  PencilIcon,
  CameraIcon,
  CalendarIcon,
  ClockIcon,
  TrophyIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon,
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  StarIcon,
  FireIcon,
  ChartBarIcon,
  BoltIcon,
} from '@heroicons/react/24/outline'
import { useState } from 'react'

interface ProfileSectionProps {
  title: string
  children: React.ReactNode
}

function ProfileSection({ title, children }: ProfileSectionProps) {
  return (
    <div className="glass-card p-6 rounded-3xl">
      <h2 className="text-xl font-bold text-white mb-6">{title}</h2>
      {children}
    </div>
  )
}

interface StatCardProps {
  icon: React.ElementType
  title: string
  value: string | number
  subtitle?: string
  color?: 'blue' | 'green' | 'yellow' | 'purple'
}

function StatCard({
  icon: Icon,
  title,
  value,
  subtitle,
  color = 'blue',
}: StatCardProps) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    yellow: 'from-yellow-500 to-yellow-600',
    purple: 'from-purple-500 to-purple-600',
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/60 text-sm">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {subtitle && <p className="text-white/40 text-xs">{subtitle}</p>}
        </div>
        <div
          className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  )
}

interface ActivityItemProps {
  icon: React.ElementType
  title: string
  description: string
  time: string
  color?: string
}

function ActivityItem({
  icon: Icon,
  title,
  description,
  time,
  color = 'text-blue-400',
}: ActivityItemProps) {
  return (
    <div className="flex items-start space-x-4 p-3 rounded-2xl hover:bg-white/5 transition-all duration-300">
      <div
        className={`w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center ${color}`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-white">{title}</h4>
        <p className="text-sm text-white/60">{description}</p>
        <p className="text-xs text-white/40 mt-1">{time}</p>
      </div>
    </div>
  )
}

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: 'Pedro Silva',
    email: 'pedro.silva@example.com',
    phone: '+55 (11) 99999-9999',
    location: 'São Paulo, SP',
    position: 'Desenvolvedor Full Stack',
    company: 'Empria Tech',
    bio: 'Desenvolvedor apaixonado por tecnologia e inovação. Sempre buscando aprender novas ferramentas e metodologias para criar soluções impactantes.',
    joinDate: 'Janeiro 2024',
  })

  const stats = [
    {
      icon: CheckCircleIcon,
      title: 'Tarefas Concluídas',
      value: 147,
      subtitle: 'Este mês',
      color: 'green' as const,
    },
    {
      icon: TrophyIcon,
      title: 'Metas Alcançadas',
      value: 23,
      subtitle: 'Total',
      color: 'yellow' as const,
    },
    {
      icon: DocumentTextIcon,
      title: 'Notas Criadas',
      value: 89,
      subtitle: 'Total',
      color: 'blue' as const,
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'Conversas IA',
      value: 312,
      subtitle: 'Total',
      color: 'purple' as const,
    },
  ]

  const recentActivities = [
    {
      icon: CheckCircleIcon,
      title: 'Tarefa Concluída',
      description: 'Implementar nova funcionalidade de notificações',
      time: '2 horas atrás',
      color: 'text-green-400',
    },
    {
      icon: DocumentTextIcon,
      title: 'Nova Nota',
      description: 'Ideias para melhorar a experiência do usuário',
      time: '4 horas atrás',
      color: 'text-blue-400',
    },
    {
      icon: TrophyIcon,
      title: 'Meta Alcançada',
      description: 'Completar 50% das tarefas desta semana',
      time: '1 dia atrás',
      color: 'text-yellow-400',
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'Conversa com IA',
      description: 'Brainstorming sobre estratégias de produtividade',
      time: '2 dias atrás',
      color: 'text-purple-400',
    },
  ]

  const achievements = [
    {
      title: 'Primeira Semana',
      description: 'Complete sua primeira semana de uso',
      earned: true,
    },
    { title: 'Produtivo', description: 'Complete 100 tarefas', earned: true },
    {
      title: 'Conversador',
      description: 'Tenha 50 conversas com a IA',
      earned: true,
    },
    { title: 'Organizador', description: 'Crie 25 notas', earned: false },
    {
      title: 'Mestre das Metas',
      description: 'Alcance 50 metas',
      earned: false,
    },
    {
      title: 'Usuário Avançado',
      description: 'Use todos os recursos do app',
      earned: false,
    },
  ]

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header do Perfil */}
        <div className="glass-card p-8 rounded-3xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-3xl bg-gradient-accent flex items-center justify-center shadow-glow-blue">
                <UserCircleIcon className="w-20 h-20 text-white" />
              </div>
              <button className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300">
                <CameraIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Informações Principais */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {profileData.name}
                  </h1>
                  <p className="text-white/60 text-lg">
                    {profileData.position}
                  </p>
                  <p className="text-white/40">{profileData.company}</p>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="btn-secondary flex items-center space-x-2 mt-4 sm:mt-0"
                >
                  <PencilIcon className="w-4 h-4" />
                  <span>{isEditing ? 'Salvar' : 'Editar Perfil'}</span>
                </button>
              </div>

              {/* Bio */}
              <p className="text-white/70 max-w-2xl">{profileData.bio}</p>

              {/* Informações de Contato */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="flex items-center space-x-3 text-white/60">
                  <EnvelopeIcon className="w-5 h-5" />
                  <span>{profileData.email}</span>
                </div>
                <div className="flex items-center space-x-3 text-white/60">
                  <PhoneIcon className="w-5 h-5" />
                  <span>{profileData.phone}</span>
                </div>
                <div className="flex items-center space-x-3 text-white/60">
                  <MapPinIcon className="w-5 h-5" />
                  <span>{profileData.location}</span>
                </div>
                <div className="flex items-center space-x-3 text-white/60">
                  <CalendarIcon className="w-5 h-5" />
                  <span>Membro desde {profileData.joinDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <ProfileSection title="📊 Estatísticas">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                icon={stat.icon}
                title={stat.title}
                value={stat.value}
                subtitle={stat.subtitle}
                color={stat.color}
              />
            ))}
          </div>
        </ProfileSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Atividades Recentes */}
          <ProfileSection title="⚡ Atividades Recentes">
            <div className="space-y-2">
              {recentActivities.map((activity, index) => (
                <ActivityItem
                  key={index}
                  icon={activity.icon}
                  title={activity.title}
                  description={activity.description}
                  time={activity.time}
                  color={activity.color}
                />
              ))}
            </div>
            <button className="w-full mt-4 py-3 text-center text-white/60 hover:text-white transition-colors duration-300 border border-white/10 rounded-2xl hover:border-white/20">
              Ver Todas as Atividades
            </button>
          </ProfileSection>

          {/* Conquistas */}
          <ProfileSection title="🏆 Conquistas">
            <div className="space-y-3">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-4 p-3 rounded-2xl border transition-all duration-300 ${
                    achievement.earned
                      ? 'border-yellow-400/30 bg-yellow-400/10'
                      : 'border-white/10 bg-white/5'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                      achievement.earned
                        ? 'bg-yellow-400/20 text-yellow-400'
                        : 'bg-white/10 text-white/40'
                    }`}
                  >
                    {achievement.earned ? (
                      <TrophyIcon className="w-5 h-5" />
                    ) : (
                      <StarIcon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4
                      className={`font-medium ${
                        achievement.earned ? 'text-white' : 'text-white/60'
                      }`}
                    >
                      {achievement.title}
                    </h4>
                    <p
                      className={`text-sm ${
                        achievement.earned ? 'text-white/70' : 'text-white/40'
                      }`}
                    >
                      {achievement.description}
                    </p>
                  </div>
                  {achievement.earned && (
                    <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center">
                      <CheckCircleIcon className="w-4 h-4 text-gray-900" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ProfileSection>
        </div>

        {/* Progresso e Metas */}
        <ProfileSection title="🎯 Progresso Atual">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Nível de Produtividade */}
            <div className="text-center">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-4">
                <ChartBarIcon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Nível de Produtividade
              </h3>
              <div className="w-full bg-white/10 rounded-full h-3 mb-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full"
                  style={{ width: '78%' }}
                ></div>
              </div>
              <p className="text-white/60 text-sm">78% - Excelente!</p>
            </div>

            {/* Sequência Diária */}
            <div className="text-center">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mx-auto mb-4">
                <FireIcon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Sequência Diária
              </h3>
              <p className="text-3xl font-bold text-white mb-2">12</p>
              <p className="text-white/60 text-sm">dias consecutivos</p>
            </div>

            {/* Energia */}
            <div className="text-center">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mx-auto mb-4">
                <BoltIcon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Nível de Energia
              </h3>
              <div className="w-full bg-white/10 rounded-full h-3 mb-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full"
                  style={{ width: '85%' }}
                ></div>
              </div>
              <p className="text-white/60 text-sm">85% - Ótimo ritmo!</p>
            </div>
          </div>
        </ProfileSection>
      </div>
    </div>
  )
}
