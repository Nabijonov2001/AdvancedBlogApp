import { Router } from "express";
import { BlogController } from "../controllers/blog";
import { BlogValidator } from "../validators/blog";
import { Middleware } from "../middleware/auth";
import multer from '../middleware/multer'

const router = Router({ mergeParams: true })
const controller = new BlogController()
const middleware = new Middleware()
const validator = new BlogValidator()

const upload = multer(['image/png', 'image/jpeg'], 20).array('images', 2)

router
    .get('/', controller.getAll)
    .post('/', upload, middleware.auth(['admin']), validator.create, controller.create)
    
router
    .get('/:id', middleware.auth(['user', 'admin']), controller.getOne)
    .patch('/:id', upload, middleware.auth(['admin']), validator.update, controller.update)
    .delete('/:id', middleware.auth(['admin']), controller.delete)
    

export default router