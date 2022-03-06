import { string } from 'joi'
import mongoose, { Schema, Document } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

export interface IUser extends Document {
    _id: string
    name: {first_name:string, last_name:string}
    phone_number:string,
    password:string,
    interested_categories:string[],
    photo:string
}

const userSchema = new Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    name: {
        first_name:String,
        last_name:String
    },
    phone_number: {
        type: String,
        unique:true,
        required:true
    },
    interested_categories:{
        type:Array
    },
    password:{
        type:String,
        required:true
    },
    photo:{
        type:String,
        default:''
    }

},{timestamps:true})

export default mongoose.model<IUser>('User', userSchema)
