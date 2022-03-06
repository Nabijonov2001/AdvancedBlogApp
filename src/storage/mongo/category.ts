import { CategoryRepo } from '../repo/category'
import Category, { ICategory } from '../../models/Category'
import { logger } from '../../config/logger'
import AppError from '../../utils/appError'

export class CategoryStorage implements CategoryRepo {
    private scope = 'storage.category'

    async find(query: Object): Promise<ICategory[]> {
        try {
            let dbObj = await Category.find({ ...query })
            
            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.find: finished with error: ${error}`)
            throw error
        }
    }

    async findOne(query: Object): Promise<ICategory> {
        try {
            let dbObj = await Category.findOne({ ...query })

            if (!dbObj) {
                logger.warn(`${this.scope}.get failed to findOne`)
                throw new AppError(404, 'category_404')
            }

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.findOne: finished with error: ${error}`)
            throw error
        }
    }

    async create(payload: ICategory): Promise<ICategory> {
        try {
            let dbObj = await Category.create(payload)

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.create: finished with error: ${error}`)
            throw error
        }
    }

    async update(id: string, payload: ICategory|Object): Promise<ICategory> {
        try {
            let dbObj = await Category.findByIdAndUpdate(id, payload, {
                new: true
            })

            if (!dbObj) {
                logger.warn(`${this.scope}.update failed to findByIdAndUpdate`)
                throw new AppError(404, 'category_404')
            }

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.update: finished with error: ${error}`)
            throw error
        }
    }

    async delete(id: string): Promise<any> {
        try {
            let dbObj = await Category.findByIdAndDelete(id)

            if (!dbObj) {
                logger.warn(`${this.scope}.delete failed to findByIdAndDelete`)
                throw new AppError(404, 'user_404')
            }

            if(dbObj.total_blogs>0){
                logger.warn(`${this.scope}.delete failed to delete`)
                throw new AppError(400, 'user_400')
            }

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.delete: finished with error: ${error}`)
            throw error
        }
    }   
}
