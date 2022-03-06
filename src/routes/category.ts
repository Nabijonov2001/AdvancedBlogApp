import { Router } from "express";
import { CategoryController } from "../controllers/category";
import { Middleware } from "../middleware/auth";
import { CategoryValidator } from "../validators/category";

const router = Router({ mergeParams: true })
const controller = new CategoryController()
const validator = new CategoryValidator()
const middleware = new Middleware()


router.route('/').get(controller.getAll)
router
    .route('/create')
    .post(validator.create, controller.create)
router
    .route('/:id')
    .patch(middleware.auth(['admin']), validator.update, controller.update)
    .delete(middleware.auth(['admin']), controller.delete)
    

export default router