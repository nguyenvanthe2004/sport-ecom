import { configureStore } from '@reduxjs/toolkit'
import currentUserReducer from './slices/currentUser'

export const store = configureStore({
  reducer: {
    auth: currentUserReducer,
  },
})