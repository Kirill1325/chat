export type User = {
    id: number
    username: string
    email: string
    password: string
}

export type UserDto = Omit<User, 'password'>

export type UpdatePasswordRequest = {
    oldPassword: string
    newPassword: string
}

export type Response = {
    user: UserDto
    accessToken: string
    refreshToken: string
}