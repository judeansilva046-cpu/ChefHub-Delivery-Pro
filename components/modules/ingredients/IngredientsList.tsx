'use client'

import Link from 'next/link'
import { Edit, Trash2, Search } from 'lucide-react'
import { useIngredients } from '@/lib/hooks/useIngredients'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'
import { Pagination } from '@/components/ui/Pagination'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Alert } from '@/components/ui/Alert'
import { deleteIngredient } from '@/lib/services/ingredients.service'

interface IngredientsListProps {
  empresaId: string
}

export function IngredientsList({ empresaId }: IngredientsListProps) {
  const {
    ingredients,
    total,
    page,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    setPage,
    refetch,
  } = useIngredients(empresaId)

  const totalPages = Math.ceil(total / 20)

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este ingrediente?')) {
      return
    }

    const success = await deleteIngredient(id)
    if (success) {
      refetch()
    }
  }

  return (
    <>
      {/* Header com busca e botão novo */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar ingrediente..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setPage(1)
              }}
              className="pl-9"
            />
          </div>
        </div>
        <Link href="/ingredientes/novo">
          <Button variant="primary" fullWidth={false}>
            + Novo Ingrediente
          </Button>
        </Link>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="error" title="Erro" closeable>
          {error}
        </Alert>
      )}

      {/* Tabela de Ingredientes */}
      <Card>
        <CardHeader>
          <CardTitle>Ingredientes ({total})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-chefhub-orange"></div>
            </div>
          ) : ingredients.length === 0 ? (
            <TableEmpty message="Nenhum ingrediente encontrado" />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Unidade</TableHead>
                    <TableHead align="right">Custo</TableHead>
                    <TableHead align="right">Estoque Mín.</TableHead>
                    <TableHead align="center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ingredients.map((ingredient) => (
                    <TableRow key={ingredient.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">
                            {ingredient.nome}
                          </p>
                          {ingredient.controla_validade && (
                            <p className="text-xs text-gray-500">
                              ⏰ Com validade
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {ingredient.unidade_medida}
                        </span>
                      </TableCell>
                      <TableCell align="right">
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(ingredient.custo_atual)}
                        </span>
                      </TableCell>
                      <TableCell align="right">
                        <span className="text-gray-600">
                          {ingredient.estoque_minimo}
                        </span>
                      </TableCell>
                      <TableCell align="center">
                        <div className="flex gap-2 justify-center">
                          <Link
                            href={`/ingredientes/${ingredient.id}`}
                            className="text-blue-600 hover:text-blue-800"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(ingredient.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Deletar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>
    </>
  )
}
