import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { useResetPasswordMutation } from './users';

const apiUrl = process.env.REACT_APP_API_URL;
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: apiUrl}),
  endpoints: (builder) => ({
    logOut: builder.query({
      query: ()=>({
        url: 'auth/logout',
        method: 'POST'
      })
    }),
    logIn: builder.mutation({
      query: ({data})=>({
        url: 'auth/login',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            'username': data.email,
            'password': data.password,
        }).toString(),
      })
    }),
    signUp: builder.mutation({
      query: ({data})=>({
        url: 'auth/register',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
    }),
    resetPasswordUser: builder.mutation({
      query: ({token, password}) => ({
        url: `${apiUrl}/auth/reset-password/${token}?password=${password}`, 
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            'password': password
        }),
        credentials: 'include'
      })
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: `${apiUrl}/auth/forgot-password`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
    }),
    verifyUser: builder.query({
      query: (token) => ({
        url:`${apiUrl}/auth/verify/${token}`
      })
    })
  })
});

export const { 
  useLazyLogOutQuery,
  useLogInMutation, 
  useSignUpMutation,
  useResetPasswordUserMutation,
  useForgotPasswordMutation,
  useVerifyUserQuery
} = authApi;