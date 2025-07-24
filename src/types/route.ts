import { Hex } from 'viem';
import { Token } from './tokens';

export interface RouteToken {
  address: string;
  decimals: number;
}

export interface RouteRequest {
  tokenIn: RouteToken;
  tokenOut: RouteToken;
  amount: string;
  recipient: string;
  slippage: string;
  deadline: number;
}

export interface RouteQuote {
  amount: string;
  amountAdjustedForGas: string;
}

export interface RouteGas {
  estimatedGas: string;
  gasCostUSD: string;
}

export interface RouteTransaction {
  to: Hex;
  data: Hex;
  value: string;
}

export interface RouteResponse {
  quote: RouteQuote;
  gas: RouteGas;
  transaction: RouteTransaction;
}

export interface RouteApiResponse {
  status: string;
  response: RouteResponse;
}

export interface RouteParams {
  tokenIn: Token;
  tokenOut: Token;
  amount: string;
  recipient: Hex;
  slippage: number;
  deadline: number;
}
