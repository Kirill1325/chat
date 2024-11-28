import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { User, Response } from '..'
import { UpdatePasswordRequest, UserDto } from '../model/types'
import { ChatType, ChatTypes } from '../../chatCard'

const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_SERVER_URL,
    'credentials': 'include'
})

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery,

    endpoints: (builder) => ({

        getUsers: builder.query<Omit<UserDto, 'email'>[], string>({
            query: (searchQuery) => ({
                url: `auth/users?query=${searchQuery}`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': import.meta.env.VITE_CLIENT_URL,
                },
            }),
        }),

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

        createChat: builder.mutation<{ chat_id: number }, { creatorId: number, type: ChatTypes }>({
            query: ({ creatorId, type }) => ({
                url: 'chats/create',
                method: 'POST',
                body: { creatorId, type },
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': import.meta.env.VITE_CLIENT_URL,
                },
            })

        }),

        getChats: builder.query<ChatType[], number>({
            query: (userId) => ({
                url: `chats/${userId}`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': import.meta.env.VITE_CLIENT_URL,
                },
            })
        }),

        connectToChat: builder.mutation<void, { chatId: number, userId: number }>({
            query: ({ chatId, userId }) => ({
                url: 'chats/connect',
                method: 'POST',
                body: { chatId, userId },
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': import.meta.env.VITE_CLIENT_URL,
                },
            })
        }),

        getLastMessage: builder.query<string, number>({
            query: (chatId) => ({
                url: `chats/last-message/${chatId}`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': import.meta.env.VITE_CLIENT_URL,
                },
            })
        }),

        getLastUser: builder.query<string, number>({
            query: (chatId) => ({
                url: `chats/last-user/${chatId}`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': import.meta.env.VITE_CLIENT_URL,
                },
            })
        }),
    }),
})