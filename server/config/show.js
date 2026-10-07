import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '.env') })

const env = { ...process.env, PGCONNECT_TIMEOUT: '10' }

if (env.DATABASE_URL) {
  const url = new URL(env.DATABASE_URL)
  if (!['postgres:', 'postgresql:'].includes(url.protocol)) {
    throw new Error('DATABASE_URL must be a PostgreSQL connection URL.')
  }
  env.PGHOST = url.hostname
  env.PGPORT = url.port || '5432'
  env.PGUSER = decodeURIComponent(url.username)
  env.PGPASSWORD = decodeURIComponent(url.password)
  env.PGDATABASE = decodeURIComponent(url.pathname.slice(1))
  env.PGSSLMODE = env.PGSSLMODE || url.searchParams.get('sslmode') || 'require'
  delete env.DATABASE_URL
}

const result = spawnSync('psql', ['-X', '-c', 'SELECT * FROM events;'], {
  env,
  stdio: 'inherit'
})

if (result.error) {
  console.error('Unable to run psql. Install the PostgreSQL command-line tools.')
  process.exitCode = 1
} else {
  process.exitCode = result.status ?? 1
}
