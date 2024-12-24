import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const apiUrl = process.env.REACT_APP_API_URL;
export const api = createApi({
	reducerPath:'api',
	baseQuery: fetchBaseQuery({baseUrl: apiUrl}),
	endpoints: () => ({})
})
