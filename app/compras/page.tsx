'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import {
  calculateIngredientsForProduction,
  createPurchaseList,
  getPendingPurchases,
} from '@/lib/services/smart-purchase.service'
import { getRecipes } from '@/lib/services/recipes.service'
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
import { Alert } from '@/components/ui/Alert'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency } from '@/lib/utils'

export default function ComprasPage() {
  const { user } = useAuth()
  const [empresaId, setEmpresaId] = useState('')
  const [receitas, setReceitas] = useState<any[]>([])
  const [compras, setCompras] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCalculator, setShowCalculator] = useState(false)
  const [calculatorData, setCalculatorData] = useState({
    recipeId: '',
    quantity: '1',
  })
  const [calculatedItems, setCalculatedItems] = useState<any[]>([])

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
        const recResult = await getRecipes(empresa.id)
        const compResult = await getPendingPurchases(empresa.id)
        setReceitas(recResult.data)
        setCompras(compResult)
      }
      setLoading(false)
    }

    loadData()
  }, [user?.id])

  const handleCalculate = async () => {
    if (!calculatorData.recipeId || !calculatorData.quantity) return

    const items = await calculateIngredientsForProduction(
      empresaId,
      calculatorData.recipeId,
      parseInt(calculatorData.quantity)
    )
    setCalculatedItems(items)
  }

  const handleCreatePurchase = async () => {
    const purchaseItems = calculatedItems
      .filter((item) => item.quantidadeComprar > 0)
      .map((item) => ({
        ingredienteId: item.ingredienteId,
        quantidade: item.quantidadeComprar,
        precoUnitario: item.custoUnitario,
      }))

    if (purchaseItems.length === 0) {
      alert('Nenhum item para comprar')
      return
    }

    const compraId = await createPurchaseList(empresaId, purchaseItems)
    if (compraId) {
      const compResult = await getPendingPurchases(empresaId)
      setCompras(compResult)
      setShowCalculator(false)
      setCalculatedItems([])
      setCalculatorData({ recipeId: '', quantity: '1' })
    }
  }

  return (
    <DashboardLayout breadcrumbs={[{ label: 'Compras' }]}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-chefhub-dark-blue mb-2">
          Compra Inteligente ⭐
        </h1>
        <p className="text-gray-600">
          Calcule automaticamente o que precisa comprar
        </p>
      </div>

      <Alert variant="info" title="Como funciona">
        Informe a receita e quantidade que deseja produzir. O sistema calcula automaticamente os
        ingredientes necessários, compara com o estoque e gera a lista de compra.
      </Alert>

      <div className="mt-6 mb-6">
        <Button
          variant="primary"
          onClick={() => setShowCalculator(!showCalculator)}
        >
          {showCalculator ? '✕ Cancelar' : '🧮 Calcular Compra'}
        </Button>
      </div>

      {showCalculator && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Calculadora de Compra</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Receita"
                  options={receitas.map((r) => ({
                    value: r.id,
                    label: r.nome,
                  }))}
                  value={calculatorData.recipeId}
                  onChange={(e) =>
                    setCalculatorData({
                      ...calculatorData,
                      recipeId: e.target.value,
                    })
                  }
                  required
                />

                <Input
                  type="number"
                  label="Quantidade para Produzir"
                  value={calculatorData.quantity}
                  onChange={(e) =>
                    setCalculatorData({
                      ...calculatorData,
                      quantity: e.target.value,
                    })
                  }
                  min="1"
                  required
                />
              </div>

              <Button onClick={handleCalculate} variant="secondary">
                Calcular
              </Button>

              {calculatedItems.length > 0 && (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ingrediente</TableHead>
                        <TableHead align="right">Necessário</TableHead>
                        <TableHead align="right">Em Estoque</TableHead>
                        <TableHead align="right">Para Comprar</TableHead>
                        <TableHead align="right">Custo</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {calculatedItems.map((item) => (
                        <TableRow
                          key={item.ingredienteId}
                          className={
                            item.quantidadeComprar > 0 ? 'bg-orange-50' : ''
                          }
                        >
                          <TableCell className="font-medium">
                            {item.nome}
                          </TableCell>
                          <TableCell align="right">
                            {item.quantidadeNecessaria} {item.unidadeMedida}
                          </TableCell>
                          <TableCell align="right">
                            {item.quantidadeEmEstoque}
                          </TableCell>
                          <TableCell align="right">
                            <span className="font-semibold">
                              {item.quantidadeComprar} {item.unidadeMedida}
                            </span>
                          </TableCell>
                          <TableCell align="right">
                            {formatCurrency(item.custoTotal)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-lg font-bold text-gray-900">
                      Custo Total da Compra:{' '}
                      {formatCurrency(
                        calculatedItems.reduce((acc, item) => acc + item.custoTotal, 0)
                      )}
                    </p>
                  </div>

                  <Button
                    onClick={handleCreatePurchase}
                    variant="primary"
                    fullWidth
                  >
                    ✓ Criar Lista de Compra
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Listas de Compra ({compras.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-chefhub-orange"></div>
            </div>
          ) : compras.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-500">Nenhuma compra planejada</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead align="right">Custo Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {compras.map((compra) => (
                  <TableRow key={compra.id}>
                    <TableCell>{compra.data_planejada}</TableCell>
                    <TableCell>{compra.itens_compra?.length || 0} items</TableCell>
                    <TableCell align="right">
                      {formatCurrency(compra.custo_total)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          compra.status === 'realizada'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {compra.status === 'realizada'
                          ? 'Realizada'
                          : 'Planejada'}
                      </span>
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
