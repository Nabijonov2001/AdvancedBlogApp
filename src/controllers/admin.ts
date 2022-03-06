import { NextFunction, Request, Response } from 'express'
import { storage } from '../storage/main'
import catchAsync from '../utils/catchAsync'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import fs from 'fs/promises'
import sharp from 'sharp'
import hash from '../helpers/bcrypt'
import { logger } from '../config/logger'
import AppError from '../utils/appError'
import { signToken } from '../middleware/auth'

export class AdminController {

    findAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const admin = await storage.admin.find()
        res.status(200).json({
            success: true,
            data: {
                admin
            }
        })
    })

    findOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        let id = req.params.id
        const admin = await storage.admin.findOne({_id:id})
        res.status(200).json({
            success: true,
            data: {
                admin
            }
        })
    })

    create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {    
        let image
        if (req.file) {
            image = `images/${req.file.fieldname}-${uuidv4()}`
            await sharp(req.file.buffer)
                .png()
                .toFile(path.join(__dirname, '../../uploads', `${image}.png`))
        }
        let pass = req.body.password
        req.body.password = await hash.hashPassword(pass)
        const admin = await storage.admin.create({ ...req.body, photo: image })
        res.status(201).json({
            success: true,
            data: {
                admin
            }
        })
    })

    login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        let { phone_number } = req.body
        const admin = await storage.admin.findOne({ phone_number })
        let check = await hash.comparePassword(req.body.password, admin.password)
        if(!check){
            logger.warn(`admin.get failed to findOne`)
                throw new AppError(401, 'user_401')
        }
        let token = signToken(admin.id, admin.role)
        res.cookie('token', token)
        res.status(200).json({
            success: true,
            data: {
                admin
            }
        })
    })

    update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        let check = await storage.admin.findOne({_id:req.params.id})

        if (req.body.password) {
            req.body.password = await hash.hashPassword(req.body.password)
        }

        let image
        if (req.file) {
            if(check.photo){
                await fs.unlink(path.join(__dirname, '../../uploads', `${check.photo}.png`))
            }
            image = `admin_images/${req.file.fieldname}-${uuidv4()}`
            await sharp(req.file.buffer)
                .png()
                .toFile(path.join(__dirname, '../../uploads', `${image}.png`))
        }

        const updated_admin = await storage.admin.update(req.params.id, {...req.body, photo:image})

        res.status(200).json({
            success: true,
            data: {
                updated_admin
            }
        })
    })

    delete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

        let check = await storage.admin.findOne({_id:req.params.id})
        if(check.role === 'super_admin'){
            logger.warn(`admin.delete failed to delete`)
                throw new AppError(400, 'admin_400')
        }

        let admin = await storage.admin.delete(req.params.id)
        if(admin.photo){
            await fs.unlink(path.join(__dirname, '../../uploads', `${admin.photo}.png`))
        }


        let udate_blog = await storage.blog.updateMany(admin.id, {creator:res.locals.id})
        res.status(200).json({
            success: true,
            udate_blog,
            data: null
        })
    })


}