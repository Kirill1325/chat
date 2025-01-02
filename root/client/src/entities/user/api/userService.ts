import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { User, Response } from '..'
import { UpdatePasswordRequest } from '../model/types'

const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_SERVER_URL,
    'credentials': 'include'
})

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery,

    endpoints: (builder) => ({

        registration: builder.mutation<Response, Partial<User>>({
            query: (user) => ({
                url: 'auth/registration/',
                method: 'POST',
                body: user,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': import.meta.env.VITE_CLIENT_URL,
                },
            })
        }),

        login: builder.mutation<Response, Partial<User>>({
            query: (user) => ({
                url: 'auth/login/',
                method: 'POST',
                body: user,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': import.meta.env.VITE_CLIENT_URL,
                },
            })
        }),

        refresh: builder.mutation<Response, void>({
            query: () => ({
                url: 'auth/refresh',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': import.meta.env.VITE_CLIENT_URL,
                },
            })
        }),

        logout: builder.mutation<string, void>({
            query: () => ({
                url: 'auth/logout',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': import.meta.env.VITE_CLIENT_URL,
                },
            })
        }),

        changePassword: builder.mutation<Response, UpdatePasswordRequest>({
            query: (body) => ({
                url: 'auth/change-password',
                method: 'POST',
                body,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': import.meta.env.VITE_CLIENT_URL,
                },
            })
        }),

        uploadPicture: builder.mutation<string, FormData>({
            query: (body) => ({
                url: 'auth/set-picture',
                method: 'POST',
                body,
                headers: {
                    // 'Content-Type': 'multipart/form-data',
                    'Access-Control-Allow-Origin': import.meta.env.VITE_CLIENT_URL,
                },
            })
        }),
    }),
})