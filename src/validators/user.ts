import Joi, { string } from 'joi'
import { NextFunction, Request, Response } from 'express'
import catchAsync from '../utils/catchAsync'


export class UserValidator {

    createSchema = Joi.object({
        name: Joi.object({
            first_name:Joi.string().min(2).max(50).required(),
            last_name: Joi.string().min(2).max(50).required()
        }),
        phone_number: Joi.string().min(13).required(),
        password:Joi.string().min(5).max(10).required(),
        interested_categories:Joi.array().items(Joi.string())
    })

    loginSchema = Joi.object({
        phone_number: Joi.string().min(13).required(),
        password:Joi.string().min(5).max(10).required()
    })
    updateSchema = Joi.object({
        name: Joi.string(),
        description: Joi.string()
    })

    create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        let {interested_categories}= req.body
        if(interested_categories){
            req.body.interested_categories = JSON.parse(interested_categories)
        }
        let {name} = req.body
        if(name){
           req.body.name = JSON.parse(name)
        }
        const { error } = this.createSchema.validate(req.body)
        if (error) return next(error)
        next()
    })

    login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { error } = this.loginSchema.validate(req.body)
        if (error) return next(error)
        next()
    })

}
