import React, { useEffect, useState } from 'react'
import Event from '../components/Event'
import EventsAPI from '../services/EventsAPI'
import LocationsAPI from '../services/LocationsAPI'
import '../css/LocationEvents.css'

const Events = () => {
  const [locations, setLocations] = useState([])
  const [events, setEvents] = useState([])
  const [selected, setSelected] = useState('')
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let active = true
    Promise.all([LocationsAPI.getAllLocations(), EventsAPI.getAllEvents()])
      .then(([places, allEvents]) => {
        if (!active) return
        setLocations(places)
        setEvents(allEvents)
        setStatus('ready')
      })
      .catch(error => { if (active) setStatus(error.message) })
    return () => { active = false }
  }, [])

  const visible = selected ? events.filter(event => event.location_slug === selected) : events

  return (
    <section className="events-page">
      <div className="page-intro"><span className="eyebrow">The plaza calendar</span><h2>Find your next gathering</h2><p>See what’s happening across all four locations.</p></div>
      {status === 'loading' ? <p className="status-message">Loading events…</p> : status !== 'ready' ? <p className="status-message" role="alert">{status}</p> : (
        <div className="content-section">
          <div className="section-heading">
            <h2>All events <span>({visible.length})</span></h2>
            <label className="filter-label">Location
              <select value={selected} onChange={event => setSelected(event.target.value)}>
                <option value="">All locations</option>
                {locations.map(location => <option key={location.id} value={location.slug}>{location.name}</option>)}
              </select>
            </label>
          </div>
          {visible.length ? <div className="event-grid">{visible.map(event => <Event key={event.id} event={event} />)}</div> : <p>No events match this location.</p>}
        </div>
      )}
    </section>
  )
}

export default Events
