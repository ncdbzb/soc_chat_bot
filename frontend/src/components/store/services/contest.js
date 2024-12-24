import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const apiUrl = process.env.REACT_APP_API_URL;
export const contestApi = createApi({
  reducerPath: 'contestApi',
  baseQuery: fetchBaseQuery({ baseUrl: apiUrl}),
  endpoints: (builder) => ({
    getLeaderboard: builder.query({
      query: (docName)=>({
        url: `/contest/leaderboard/${docName}`
      })
    }),
    getLeaderboardMe: builder.query({
      query: ()=>({
        url: `/contest/leaderboard_me`
      })
    }),
  })
})

export const {useGetLeaderboardQuery, useGetLeaderboardMeQuery} = contestApi