'use client';

import { combineReducers, configureStore, createAction } from '@reduxjs/toolkit';
import CommonReducer, { initialState as commonReducerInitialState } from './reducers/common';
import { PreloadedState } from '../src/types';

const rootReducer = combineReducers({
  common: CommonReducer,
});

export const updateVersion = createAction<void>('global/updateVersion');

let store: ReturnType<typeof makeStore>;

export function makeStore(preloadedState: PreloadedState = undefined) {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {},
      }),
    devTools: process.env.NODE_ENV !== 'production',
    preloadedState,
  });
}

export const initializeStore = () => {
  const initialStoreState: PreloadedState = {
    common: commonReducerInitialState,
  };
  const preloadedState: PreloadedState = {
    ...initialStoreState,
    // Add other slices if you want to pre-populate them as wel
  };
  return makeStore(preloadedState);
};

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
