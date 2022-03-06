import { Router } from "express";
import multer from "../middleware/multer";
import { UserController } from "../controllers/user";
import { Middleware } from "../middleware/auth";
import { UserValidator } from "../validators/user";

const router = Router({ mergeParams: true })
const controller = new UserController()
const validator = new UserValidator()
const middleware = new Middleware()
const upload = multer(['image/png', 'image/jpeg'], 20).single('photo')

router.get('/', middleware.auth(['admin']), controller.findAll)
router.get('/:id', middleware.auth(['admin']), controller.getOne)
router.delete('/:id', middleware.auth(['admin']), controller.delete)
router.patch('/:id', upload, middleware.auth(['admin']), controller.update)
router.patch('/:id', middleware.auth(['admin']), controller.delete)
router.post('/create', upload, validator.create, controller.create)
router.post('/login', validator.login, controller.login)

export default router