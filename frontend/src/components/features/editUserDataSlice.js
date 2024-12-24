import { createSlice } from '@reduxjs/toolkit'
import { usersApi } from '../store/services/users';


const editUserDataSlice = createSlice({
  name: 'editUser',
  initialState: {},
  reducers: {
    updateUser: (state, action)=> {
        state.surname =  action.payload.surname
        state.name =  action.payload.name
        state.email =  action.payload.email
        state.id =  action.payload.id
        state.is_active =  action.payload.is_active
        state.is_superuser =  action.payload.is_superuser
        state.is_verified =  action.payload.is_verified
        state.flag =  action.payload.flag
        
    },
    clearUser: (state, action) =>{
        state = null
    }
  },
    extraReducers:(builder) => {
        builder.addMatcher(
            usersApi.endpoints.getInformationUser.matchFulfilled,
            (state, action) => {
                state.surname =  action.payload.surname
                state.name =  action.payload.name
                state.email =  action.payload.email
                state.id =  action.payload.id
                state.is_active =  action.payload.is_active
                state.is_superuser =  action.payload.is_superuser
                state.is_verified =  action.payload.is_verified
            }
        )
    }   

})

// Action creators are generated for each case reducer function
export const { updateUser, clearUser } = editUserDataSlice.actions
export default editUserDataSlice.reducer