export interface IUserDto {
    id: number,
    username: string,
    email: string,
    password: string,
    status: string | null,
    role: string | null
}