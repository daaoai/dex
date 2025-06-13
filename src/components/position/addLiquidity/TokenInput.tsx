import DynamicLogo from '@/components/ui/logo/DynamicLogo';
import Text from '@/components/ui/Text';

const TokenInput = ({
  id,
  value,
  onChange,
  symbol,
  balance,
  logoUrl,
  disabled,
}: {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  symbol: string;
  balance: string;
  logoUrl: string | undefined;
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
        className="w-full py-12 bg-black border border-gray-700 rounded-xl pl-4 pr-36 text-white text-5xl placeholder:text-muted-foreground"
        placeholder="0.0"
      />
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-right text-xs text-muted-foreground flex flex-col items-end gap-6">
        <div className="flex items-center gap-1">
          <DynamicLogo logoUrl={logoUrl} alt={symbol} width={20} height={20} className="rounded-full" />
          <Text type="span" className="text-white text-base">
            {symbol}
          </Text>
        </div>
        <Text type="span" className="text-xs text-muted-foreground">
          bal {balance}
        </Text>
      </div>
    </div>
  </div>
);
export default TokenInput;
