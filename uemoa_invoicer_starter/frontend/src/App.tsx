import React from 'react'
import Dashboard from './pages/Dashboard'
import AdminPanel from './pages/AdminPanel'
import Storefront from './pages/Storefront'

export default function App() {
  const [route, setRoute] = React.useState(window.location.hash || '#/dashboard')
  React.useEffect(() => {
    const onHash = () => setRoute(window.location.hash || '#/dashboard')
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  const Current = route.startsWith('#/admin') ? AdminPanel : (route.startsWith('#/store') ? Storefront : Dashboard)
  return (
    <div>
      <nav className="flex gap-3 p-3 border-b sticky top-0 bg-white">
        <a className="btn" href="#/dashboard">Dashboard</a>
        <a className="btn" href="#/store">Boutique</a>
        <a className="btn" href="#/admin">Control Panel</a>
      </nav>
      <Current />
    </div>
  )
}
