'use client'

import {
  createContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  AuthUser,
  LoginCredentials,
  RegisterCredentials,
  AuthError,
} from '@/types/auth'

interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: AuthError | null
  login: (credentials: LoginCredentials) => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<AuthError | null>(null)

  const supabase = createClient()

  // Carregar usuário atual ao montar o componente
  useEffect(() => {
    const loadUser = async () => {
      try {
        setIsLoading(true)

        // Obter sessão atual
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          // Buscar dados do usuário da tabela usuarios
          const { data, error: fetchError } = await supabase
            .from('usuarios')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (fetchError) {
            console.error('Erro ao carregar usuário:', fetchError)
            setUser(null)
          } else {
            setUser(data)
          }
        } else {
          setUser(null)
        }
      } catch (err) {
        console.error('Erro ao verificar autenticação:', err)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()

    // Observar mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Buscar dados do usuário
        const { data } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', session.user.id)
          .single()

        setUser(data || null)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [supabase])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        setIsLoading(true)
        setError(null)

        // Autenticar com Supabase Auth
        const { error: authError, data } =
          await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          })

        if (authError) {
          setError({
            message:
              authError.message || 'Erro ao fazer login. Tente novamente.',
            code: authError.code,
          })
          throw authError
        }

        // Buscar dados do usuário
        if (data.user) {
          const { data: userData, error: fetchError } = await supabase
            .from('usuarios')
            .select('*')
            .eq('id', data.user.id)
            .single()

          if (fetchError) {
            throw fetchError
          }

          setUser(userData)
        }
      } catch (err) {
        console.error('Erro ao fazer login:', err)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [supabase]
  )

  const register = useCallback(
    async (credentials: RegisterCredentials) => {
      try {
        setIsLoading(true)
        setError(null)

        // Criar conta de autenticação
        const { error: authError, data } = await supabase.auth.signUp({
          email: credentials.email,
          password: credentials.password,
        })

        if (authError) {
          setError({
            message:
              authError.message ||
              'Erro ao criar conta. Tente novamente.',
            code: authError.code,
          })
          throw authError
        }

        // Criar registro do usuário na tabela usuarios
        if (data.user) {
          const { error: insertError } = await supabase
            .from('usuarios')
            .insert({
              id: data.user.id,
              email: credentials.email,
              nome: credentials.nome,
              telefone: credentials.telefone,
            })

          if (insertError) {
            // Deletar a conta de autenticação se falhar ao criar usuário
            await supabase.auth.admin.deleteUser(data.user.id)
            throw insertError
          }

          // Buscar os dados do usuário criado
          const { data: userData } = await supabase
            .from('usuarios')
            .select('*')
            .eq('id', data.user.id)
            .single()

          setUser(userData || null)
        }
      } catch (err) {
        console.error('Erro ao registrar:', err)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [supabase]
  )

  const logout = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const { error: logoutError } = await supabase.auth.signOut()

      if (logoutError) {
        throw logoutError
      }

      setUser(null)
    } catch (err) {
      console.error('Erro ao fazer logout:', err)
      setError({
        message: 'Erro ao fazer logout',
      })
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [supabase])

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
