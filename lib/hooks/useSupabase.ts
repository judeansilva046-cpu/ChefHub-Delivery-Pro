'use client'

import { useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'

/**
 * Hook para obter o cliente Supabase
 * Memoizado para evitar recreações desnecessárias
 */
export function useSupabase() {
  return useMemo(() => createClient(), [])
}
