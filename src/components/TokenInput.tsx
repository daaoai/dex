import Image from 'next/image';

const TokenInput = ({
  id,
  value,
  onChange,
  symbol,
  balance,
  logoURI,
  disabled,
}: {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  symbol: string;
  balance: string;
  logoURI: string;
  disabled: boolean;
}) => (
  <div className="mb-5">
    <div className="relative w-full">
      <input
        id={id}
        type="number"
        disabled={disabled}
        value={value}
        onChange={onChange}
        className="w-full bg-black border border-gray-700 rounded-xl py-5 pl-4 pr-36 text-white text-lg placeholder:text-muted-foreground"
        placeholder="0.0"
      />
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-right text-xs text-muted-foreground flex flex-col items-end gap-1">
        <div className="flex items-center gap-1">
          <Image src={logoURI} alt={symbol} width={20} height={20} className="rounded-full" />
          <span className="text-white text-base">{symbol}</span>
        </div>
        <span className="text-xs text-muted-foreground">bal {balance}</span>
      </div>
    </div>
  </div>
);
export default TokenInput;
