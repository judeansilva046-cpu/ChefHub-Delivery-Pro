'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { getRecipes, deleteRecipe } from '@/lib/services/recipes.service'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Pagination } from '@/components/ui/Pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Search, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, formatPercent } from '@/lib/utils'

export default function ReceitasPage() {
  const { user } = useAuth()
  const [receitas, setReceitas] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

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
        const result = await getRecipes(empresa.id, { search, page })
        setReceitas(result.data)
        setTotal(result.total)
      }
      setLoading(false)
    }

    loadData()
  }, [user?.id, search, page])

  const handleDelete = async (id: string) => {
    if (confirm('Deletar receita?')) {
      await deleteRecipe(id)
      setReceitas(receitas.filter((r) => r.id !== id))
    }
  }

  return (
    <DashboardLayout breadcrumbs={[{ label: 'Receitas' }]}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-chefhub-dark-blue mb-2">
          Receitas
        </h1>
        <p className="text-gray-600">
          Gerencie suas fichas técnicas e cálculos de custo
        </p>
      </div>

      <div className="mb-6 flex gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar receita..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="pl-9"
            />
          </div>
        </div>
        <Link href="/receitas/novo">
          <Button variant="primary">+ Nova Receita</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Receitas ({total})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-chefhub-orange"></div>
            </div>
          ) : receitas.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-500">Nenhuma receita encontrada</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead align="right">Rendimento</TableHead>
                    <TableHead align="right">Custo Total</TableHead>
                    <TableHead align="right">CMV</TableHead>
                    <TableHead align="right">Margem</TableHead>
                    <TableHead align="center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {receitas.map((receita) => (
                    <TableRow key={receita.id}>
                      <TableCell className="font-medium">{receita.nome}</TableCell>
                      <TableCell align="right">{receita.rendimento} un</TableCell>
                      <TableCell align="right">
                        {formatCurrency(receita.custo_total)}
                      </TableCell>
                      <TableCell align="right">
                        <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm">
                          {formatPercent(receita.cmv_percentual)}
                        </span>
                      </TableCell>
                      <TableCell align="right">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                          {formatPercent(receita.margem_percentual)}
                        </span>
                      </TableCell>
                      <TableCell align="center">
                        <div className="flex gap-2 justify-center">
                          <Link href={`/receitas/${receita.id}`} className="text-blue-600">
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(receita.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {Math.ceil(total / 20) > 1 && (
                <Pagination
                  currentPage={page}
                  totalPages={Math.ceil(total / 20)}
                  onPageChange={setPage}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
