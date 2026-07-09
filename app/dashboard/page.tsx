'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { useDashboard } from '@/lib/hooks/useDashboard'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Alert } from '@/components/ui/Alert'
import {
  StatCard,
  LowStockWidget,
  ExpiringProductsWidget,
  MostProfitableRecipesWidget,
  RevenueChart,
  ExpensesChart,
} from '@/components/modules/dashboard'
import { createClient } from '@/lib/supabase/client'
import {
  TrendingUp,
  Package,
  AlertCircle,
  DollarSign,
} from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuth()
  const [empresaId, setEmpresaId] = useState<string>('')
  const { stats, alerts, revenueData, expensesData, isLoading, error } =
    useDashboard(empresaId)

  // Buscar empresa_id do usuário
  useEffect(() => {
    const fetchEmpresa = async () => {
      if (!user?.id) return

      const supabase = createClient()
      const { data } = await supabase
        .from('empresas')
        .select('id')
        .eq('usuario_id', user.id)
        .limit(1)
        .single()

      if (data) {
        setEmpresaId(data.id)
      }
    }

    fetchEmpresa()
  }, [user?.id])

  return (
    <DashboardLayout breadcrumbs={[{ label: 'Dashboard' }]}>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-chefhub-dark-blue mb-2">
          Bem-vindo, {user?.nome.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-600">
          Acompanhe o desempenho do seu negócio em tempo real
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert
          variant="error"
          title="Erro ao carregar dados"
          closeable
        >
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Faturamento"
          value={stats?.faturamento || 0}
          format="currency"
          icon={<TrendingUp className="w-5 h-5" />}
          variant="default"
          subtitle="Este mês"
        />

        <StatCard
          title="Lucro Estimado"
          value={stats?.lucroEstimado || 0}
          format="currency"
          icon={<DollarSign className="w-5 h-5" />}
          variant="success"
          subtitle="Este mês"
        />

        <StatCard
          title="CMV Médio"
          value={stats?.cmvMedio || 0}
          format="percent"
          icon={<AlertCircle className="w-5 h-5" />}
          variant="warning"
          subtitle="Todas as receitas"
        />

        <StatCard
          title="Valor do Estoque"
          value={stats?.estoque || 0}
          format="currency"
          icon={<Package className="w-5 h-5" />}
          variant="default"
          subtitle="Total em estoque"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <RevenueChart
          data={revenueData || []}
          isLoading={isLoading}
        />
        <ExpensesChart
          data={expensesData || []}
          isLoading={isLoading}
        />
      </div>

      {/* Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <LowStockWidget
          items={alerts?.estoquesBaixos || []}
          isLoading={isLoading}
        />
        <ExpiringProductsWidget
          items={alerts?.produtosVencendo || []}
          isLoading={isLoading}
        />
      </div>

      {/* Most Profitable Recipes */}
      <div className="mb-8">
        <MostProfitableRecipesWidget
          items={alerts?.receitasLucrativas || []}
          isLoading={isLoading}
        />
      </div>

      {/* Info Section */}
      {!empresaId && (
        <Alert
          variant="info"
          title="Nenhuma empresa configurada"
        >
          Você precisa criar uma empresa para visualizar os dados do dashboard.
          Vá para Configurações para adicionar sua empresa.
        </Alert>
      )}
    </DashboardLayout>
  )
}
