import { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { cn, formatCurrency, formatPercent } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: number | string
  icon: ReactNode
  subtitle?: string
  format?: 'currency' | 'percent' | 'number'
  variant?: 'default' | 'success' | 'warning' | 'danger'
  trend?: {
    value: number
    direction: 'up' | 'down'
  }
  className?: string
}

export function StatCard({
  title,
  value,
  icon,
  subtitle,
  format = 'number',
  variant = 'default',
  trend,
  className,
}: StatCardProps) {
  const formatValue = () => {
    if (typeof value === 'string') return value

    switch (format) {
      case 'currency':
        return formatCurrency(value)
      case 'percent':
        return formatPercent(value)
      case 'number':
      default:
        return value.toLocaleString('pt-BR')
    }
  }

  const variantColors = {
    default: {
      bg: 'bg-blue-50',
      icon: 'text-blue-600',
      text: 'text-blue-900',
    },
    success: {
      bg: 'bg-green-50',
      icon: 'text-green-600',
      text: 'text-green-900',
    },
    warning: {
      bg: 'bg-yellow-50',
      icon: 'text-yellow-600',
      text: 'text-yellow-900',
    },
    danger: {
      bg: 'bg-red-50',
      icon: 'text-red-600',
      text: 'text-red-900',
    },
  }

  const colors = variantColors[variant]

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <div className={cn('p-2 rounded-lg', colors.bg)}>
          <div className={colors.icon}>{icon}</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <div className={cn('text-2xl font-bold', colors.text)}>
            {formatValue()}
          </div>
          {trend && (
            <div
              className={cn(
                'text-xs font-semibold',
                trend.direction === 'up'
                  ? 'text-green-600'
                  : 'text-red-600'
              )}
            >
              {trend.direction === 'up' ? '↑' : '↓'} {trend.value}%
            </div>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  )
}
