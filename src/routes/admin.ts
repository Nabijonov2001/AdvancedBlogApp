import { Router } from 'express'
import { AdminController } from '../controllers/admin'
import { AdminValidator } from '../validators/admin'
import multer from '../middleware/multer'
import { Middleware } from '../middleware/auth'

const router = Router({ mergeParams: true })
const controller = new AdminController()
const validator = new AdminValidator()
const middleware = new Middleware()

const upload = multer(['image/png', 'image/jpeg'], 20).single('photo')

router
    .get('/', middleware.auth(['super_admin']), controller.findAll)
    .post('/login', validator.login, controller.login)
    .post('/create-admin', middleware.auth(['super_admin']),  upload, validator.create, controller.create)
    .get('/:id', middleware.auth(['super_admin']), controller.findOne)
    .patch('/:id', middleware.auth(['admin']), upload, validator.update, controller.update)
    .delete('/:id', middleware.auth(['super_admin']), controller.delete)

export default router
