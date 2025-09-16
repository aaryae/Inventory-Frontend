// import { Navigate, useLocation } from 'react-router-dom'

// const ProtectedRoute = ({ children, silent = false }) => {
//   const isLoggedIn = !!localStorage.getItem('token')
// //  const news = axios.get("http://localhost:5000/api/auth/me")
// //  console.log(news)
//   const location = useLocation()

//   if (!isLoggedIn) {
//     if (silent) {
//       return <Navigate to='/login' state={{ from: location }} replace />
//     }

//     return (
//       <div className='min-h-screen flex items-center justify-center text-center px-4 '>
//         <div className='max-w-md'>
//           <h1 className='text-4xl mb-4  text-red-700'>Please login first to view this page.</h1>
//         </div>
//       </div>
//     )
//   }

//   return children
// }

// export default ProtectedRoute

// import { Navigate, useLocation } from 'react-router-dom'

// const ProtectedRoute = ({ children, allowedRoles = [], silent = false }) => {
//   const token = localStorage.getItem('token')
//   const name = localStorage.getItem('username')
//   console.log("role:",name);

//   const location = useLocation()


//   if (!token) {
//     if (silent) {
//       return <Navigate to='/login' state={{ from: location }} replace />
//     }

//     return (
//       <div className='min-h-screen flex items-center justify-center text-center px-4'>
//         <div className='max-w-md'>
//           <h1 className='text-4xl mb-4 text-red-700'>
//             Please login first to view this page.
//           </h1>
//         </div>
//       </div>
//     )
//   }


//   if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
//     return <Navigate to='/not-authorized' replace />
//   }

//   return children
// }

// export default ProtectedRoute


import { Navigate, useLocation } from 'react-router-dom'

const ProtectedRoute = ({ children, allowedRoles = [], silent = false }) => {
  const token = localStorage.getItem('token')
  const username = localStorage.getItem('username') // e.g., "admin" or any other username
  const location = useLocation()

  // Determine role based on username
  const role = username === 'admin' ? 'admin' : 'user'

  console.log("role:", role)

  // Not logged in
  if (!token) {
    if (silent) {
      return <Navigate to='/login' state={{ from: location }} replace />
    }

    return (
      <div className='min-h-screen flex items-center justify-center text-center px-4'>
        <div className='max-w-md'>
          <h1 className='text-4xl mb-4 text-red-700'>
            Please login first to view this page.
          </h1>
        </div>
      </div>
    )
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to='/not-authorized' replace />
  }

  return children
}

export default ProtectedRoute
