import { AdminRepo,} from '../repo/admin'
import { logger } from '../../config/logger'
import AppError from '../../utils/appError'
import Admin, { IAdmin } from '../../models/Admin'

export class AdminStorage implements AdminRepo{
    private scope = 'storage.admin'

    async find(): Promise<IAdmin[]> {
        try {
            let dbObj = await Admin.find()

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.find: finished with error: ${error}`)
            throw error
        }
    }

    async create(payload: IAdmin): Promise<IAdmin> {
        try {
            let dbObj = await Admin.create(payload)

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.create: finished with error: ${error}`)
            throw error
        }
    }

    async findOne(query: Object): Promise<IAdmin> {
        try {
            let dbObj = await Admin.findOne({ ...query })
            if (!dbObj) {
                logger.warn(`${this.scope}.get failed to findOne`)
                throw new AppError(401, 'user_401')
            }
            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.findOne: finished with error: ${error}`)
            throw error
        }
    }

    async update(id: string, payload: IAdmin): Promise<IAdmin> {
        try {
            let dbObj = await Admin.findByIdAndUpdate(id, payload, {
                new: true
            })

            if (!dbObj) {
                logger.warn(`${this.scope}.update failed to findByIdAndUpdate`)
                throw new AppError(404, 'sample_404')
            }

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.update: finished with error: ${error}`)
            throw error
        }
    }

    async delete(id: string): Promise<any> {
        try {
            let dbObj = await Admin.findByIdAndDelete(id)

            if (!dbObj) {
                logger.warn(`${this.scope}.delete failed to findByIdAndDelete`)
                throw new AppError(404, 'sample_404')
            }

            return dbObj
        } catch (error) {
            logger.error(`${this.scope}.delete: finished with error: ${error}`)
            throw error
        }
    }
}
