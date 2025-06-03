'use client';

import { combineReducers, configureStore, createAction } from '@reduxjs/toolkit';
import CommonReducer, { initialState as commonReducerInitialState } from './reducers/common';
import { PreloadedState } from '../src/types';
import PositionReducer, { positionReducerInitialState } from './reducers/position';

const rootReducer = combineReducers({
  common: CommonReducer,
  position: PositionReducer,
});

export const updateVersion = createAction<void>('global/updateVersion');

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

// Initialize the store
const store = makeStore();

export const initializeStore = () => {
  const initialStoreState: PreloadedState = {
    common: commonReducerInitialState,
    position: positionReducerInitialState,
  };
  const preloadedState: PreloadedState = {
    ...initialStoreState,
    // Add other slices if you want to pre-populate them as well
  };
  return makeStore(preloadedState);
};

// Alternative approach for RootState
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
