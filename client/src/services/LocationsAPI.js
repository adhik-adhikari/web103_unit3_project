import getJson from './api'

const LocationsAPI = {
  getAllLocations: () => getJson('/locations'),
  getLocation: slug => getJson(`/locations/${encodeURIComponent(slug)}`),
  getLocationEvents: slug => getJson(`/locations/${encodeURIComponent(slug)}/events`)
}

export default LocationsAPI
