import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../css/Event.css'

function countdown(startsAt, now) {
  const difference = new Date(startsAt).getTime() - now
  if (difference <= 0) return 'Event has passed'
  const days = Math.floor(difference / 86400000)
  const hours = Math.floor((difference % 86400000) / 3600000)
  const minutes = Math.floor((difference % 3600000) / 60000)
  if (days) return `Starts in ${days}d ${hours}h`
  if (hours) return `Starts in ${hours}h ${minutes}m`
  return `Starts in ${Math.max(1, minutes)}m`
}

const Event = ({ event }) => {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60000)
    return () => window.clearInterval(timer)
  }, [])

  const passed = new Date(event.starts_at).getTime() <= now
  const date = new Intl.DateTimeFormat('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', timeZone: 'America/Chicago', timeZoneName: 'short'
  }).format(new Date(event.starts_at))

  return (
    <article className={`event-card${passed ? ' event-card--past' : ''}`}>
      <div className="event-card__top">
        <span className="event-card__eyebrow">{passed ? 'Past event' : 'Coming up'}</span>
        <span className="event-card__countdown">{countdown(event.starts_at, now)}</span>
      </div>
      <h3>{event.title}</h3>
      <p>{event.description}</p>
      <div className="event-card__footer">
        <time dateTime={event.starts_at}>{date}</time>
        <Link to={`/locations/${event.location_slug}`}>{event.location_name}</Link>
      </div>
    </article>
  )
}

export default Event
