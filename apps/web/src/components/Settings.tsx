'use client'

import {
  CogIcon,
  BellIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  PaintBrushIcon,
  LanguageIcon,
  MoonIcon,
  SunIcon,
  ComputerDesktopIcon,
  EyeIcon,
  EyeSlashIcon,
  TrashIcon,
  ArrowRightOnRectangleIcon,
  CheckIcon,
} from '@heroicons/react/24/outline'
import { useState } from 'react'

interface SettingsSectionProps {
  title: string
  children: React.ReactNode
}

function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <div className="glass-card p-6 rounded-3xl">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-3">
        <span>{title}</span>
      </h2>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

interface SettingItemProps {
  icon: React.ElementType
  title: string
  description: string
  children: React.ReactNode
}

function SettingItem({
  icon: Icon,
  title,
  description,
  children,
}: SettingItemProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-2xl bg-gradient-accent flex items-center justify-center">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-medium text-white">{title}</h3>
          <p className="text-sm text-white/60">{description}</p>
        </div>
      </div>
      <div className="flex items-center space-x-3">{children}</div>
    </div>
  )
}

interface ToggleProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
}

function Toggle({ enabled, onChange }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
        enabled ? 'bg-blue-600' : 'bg-white/20'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )
}

export default function Settings() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('dark')
  const [language, setLanguage] = useState('pt-BR')
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    desktop: false,
    sounds: true,
  })
  const [privacy, setPrivacy] = useState({
    analytics: true,
    crashReports: true,
    dataCollection: false,
  })

  const themes = [
    { id: 'light', name: 'Claro', icon: SunIcon },
    { id: 'dark', name: 'Escuro', icon: MoonIcon },
    { id: 'system', name: 'Sistema', icon: ComputerDesktopIcon },
  ]

  const languages = [
    { id: 'pt-BR', name: 'Português (Brasil)', flag: '🇧🇷' },
    { id: 'en-US', name: 'English (US)', flag: '🇺🇸' },
    { id: 'es-ES', name: 'Español', flag: '🇪🇸' },
  ]

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-accent mb-4 shadow-glow-blue">
            <CogIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Configurações</h1>
          <p className="text-white/60">Personalize sua experiência no CareAI</p>
        </div>

        {/* Aparência */}
        <SettingsSection title="🎨 Aparência">
          <SettingItem
            icon={PaintBrushIcon}
            title="Tema"
            description="Escolha como o aplicativo deve aparecer"
          >
            <div className="flex space-x-2">
              {themes.map((themeOption) => (
                <button
                  key={themeOption.id}
                  onClick={() => setTheme(themeOption.id as any)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-xl border transition-all duration-300 ${
                    theme === themeOption.id
                      ? 'border-blue-400 bg-blue-400/20 text-white'
                      : 'border-white/20 text-white/60 hover:border-white/40 hover:text-white'
                  }`}
                >
                  <themeOption.icon className="w-4 h-4" />
                  <span className="text-sm">{themeOption.name}</span>
                  {theme === themeOption.id && (
                    <CheckIcon className="w-4 h-4 text-blue-400" />
                  )}
                </button>
              ))}
            </div>
          </SettingItem>

          <SettingItem
            icon={LanguageIcon}
            title="Idioma"
            description="Selecione seu idioma preferido"
          >
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-sm focus:border-blue-400 focus:outline-none"
            >
              {languages.map((lang) => (
                <option key={lang.id} value={lang.id} className="bg-gray-900">
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </SettingItem>
        </SettingsSection>

        {/* Notificações */}
        <SettingsSection title="🔔 Notificações">
          <SettingItem
            icon={BellIcon}
            title="Notificações por Email"
            description="Receba atualizações importantes por email"
          >
            <Toggle
              enabled={notifications.email}
              onChange={(enabled) =>
                setNotifications({ ...notifications, email: enabled })
              }
            />
          </SettingItem>

          <SettingItem
            icon={BellIcon}
            title="Notificações Push"
            description="Notificações em tempo real no navegador"
          >
            <Toggle
              enabled={notifications.push}
              onChange={(enabled) =>
                setNotifications({ ...notifications, push: enabled })
              }
            />
          </SettingItem>

          <SettingItem
            icon={ComputerDesktopIcon}
            title="Notificações Desktop"
            description="Notificações na área de trabalho"
          >
            <Toggle
              enabled={notifications.desktop}
              onChange={(enabled) =>
                setNotifications({ ...notifications, desktop: enabled })
              }
            />
          </SettingItem>

          <SettingItem
            icon={BellIcon}
            title="Sons de Notificação"
            description="Reproduzir som ao receber notificações"
          >
            <Toggle
              enabled={notifications.sounds}
              onChange={(enabled) =>
                setNotifications({ ...notifications, sounds: enabled })
              }
            />
          </SettingItem>
        </SettingsSection>

        {/* Privacidade */}
        <SettingsSection title="🔒 Privacidade & Segurança">
          <SettingItem
            icon={ShieldCheckIcon}
            title="Análise de Uso"
            description="Ajude-nos a melhorar compartilhando dados de uso"
          >
            <Toggle
              enabled={privacy.analytics}
              onChange={(enabled) =>
                setPrivacy({ ...privacy, analytics: enabled })
              }
            />
          </SettingItem>

          <SettingItem
            icon={ShieldCheckIcon}
            title="Relatórios de Erro"
            description="Enviar relatórios automáticos de falhas"
          >
            <Toggle
              enabled={privacy.crashReports}
              onChange={(enabled) =>
                setPrivacy({ ...privacy, crashReports: enabled })
              }
            />
          </SettingItem>

          <SettingItem
            icon={EyeSlashIcon}
            title="Coleta de Dados"
            description="Permitir coleta de dados para personalização"
          >
            <Toggle
              enabled={privacy.dataCollection}
              onChange={(enabled) =>
                setPrivacy({ ...privacy, dataCollection: enabled })
              }
            />
          </SettingItem>
        </SettingsSection>

        {/* Conta */}
        <SettingsSection title="👤 Conta">
          <SettingItem
            icon={UserCircleIcon}
            title="Editar Perfil"
            description="Altere suas informações pessoais"
          >
            <button className="btn-secondary text-sm">Editar</button>
          </SettingItem>

          <SettingItem
            icon={EyeIcon}
            title="Alterar Senha"
            description="Atualize sua senha de acesso"
          >
            <button className="btn-secondary text-sm">Alterar</button>
          </SettingItem>

          <SettingItem
            icon={TrashIcon}
            title="Excluir Conta"
            description="Remover permanentemente sua conta"
          >
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm transition-colors duration-300">
              Excluir
            </button>
          </SettingItem>
        </SettingsSection>

        {/* Sobre */}
        <SettingsSection title="ℹ️ Sobre">
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-3xl bg-gradient-accent flex items-center justify-center mx-auto mb-4 shadow-glow-blue">
              <CogIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">CareAI</h3>
            <p className="text-white/60 mb-4">Versão 1.0.0</p>
            <p className="text-sm text-white/40 max-w-md mx-auto">
              Seu assistente pessoal inteligente para produtividade e bem-estar.
              Desenvolvido com ❤️ para tornar sua vida mais organizada.
            </p>
          </div>

          <div className="flex justify-center pt-6">
            <button className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors duration-300">
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span>Sair da Conta</span>
            </button>
          </div>
        </SettingsSection>
      </div>
    </div>
  )
}
