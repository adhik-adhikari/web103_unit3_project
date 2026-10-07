import { Router } from 'express'
import { getLocation, getLocationEvents, getLocations } from '../controllers/locations.js'

const router = Router()
router.get('/', getLocations)
router.get('/:slug/events', getLocationEvents)
router.get('/:slug', getLocation)
export default router
