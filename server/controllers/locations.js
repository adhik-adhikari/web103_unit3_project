import pool from '../config/database.js'

export async function getLocations(_req, res, next) {
  try {
    const { rows } = await pool.query('SELECT id, slug, name, address, city, state, zip, description FROM locations ORDER BY id')
    res.json(rows)
  } catch (error) { next(error) }
}

export async function getLocation(req, res, next) {
  try {
    const { rows } = await pool.query('SELECT id, slug, name, address, city, state, zip, description FROM locations WHERE slug = $1', [req.params.slug])
    if (!rows.length) return res.status(404).json({ error: 'Location not found.' })
    res.json(rows[0])
  } catch (error) { next(error) }
}

export async function getLocationEvents(req, res, next) {
  try {
    const { rows } = await pool.query(
      `SELECT e.id, e.title, e.description, e.starts_at, e.location_id,
              l.name AS location_name, l.slug AS location_slug
       FROM events e JOIN locations l ON l.id = e.location_id
       WHERE l.slug = $1 ORDER BY e.starts_at ASC`,
      [req.params.slug]
    )
    res.json(rows)
  } catch (error) { next(error) }
}
