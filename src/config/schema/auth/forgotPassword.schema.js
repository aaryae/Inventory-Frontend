import { object, string } from 'yup'

export const forgotPasswordSchema = object().shape({
  email: string().email('Invalid email format').required('Email is required'),
})
