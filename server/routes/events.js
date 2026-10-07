import { Router } from 'express'
import { getEvent, getEvents } from '../controllers/events.js'

const router = Router()
router.get('/', getEvents)
router.get('/:id', getEvent)
export default router
