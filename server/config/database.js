import pg from 'pg'
import dotenv from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '.env') })

const { Pool } = pg
if (process.env.DATABASE_URL && !/^postgres(?:ql)?:\/\//.test(process.env.DATABASE_URL)) {
  throw new Error('DATABASE_URL must be a PostgreSQL connection URL (postgres:// or postgresql://).')
}
const config = process.env.DATABASE_URL
  ? { connectionString: process.env.DATABASE_URL }
  : {
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      host: process.env.PGHOST,
      port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
      database: process.env.PGDATABASE
    }

config.connectionTimeoutMillis = 10000
if (process.env.PGSSLMODE === 'require') config.ssl = { rejectUnauthorized: true }

export default new Pool(config)
