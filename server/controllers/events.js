import pool from '../config/database.js'

export async function getEvents(req, res, next) {
  try {
    const params = []
    let where = ''
    if (req.query.location) {
      params.push(req.query.location)
      where = 'WHERE l.slug = $1'
    }
    const { rows } = await pool.query(
      `SELECT e.id, e.title, e.description, e.starts_at, e.location_id,
              l.name AS location_name, l.slug AS location_slug
       FROM events e JOIN locations l ON l.id = e.location_id
       ${where} ORDER BY e.starts_at ASC`, params
    )
    res.json(rows)
  } catch (error) { next(error) }
}

export async function getEvent(req, res, next) {
  try {
    const { rows } = await pool.query(
      `SELECT e.id, e.title, e.description, e.starts_at, e.location_id,
              l.name AS location_name, l.slug AS location_slug
       FROM events e JOIN locations l ON l.id = e.location_id WHERE e.id = $1`,
      [req.params.id]
    )
    if (!rows.length) return res.status(404).json({ error: 'Event not found.' })
    res.json(rows[0])
  } catch (error) { next(error) }
}
