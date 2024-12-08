

import {configureStore} from '@reduxjs/toolkit'
import userReducer from './userSlice.js'

const store = configureStore({
    reducer:{
        token:userReducer
    }
})

export default store