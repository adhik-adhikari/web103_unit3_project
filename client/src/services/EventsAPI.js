import getJson from './api'

const EventsAPI = {
  getAllEvents: location => getJson(`/events${location ? `?location=${encodeURIComponent(location)}` : ''}`),
  getEventById: id => getJson(`/events/${encodeURIComponent(id)}`)
}

export default EventsAPI
