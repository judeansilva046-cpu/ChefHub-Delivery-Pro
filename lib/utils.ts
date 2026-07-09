import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind classes com suporte a conflitos
 * @example
 * cn('px-2 py-1', 'px-4') // 'py-1 px-4'
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formatar valor em moeda BRL
 */
export function formatCurrency(value: number, locale = 'pt-BR'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

/**
 * Formatar porcentagem
 */
export function formatPercent(value: number, decimals = 2): string {
  return `${Number(value).toFixed(decimals)}%`
}

/**
 * Formatar data
 */
export function formatDate(date: string | Date, locale = 'pt-BR'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

/**
 * Formatar data e hora
 */
export function formatDateTime(
  date: string | Date,
  locale = 'pt-BR'
): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

/**
 * Calcular CMV (Custo da Mercadoria Vendida)
 * CMV% = (Custo Total / Preço Final) × 100
 */
export function calculateCMV(
  totalCost: number,
  finalPrice: number
): number {
  if (finalPrice === 0) return 0
  return (totalCost / finalPrice) * 100
}

/**
 * Calcular Margem de Lucro
 * Margem% = ((Preço Final - Custo Total) / Preço Final) × 100
 */
export function calculateMargin(
  totalCost: number,
  finalPrice: number
): number {
  if (finalPrice === 0) return 0
  return ((finalPrice - totalCost) / finalPrice) * 100
}

/**
 * Calcular preço sugerido baseado em custo e margem desejada
 * Preço = Custo / (1 - Margem%)
 */
export function calculateSuggestedPrice(
  totalCost: number,
  desiredMarginPercent: number
): number {
  if (desiredMarginPercent >= 100) return 0
  return totalCost / (1 - desiredMarginPercent / 100)
}

/**
 * Delay para async/await
 */
export async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Validar email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validar CNPJ (formato básico)
 */
export function isValidCNPJ(cnpj: string): boolean {
  const cleanCNPJ = cnpj.replace(/\D/g, '')
  return cleanCNPJ.length === 14
}

/**
 * Remover caracteres especiais de um CNPJ
 */
export function cleanCNPJ(cnpj: string): string {
  return cnpj.replace(/\D/g, '')
}

/**
 * Formatar CNPJ para exibição
 */
export function formatCNPJ(cnpj: string): string {
  const clean = cleanCNPJ(cnpj)
  return clean.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
}

/**
 * Remover caracteres especiais de telefone
 */
export function cleanPhone(phone: string): string {
  return phone.replace(/\D/g, '')
}

/**
 * Formatar telefone para exibição
 */
export function formatPhone(phone: string): string {
  const clean = cleanPhone(phone)
  if (clean.length === 11) {
    return clean.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }
  if (clean.length === 10) {
    return clean.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }
  return phone
}

/**
 * Truncar string com elipses
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

/**
 * Capitalizar primeira letra
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}
