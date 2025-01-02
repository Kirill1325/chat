export enum UserStatus {
    online = 'Online',
    offline = 'Offline'
}

export enum UserRoles{
    user = 'User',
    admin = 'Admin'
}

export interface IUserDto {
    id: number,
    username: string,
    email: string,
    password: string,
    status: UserStatus | null,
    role: UserRoles | null
}