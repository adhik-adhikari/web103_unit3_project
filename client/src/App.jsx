import React from 'react'
import { Link, Navigate, useRoutes } from 'react-router-dom'
import Locations from './pages/Locations'
import LocationEvents from './pages/LocationEvents'
import Events from './pages/Events'
import './App.css'

const legacySlugs = ['echolounge', 'houseofblues', 'pavilion', 'americanairlines']

const App = () => {
  const element = useRoutes([
    { path: '/', element: <Locations /> },
    { path: '/locations/:slug', element: <LocationEvents /> },
    { path: '/events', element: <Events /> },
    ...legacySlugs.map(slug => ({ path: `/${slug}`, element: <Navigate to={`/locations/${slug}`} replace /> })),
    { path: '*', element: <section className="not-found"><h2>Page not found</h2><Link to="/">Return to the plaza</Link></section> }
  ])

  return (
    <div className="app">
      <header className="main-header">
        <Link className="brand" to="/">UnityGrid <span>Plaza</span></Link>
        <nav aria-label="Main navigation">
          <Link to="/">Map</Link>
          <Link to="/events">All events</Link>
        </nav>
      </header>
      <main id="main-content">{element}</main>
      <footer className="site-footer">Find your people. Find your place.</footer>
    </div>
  )
}

export default App
