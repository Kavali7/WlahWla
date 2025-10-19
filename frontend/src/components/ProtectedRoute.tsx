import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import LoadingScreen from './LoadingScreen'
import { useAuth } from '../contexts/AuthContext'

type ProtectedRouteProps = {
  redirectTo?: string
  children?: React.ReactNode
}

export function ProtectedRoute({ redirectTo = '/login', children }: ProtectedRouteProps) {
  const location = useLocation()
  const { isAuthenticated, initializing } = useAuth()

  if (initializing) {
    return <LoadingScreen />
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  if (children) {
    return <>{children}</>
  }

  return <Outlet />
}
