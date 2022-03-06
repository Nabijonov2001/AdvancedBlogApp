import { AdminStorage } from './mongo/admin'
import { BlogStorage } from './mongo/blog'
import { CategoryStorage } from './mongo/category'
import { SampleStorage } from './mongo/sample'
import { UserStorage } from './mongo/user'

interface IStorage {
    sample: SampleStorage
    user:UserStorage
    category:CategoryStorage,
    blog:BlogStorage,
    admin:AdminStorage
}

export let storage: IStorage = {
    sample: new SampleStorage(),
    user:new UserStorage(),
    category: new CategoryStorage(),
    blog:new BlogStorage(),
    admin:new AdminStorage()
}
