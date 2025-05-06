import { CommonReducerState } from './common';

export type RootReducerState = {
  common: CommonReducerState;
};

export type PreloadedState = RootReducerState | undefined;
