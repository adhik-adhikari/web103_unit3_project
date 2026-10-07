import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import LocationsAPI from '../services/LocationsAPI'
import unitygrid from '../assets/unitygrid.jpg'
import '../css/Locations.css'

const mapAreas = [
  { slug: 'echolounge', fallback: 'Echo Lounge', labelX: 104, labelY: 283, points: '2.97,234.52 17.94,198.9 34.45,188.58 52.52,191.68 56.65,196.32 69.03,162.26 84,137.48 103.61,121.48 126.32,109.61 154.71,125.61 175.87,149.87 189.81,176.71 199.61,206.13 205.81,229.35 210.45,243.81 206.84,272.19 214.58,285.1 214.58,302.13 203.74,334.13 194.45,351.68 205.29,366.65 132.52,366.65 159.35,391.42 155.74,399.68 119.61,399.68 86.06,399.68 62.84,399.68 25.16,399.68 0,397.61' },
  { slug: 'houseofblues', fallback: 'House of Blues', labelX: 478, labelY: 305, points: '358.58,353.74 376.65,322.77 389.55,314.52 384.39,280.45 407.61,272.19 422.06,220.58 438.58,126.65 449.42,38.39 457.68,16.71 468,35.81 474.19,103.42 491.74,203.03 508.26,261.87 517.03,281.48 517.03,214.9 529.42,194.26 540.77,197.35 540.77,169.48 552.13,167.94 556.77,149.87 566.06,156.06 566.06,193.74 577.42,211.81 577.42,238.65 601.16,254.65 594.45,302.13 575.87,335.68 587.23,353.74 601.16,363.55 358.58,363.55' },
  { slug: 'pavilion', fallback: 'The Pavilion', labelX: 897, labelY: 287, points: '998.06,83.81 952.65,31.16 914.45,16.71 877.29,43.55 833.94,102.39 811.74,161.23 796.77,241.23 802.97,303.16 833.94,353.23 871.61,385.23 954.71,385.23 1000.32,387.81' },
  { slug: 'americanairlines', fallback: 'American Airlines Center', labelX: 708, labelY: 333, points: '625,291 615,305 608,318 625,338 637,354 622.5,358 673,363.5 751,363.5 793,363.5 769,352 772,347 793,340 806,321 796.8,291 784,269 757,261 730,272 707,281 672,283' }
]

const Locations = () => {
  const [locations, setLocations] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    LocationsAPI.getAllLocations()
      .then(data => { if (active) setLocations(data) })
      .catch(err => { if (active) setError(err.message) })
    return () => { active = false }
  }, [])

  const names = Object.fromEntries(locations.map(location => [location.slug, location.name]))

  return (
    <section className="locations-page">
      <div className="home-intro">
        <span className="eyebrow">Your community, your next adventure</span>
        <h2>Explore the plaza</h2>
        <p>Choose a place on the map to discover its events.</p>
      </div>
      {error && <p className="map-error" role="alert">{error} The map remains available; try a location to reconnect.</p>}
      <div className="map-frame">
        <svg viewBox="0 0 1000 500" role="img" aria-label="Interactive map of four UnityGrid Plaza locations">
          <image href={unitygrid} x="0" y="0" width="1000" height="500" preserveAspectRatio="none" />
          {mapAreas.map(area => (
            <Link key={area.slug} to={`/locations/${area.slug}`} aria-label={`Explore ${names[area.slug] || area.fallback}`}>
              <polygon points={area.points} />
              <text x={area.labelX} y={area.labelY} textAnchor="middle">{names[area.slug] || area.fallback}</text>
            </Link>
          ))}
        </svg>
      </div>
      <div className="location-quick-links" aria-label="Locations">
        {mapAreas.map(area => <Link key={area.slug} to={`/locations/${area.slug}`}>{names[area.slug] || area.fallback} <span aria-hidden="true">↗</span></Link>)}
      </div>
    </section>
  )
}

export default Locations
