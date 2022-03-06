import { NextFunction, Request, Response } from 'express'
import { logger } from '../config/logger'
import { storage } from '../storage/main'
import AppError from '../utils/appError'
import catchAsync from '../utils/catchAsync'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import sharp from 'sharp'
import fs from 'fs/promises'
import hash from '../helpers/bcrypt'
import { signToken } from '../middleware/auth'
import { message } from '../locales/get_message'

export class UserController{
    
    findAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const users = await storage.user.find(req.query)
        res.status(200).json({
            success: true,
            data: {
                users
            },
            message: message('user_getAll_200', res.locals.lang)
        })
    })

    getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const sample = await storage.sample.findOne({_id:req.params.id})

        res.status(200).json({
            success: true,
            data: {
                sample
            }
        })
    })

    create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
       let pass = req.body.password
       req.body.password = await hash.hashPassword(pass)
       let image
        if (req.file) {
             image = `images/${req.file.fieldname}-${uuidv4()}`
             await sharp(req.file.buffer).png().toFile(path.join(__dirname, '../../uploads', `${image}.png`))
        }
        const user = await storage.user.create({...req.body, photo:image})
        res.status(201).json({
            success: true,
            data: {
                user
            },
            message: message("user_create_200", res.locals.lang)
        })
    })

    login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        let {phone_number} = req.body
        const user = await storage.user.findOne({phone_number})
        let check = await hash.comparePassword(req.body.password, user.password)
        if(!check){
            logger.warn(`user.get failed to findOne`)
                throw new AppError(401, 'user_401')
        }
        let token= signToken(user.id, 'user')
        res.cookie('token', token)
        res.status(200).json({
            success: true,
            data: {
                user
            }
        })
    })
    
    update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        let check = await storage.user.findOne({_id:req.params.id})
        
        if (req.body.password) {
            req.body.password = await hash.hashPassword(req.body.password)
        }
        let image
        if (req.file) {
            if(check.photo){
                await fs.unlink(path.join(__dirname, '../../uploads', `${check.photo}.png`))
            }
             image = `user_images/${req.file.fieldname}-${uuidv4()}`
             await sharp(req.file.buffer).png().toFile(path.join(__dirname, '../../uploads', `${image}.png`))
        }

        const user = await storage.user.update(req.params.id, {...req.body, photo:image})

        res.status(200).json({
            success: true,
            data: {
                user
            }
        })
    })

    delete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        let user = await storage.user.delete(req.params.id)
        if(user.photo){
            await fs.unlink(path.join(__dirname, '../../uploads', `${user.photo}.png`))
        }
        res.status(200).json({
            success: true,
            data: null
        })
    })
}

function lang(arg0: string, lang: any) {
    throw new Error('Function not implemented.')
}
