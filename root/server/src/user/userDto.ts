import { IUserDto, UserStatus } from "./types"


export class UserDto {
    email: string
    username: string
    id: number
    status: UserStatus

    constructor(model: IUserDto) {
        this.email = model.email
        this.username = model.username
        this.id = model.id
        this.status = model.status
    }

}