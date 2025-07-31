export type BalancePercentageButtonsProps = {
  balance: bigint;
  decimals: number;
  setAmount: (value: string) => void;
  disabled?: boolean;
};
