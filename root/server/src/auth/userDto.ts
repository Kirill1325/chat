import { IUserDto } from "./types"


export class UserDto {
    email: string
    username: string
    id: number
    // TODO: add status

    constructor(model: IUserDto) {
        this.email = model.email
        this.username = model.username
        this.id = model.id
    }

}