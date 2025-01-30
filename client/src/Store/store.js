import {configureStore} from "@reduxjs/toolkit" 
import authslice from './patient/authslice.js'


export const store=configureStore({
    reducer:{
        auth:authslice
    }
})