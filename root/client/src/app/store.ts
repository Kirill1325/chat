import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { userApi } from '../entities/user'
import userSlice from '../entities/user/model/userSlice'
import sidebarSlice from '../widgets/sidebar/model/sidebarSlice'
import settingsModalSlice from '../widgets/ssettingsModal/model/settingsModalSlice'

const rootReducer = combineReducers({
  [userApi.reducerPath]: userApi.reducer,
  userSlice,
  sidebarSlice,
  settingsModalSlice
})

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(userApi.middleware)
})

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store