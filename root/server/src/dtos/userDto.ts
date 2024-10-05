interface IUserDto {
    email: string
    username: string
    id: string
    is_activated: boolean
}

export class UserDto {
    email: string
    username: string
    id: string
    isActivated: boolean

    constructor(model: IUserDto) {
        this.email = model.email
        this.username = model.username
        this.id = model.id
        this.isActivated = model.is_activated
    }

}