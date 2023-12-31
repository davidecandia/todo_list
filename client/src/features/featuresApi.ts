// Need to use the React-specific entry point to allow generating React hooks
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { TNotes } from "../vite-env";
//https://notes-pbwe.onrender.com/

export const Notes = createApi({
  reducerPath: "Notes",
  baseQuery: fetchBaseQuery({ baseUrl: "https://notes-pbwe.onrender.com/" }),
  tagTypes: ["Notes"],
  endpoints: (builder) => ({
    createNote: builder.mutation<void, TNotes>({
      query: (value) => ({
        url: "notes",
        method: "POST",
        body: value,
      }),
      invalidatesTags: ["Notes"],
    }),
    getNoteById: builder.query<TNotes, string>({
      query: (id) => `/notes/${id}`,
      providesTags: ["Notes"],
    }),
    editNote: builder.mutation<TNotes, Partial<TNotes>>({
      query: ({ _id, title, description }) => ({
        url: `/notes/${_id}`,
        method: "PUT",
        body: { title, description },
      }),
      invalidatesTags: ["Notes"],
    }),
    // getNotes: builder.query<TNotes[], any>({
    //   query: (options) => ({
    //     url: "notes",
    //     method: "GET",
    //     headers: options.headers, // Aggiungi gli headers dalla configurazione
    //   }),
    //   providesTags: ["Notes"],
    // }),

    deleteNotes: builder.mutation<void, string>({
      query: (id) => ({
        url: `notes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notes"],
    }),
  }),
});

export const {
  // useGetNotesQuery,
  useCreateNoteMutation,
  useDeleteNotesMutation,
  useGetNoteByIdQuery,
  useEditNoteMutation,
} = Notes;
