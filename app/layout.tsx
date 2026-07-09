import type { Metadata } from 'next'
import './globals.css'
import { RootLayoutWrapper } from '@/components/layout/RootLayoutWrapper'

export const metadata: Metadata = {
  title: 'ChefHub Delivery Pro®',
  description: 'Plataforma SaaS de gestão para food service',
  viewport: 'width=device-width, initial-scale=1.0',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-white text-gray-900">
        <RootLayoutWrapper>
          {children}
        </RootLayoutWrapper>
      </body>
    </html>
  )
}
