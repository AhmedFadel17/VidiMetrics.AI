import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const mainApi = createApi({
  reducerPath: 'mainApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth?.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    // Infra
    'User',
    'Admin',
    'Credits',
    'Subscription',
    'SubscriptionPlan',
    'Notification',

    // StoryEngine
    'Show',
    'Character',
    'Episode',
    'Scene',
    'Location',
    // Core
    'Channel',
    'Video',
    'ChannelPost',
    // Ai
    'AiTask',
    'AiPromptTemplate',
    'AiVideo',
    'Transcript',
    'AiImage',
    'AiScript',
    // Copilot
    'CopilotChat',
    'CopilotMessage',
    'CopilotDraft',
    // Seo
    'Keyword',
    'KeywordRanking',
    'CompetitorVideo',
    'SeoAudit',
    'VideoTag',
  ],
  endpoints: () => ({}),
});
