import mongoose, { Schema, Document } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

export interface IBlog extends Document {
    _id: string
    creator: string
    category:string,
    title:string,
    content:string,
    images:string[]
}

const blogSchema = new Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    creator: {
        type:String,
        ref:'Admin',
        required:true
    },
    category: {
        type: String,
        ref:"Category",
        required:true
    },
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    images:{
        type:Array,
        required:true
    }

}, {timestamps:true})

export default mongoose.model<IBlog>('Blog', blogSchema)
