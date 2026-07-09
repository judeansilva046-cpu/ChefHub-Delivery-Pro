import { AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'

interface LowStockItem {
  id: string
  nome: string
  estoque_atual: number
  estoque_minimo: number
}

interface LowStockWidgetProps {
  items: LowStockItem[]
  isLoading?: boolean
}

export function LowStockWidget({ items, isLoading = false }: LowStockWidgetProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            Estoque Baixo
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          Estoque Baixo
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-green-600 font-medium">✓ Todos os estoques estão OK</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ingrediente</TableHead>
                <TableHead align="right">Atual</TableHead>
                <TableHead align="right">Mínimo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <p className="font-medium text-gray-900">{item.nome}</p>
                  </TableCell>
                  <TableCell align="right">
                    <span className="text-red-600 font-semibold">
                      {item.estoque_atual}
                    </span>
                  </TableCell>
                  <TableCell align="right">
                    <span className="text-gray-600">{item.estoque_minimo}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <p className="text-xs text-gray-500 mt-4">
          Atenção: {items.length} ingrediente(s) com estoque baixo
        </p>
      </CardContent>
    </Card>
  )
}
