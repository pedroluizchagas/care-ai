import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: 'CareAI - Seu Assistente Pessoal Inteligente',
  description:
    'Seu assistente pessoal Freech para organizar sua vida com inteligência artificial. Gerencie tarefas, agenda, metas e muito mais.',
  keywords: 'assistente AI, Freech, produtividade, agenda, tarefas, metas, PWA',
  authors: [{ name: 'CareAI Team' }],
  creator: 'CareAI',
  publisher: 'CareAI',
  metadataBase: new URL('http://localhost:3001'),
  icons: {
    icon: [
      {
        url: '/freech-avatar.jpg',
        sizes: '192x192',
        type: 'image/jpeg',
      },
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      },
    ],
    shortcut: '/freech-avatar.jpg',
    apple: [
      {
        url: '/freech-avatar.jpg',
        sizes: '180x180',
        type: 'image/jpeg',
      },
    ],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'CareAI - Freech',
  },
  openGraph: {
    type: 'website',
    siteName: 'CareAI',
    title: 'CareAI - Seu Assistente Pessoal Inteligente',
    description: 'Seu assistente pessoal Freech para organizar sua vida',
    images: [
      {
        url: '/freech-avatar.jpg',
        width: 512,
        height: 512,
        alt: 'Freech - Assistente CareAI',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'CareAI - Seu Assistente Pessoal Inteligente',
    description: 'Seu assistente pessoal Freech para organizar sua vida',
    images: ['/freech-avatar.jpg'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#3b82f6',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.className} min-h-screen`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background:
                'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
              backdropFilter: 'blur(15px)',
              WebkitBackdropFilter: 'blur(15px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
              borderRadius: '1rem',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
            },
            success: {
              iconTheme: {
                primary: '#3b82f6',
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
              },
            },
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
