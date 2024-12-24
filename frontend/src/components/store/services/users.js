import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const apiUrl = process.env.REACT_APP_API_URL;
export const usersApi= createApi({
  tagTypes: ['User'],
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({ baseUrl: apiUrl}),
  endpoints: (builder) => ({
    getInformationUser: builder.query({
      query: ()=>'users/me',
      providesTags: ['User']

    }),
    resetPassword: builder.mutation({
      query: ({data})=>({
        url: 'users/me',
        method: "PATCH",
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      }),
      invalidatesTags: ['User']
    })
  }),
})


export const { useGetInformationUserQuery, useResetPasswordMutation } = usersApi