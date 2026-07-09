'use client'

import { useEffect, useRef } from 'react'
import * as Chart from 'chart.js'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

interface RevenueChartProps {
  data: Array<{ dia: string; valor: number }>
  isLoading?: boolean
}

export function RevenueChart({ data, isLoading = false }: RevenueChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart.Chart<'line'> | null>(null)

  useEffect(() => {
    if (!canvasRef.current || !data || data.length === 0 || isLoading) return

    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    // Destruir chart anterior se existir
    if (chartRef.current) {
      chartRef.current.destroy()
    }

    // Formatar datas para exibição
    const labels = data.map((item) => {
      const date = new Date(item.dia)
      return date.toLocaleDateString('pt-BR', {
        month: 'short',
        day: 'numeric',
      })
    })

    const values = data.map((item) => item.valor)

    chartRef.current = new Chart.Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Faturamento (R$)',
            data: values,
            borderColor: '#FF6B00',
            backgroundColor: 'rgba(255, 107, 0, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#FF6B00',
            pointBorderColor: '#FFF',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: true,
            position: 'top' as const,
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const value = context.parsed.y
                if (typeof value === 'number') {
                  return `R$ ${value.toFixed(2).replace('.', ',')}`
                }
                return 'R$ 0,00'
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return `R$ ${value}`
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
        <CardTitle className="text-lg">Faturamento (Últimos 30 dias)</CardTitle>
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
              Nenhum dado de faturamento disponível
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
