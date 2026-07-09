'use client'

import { useEffect, useRef } from 'react'
import * as Chart from 'chart.js'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

interface ExpensesChartProps {
  data: Array<{ categoria: string; valor: number }>
  isLoading?: boolean
}

export function ExpensesChart({ data, isLoading = false }: ExpensesChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart.Chart<'doughnut'> | null>(null)

  useEffect(() => {
    if (!canvasRef.current || !data || data.length === 0 || isLoading) return

    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    // Destruir chart anterior se existir
    if (chartRef.current) {
      chartRef.current.destroy()
    }

    const labels = data.map((item) => item.categoria)
    const values = data.map((item) => item.valor)

    const colors = [
      '#FF6B00',
      '#0B1F3A',
      '#10B981',
      '#F59E0B',
      '#EF4444',
      '#8B5CF6',
      '#06B6D4',
      '#EC4899',
    ]

    chartRef.current = new Chart.Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: colors.slice(0, labels.length),
            borderColor: '#FFF',
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: true,
            position: 'bottom' as const,
            labels: {
              padding: 15,
              font: {
                size: 12,
              },
            },
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const total = context.dataset.data.reduce(
                  (acc: number, val: number) => acc + val,
                  0
                ) as number
                const percentage = (
                  ((context.parsed as number) / total) *
                  100
                ).toFixed(1)
                return `R$ ${(context.parsed as number).toFixed(2).replace('.', ',')} (${percentage}%)`
              },
            },
          },
        },
      },
    })

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
      }
    }
  }, [data, isLoading])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Despesas por Categoria (Este Mês)</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-chefhub-orange"></div>
          </div>
        ) : data && data.length > 0 ? (
          <div className="relative h-80">
            <canvas ref={canvasRef}></canvas>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-sm">
              Nenhuma despesa registrada este mês
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
