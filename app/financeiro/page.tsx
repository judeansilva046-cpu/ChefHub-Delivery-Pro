'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import {
  recordIncome,
  recordExpense,
  getFinancialTransactions,
  getFinancialSummary,
} from '@/lib/services/financial.service'
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
import { formatCurrency, formatDate } from '@/lib/utils'

export default function FinanceiroPage() {
  const { user } = useAuth()
  const [empresaId, setEmpresaId] = useState('')
  const [transactions, setTransactions] = useState<any[]>([])
  const [summary, setSummary] = useState({ receita: 0, despesa: 0, lucro: 0 })
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    tipo: 'receita' as 'receita' | 'despesa',
    categoria: '',
    valor: '',
    dataLancamento: new Date().toISOString().split('T')[0],
    descricao: '',
  })

  const hoje = new Date()
  const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
    .toISOString()
    .split('T')[0]

  const loadData = async () => {
    if (!empresaId) return

    try {
      const trans = await getFinancialTransactions(empresaId, inicioMes, hoje.toISOString().split('T')[0])
      const summ = await getFinancialSummary(empresaId, inicioMes, hoje.toISOString().split('T')[0])

      setTransactions(trans)
      setSummary(summ)
    } catch (error) {
      console.error('Erro ao carregar financeiro:', error)
    }
  }

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
    loadData()
  }, [empresaId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const success =
      formData.tipo === 'receita'
        ? await recordIncome(
            empresaId,
            formData.categoria,
            parseFloat(formData.valor),
            formData.dataLancamento,
            formData.descricao
          )
        : await recordExpense(
            empresaId,
            formData.categoria,
            parseFloat(formData.valor),
            formData.dataLancamento,
            formData.descricao
          )

    if (success) {
      loadData()
      setShowForm(false)
      setFormData({
        tipo: 'receita',
        categoria: '',
        valor: '',
        dataLancamento: new Date().toISOString().split('T')[0],
        descricao: '',
      })
    }
  }

  return (
    <DashboardLayout breadcrumbs={[{ label: 'Financeiro' }]}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-chefhub-dark-blue mb-2">
          Financeiro
        </h1>
        <p className="text-gray-600">Gerencie receitas e despesas</p>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Receitas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(summary.receita)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Despesas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">
              {formatCurrency(summary.despesa)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Resultado</CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className={`text-2xl font-bold ${
                summary.lucro >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {formatCurrency(summary.lucro)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Lucro/Prejuízo</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <Button
          variant="primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ Cancelar' : '+ Novo Lançamento'}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Novo Lançamento</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Select
                label="Tipo"
                options={[
                  { value: 'receita', label: 'Receita' },
                  { value: 'despesa', label: 'Despesa' },
                ]}
                value={formData.tipo}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tipo: e.target.value as 'receita' | 'despesa',
                    categoria: '',
                  })
                }
              />

              <Select
                label="Categoria"
                options={
                  formData.tipo === 'receita'
                    ? [
                        { value: 'venda_balcao', label: 'Venda Balcão' },
                        { value: 'venda_delivery', label: 'Venda Delivery' },
                      ]
                    : [
                        { value: 'compras', label: 'Compras' },
                        { value: 'aluguel', label: 'Aluguel' },
                        { value: 'energia', label: 'Energia' },
                        { value: 'agua', label: 'Água' },
                        { value: 'internet', label: 'Internet' },
                        { value: 'folha_pagamento', label: 'Folha Pagamento' },
                      ]
                }
                value={formData.categoria}
                onChange={(e) =>
                  setFormData({ ...formData, categoria: e.target.value })
                }
                required
              />

              <Input
                type="number"
                label="Valor (R$)"
                value={formData.valor}
                onChange={(e) =>
                  setFormData({ ...formData, valor: e.target.value })
                }
                step="0.01"
                required
              />

              <Input
                type="date"
                label="Data"
                value={formData.dataLancamento}
                onChange={(e) =>
                  setFormData({ ...formData, dataLancamento: e.target.value })
                }
                required
              />

              <Input
                label="Descrição (opcional)"
                value={formData.descricao}
                onChange={(e) =>
                  setFormData({ ...formData, descricao: e.target.value })
                }
              />

              <Button type="submit" variant="primary">
                Registrar
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Movimentações ({transactions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-chefhub-orange"></div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-500">Nenhuma movimentação</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead align="right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>{formatDate(t.data_lancamento)}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          t.tipo === 'receita'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {t.tipo === 'receita' ? 'Receita' : 'Despesa'}
                      </span>
                    </TableCell>
                    <TableCell>{t.categoria}</TableCell>
                    <TableCell>{t.descricao || '-'}</TableCell>
                    <TableCell
                      align="right"
                      className={
                        t.tipo === 'receita'
                          ? 'text-green-600 font-semibold'
                          : 'text-red-600 font-semibold'
                      }
                    >
                      {t.tipo === 'receita' ? '+' : '-'}
                      {formatCurrency(t.valor)}
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
