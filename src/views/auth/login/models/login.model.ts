export interface LoginFormValues {
  email: string
  password: string
}

export interface LoginFieldError {
  message: string
}

export interface LoginFormErrors {
  email?: LoginFieldError[]
  password?: LoginFieldError[]
}

export interface LoginFormResolverResult {
  errors: LoginFormErrors
}

export interface SocialLoginPayload {
  email: string
  name: string
  providerId: string
}
