'use client';

import ImageUpload from '@/components/launch/ImageUpload';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn/components/ui/select';
import type {
  DistributionOption,
  GovernanceModelOption,
  TargetAudienceOption,
  TokenFormData,
} from '@/types/launchForm';

interface Step1SetupProps {
  formData: TokenFormData;
  distributionOptions: readonly DistributionOption[];
  targetAudienceOptions: readonly TargetAudienceOption[];
  governanceModelOptions: readonly GovernanceModelOption[];
  onInputChange: (field: keyof TokenFormData, value: string | File | null | boolean) => void;
  onToggleDistribution: (option: DistributionOption) => void;
  onTokenUseDisclosureChange: (key: string, value: boolean) => void;
}

const Step1Setup: React.FC<Step1SetupProps> = ({
  formData,
  distributionOptions,
  targetAudienceOptions,
  governanceModelOptions,
  onInputChange,
  onToggleDistribution,
  onTokenUseDisclosureChange,
}) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2 text-[#C2C2C2]">Step 1 - Set Up</h2>
      <p className="text-[#858991] font-normal text-sm mb-6">
        Start by setting up your token details and intended use.
      </p>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[260px_minmax(0,1fr)] mt-12">
        <ImageUpload onImageSelect={(file) => onInputChange('image', file)} selectedImage={formData.image} />

        <div className="flex flex-col gap-6 pt-2">
          <div className="mb-6">
            <label className="block text-base font-medium text-white mb-2">
              Token Name <span className="text-[#FF6961]">*</span>
            </label>
            <input
              type="text"
              value={formData.tokenName}
              onChange={(e) => onInputChange('tokenName', e.target.value)}
              className="w-full h-[54px] px-4 bg-[#0D1117] border border-stroke-3 rounded-md text-white placeholder-grey focus:outline-none focus:ring-2 focus:ring-background-11"
            />
          </div>

          <div className="mb-6">
            <label className="flex text-base font-medium text-white mb-2 items-center gap-2">
              Token Symbol <span className="text-[#FF6961]">*</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </label>
            <input
              type="text"
              value={formData.tickerSymbol}
              onChange={(e) => onInputChange('tickerSymbol', e.target.value)}
              className="w-full h-[54px] px-4 bg-[#0D1117] border border-stroke-3 rounded-md text-white placeholder-grey focus:outline-none focus:ring-2 focus:ring-background-11"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-base font-medium text-white mt-12 mb-3">
          Token Use Disclosure <span className="text-[#FF6961]">*</span>
        </label>
        <p className="text-[#858991] text-sm mb-5">Select all that apply to your token&apos;s intended use.</p>
        <div className="flex flex-col gap-6">
          {[
            {
              key: 'governance',
              label: 'The token grants access to network features and governance rights.',
            },
            {
              key: 'staking',
              label: 'Users can stake tokens to access premium features or services.',
            },
            {
              key: 'community',
              label: 'The goal is to enable a self-sustaining, community-driven protocol.',
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-[#1F2530] border px-6 rounded-lg bg-[#0D1117] py-3"
            >
              <span className="text-sm text-[#FFFFFF] font-normal">{item.label}</span>
              <div className="flex items-center gap-3 min-w-[200px]">
                <button
                  type="button"
                  onClick={() => onTokenUseDisclosureChange(item.key, true)}
                  className={`flex-1 rounded-md px-4 py-2 text-sm font-normal transition ${
                    formData.tokenUseDisclosure?.[item.key]
                      ? 'bg-[#0F231D] text-[#3CE3AB] border border-[#3CE3AB]'
                      : 'bg-[#000000] text-[#8C95A8] border border-[#1F2432] hover:text-white'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => onTokenUseDisclosureChange(item.key, false)}
                  className={`flex-1 rounded-md px-4 py-2 text-sm font-normal transition ${
                    formData.tokenUseDisclosure?.[item.key] === false
                      ? 'bg-[#25121B] text-[#FF6961] border border-[#FF6961]'
                      : 'bg-[#000000] text-[#8C95A8] border border-[#1F2432] hover:text-white'
                  }`}
                >
                  No
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
        <div>
          <label className="block text-base font-medium text-white mb-3">
            Raised Token <span className="text-[#FF6961]">*</span>
          </label>
          <Select value={formData.raisedToken} onValueChange={(value) => onInputChange('raisedToken', value)}>
            <SelectTrigger className="w-full h-[54px] bg-[#0D1117] border border-[#1F2530] text-white rounded-md px-4">
              <SelectValue placeholder="Select Token" />
            </SelectTrigger>
            <SelectContent className="bg-[#0D1117] border border-[#1F2530] rounded-md w-[var(--radix-select-trigger-width)]">
              {['BNB', 'ETH', 'USDT'].map((token) => (
                <SelectItem key={token} value={token} className="text-white hover:bg-background-5">
                  {token}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-base font-medium text-white mb-3">
            Amount <span className="text-[#FF6961]">*</span>{' '}
            <span className="text-sm text-gray-400">(∼$0.00)</span>
          </label>
          <div className="flex h-[54px] rounded-md border border-[#1F2530] bg-[#0D1117] overflow-hidden focus-within:border-[#3E14CB] focus-within:ring-2 focus-within:ring-[#3E14CB]">
            <input
              type="number"
              value={formData.raisedAmount}
              onChange={(e) => onInputChange('raisedAmount', e.target.value)}
              className="w-4/5 px-4 bg-transparent text-white placeholder-[#4B5161] focus:outline-none"
              placeholder="0"
            />
            <Select value="USD" onValueChange={() => {}}>
              <SelectTrigger className="w-[120px] h-full border-l border-[#1F2530]/60 bg-[#10141D] text-white px-4 rounded-md focus:ring-0 focus:outline-none">
                <SelectValue placeholder="USD" />
              </SelectTrigger>
              <SelectContent className="bg-[#0D1117] border border-[#1F2530] rounded-md w-[120px]">
                <SelectItem value="USD" className="text-white hover:bg-background-5">
                  USD
                </SelectItem>
                <SelectItem value="EUR" className="text-white hover:bg-background-5">
                  EUR
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <label className="block text-base font-medium text-white mb-3">
          Distribution Plan <span className="text-[#FF6961]">*</span>
        </label>
        <div className="rounded-md border border-[#1F2530] bg-[#0D1117] overflow-hidden">
          {distributionOptions.map((item, index) => (
            <button
              key={item}
              type="button"
              onClick={() => onToggleDistribution(item)}
              className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                index !== distributionOptions.length - 1 ? 'border-b border-[#1F2530]' : ''
              }`}
            >
              <span className="text-sm text-[#ffffff]">{item}</span>
              <span
                className={`relative inline-flex h-[28px] w-[55px] items-center rounded-full transition-colors ${
                  formData.distributionPlan[item] ? 'bg-[#172239]' : 'bg-[#2F343E]'
                }`}
              >
                <span
                  className={`inline-block h-[20px] w-[20px] rounded-full transform transition-transform duration-300 ${
                    formData.distributionPlan[item] ? 'translate-x-[28px] bg-[#4B2BFF]' : 'translate-x-[4px] bg-[#8F97A6]'
                  }`}
                />
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-base font-medium text-white mt-12 mb-3">
          Target Audience <span className="text-[#FF6961]">*</span>
        </label>
        <Select value={formData.targetAudience || undefined} onValueChange={(value) => onInputChange('targetAudience', value)}>
          <SelectTrigger className="w-full bg-[#0D1117] border border-[#1E2128] text-white rounded-md px-5 h-[54px]">
            <SelectValue placeholder="Select Group" />
          </SelectTrigger>
          <SelectContent className="bg-[#0D1117] border border-[#1E2128] text-white rounded-md overflow-hidden w-[var(--radix-select-trigger-width)]">
            <div className="flex flex-col w-full">
              {targetAudienceOptions.map((option) => (
                <SelectItem
                  key={option}
                  value={option}
                  className="w-full cursor-pointer px-4 py-4 text-base hover:bg-[#13161F] focus:bg-[#13161F] data-[state=checked]:bg-[#151F2C]"
                >
                  {option}
                </SelectItem>
              ))}
            </div>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-base font-medium text-white mt-12 mb-3">
          Governance Model <span className="text-[#FF6961]">*</span>
        </label>
        <Select value={formData.governanceModel || undefined} onValueChange={(value) => onInputChange('governanceModel', value)}>
          <SelectTrigger className="w-full bg-[#0D1117] border border-[#1E2128] text-white rounded-md px-5 h-[54px]">
            <SelectValue placeholder="Select Model" />
          </SelectTrigger>
          <SelectContent className="bg-[#0D1117] border border-[#1E2128] text-white rounded-md overflow-hidden w-[var(--radix-select-trigger-width)]">
            <div className="flex flex-col w-full">
              {governanceModelOptions.map((option) => (
                <SelectItem
                  key={option}
                  value={option}
                  className="w-full cursor-pointer px-4 py-4 text-base hover:bg-[#13161F] focus:bg-[#13161F] data-[state=checked]:bg-[#151F2C]"
                >
                  {option}
                </SelectItem>
              ))}
            </div>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default Step1Setup;

