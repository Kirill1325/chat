export enum UserStatus {
    online = 'Online',
    offline = 'Offline'
}

export type User = {
    id: number
    username: string
    email: string
    password: string
}

export type UserDto = Omit<User, 'password'> & { status: UserStatus } & { profilePic: string | undefined }


export type Response = {
    user: UserDto
    accessToken: string
    refreshToken: string
}