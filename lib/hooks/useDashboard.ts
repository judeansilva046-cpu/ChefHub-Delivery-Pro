'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  getDashboardStats,
  getDashboardAlerts,
  getRevenueByDay,
  getExpensesByCategory,
  DashboardStats,
  DashboardAlerts,
} from '@/lib/services/dashboard.service'

interface UseDashboardReturn {
  stats: DashboardStats | null
  alerts: DashboardAlerts | null
  revenueData: Array<{ dia: string; valor: number }> | null
  expensesData: Array<{ categoria: string; valor: number }> | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * Hook para buscar dados do dashboard
 * Executa todas as queries em paralelo
 */
export function useDashboard(empresaId?: string): UseDashboardReturn {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [alerts, setAlerts] = useState<DashboardAlerts | null>(null)
  const [revenueData, setRevenueData] = useState<
    Array<{ dia: string; valor: number }> | null
  >(null)
  const [expensesData, setExpensesData] = useState<
    Array<{ categoria: string; valor: number }> | null
  >(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    if (!empresaId) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // Executar todas as queries em paralelo
      const [statsData, alertsData, revenueData, expensesData] =
        await Promise.all([
          getDashboardStats(empresaId),
          getDashboardAlerts(empresaId),
          getRevenueByDay(empresaId),
          getExpensesByCategory(empresaId),
        ])

      setStats(statsData)
      setAlerts(alertsData)
      setRevenueData(revenueData)
      setExpensesData(expensesData)
    } catch (err) {
      console.error('Erro ao buscar dados do dashboard:', err)
      setError('Erro ao carregar dados do dashboard')
    } finally {
      setIsLoading(false)
    }
  }, [empresaId])

  // Buscar dados ao montar ou quando empresaId muda
  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    stats,
    alerts,
    revenueData,
    expensesData,
    isLoading,
    error,
    refetch: fetchData,
  }
}
