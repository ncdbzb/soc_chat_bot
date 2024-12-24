import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { usersApi } from './services/users'
import { authApi } from './services/auth'
import { docksApi } from './services/docks'
import { contestApi } from './services/contest'
import { adminApi } from './services/admin'
import { answerToQuestionApi } from './services/answerToQuestion'
import { testApi } from './services/test'
import { feedbackApi } from './services/feedback'
import reducerUser from '../features/editUserDataSlice'
import reducerDocumentation from '../features/workWithDocumentation'

export const store = configureStore({
  reducer: {
		updateUser: reducerUser,
		updateDocumentation: reducerDocumentation,
		[usersApi.reducerPath]: usersApi.reducer,
		[authApi.reducerPath]: authApi.reducer,
		[docksApi.reducerPath]: docksApi.reducer,
		[contestApi.reducerPath]: contestApi.reducer,
		[adminApi.reducerPath]: adminApi.reducer,
		[answerToQuestionApi.reducerPath]: answerToQuestionApi.reducer,
		[testApi.reducerPath]: testApi.reducer,
		[feedbackApi.reducerPath]: feedbackApi.reducer
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware()
			.concat(usersApi.middleware)
      		.concat(authApi.middleware)
			.concat(docksApi.middleware)
			.concat(contestApi.middleware)
			.concat(adminApi.middleware)
			.concat(answerToQuestionApi.middleware)
			.concat(testApi.middleware)
			.concat(feedbackApi.middleware)
})



setupListeners(store.dispatch, store.getState)
