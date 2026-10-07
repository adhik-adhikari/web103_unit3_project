import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Event from '../components/Event'
import LocationsAPI from '../services/LocationsAPI'
import '../css/LocationEvents.css'

const LocationEvents = () => {
  const { slug } = useParams()
  const [location, setLocation] = useState(null)
  const [events, setEvents] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let active = true
    setStatus('loading')
    Promise.all([LocationsAPI.getLocation(slug), LocationsAPI.getLocationEvents(slug)])
      .then(([place, placeEvents]) => {
        if (!active) return
        setLocation(place)
        setEvents(placeEvents)
        setStatus('ready')
      })
      .catch(error => { if (active) setStatus(error.message) })
    return () => { active = false }
  }, [slug])

  if (status === 'loading') return <p className="status-message">Loading location…</p>
  if (status !== 'ready') return <p className="status-message" role="alert">{status}</p>

  return (
    <section className="location-page">
      <div className="location-hero">
        <Link className="back-link" to="/">← Back to the map</Link>
        <span className="eyebrow">Explore the plaza</span>
        <h2>{location.name}</h2>
        <p>{location.description}</p>
        <address>{location.address}, {location.city}, {location.state} {location.zip}</address>
      </div>
      <div className="content-section">
        <div className="section-heading"><h2>Events at this location</h2><span>{events.length} events</span></div>
        {events.length ? <div className="event-grid">{events.map(event => <Event key={event.id} event={event} />)}</div> : <p>No events scheduled here yet.</p>}
      </div>
    </section>
  )
}

export default LocationEvents
