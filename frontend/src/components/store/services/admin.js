import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const apiUrl = process.env.REACT_APP_API_URL;
export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({ baseUrl: apiUrl}),
  endpoints: (builder) => ({
    getListFeedback: builder.mutation({
      query: (flag) => ({
        url: `/admin/get_feedback?all_feedbacks=${flag}`,
        method: 'POST'
      })
    }),
    getListUserVerification: builder.mutation({
      query: () => `/admin/requests`
    }),
    acceptUser: builder.mutation({
      query: (id) => ({
        url: `${apiUrl}/admin/accept?request_id=${id}`,
        method: "POST",
        credentials: "include",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
    }),
    rejectUser: builder.mutation({
      query: (id) => ({
        url: `${apiUrl}/admin/reject?request_id=${id}`,
        method: "POST",
        credentials: "include",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
    })
  })
})

export const {useGetListFeedbackMutation, useGetListUserVerificationMutation, useAcceptUserMutation, useRejectUserMutation} = adminApi