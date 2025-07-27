import { Navigate, useLocation } from 'react-router-dom'

const ProtectedRoute = ({ children, silent = false }) => {
  const isLoggedIn = !!localStorage.getItem('token')
  const location = useLocation()

  if (!isLoggedIn) {
    // ✅ If silent, just block access (could redirect)
    if (silent) {
      return <Navigate to='/login' state={{ from: location }} replace />
    }

    // ✅ Otherwise, show message
    return (
      <div className='min-h-screen flex items-center justify-center text-center px-4 '>
        <div className='max-w-md'>
          <h1 className='text-4xl mb-4  text-red-700'>Please login first to view this page.</h1>
        </div>
      </div>
    )
  }

  return children
}

export default ProtectedRoute
