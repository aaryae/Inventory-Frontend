import {
  object,
  string,
  bool,
  ref
} from 'yup'

export const registerSchema = object().shape({
  firstName: string().required('First name is required'),
  lastName: string().required('Last name is required'),
  email: string().email('Invalid email').required('Email is required'),
  phone: string().required('Phone number is required'),
  address: string().required('Address is required'),
  nationality: string().required('Nationality is required'),
  about: string().required('Please write something about yourself'),
  password: string().min(6, 'Minimum 6 characters').required('Password is required'),
  confirmPassword: string()
    .oneOf([ref('password'), null], 'Passwords must match')
    .required('Confirm your password'),
  acceptTerms: bool().oneOf([true], 'You must accept Terms & Conditions'),
})
