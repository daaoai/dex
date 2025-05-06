import { CommonReducerState } from '../../store/types/common';

export type RootReducerState = {
  common: CommonReducerState;
};

export type PreloadedState = RootReducerState | undefined;
