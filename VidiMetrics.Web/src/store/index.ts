import { configureStore } from '@reduxjs/toolkit';
import { identityApi } from './apis/identityApi';
import { mainApi } from './apis/mainApi';

export const store = configureStore({
  reducer: {
    [identityApi.reducerPath]: identityApi.reducer,
    [mainApi.reducerPath]: mainApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/setUser'],
        ignoredPaths: ['auth.user'],
      },
    }).concat(identityApi.middleware, mainApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
