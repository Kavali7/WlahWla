import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { getAuthToken } from '../lib/auth'

type ProtectedRouteProps = {
  redirectTo?: string
  children?: React.ReactNode
}

export function ProtectedRoute({ redirectTo = '/login', children }: ProtectedRouteProps) {
  const location = useLocation()
  const token = getAuthToken()
  const isAuthenticated = Boolean(token)

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  if (children) {
    return <>{children}</>
  }

  return <Outlet />
}
