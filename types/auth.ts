// Tipos de Autenticação

export interface AuthUser {
  id: string
  email: string
  nome: string
  telefone?: string
  data_criacao: string
  ativo: boolean
}

export interface AuthSession {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  confirmPassword: string
  nome: string
  telefone?: string
}

export interface AuthError {
  message: string
  code?: string
}

export interface PasswordRecovery {
  email: string
}

export interface PasswordReset {
  token: string
  password: string
  confirmPassword: string
}
