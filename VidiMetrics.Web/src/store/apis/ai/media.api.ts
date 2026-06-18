import { mainApi } from '../mainApi';
import { ApiResponse } from '@/types/api';
import { MediaStats } from '@/types/models/ai';

export const mediaApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getMediaStats: builder.query<ApiResponse<MediaStats>, void>({
      query: () => `/api/ai/media/stats`,
      providesTags: (_result, _err) => [{ type: 'Media', id: 'STATS' }],
    }),
  }),
});

export const {
  useGetMediaStatsQuery,
} = mediaApi;
