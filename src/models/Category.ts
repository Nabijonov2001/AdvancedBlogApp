import mongoose, { Schema, Document } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

export interface ICategory extends Document {
    _id: string
    name: string
    total_blogs:number
}

const categorySchema = new Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    name: {
        type:String,
        min:2,
        unique:true
    },
    total_blogs: {
        type: Number,
        default:0
    }

}, {timestamps:true})

export default mongoose.model<ICategory>('Category', categorySchema)
