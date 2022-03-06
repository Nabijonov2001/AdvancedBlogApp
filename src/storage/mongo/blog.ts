import { BlogRepo} from '../repo/blog'
import Blog, { IBlog } from '../../models/Blog'
import { logger } from '../../config/logger'
import AppError from '../../utils/appError'
import config from '../../config/config'

export class BlogStorage implements BlogRepo {
    private scope = 'storage.blog'

    async find(query: Object): Promise<IBlog[]> {
        try {
            let dbObj = await Blog.find({ ...query })
                // .populate('category', 'name')
                // .populate('creator', 'name')

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.find: finished with error: ${error}`)
            throw error
        }
    }
    
    async findOne(query: Object): Promise<IBlog> {
        try {
            let dbObj = await Blog.findOne({ ...query })
                // .populate('category', 'name')
                // .populate('creator', 'name')

            if (!dbObj) {
                logger.warn(`${this.scope}.get failed to findOne`)
                throw new AppError(404, 'sample_404')
            }

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.findOne: finished with error: ${error}`)
            throw error
        }
    }

    async create(payload: IBlog): Promise<IBlog> {
        try {
            let dbObj = await Blog.create(payload)

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.create: finished with error: ${error}`)
            throw error
        }
    }

    async update(id: string, payload: IBlog): Promise<IBlog> {
        try {
            let dbObj = await Blog.findByIdAndUpdate(id, payload, {
                new: true
            })

            if (!dbObj) {
                logger.warn(`${this.scope}.update failed to findByIdAndUpdate`)
                throw new AppError(404, 'update_404')
            }

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.update: finished with error: ${error}`)
            throw error
        }
    }

    async updateMany(id:string, payload:Object):Promise<Object>{
        try {
            let dbObj =  await Blog.updateMany({creator:id}, payload)
            if (!dbObj) {
                logger.warn(`${this.scope}.update failed to updateMany`)
                throw new AppError(404, 'update_404')
            }
            
            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.update: finished with error: ${error}`)
            throw error
        }
    }
    
    async delete(id: string): Promise<any> {
        try {
            let dbObj = await Blog.findByIdAndDelete(id)

            if (!dbObj) {
                logger.warn(`${this.scope}.delete failed to findByIdAndDelete`)
                throw new AppError(404, 'blog_404')
            }

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.delete: finished with error: ${error}`)
            throw error
        }
    }
}
