import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
import locationsRouter from './routes/locations.js'
import eventsRouter from './routes/events.js'

const serverDir = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(serverDir, '.env') })

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use('/api/locations', locationsRouter)
app.use('/api/events', eventsRouter)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(serverDir, 'public')))
  app.get('*', (_req, res) => res.sendFile(path.join(serverDir, 'public', 'index.html')))
}

app.use((error, _req, res, _next) => {
  console.error(error)
  res.status(500).json({ error: 'The server could not complete this request.' })
})

app.listen(port, () => console.log(`Server listening on http://localhost:${port}`))
