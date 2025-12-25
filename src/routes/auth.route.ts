import { Hono } from 'hono'
import * as controller from '../controllers/auth.controller'

const router = new Hono()

router.post('/token', controller.token)

export default router
