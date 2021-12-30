type ValidationError = {
  username?: boolean
  password?: boolean
}

type LoginForm = {
  username: string
  password: string
}

export const validateUser = ({ username, password }: LoginForm): ValidationError | null => {
  const validationErrors: ValidationError = {}
  if (username.trim() === '') validationErrors.username = true
  if (password.trim() === '') validationErrors.password = true
  if (Object.keys(validationErrors).length) return validationErrors
  return null
}
