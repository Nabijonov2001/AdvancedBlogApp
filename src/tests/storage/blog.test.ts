import { IBlog } from '../../models/Blog'
import { BlogStorage } from '../../storage/mongo/blog'
import Database from '../../core/db'

let storage = new BlogStorage()

beforeAll(async () => {
    const db = new Database()
    db.connect()
})

describe('Checking storage.blog', () => {
    const blog = {
        _id: '8bf5fc5c-0558-408c-a12-5995dca952a0cd',
        creator: '8bf5fc5c-0558-408c-a12-5995dca962a0cd',
        category:'8bf5fc5c-0558-408c-a12-5995dca962a0cd',
        title:'What is your name?',
        content:"JavaScript unit testing using Jest. We will look at how to setup.",
        images:['uploads/images/8bf5fc5c-0558-408c-a12-5995dca962a0cd', 'uploads/images/8bf5fc5c-0558-406c-a12-5995dca962a0cd']
    }

    const fake_id = '8bf5fc5c-0558-408c-a12f-95dca952a56'

    test('Create new blog: succes', () => {
        return storage.create(blog as IBlog).then((data) => {
            expect(data._id).toEqual(blog._id)
        })
    })

    test('Get all blog: success', () => {
        return storage.find({}).then((data) => {
            expect(data.length > 0).toBeTruthy()
        })
    })

    test('Get one blog: success', () => {
        return storage.findOne({ _id: blog._id }).then((data) => {
            expect(data._id).toEqual(blog._id)
        })
    })

    test('Get one blog: fail', () => {
        return storage.findOne({ _id: fake_id }).catch((error) => {
            expect(error.statusCode).toEqual(404)
        })
    })

    test('Get update blog: success', () => {
        const title = 'title updated'
        return storage.update(blog._id, { title } as IBlog).then((data) => {
            expect(data._id).toEqual(blog._id)
        })
    })

    test('Get update blog: fail', () => {
        const title = 'Title not updated'
        return storage.update(fake_id, { title} as IBlog).catch((error) => {
            expect(error.statusCode).toEqual(404)
        })
    })

    // test('Get update all blog: success', () => {
    //     const title = 'Title updated'
    //     return storage.updateMany(blog._id,  { title} as IBlog).then((data) => {
    //         expect(data.ok).toEqual(1)
    //     })
    // })

    // test('Get update all blog: fail', () => {
    //     const title = 'Title not updated'
    //     return storage.updateMany(blog._id, { title} as IBlog).catch((error) => {
    //         expect(error.statusCode).toEqual(404)
    //     })
    // })

    test('Get delete blog: succes', () => {
        return storage.delete(blog._id).then((data) => {
            expect(data._id).toEqual(blog._id)
        })
    })

    test('Get delete blog: fail', () => {
        return storage.delete(fake_id).catch((error) => {
            expect(error.statusCode).toEqual(404)
        })
    })
})
