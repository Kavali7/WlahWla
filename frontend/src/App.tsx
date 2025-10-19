import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import LoadingScreen from './components/LoadingScreen'

export default function App() {
  return <RouterProvider router={router} fallbackElement={<LoadingScreen />} />
}
