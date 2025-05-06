import { supportedChainIds } from '@/constants/chains';
import { createSlice } from '@reduxjs/toolkit';
import { reducerNames } from '../constants/names';
import { CommonReducerState } from '../types/common';

export const initialState: CommonReducerState = {
  appChainId: supportedChainIds.mode,
};

export const CommonReducer = createSlice({
  name: reducerNames.common,
  initialState,
  reducers: {
    setAppChainId: (state, action) => {
      state.appChainId = action.payload;
    },
  },
});

export const { setAppChainId } = CommonReducer.actions;
export default CommonReducer.reducer;
