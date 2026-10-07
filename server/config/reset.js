import pool from './database.js'

const locations = [
  ['echolounge', 'Echo Lounge', '12 Resonance Way', 'UnityGrid City', 'TX', '75001', 'An intimate room for live music, open mics, and conversations.'],
  ['houseofblues', 'House of Blues', '48 Rhythm Street', 'UnityGrid City', 'TX', '75001', 'Big sound, bright lights, and a stage built for every genre.'],
  ['pavilion', 'The Pavilion', '100 Festival Road', 'UnityGrid City', 'TX', '75001', 'An open-air gathering place for markets, film nights, and festivals.'],
  ['americanairlines', 'American Airlines Center', '1 Arena Plaza', 'UnityGrid City', 'TX', '75001', 'The plaza’s largest destination for shows and community celebrations.']
]

const events = [
  ['echo-open-mic', 'Open Mic Under the Lights', 'An easygoing evening of music, poetry, and first performances.', 0, 3],
  ['echo-jazz', 'Midnight Jazz Sessions', 'Local players take the stage for a late-night jam.', 0, 10],
  ['blues-showcase', 'Blues & Soul Showcase', 'A lineup of neighborhood bands brings the house down.', 1, 5],
  ['blues-dance', 'Community Dance Night', 'Bring a friend and learn a few new moves.', 1, 14],
  ['pavilion-market', 'Makers Market', 'Browse art, food, and handmade finds from local creators.', 2, 2],
  ['pavilion-movies', 'Movies on the Lawn', 'A family-friendly outdoor screening under the stars.', 2, 18],
  ['arena-celebration', 'UnityGrid Celebration', 'A citywide evening of performances and shared stories.', 3, 7],
  ['arena-game', 'Neighborhood Games', 'Cheer on community teams in a day of friendly competition.', 3, 21],
  ['echo-past', 'Founding Night Jam', 'The first gathering that kicked off the plaza’s music series.', 0, -5]
]

async function main() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query(`
      CREATE TABLE IF NOT EXISTS locations (
        id SERIAL PRIMARY KEY,
        slug TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        address TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        zip TEXT NOT NULL,
        description TEXT NOT NULL
      )
    `)
    await client.query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        seed_key TEXT UNIQUE,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        starts_at TIMESTAMPTZ NOT NULL,
        location_id INTEGER NOT NULL REFERENCES locations(id) ON DELETE CASCADE
      )
    `)
    await client.query('CREATE INDEX IF NOT EXISTS events_location_starts_idx ON events(location_id, starts_at)')

    const ids = []
    for (const location of locations) {
      const { rows } = await client.query(
        `INSERT INTO locations (slug, name, address, city, state, zip, description)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, address = EXCLUDED.address,
           city = EXCLUDED.city, state = EXCLUDED.state, zip = EXCLUDED.zip,
           description = EXCLUDED.description RETURNING id`, location
      )
      ids.push(rows[0].id)
    }

    for (const [key, title, description, locationIndex, daysFromNow] of events) {
      await client.query(
        `INSERT INTO events (seed_key, title, description, starts_at, location_id)
         VALUES ($1, $2, $3, (((NOW() AT TIME ZONE 'America/Chicago')::date + $4::integer) + TIME '19:00') AT TIME ZONE 'America/Chicago', $5)
         ON CONFLICT (seed_key) DO NOTHING`,
        [key, title, description, daysFromNow, ids[locationIndex]]
      )
    }
    await client.query('COMMIT')
    console.log('Database ready: four locations and sample events are available.')
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
    await pool.end()
  }
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
