import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface TableProps {
  children: ReactNode
  className?: string
}

export function Table({ children, className }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table
        className={cn(
          'w-full text-sm border-collapse',
          className
        )}
      >
        {children}
      </table>
    </div>
  )
}

interface TableHeaderProps {
  children: ReactNode
  className?: string
}

export function TableHeader({ children, className }: TableHeaderProps) {
  return (
    <thead className={cn('bg-gray-50 border-b border-gray-200', className)}>
      {children}
    </thead>
  )
}

interface TableBodyProps {
  children: ReactNode
  className?: string
}

export function TableBody({ children, className }: TableBodyProps) {
  return (
    <tbody className={cn('divide-y divide-gray-200', className)}>
      {children}
    </tbody>
  )
}

interface TableRowProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  clickable?: boolean
}

export function TableRow({
  children,
  className,
  onClick,
  clickable = false,
}: TableRowProps) {
  return (
    <tr
      className={cn(
        'hover:bg-gray-50 transition-colors',
        clickable && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </tr>
  )
}

interface TableHeadProps {
  children: ReactNode
  className?: string
  align?: 'left' | 'center' | 'right'
}

export function TableHead({ children, className, align = 'left' }: TableHeadProps) {
  return (
    <th
      className={cn(
        'px-4 py-2 font-semibold text-gray-700 text-xs uppercase tracking-wide',
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        className
      )}
    >
      {children}
    </th>
  )
}

interface TableCellProps {
  children: ReactNode
  className?: string
  align?: 'left' | 'center' | 'right'
}

export function TableCell({
  children,
  className,
  align = 'left',
}: TableCellProps) {
  return (
    <td
      className={cn(
        'px-4 py-3 text-gray-900',
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        className
      )}
    >
      {children}
    </td>
  )
}

interface TableEmptyProps {
  message?: string
}

export function TableEmpty({ message = 'Nenhum dado disponível' }: TableEmptyProps) {
  return (
    <div className="text-center py-8">
      <p className="text-gray-500 text-sm">{message}</p>
    </div>
  )
}
