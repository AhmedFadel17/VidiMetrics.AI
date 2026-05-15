import { mainApi } from '../mainApi';
import { ApiResponse, PaginationResponse, PaginationFilter, Lookup } from '@/types/api';
import { Character } from '@/types/models/storyEngine';

export interface CreateCharacterRequest {
  name: string;
  physicalDescription: string;
  clothingStyle: string;
  personalityTraits: string;
  role: string;
  voiceProfileId?: string;
  aiImageId: string;
  showId: string;
}

export interface UpdateCharacterRequest extends Partial<CreateCharacterRequest> { }

export interface CharacterFilter extends PaginationFilter {
  showId?: string;
  createdAfter?: string;
  createdBefore?: string;
}

export const charactersApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getCharacters: builder.query<ApiResponse<PaginationResponse<Character>>, CharacterFilter>({
      query: (filter) => {
        const params = new URLSearchParams();

        Object.entries(filter).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString());
          }
        });

        return {
          url: '/api/characters',
          params: params,
        };
      },
      providesTags: (result) =>
        result?.data?.items
          ? [
            ...result.data.items.map(({ id }) => ({ type: 'Character' as const, id })),
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

    getCharactersLookup: builder.query<ApiResponse<Lookup[]>, string | undefined>({
      query: (showId) => ({
        url: '/api/characters/lookup',
        params: showId ? { showId } : undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
            ...result.data.map(({ id }) => ({ type: 'Character' as const, id })),
            { type: 'Character', id: 'LOOKUP' },
          ]
          : [{ type: 'Character', id: 'LOOKUP' }],
    }),
  }),
});

export const {
  useGetCharactersQuery,
  useGetCharacterByIdQuery,
  useGetCharactersLookupQuery,
  useCreateCharacterMutation,
  useUpdateCharacterMutation,
  useDeleteCharacterMutation,
} = charactersApi;
