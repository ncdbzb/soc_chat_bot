import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const apiUrl = process.env.REACT_APP_API_URL;
export const testApi = createApi({
	reducerPath:'testApi',
	baseQuery: fetchBaseQuery({baseUrl: apiUrl}),
	endpoints: (builder) => ({
        generateTest: builder.mutation({
            query: ({docName}) => ({
                
                url: `${apiUrl}/get_test?filename=${docName}`,
                method: 'POST',
                credentials: 'include',
            })
        }),
        checkTrueAnswer: builder.mutation({
            query: ({id, answer}) => ({
                url: `${apiUrl}/check_test`,
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    request_id: id,
                    selected_option: answer,
                })
            })
        })
    })
})
export const {
    useGenerateTestMutation,
    useCheckTrueAnswerMutation
} = testApi