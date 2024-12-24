import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const apiUrl = process.env.REACT_APP_API_URL;
export const feedbackApi = createApi({
	reducerPath:'feedbackApi',
	baseQuery: fetchBaseQuery({baseUrl: apiUrl}),
	endpoints: (builder) => ({
        sendFeedback:builder.mutation({
            query: (requestData)=>({
                url: `${apiUrl}/send_feedback`,
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify(requestData),
                headers: {
                    'Content-Type': 'application/json',
                }
            })
        })
    })
})
export const {
    useSendFeedbackMutation
} = feedbackApi
