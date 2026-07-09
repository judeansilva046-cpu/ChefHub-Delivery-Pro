'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import {
  getCMVByRecipeReport,
  getProfitByRecipeReport,
  getStockValueReport,
  getIngredientConsumptionReport,
  getProfitLossReport,
  getPurchaseReport,
} from '@/lib/services/reports.service'
import { Input } from '@/components/ui/Input'
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
import { formatCurrency, formatPercent } from '@/lib/utils'

export default function RelatoriosPage() {
  const { user } = useAuth()
  const [empresaId, setEmpresaId] = useState('')
  const [reportType, setReportType] = useState<'cmv' | 'lucro' | 'estoque' | 'consumo' | 'pl' | 'compras'>('cmv')
  const [reportData, setReportData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    inicio: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split('T')[0],
    fim: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    const fetchEmpresa = async () => {
      if (!user?.id) {
        setLoading(false)
        return
      }

      const supabase = createClient()
      const { data } = await supabase
        .from('empresas')
        .select('id')
        .eq('usuario_id', user.id)
        .single()

      if (data) {
        setEmpresaId(data.id)
      }
      setLoading(false)
    }

    fetchEmpresa()
  }, [user?.id])

  useEffect(() => {
    if (!empresaId) return

    const loadReport = async () => {
      setLoading(true)
      try {
        let data
        switch (reportType) {
          case 'cmv':
            data = await getCMVByRecipeReport(empresaId)
            break
          case 'lucro':
            data = await getProfitByRecipeReport(empresaId)
            break
          case 'estoque':
            data = await getStockValueReport(empresaId)
            break
          case 'consumo':
            data = await getIngredientConsumptionReport(
              empresaId,
              dateRange.inicio,
              dateRange.fim
            )
            break
          case 'pl':
            data = await getProfitLossReport(
              empresaId,
              dateRange.inicio,
              dateRange.fim
            )
            break
          case 'compras':
            data = await getPurchaseReport(
              empresaId,
              dateRange.inicio,
              dateRange.fim
            )
            break
        }
        setReportData(data)
      } catch (error) {
        console.error('Erro ao carregar relatório:', error)
      } finally {
        setLoading(false)
      }
    }

    loadReport()
  }, [empresaId, reportType, dateRange])

  const renderReport = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-chefhub-orange"></div>
        </div>
      )
    }

    switch (reportType) {
      case 'cmv':
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Receita</TableHead>
                <TableHead align="right">CMV %</TableHead>
                <TableHead align="right">Custo Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(reportData) &&
                reportData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.nome}</TableCell>
                    <TableCell align="right">
                      {formatPercent(item.cmv_percentual)}
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(item.custo_total)}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )

      case 'lucro':
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Receita</TableHead>
                <TableHead align="right">Margem %</TableHead>
                <TableHead align="right">Preço Sugerido</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(reportData) &&
                reportData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.nome}</TableCell>
                    <TableCell align="right">
                      {formatPercent(item.margem_percentual)}
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(item.preco_sugerido)}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )

      case 'estoque':
        return (
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ingrediente</TableHead>
                  <TableHead align="right">Quantidade</TableHead>
                  <TableHead align="right">Custo Unitário</TableHead>
                  <TableHead align="right">Valor Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData?.items?.map((item: any) => (
                  <TableRow key={item.nome}>
                    <TableCell className="font-medium">{item.nome}</TableCell>
                    <TableCell align="right">
                      {item.quantidade} {item.unidade}
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(item.custoUnitario)}
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(item.valorTotal)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 bg-gray-50 p-4 rounded-lg">
              <p className="text-lg font-bold">
                Valor Total do Estoque:{' '}
                {formatCurrency(reportData?.totalValue || 0)}
              </p>
            </div>
          </div>
        )

      case 'pl':
        return (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <p className="text-gray-600 mb-2">Receitas</p>
              <p className="text-3xl font-bold text-green-600">
                {formatCurrency(reportData?.receitas || 0)}
              </p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-gray-600 mb-2">Despesas</p>
              <p className="text-3xl font-bold text-red-600">
                {formatCurrency(reportData?.despesas || 0)}
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-gray-600 mb-2">Lucro Líquido</p>
              <p className="text-3xl font-bold text-blue-600">
                {formatCurrency(reportData?.lucroLiquido || 0)}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Margem: {formatPercent(reportData?.margemLiquida || 0)}
              </p>
            </div>
          </div>
        )

      default:
        return <p className="text-gray-500">Selecione um relatório</p>
    }
  }

  return (
    <DashboardLayout breadcrumbs={[{ label: 'Relatórios' }]}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-chefhub-dark-blue mb-2">
          Relatórios
        </h1>
        <p className="text-gray-600">
          Gere relatórios detalhados sobre sua operação
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Relatório
              </label>
              <select
                value={reportType}
                onChange={(e) =>
                  setReportType(
                    e.target.value as
                      | 'cmv'
                      | 'lucro'
                      | 'estoque'
                      | 'consumo'
                      | 'pl'
                      | 'compras'
                  )
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="cmv">CMV por Receita</option>
                <option value="lucro">Lucro por Receita</option>
                <option value="estoque">Valor do Estoque</option>
                <option value="consumo">Consumo de Ingredientes</option>
                <option value="pl">Demonstração do Resultado (P&L)</option>
                <option value="compras">Compras Realizadas</option>
              </select>
            </div>

            {['consumo', 'pl', 'compras'].includes(reportType) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="date"
                  label="Data Início"
                  value={dateRange.inicio}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, inicio: e.target.value })
                  }
                />
                <Input
                  type="date"
                  label="Data Fim"
                  value={dateRange.fim}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, fim: e.target.value })
                  }
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resultado</CardTitle>
        </CardHeader>
        <CardContent>{renderReport()}</CardContent>
      </Card>
    </DashboardLayout>
  )
}
