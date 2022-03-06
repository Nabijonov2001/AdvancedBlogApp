import bcrypt from 'bcrypt'

export = class Password{
    static async hashPassword(pass:string):Promise<string>{
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(pass, salt)
        return hash
    }
    
    static async comparePassword(password:string, hashedPassword:string){
        return await bcrypt.compare(password, hashedPassword)
    }
}