import { NextFunction, Request, Response } from 'express'
import { storage } from '../storage/main'
import catchAsync from '../utils/catchAsync'
import { message } from '../locales/get_message'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import fs from 'fs/promises'
import sharp, { strategy } from 'sharp'
import { any, object, string } from 'joi'
import AppError from '../utils/appError'

export class BlogController {
    getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        let blog: Object
        if (req.query.category) {
            const category = await storage.category.findOne({ name: req.query.category })
            blog = await storage.blog.find({ category: category._id })
        } else {
            blog = await storage.blog.find({})
        }

        res.status(200).json({
            success: true,
            data: {
                blog
            }
        })
    })

    getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const blog = await storage.blog.findOne({ _id: req.params.id })

        res.status(200).json({
            success: true,
            data: {
                blog
            }
        })
    })

    create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        let isCategory: any = await storage.category.find({ name: req.body.category })
        if (!isCategory.length) {
            throw new AppError(400, 'category_error')
        }

        if (req.files) {
            req.body.images = []
            let files: object[] = JSON.parse(JSON.stringify(req.files))
            await Promise.all(
                files.map(async (file: any) => {
                    const image = `blog_images/${file.fieldname}-${uuidv4()}`
                    await fs.writeFile(
                        path.join(__dirname, '../../uploads', `${image}.png`),
                        Buffer.from(file.buffer)
                    )
                    req.body.images.push(image)
                })
            )
        }

        req.body.creator = res.locals.id
        req.body.category = isCategory[0]._id

        const blog = await storage.blog.create(req.body)
        await storage.category.update(req.body.category, { $inc: { total_blogs: 1 } })
        res.status(201).json({
            success: true,
            data: {
                blog
            }
        })
    })

    update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        if (req.body.category) {
            let isCategory: any = await storage.category.find({ name: req.body.category })
            if (!isCategory.length) {
                throw new AppError(400, 'category_error')
            }
            req.body.category = isCategory[0]._id
        }
        const blog = await storage.blog.findOne({ _id: req.params.id })
        if (req.files) {
            // deleting old images
            if (blog.images.length) {
                await Promise.all(
                    blog.images.map(async (file) => {
                        await fs.unlink(path.join(__dirname, '../../uploads', `${file}.png`))
                    })
                )
            }

            // uploading new images
            req.body.images = []
            let files: object[] = JSON.parse(JSON.stringify(req.files))
            await Promise.all(
                files.map(async (file: any) => {
                    const image = `blog_images/${file.fieldname}-${uuidv4()}`
                    await fs.writeFile(
                        path.join(__dirname, '../../uploads', `${image}.png`),
                        Buffer.from(file.buffer)
                    )
                    req.body.images.push(image)
                })
            )
        }

        const updated_blog = await storage.blog.update(req.params.id, req.body)
        await storage.category.update(req.body.category, { $inc: { total_blogs: 1 } })
        await storage.category.update(blog.category, { $inc: { total_blogs: -1 } })
        res.status(200).json({
            success: true,
            data: {
                updated_blog
            }
        })
    })

    delete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        let blog_data = await storage.blog.delete(req.params.id)
        if (blog_data.images.length) {
            await Promise.all(
                blog_data.images.map(async (file: any) => {
                    await fs.unlink(path.join(__dirname, '../../uploads', `${file}.png`))
                })
            )
        }
        let category = await storage.category.update(blog_data.category, {
            $inc: { total_blogs: -1 }
        })

        if (!category) {
            throw new AppError(404, 'blog_404')
        }

        res.status(204).json({
            success: true,
            data: null
        })
    })
}
