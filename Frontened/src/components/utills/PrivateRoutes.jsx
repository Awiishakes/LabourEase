import React from 'react'
import { useGlobal } from '../../context/ContextHolder'
import { Navigate, Outlet } from 'react-router-dom'

const PrivateRoutes = ({allowedRoles}) => {

  const {role, isAuthorized} = useGlobal()
   if (!isAuthorized) {
    return <Navigate to='/login' replace />
  }
  if (!allowedRoles.includes(role)) {
    return <Navigate to='/' replace />
  }

  
  return <Outlet />;

}
export default PrivateRoutes
