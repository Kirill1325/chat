export interface IUserDto {
    email: string
    username: string
    id: string
}

export class UserDto {
    email: string
    username: string
    id: string

    constructor(model: IUserDto) {
        this.email = model.email
        this.username = model.username
        this.id = model.id
    }

}