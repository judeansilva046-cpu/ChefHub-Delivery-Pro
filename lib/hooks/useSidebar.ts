'use client'

import { useState, useCallback, useEffect } from 'react'
import { SidebarState } from '@/types/layout'

/**
 * Hook para gerenciar estado da sidebar
 * Persiste preferência do usuário em localStorage
 */
export function useSidebar() {
  const [state, setState] = useState<SidebarState>({
    isOpen: true,
    isCollapsed: false,
  })

  const [isMobile, setIsMobile] = useState(false)

  // Carregar estado do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-state')
    if (saved) {
      setState(JSON.parse(saved))
    }

    // Detectar se é mobile
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Salvar estado no localStorage
  const updateState = useCallback((newState: SidebarState) => {
    setState(newState)
    localStorage.setItem('sidebar-state', JSON.stringify(newState))
  }, [])

  const toggle = useCallback(() => {
    updateState({
      ...state,
      isOpen: !state.isOpen,
    })
  }, [state, updateState])

  const collapse = useCallback(() => {
    updateState({
      isOpen: true,
      isCollapsed: !state.isCollapsed,
    })
  }, [state, updateState])

  return {
    isOpen: state.isOpen,
    isCollapsed: state.isCollapsed,
    isMobile,
    toggle,
    collapse,
  }
}
