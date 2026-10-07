async function getJson(path) {
  const response = await fetch(`/api${path}`)
  if (!response.ok) {
    let message = 'Unable to load data. Please try again.'
    try { message = (await response.json()).error || message } catch { /* non-JSON response */ }
    throw new Error(message)
  }
  return response.json()
}

export default getJson
