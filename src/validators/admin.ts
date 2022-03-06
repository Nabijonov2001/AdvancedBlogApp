import Joi, { string } from 'joi'
import { NextFunction, Request, Response } from 'express'
import catchAsync from '../utils/catchAsync'

export class AdminValidator {
    createSchema = Joi.object({
        name: Joi.object({
            first_name: Joi.string().min(2).max(50).required(),
            last_name: Joi.string().min(2).max(50).required()
        }),
        phone_number: Joi.string().required(),
        password: Joi.string().min(5).max(10).required()
    })

    loginAdminSchema = Joi.object({
        phone_number: Joi.string().min(13).required(),
        password: Joi.string().min(5).max(10).required()
    })

    updateSchema = Joi.object({
        name: Joi.object({
            first_name: Joi.string().min(2).max(50),
            last_name: Joi.string().min(2).max(50)
        }),
        phone_number: Joi.string().min(13),
        password: Joi.string().min(5).max(10)
    })

    create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        let { name } = req.body
        if (name) {
            req.body.name = JSON.parse(name)
        }
        const { error } = this.createSchema.validate(req.body)
        if (error) return next(error)
        next()
    })

    login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { error } = this.loginAdminSchema.validate(req.body)
        if (error) return next(error)
        next()
    })

    update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        let { name } = req.body
        if (name) {
            req.body.name = JSON.parse(name)
        }
        const { error } = this.updateSchema.validate(req.body)
        if (error) return next(error)
        next()
    })
}
