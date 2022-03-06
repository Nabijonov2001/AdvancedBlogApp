import express, { Router } from 'express'
import path from 'path'
import userRouter from './user'
import blogRouter from './blog'
import adminRouter from './admin'
import categoryRouter from './category'

const router = Router({ mergeParams: true })

router.use('/api/file', express.static(path.join(__dirname, '../../../uploads')))

router.use('/api/user', userRouter)
router.use('/api/blog', blogRouter)
router.use('/api/category', categoryRouter)
router.use('/api/admin', adminRouter)

export default router
