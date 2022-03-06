import Joi from 'joi'
import { NextFunction, Request, Response } from 'express'
import catchAsync from '../utils/catchAsync'

export class SampleValidator {

    createSchema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required()
    })

    updateSchema = Joi.object({
        name: Joi.string(),
        description: Joi.string()
    })

    create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        console.log(req.body)
        // const { error } = this.createSchema.validate(req.body)
        // if (error) return next(error)

        // next()
    })

    update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { error } = this.updateSchema.validate(req.body)
        if (error) return next(error)

        next()
    })
}
