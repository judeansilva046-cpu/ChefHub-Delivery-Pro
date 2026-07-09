import { TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { formatCurrency, formatPercent } from '@/lib/utils'

interface ProfitableRecipe {
  id: string
  nome: string
  margem_percentual: number
  preco_sugerido: number
}

interface MostProfitableRecipesWidgetProps {
  items: ProfitableRecipe[]
  isLoading?: boolean
}

export function MostProfitableRecipesWidget({
  items,
  isLoading = false,
}: MostProfitableRecipesWidgetProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Receitas Mais Lucrativas
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
          <TrendingUp className="w-5 h-5 text-green-600" />
          Receitas Mais Lucrativas
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500 text-sm">Nenhuma receita cadastrada</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((recipe, index) => (
              <div
                key={recipe.id}
                className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-transparent rounded-lg border border-green-100"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-chefhub-orange bg-chefhub-orange bg-opacity-10 px-2 py-0.5 rounded">
                      #{index + 1}
                    </span>
                    <p className="font-medium text-gray-900">{recipe.nome}</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    Preço: {formatCurrency(recipe.preco_sugerido)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">
                    {formatPercent(recipe.margem_percentual)}
                  </p>
                  <p className="text-xs text-gray-500">margem</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
