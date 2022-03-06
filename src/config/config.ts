import dotenv from 'dotenv'

dotenv.config()

interface Config {
    HttpPort: string
    MongoPort: number
    MongoDatabase: string
    JwtSecret: string
    NodeEnv: string
    SuperAdmin:string
}

let config: Config = {
    HttpPort: getConf('HTTP_PORT', '4000'),
    MongoPort: parseInt(getConf('MONGO_PORT', '27017')),
    MongoDatabase: getConf('MONGO_DATABASE', 'just_project'),
    JwtSecret: getConf('JWT_SECRET', 'my_secret'),
    NodeEnv: getConf('NODE_ENV', 'development'),
    SuperAdmin:getConf('SUPER_ADMIN', 'bb48408f-127a-451f-8b89-d543cd5c9c60')
}

function getConf(name: string, def: string = ''): string {
    if (process.env[name]) {
        return process.env[name] || ''
    }

    return def
}

export default config
