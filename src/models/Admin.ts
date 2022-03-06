import { string } from 'joi'
import mongoose, { Schema, Document } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

export interface IAdmin extends Document {
    _id: string
    name: {first_name:string, last_name:string}
    phone_number:string,
    password:string,
    role:string,
    photo:string
}

const adminSchema = new Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    name: {
        first_name:{
            type:String,
            required:true
        },
        last_name:{
            type:String,
            required:true
        }
    },
    phone_number: {
        type: String,
        min:14,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:'admin'
    },
    photo:{
        type:String,
        default:''
    }

}, {timestamps:true})

export default mongoose.model<IAdmin>('Admin', adminSchema)
