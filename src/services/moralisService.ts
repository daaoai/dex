import { MoralisSwapTransaction, MoralisSwapResponse, ProcessedTransaction } from '@/types/moralis';
import { Hex } from 'viem';

export class MoralisService {
  private static readonly BASE_URL = 'https://deep-index.moralis.io/api/v2.2';
  private static readonly API_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjBlYjViZTEyLWJiZmMtNDdhZi1iOTA1LWYyODBhMjEyNzJkNiIsIm9yZ0lkIjoiMzczNzkwIiwidXNlcklkIjoiMzg0MTM3IiwidHlwZUlkIjoiNGM2MmRkNzUtN2FhNi00NTAxLWI4YzAtMGQ4NWU0MWY5YTEzIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MDYwMTEzODMsImV4cCI6NDg2MTc3MTM4M30.j-R4Iu0tu2GwiBLOv14DdmyqEmzGal1PfcryjFzsRZ0';

  private static CHAIN_MAP: Record<number, string> = {
    56: 'bsc',
    1: 'eth',
    137: 'polygon',
    43114: 'avalanche',
    250: 'fantom',
    42161: 'arbitrum',
    10: 'optimism',
    8453: 'base',
  };

  /**
   * Fetch swap transactions for a token
   * @param tokenAddress Token contract address
   * @param chainId Chain ID
   * @param limit Number of transactions to fetch (max 100)
   * @returns Promise<MoralisSwapResponse>
   */
  static async getSwapTransactions(
    tokenAddress: Hex,
    chainId: number,
    limit: number = 10,
  ): Promise<MoralisSwapResponse> {
    try {
      const chain = this.CHAIN_MAP[chainId];
      if (!chain) {
        throw new Error(`Unsupported chain ID: ${chainId}`);
      }

      const url = `${this.BASE_URL}/erc20/${tokenAddress}/swaps?chain=${chain}&order=DESC&limit=${limit}`;
      const response = await fetch(url, {
        headers: {
          accept: 'application/json',
          'X-API-Key': this.API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error(`Moralis API error: ${response.status} ${response.statusText}`);
      }

      const { result } = (await response.json()) as { result: MoralisSwapTransaction[] };
      return { result };
    } catch (error) {
      console.error(`Failed to fetch swap transactions for ${tokenAddress}:`, error);
      return {
        result: [],
      };
    }
  }

  /**
   * Process raw Moralis transaction data into a more usable format
   * @param transactions Raw Moralis transactions
   * @param targetTokenAddress The token address we're interested in
   * @returns ProcessedTransaction[]
   */
  static processTransactions(transactions: MoralisSwapTransaction[], targetTokenAddress: Hex): ProcessedTransaction[] {
    // Remove duplicates based on transaction hash and transaction index
    const uniqueTransactions = transactions.filter(
      (tx, index, self) =>
        index ===
        self.findIndex((t) => t.transactionHash === tx.transactionHash && t.transactionIndex === tx.transactionIndex),
    );

    return uniqueTransactions.map((tx, index) => {
      // Determine which token is our target token
      const isTargetTokenSold = tx.sold.address.toLowerCase() === targetTokenAddress.toLowerCase();
      const isTargetTokenBought = tx.bought.address.toLowerCase() === targetTokenAddress.toLowerCase();

      let type: 'Buy' | 'Sell';
      let tokenAmount: number;
      let tokenSymbol: string;
      let usdAmount: number;
      let price: number;

      if (isTargetTokenSold) {
        // Target token was sold (negative amount in API)
        type = 'Sell';
        tokenAmount = Math.abs(parseFloat(tx.sold.amount));
        tokenSymbol = tx.sold.symbol;
        usdAmount = Math.abs(tx.sold.usdAmount);
        price = tx.sold.usdPrice;
      } else if (isTargetTokenBought) {
        // Target token was bought (positive amount in API)
        type = 'Buy';
        tokenAmount = parseFloat(tx.bought.amount);
        tokenSymbol = tx.bought.symbol;
        usdAmount = tx.bought.usdAmount;
        price = tx.bought.usdPrice;
      } else {
        // Fallback using transaction type
        type = tx.transactionType === 'buy' ? 'Buy' : 'Sell';
        tokenAmount = tx.totalValueUsd / parseFloat(tx.baseQuotePrice);
        tokenSymbol = tx.sold.symbol; // Default to sold token symbol
        usdAmount = tx.totalValueUsd;
        price = parseFloat(tx.baseQuotePrice);
      }

      const timestamp = new Date(tx.blockTimestamp);
      const age = this.formatAge(timestamp);

      // Create a unique ID by combining transaction hash with transaction index and our processing index
      const uniqueId = `${tx.transactionHash}-${tx.transactionIndex}-${index}`;

      return {
        id: uniqueId,
        type,
        timestamp: tx.blockTimestamp,
        age,
        trader: `${tx.walletAddress.slice(0, 6)}...${tx.walletAddress.slice(-4)}`,
        tokenAmount,
        tokenSymbol,
        usdAmount,
        price,
        exchange: tx.exchangeName || 'Unknown',
        txHash: tx.transactionHash,
      };
    });
  }

  /**
   * Format timestamp into human-readable age
   * @param timestamp Transaction timestamp
   * @returns Formatted age string
   */
  private static formatAge(timestamp: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) {
      return 'Just now';
    } else if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  }

  /**
   * Get transaction explorer URL for a given chain
   * @param txHash Transaction hash
   * @param chainId Chain ID
   * @returns Explorer URL
   */
  static getExplorerUrl(txHash: string, chainId: number): string {
    const explorers: Record<number, string> = {
      1: 'https://etherscan.io/tx/',
      56: 'https://bscscan.com/tx/',
      137: 'https://polygonscan.com/tx/',
      43114: 'https://snowtrace.io/tx/',
      250: 'https://ftmscan.com/tx/',
      42161: 'https://arbiscan.io/tx/',
      10: 'https://optimistic.etherscan.io/tx/',
      8453: 'https://basescan.org/tx/',
    };

    return `${explorers[chainId] || 'https://etherscan.io/tx/'}${txHash}`;
  }
}
