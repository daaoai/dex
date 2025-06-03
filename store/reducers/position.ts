import { supportedChainIds } from '@/constants/chains';
import { createSlice } from '@reduxjs/toolkit';
import { reducerNames } from '../constants/names';
import { CommonReducerState } from '../types/common';
import { PositionReducerState } from '../types/position';

export const positionReducerInitialState: PositionReducerState = {
  positions: [],
};

const PositionReducer = createSlice({
  name: reducerNames.position,
  initialState: positionReducerInitialState,
  reducers: {
    setPositions: (state, action) => {
      state.positions = action.payload;
    },
  },
});

export const { setPositions } = PositionReducer.actions;
export default PositionReducer.reducer;
