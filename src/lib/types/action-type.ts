export interface CreateActionRequest {
    name: string,
    desc: string,
    type: string,
    text?: string

}

export interface UpdateActionRequest {
    name: string,
    desc: string,
    type: string,
    text?: string

}
export interface Action {
    _id: string,
    name: string,
    desc: string, 
    type: string,
    text?: string;
    deleted: boolean,
    deletedAt: string 
    createdAt:string,
    updatedAt: string 
}