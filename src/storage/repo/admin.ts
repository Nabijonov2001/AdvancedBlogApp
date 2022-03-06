import { IAdmin } from '../../models/Admin'

export interface AdminRepo {
    find(): Promise<IAdmin[]>
    findOne(query: Object): Promise<IAdmin>
    create(payload: IAdmin): Promise<IAdmin>
    update(id: string, payload: IAdmin): Promise<IAdmin>
    delete(id:string):Promise<any>
}
