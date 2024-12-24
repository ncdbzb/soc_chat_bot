import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const apiUrl = process.env.REACT_APP_API_URL;
export const answerToQuestionApi = createApi({
	reducerPath:'answerToQuestionApi',
	baseQuery: fetchBaseQuery({baseUrl: apiUrl}),
	endpoints: (builder) => ({
        answerToQuestion: builder.mutation({
            query: ({docName, question}) => ({
                url: `${apiUrl}/get_answer?filename=${docName}&question=${question}`,
                method: 'POST',
                credentials: 'include',
            })
        })
    })
})
export const {
    useAnswerToQuestionMutation
} = answerToQuestionApi