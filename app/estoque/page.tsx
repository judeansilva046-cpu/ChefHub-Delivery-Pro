'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { getStockItems, registerStockMovement } from '@/lib/services/stock.service'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency } from '@/lib/utils'

export default function EstoquePage() {
  const { user } = useAuth()
  const [empresaId, setEmpresaId] = useState('')
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showMovement, setShowMovement] = useState(false)
  const [movementData, setMovementData] = useState({
    ingredienteId: '',
    tipo: 'entrada' as 'entrada' | 'saida' | 'ajuste',
    quantidade: '',
    descricao: '',
  })

  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) {
        setLoading(false)
        return
      }

      const supabase = createClient()
      const { data: empresa } = await supabase
        .from('empresas')
        .select('id')
        .eq('usuario_id', user.id)
        .single()

      if (empresa) {
        setEmpresaId(empresa.id)
        try {
          const stockItems = await getStockItems(empresa.id)
          setItems(stockItems)
        } catch (error) {
          console.error('Erro ao carregar estoque:', error)
        }
      }
      setLoading(false)
    }

    loadData()
  }, [user?.id])

  const handleMovement = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!movementData.ingredienteId || !movementData.quantidade) return

    const success = await registerStockMovement(
      empresaId,
      movementData.ingredienteId,
      movementData.tipo,
      parseFloat(movementData.quantidade),
      movementData.descricao || undefined,
      user?.id
    )

    if (success) {
      const stockItems = await getStockItems(empresaId)
      setItems(stockItems)
      setShowMovement(false)
      setMovementData({
        ingredienteId: '',
        tipo: 'entrada',
        quantidade: '',
        descricao: '',
      })
    }
  }

  return (
    <DashboardLayout breadcrumbs={[{ label: 'Estoque' }]}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-chefhub-dark-blue mb-2">
          Estoque
        </h1>
        <p className="text-gray-600">
          Visualize e gerencie o estoque de ingredientes
        </p>
      </div>

      <div className="mb-6">
        <Button
          variant="primary"
          onClick={() => setShowMovement(!showMovement)}
        >
          {showMovement ? '✕ Cancelar' : '+ Registrar Movimentação'}
        </Button>
      </div>

      {showMovement && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Registrar Movimentação</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleMovement} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Ingrediente"
                  options={items.map((item) => ({
                    value: item.ingrediente_id,
                    label: item.ingredientes?.nome || 'Desconhecido',
                  }))}
                  value={movementData.ingredienteId}
                  onChange={(e) =>
                    setMovementData({
                      ...movementData,
                      ingredienteId: e.target.value,
                    })
                  }
                  required
                />

                <Select
                  label="Tipo de Movimentação"
                  options={[
                    { value: 'entrada', label: 'Entrada' },
                    { value: 'saida', label: 'Saída' },
                    { value: 'ajuste', label: 'Ajuste' },
                  ]}
                  value={movementData.tipo}
                  onChange={(e) =>
                    setMovementData({
                      ...movementData,
                      tipo: e.target.value as 'entrada' | 'saida' | 'ajuste',
                    })
                  }
                />
              </div>

              <Input
                type="number"
                label="Quantidade"
                placeholder="0"
                value={movementData.quantidade}
                onChange={(e) =>
                  setMovementData({ ...movementData, quantidade: e.target.value })
                }
                step="0.01"
                required
              />

              <Input
                label="Descrição (opcional)"
                placeholder="Ex: Compra, Devolução, Perda"
                value={movementData.descricao}
                onChange={(e) =>
                  setMovementData({ ...movementData, descricao: e.target.value })
                }
              />

              <Button type="submit" variant="primary">
                Registrar Movimentação
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Estoque Atual ({items.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-chefhub-orange"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-500">Nenhum item em estoque</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ingrediente</TableHead>
                  <TableHead align="right">Quantidade</TableHead>
                  <TableHead align="right">Mínimo</TableHead>
                  <TableHead align="right">Valor Total</TableHead>
                  <TableHead align="center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.ingredientes?.nome}
                    </TableCell>
                    <TableCell align="right">
                      {item.quantidade} {item.ingredientes?.unidade_medida}
                    </TableCell>
                    <TableCell align="right">
                      {item.ingredientes?.estoque_minimo}
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(
                        item.quantidade * (item.ingredientes?.custo_atual || 0)
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {item.quantidade <= item.ingredientes?.estoque_minimo ? (
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                          Baixo
                        </span>
                      ) : (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                          OK
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
