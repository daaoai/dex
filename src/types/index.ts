import { CommonReducerState } from '../../store/types/common';
import { PositionReducerState } from '../../store/types/position';

export type RootReducerState = {
  common: CommonReducerState;
  position: PositionReducerState;
};

export type PreloadedState = RootReducerState | undefined;
