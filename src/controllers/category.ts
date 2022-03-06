import { NextFunction, Request, Response } from 'express'
import { storage } from '../storage/main'
import catchAsync from '../utils/catchAsync'
import { message } from '../locales/get_message'

export class CategoryController{

    getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        
        const category = await storage.category.find(req.query)

        res.status(200).json({
            success: true,
            data: {
                category
            },
            message: message('All categories', 'en')
        })
    })

    create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const category = await storage.category.create(req.body)
        res.status(201).json({
            success: true,
            data: {
                category
            }
        })
    })

    update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const category = await storage.category.update(req.params.id, req.body)

        res.status(200).json({
            success: true,
            data: {
                category
            }
        })
    })

    delete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        await storage.category.delete(req.params.id)

        res.status(204).json({
            success: true,
            data: null
        })
    })

    
    
}