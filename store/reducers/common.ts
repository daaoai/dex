import { supportedChainIds } from '@/constants/chains';
import { LiveFeedToken } from '@/types/coinGecko';
import { createSlice } from '@reduxjs/toolkit';
import { reducerNames } from '../constants/names';
import { CommonReducerState } from '../types/common';

export const initialState: CommonReducerState = {
  appChainId: supportedChainIds.bsc,
  memeTokens: {},
  altTokens: {},
};

const CommonReducer = createSlice({
  name: reducerNames.common,
  initialState,
  reducers: {
    setAppChainId: (state, action: { payload: number }) => {
      state.appChainId = action.payload;
    },
    setMemeTokensForChainId: (state, action: { payload: { chainId: number; tokens: LiveFeedToken[] } }) => {
      const { chainId, tokens } = action.payload;
      state.memeTokens = {
        ...state.memeTokens,
        [chainId]: tokens,
      };
    },
    setAltTokensForChainId: (state, action: { payload: { chainId: number; tokens: LiveFeedToken[] } }) => {
      const { chainId, tokens } = action.payload;
      state.altTokens = {
        ...state.altTokens,
        [chainId]: tokens,
      };
    },
  },
});

export const { setAppChainId, setMemeTokensForChainId, setAltTokensForChainId } = CommonReducer.actions;
export default CommonReducer.reducer;
