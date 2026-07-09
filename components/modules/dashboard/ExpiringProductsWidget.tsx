import { Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'
import { formatDate } from '@/lib/utils'

interface ExpiringProduct {
  id: string
  nome: string
  validade: string
  quantidade: number
}

interface ExpiringProductsWidgetProps {
  items: ExpiringProduct[]
  isLoading?: boolean
}

export function ExpiringProductsWidget({
  items,
  isLoading = false,
}: ExpiringProductsWidgetProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-red-600" />
            Produtos Vencendo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-chefhub-orange"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getDaysUntilExpiry = (expiryDate: string): number => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const diffTime = expiry.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const getStatusColor = (daysLeft: number) => {
    if (daysLeft <= 0) return 'bg-red-100 text-red-800'
    if (daysLeft <= 3) return 'bg-orange-100 text-orange-800'
    return 'bg-yellow-100 text-yellow-800'
  }

  const getStatusText = (daysLeft: number) => {
    if (daysLeft <= 0) return 'Vencido'
    if (daysLeft === 1) return '1 dia'
    return `${daysLeft} dias`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="w-5 h-5 text-red-600" />
          Produtos Vencendo
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-green-600 font-medium">✓ Nenhum produto vencendo</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead align="right">Validade</TableHead>
                <TableHead align="right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => {
                const daysLeft = getDaysUntilExpiry(item.validade)
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{item.nome}</p>
                        <p className="text-xs text-gray-500">
                          Qtd: {item.quantidade}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell align="right">
                      <span className="text-gray-600">
                        {formatDate(item.validade)}
                      </span>
                    </TableCell>
                    <TableCell align="right">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(
                          daysLeft
                        )}`}
                      >
                        {getStatusText(daysLeft)}
                      </span>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
