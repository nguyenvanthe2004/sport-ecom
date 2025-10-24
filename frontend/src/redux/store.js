import { configureStore } from '@reduxjs/toolkit'
import currentUserReducer  from './slices/currentUser'
import cartReducer from './slices/cartSlice'

export const store = configureStore({
  reducer: {
    auth: currentUserReducer,
    cart: cartReducer,
  },
})