import { object, string } from 'yup'

export const loginSchema = object().shape({
  email: string().email('Invalid email format').required('Email is required'),
  password: string().min(6, 'Minimum 6 characters').required('Password is required'),
})
