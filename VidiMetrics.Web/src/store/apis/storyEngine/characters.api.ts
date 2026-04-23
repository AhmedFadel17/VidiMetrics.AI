import { mainApi } from '../mainApi';
import { ApiResponse } from '@/types/api';
import { Character } from '@/types/models/storyEngine';

export interface CreateCharacterRequest {
  name: string;
  physicalDescription: string;
  clothingStyle: string;
  personalityTraits: string;
  voiceId?: string;
  referenceImageUrl?: string;
  showId: string;
}

export interface UpdateCharacterRequest extends CreateCharacterRequest {}

export const charactersApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getCharactersByShow: builder.query<ApiResponse<Character[]>, string>({
      query: (showId) => `/api/characters?showId=${showId}`,
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'Character' as const, id })),
              { type: 'Character', id: 'LIST' },
            ]
          : [{ type: 'Character', id: 'LIST' }],
    }),

    getCharacterById: builder.query<ApiResponse<Character>, string>({
      query: (id) => `/api/characters/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Character', id }],
    }),

    createCharacter: builder.mutation<ApiResponse<Character>, CreateCharacterRequest>({
      query: (body) => ({ url: '/api/characters', method: 'POST', body }),
      invalidatesTags: [{ type: 'Character', id: 'LIST' }],
    }),

    updateCharacter: builder.mutation<ApiResponse<Character>, { id: string; body: UpdateCharacterRequest }>({
      query: ({ id, body }) => ({ url: `/api/characters/${id}`, method: 'PUT', body }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: 'Character', id },
        { type: 'Character', id: 'LIST' },
      ],
    }),

    deleteCharacter: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/api/characters/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _err, id) => [
        { type: 'Character', id },
        { type: 'Character', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetCharactersByShowQuery,
  useGetCharacterByIdQuery,
  useCreateCharacterMutation,
  useUpdateCharacterMutation,
  useDeleteCharacterMutation,
} = charactersApi;
