import Joi from 'joi'
import { NextFunction, Request, Response } from 'express'
import catchAsync from '../utils/catchAsync'


export class BlogValidator {

    createSchema = Joi.object({
        category:Joi.string().min(3).max(40).required(),
        title:Joi.string().min(3).required(),
        content:Joi.string().required(),
    })

    updateSchema = Joi.object({
        category:Joi.string().min(3).max(40),
        title:Joi.string().min(3),
        content:Joi.string()
    })

    create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { error } = this.createSchema.validate(req.body)
        if (error) return next(error)
        next()
    })

    update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { error } = this.updateSchema.validate(req.body)
        if (error) return next(error)
        next()
    })

}
