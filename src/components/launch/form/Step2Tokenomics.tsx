'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn/components/ui/select';
import type { TokenFormData } from '@/types/launchForm';

interface Step2TokenomicsProps {
  formData: TokenFormData;
  onInputChange: <K extends keyof TokenFormData>(field: K, value: TokenFormData[K]) => void;
  onAllocationChange: (
    field: keyof Pick<
      TokenFormData,
      | 'treasuryAllocation'
      | 'collaboratorsAllocation'
      | 'publicAllocation'
      | 'airdropAllocation'
      | 'liquidityAllocation'
    >,
    value: number,
  ) => void;
  onSupplyEmissionChange: (value: string) => void;
}

const rateOptions = ['1%', '2%', '5%', '10%'] as const;
const frequencyOptions = ['Daily', 'Weekly', 'Monthly', 'Yearly'] as const;
const durationOptions = ['1 Year', '2 Years', '5 Years', '10 Years'] as const;

const Step2Tokenomics: React.FC<Step2TokenomicsProps> = ({
  formData,
  onInputChange,
  onAllocationChange,
  onSupplyEmissionChange,
}) => {
  return (
    <div>
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">Step 2 - Tokenomics</h2>
        <p className="text-sm text-[#8C95A8]">Define your token&apos;s economic parameters and supply behavior.</p>
      </div>

      <div className="flex flex-col gap-6">
        <div>
          <label className="block text-base font-medium text-white mb-2">
            Total Supply <span className="text-sm text-[#8C95A8]">(Mln)</span>
          </label>
          <Select value={formData.totalSupply} onValueChange={(value) => onInputChange('totalSupply', value)}>
            <SelectTrigger className="w-full h-[54px] rounded-md border border-[#1F2530] bg-[#0D1117] px-4 text-white focus:outline-none focus:ring-2 focus:ring-[#3E14CB]">
              <SelectValue placeholder="Select Supply" />
            </SelectTrigger>
            <SelectContent className="bg-[#0D1117] border border-[#1F2530] rounded-md w-[var(--radix-select-trigger-width)] text-white">
              {['1000000', '10000000', '100000000', '1000000000'].map((option) => (
                <SelectItem key={option} value={option} className="px-4 py-3 text-white hover:bg-[#13161F]">
                  {Number(option).toLocaleString()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-base font-medium text-white mb-2">Supply Emission</label>
          <Select value={formData.supplyEmission} onValueChange={onSupplyEmissionChange}>
            <SelectTrigger className="w-full h-[54px] rounded-md border border-[#1F2530] bg-[#0D1117] px-4 text-white focus:outline-none focus:ring-2 focus:ring-[#3E14CB]">
              <SelectValue placeholder="Select Emission" />
            </SelectTrigger>
            <SelectContent className="bg-[#0D1117] border border-[#1F2530] rounded-md w-[var(--radix-select-trigger-width)] text-white">
              <SelectItem value="Fixed Supply" className="px-4 py-3 text-white hover:bg-[#13161F]">
                Fixed Supply
              </SelectItem>
              <SelectItem value="Dynamic Supply" className="px-4 py-3 text-white hover:bg-[#13161F]">
                Dynamic Supply
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-white">Inflation/Deflation</label>
          <div
            className={`relative flex h-[50px] items-center rounded-full border border-[#1F2530] bg-[#0D1117] px-2 ${
              formData.tokenomicsEnabled ? '' : 'opacity-40'
            }`}
          >
            <span
              className="absolute top-1 bottom-1 rounded-full bg-gradient-to-r from-[#7036FF] to-[#8F62FF] shadow-[0_10px_30px_rgba(112,54,255,0.35)] transition-transform duration-300"
              style={{
                width: 'calc(50% - 8px)',
                transform:
                  formData.inflationDeflation === 'Inflation' ? 'translateX(0)' : 'translateX(calc(100% + 16px))',
              }}
            />
            <button
              className={`relative z-10 flex-1 text-sm font-semibold transition-colors ${
                formData.inflationDeflation === 'Inflation' ? 'text-white' : 'text-[#8C95A8]'
              }`}
              onClick={() => formData.tokenomicsEnabled && onInputChange('inflationDeflation', 'Inflation')}
              disabled={!formData.tokenomicsEnabled}
            >
              Inflation
            </button>
            <button
              className={`relative z-10 flex-1 text-sm font-semibold transition-colors ${
                formData.inflationDeflation === 'Deflation' ? 'text-white' : 'text-[#8C95A8]'
              }`}
              onClick={() => formData.tokenomicsEnabled && onInputChange('inflationDeflation', 'Deflation')}
              disabled={!formData.tokenomicsEnabled}
            >
              Deflation
            </button>
          </div>
        </div>

        {[
          { label: 'Rate', options: rateOptions, field: 'rate' as const },
          { label: 'Frequency', options: frequencyOptions, field: 'frequency' as const },
          { label: 'Duration', options: durationOptions, field: 'duration' as const },
        ].map(({ label, options, field }) => (
          <div key={field} className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white">{label}</label>
            <Select
              value={formData[field]}
              onValueChange={(value) => onInputChange(field, value)}
              disabled={!formData.tokenomicsEnabled}
            >
              <SelectTrigger
                className={`w-full h-[48px] rounded-md border border-[#1F2530] bg-[#0D1117] px-4 text-white focus:outline-none focus:ring-2 focus:ring-[#3E14CB] ${
                  !formData.tokenomicsEnabled ? 'opacity-40 cursor-not-allowed' : ''
                }`}
              >
                <SelectValue placeholder={`Select ${label}`} />
              </SelectTrigger>
              <SelectContent className="bg-[#0D1117] border border-[#1F2530] rounded-md w-[var(--radix-select-trigger-width)] text-white">
                {options.map((option) => (
                  <SelectItem key={option} value={option} className="px-4 py-3 text-white hover:bg-[#13161F]">
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Allocations (%)</h3>
          <span className="text-xs text-[#8C95A8]">Adjust how supply is distributed across stakeholders.</span>
        </div>

        <div className="rounded-[18px] border border-[#1F2530] bg-[#080B15] p-4 md:p-6 space-y-6">
          <div className="grid grid-cols-5 text-center text-sm font-medium text-[#8C95A8]">
            <span>Treasury</span>
            <span>Collaborators</span>
            <span>Public</span>
            <span>Airdrop</span>
            <span>Liquidity</span>
          </div>

          <div className="grid grid-cols-5 gap-3">
            {(
              [
                ['treasuryAllocation', 'Treasury'],
                ['collaboratorsAllocation', 'Collaborators'],
                ['publicAllocation', 'Public'],
                ['airdropAllocation', 'Airdrop'],
                ['liquidityAllocation', 'Liquidity'],
              ] as const
            ).map(([key]) => (
              <div key={key} className="flex flex-col items-center gap-2">
                <div className="relative flex items-center w-full">
                  <input
                    type="number"
                    value={formData[key]}
                    onChange={(e) => onAllocationChange(key, parseInt(e.target.value, 10) || 0)}
                    className="w-full h-[46px] bg-[#0D1117] border border-[#1F2530] rounded-md text-white text-center px-3 focus:outline-none focus:ring-2 focus:ring-[#3E14CB]"
                    disabled={key === 'liquidityAllocation'}
                  />
                  {key === 'liquidityAllocation' && <span className="absolute right-3 text-[#8C95A8] text-xs">🔒</span>}
                </div>
                <span className="text-xs text-[#8C95A8]">%</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <button className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#5D2FFF] to-[#3E14CB] px-4 py-2 text-sm font-medium text-white shadow-[0_12px_35px_rgba(62,20,203,0.3)] hover:opacity-90 transition">
              Auto Balance
            </button>
            <p className="text-sm text-[#8C95A8]">
              <span className="text-[#FFB74D] font-semibold">
                Remaining:{' '}
                {100 -
                  (formData.treasuryAllocation +
                    formData.collaboratorsAllocation +
                    formData.publicAllocation +
                    formData.airdropAllocation +
                    formData.liquidityAllocation)}
                %
              </span>{' '}
              <span className="text-[#8C95A8]">
                (Total:{' '}
                {formData.treasuryAllocation +
                  formData.collaboratorsAllocation +
                  formData.publicAllocation +
                  formData.airdropAllocation +
                  formData.liquidityAllocation}
                %)
              </span>
            </p>
          </div>

          <p className="text-xs text-[#6A7183] flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Liquidity is auto-routed to the Synthari Pool.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Step2Tokenomics;
