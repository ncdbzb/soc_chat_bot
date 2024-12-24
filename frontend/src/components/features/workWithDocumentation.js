import { createSlice } from '@reduxjs/toolkit'
import { docksApi } from '../store/services/docks'

const workDocumentation = createSlice({
  name: 'documentation',
  initialState: {},
  reducers: {
    updateDocumentation: (state, action)=> {
        state.name = action.payload.name
        state.description = action.payload.description
    },
    deleteDocumentation: (state, action) =>{
        state = null
    }
  },
    extraReducers:(builder) => {
        builder.addMatcher(
            docksApi.endpoints.getDocks.matchFulfilled,
            (state, action) => {
                state.name = action.payload.name
                state.description = action.payload.description
            }
        )
    }   

})

// Action creators are generated for each case reducer function
export const { updateDocumentation, deleteDocumentation } =workDocumentation.actions
export default workDocumentation.reducer