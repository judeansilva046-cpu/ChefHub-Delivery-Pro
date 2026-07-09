import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './Button'
import { cn } from '@/lib/utils'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  disabled?: boolean
  showNumbers?: boolean
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
  showNumbers = true,
}: PaginationProps) {
  const pages = []
  const maxVisiblePages = 5

  // Calcular páginas a mostrar
  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    // Sempre mostrar primeira página
    pages.push(1)

    // Páginas ao redor da página atual
    const startPage = Math.max(2, currentPage - 1)
    const endPage = Math.min(totalPages - 1, currentPage + 1)

    if (startPage > 2) {
      pages.push(-1) // Representa "..."
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    if (endPage < totalPages - 1) {
      pages.push(-1) // Representa "..."
    }

    // Sempre mostrar última página
    pages.push(totalPages)
  }

  return (
    <div className="flex items-center justify-between mt-6">
      <p className="text-sm text-gray-600">
        Página {currentPage} de {totalPages}
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={disabled || currentPage === 1}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {showNumbers && (
          <div className="flex items-center gap-1">
            {pages.map((page, index) =>
              page === -1 ? (
                <span key={`ellipsis-${index}`} className="px-2 py-1">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  disabled={disabled}
                  className={cn(
                    'px-3 py-1 rounded-lg text-sm font-medium transition-colors',
                    page === currentPage
                      ? 'bg-chefhub-orange text-white'
                      : 'text-gray-700 hover:bg-gray-100',
                    disabled && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {page}
                </button>
              )
            )}
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={disabled || currentPage === totalPages}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
