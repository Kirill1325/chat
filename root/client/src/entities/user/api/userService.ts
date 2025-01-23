import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { User, Response } from '..'

const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_SERVER_URL,
    'credentials': 'include'
})

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery,

    endpoints: (builder) => ({

        registration: builder.mutation<Response, Omit<User, 'id'>>({
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

        login: builder.mutation<Response, Omit<User, 'id' | 'username'>>({
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

        changePassword: builder.mutation<Response, { oldPassword: string, newPassword: string }>({
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

        // uploadProfilePic: builder.mutation<void, { pic: File, userId: number }>({
        //     query: (body) => {
        //         let formData = new FormData()
        //         formData.append('file', body.pic)
        //         formData.append('userId', body.userId.toString())

        //         return {
        //             url: "user/upload-profile-pic",
        //             method: "POST",
        //             body: formData,
        //             formData: true,
        //             headers: {
        //                 'Access-Control-Allow-Origin': import.meta.env.VITE_CLIENT_URL,
        //             },
        //         }
        //     },
        //     transformResponse: (response: any) => response.data,
        // }),

        // getProfilePic: builder.query<{ mimetype: string, fileName: string, filepath: string }, string>({
        //     query: (userId) => ({
        //         url: `user/profile-pic/${userId}`,
        //         method: 'GET',
        //         headers: {
        //             'Access-Control-Allow-Origin': import.meta.env.VITE_CLIENT_URL,
        //         },
        //     })
        // }),

    }),
})