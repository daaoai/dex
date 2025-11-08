'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn/components/ui/select';
import type { TokenFormData } from '@/types/launchForm';

interface Step3SaleSetupProps {
  formData: TokenFormData;
  onInputChange: <K extends keyof TokenFormData>(field: K, value: TokenFormData[K]) => void;
}

const Step3SaleSetup: React.FC<Step3SaleSetupProps> = ({ formData, onInputChange }) => (
  <div>
    <h2 className="text-xl font-bold text-white mb-4">Step 3 - Sale Setup</h2>

    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Soft Cap</label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-[#0D1117] border border-stroke-3 rounded-md text-white placeholder-grey focus:outline-none focus:ring-2 focus:ring-background-11"
            placeholder="e.g. 100 BNB"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Hard Cap</label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-[#0D1117] border border-stroke-3 rounded-md text-white placeholder-grey focus:outline-none focus:ring-2 focus:ring-background-11"
            placeholder="e.g. 1000 BNB"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
        {['Start', 'End'].map((label) => (
          <div key={label}>
            <label className="block text-sm font-medium text-white mb-2">{label}</label>
            <div className="relative">
              <input
                type="date"
                className="w-full h-12 px-4 pr-10 bg-[#0D1117] border border-stroke-3 rounded-md text-white placeholder-grey focus:outline-none focus:ring-2 focus:ring-background-11"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M7 3V5M17 3V5M5 9H19M6 5H18C19.1046 5 20 5.89543 20 7V19C20 20.1046 19.1046 21 18 21H6C4.89543 21 4 20.1046 4 19V7C4 5.89543 4.89543 5 6 5Z"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium text-white mb-2">Per Wallet Limit (% of Total Supply)</label>
        <div className="relative">
          <input
            type="text"
            className="w-full px-3 py-2 bg-[#0D1117] border border-stroke-3 rounded-md text-white placeholder-grey focus:outline-none focus:ring-2 focus:ring-background-11 pr-10"
            placeholder="%"
          />
          <svg
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>

    <div className="mt-12 space-y-6">
      <h3 className="text-lg font-semibold text-white">Vesting Schedule</h3>
      <p className="text-sm text-[#8C95A8]">
        Define how tokens are released over time to prevent early dumps and maintain stability.
      </p>

      <div className="rounded-2xl border border-[#1F2530] bg-[#0D1117] px-6 py-4 flex items-center justify-between">
        <span className="text-base font-medium text-white">Enable Vesting Schedule</span>
        <label className="relative inline-flex h-[30px] w-[60px] cursor-pointer items-center">
          <input
            type="checkbox"
            className="sr-only"
            checked={formData.enableVestingSchedule}
            onChange={(event) => onInputChange('enableVestingSchedule', event.target.checked)}
          />
          <span
            className={`relative inline-flex h-[28px] w-[55px] items-center rounded-full transition-colors ${
              formData.enableVestingSchedule ? 'bg-[#172239]' : 'bg-[#2F343E]'
            }`}
          >
            <span
              className={`inline-block h-[20px] w-[20px] rounded-full transform transition-transform duration-300 ${
                formData.enableVestingSchedule ? 'translate-x-[28px] bg-[#4B2BFF]' : 'translate-x-[4px] bg-[#8F97A6]'
              }`}
            />
          </span>
        </label>
      </div>

      {formData.enableVestingSchedule && (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Vesting Type</label>
              <Select>
                <SelectTrigger className="w-full h-12 bg-[#0D1117] border border-stroke-3 text-white px-4">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent className="bg-[#0D1117] border border-stroke-3 rounded-md w-[var(--radix-select-trigger-width)]">
                  <SelectItem value="Fixed" className="text-white hover:bg-background-5">
                    Fixed
                  </SelectItem>
                  <SelectItem value="Linear" className="text-white hover:bg-background-5">
                    Linear
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Release Frequency</label>
              <Select>
                <SelectTrigger className="w-full h-12 bg-[#0D1117] border border-stroke-3 text-white px-4">
                  <SelectValue placeholder="Select Frequency" />
                </SelectTrigger>
                <SelectContent className="bg-[#0D1117] border border-stroke-3 rounded-md w-[var(--radix-select-trigger-width)]">
                  <SelectItem value="Daily" className="text-white hover:bg-background-5">
                    Daily
                  </SelectItem>
                  <SelectItem value="Weekly" className="text-white hover:bg-background-5">
                    Weekly
                  </SelectItem>
                  <SelectItem value="Monthly" className="text-white hover:bg-background-5">
                    Monthly
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Total Duration (Months)</label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full h-12 px-4 bg-[#0D1117] border border-stroke-3 rounded-md text-white placeholder-grey focus:outline-none focus:ring-2 focus:ring-background-11 pr-10"
                  placeholder="00/00/0000"
                />
                <svg
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Cliff Period</label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full h-12 px-4 bg-[#0D1117] border border-stroke-3 rounded-md text-white placeholder-grey focus:outline-none focus:ring-2 focus:ring-background-11 pr-10"
                  placeholder="00/00/0000"
                />
                <svg
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Initial Unlock (months)</label>
              <input
                type="text"
                className="w-full h-12 px-4 bg-[#0D1117] border border-stroke-3 rounded-md text-white placeholder-grey focus:outline-none focus:ring-2 focus:ring-background-11"
                placeholder="e.g. 10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Final Unlock (%)</label>
              <input
                type="text"
                className="w-full h-12 px-4 bg-[#0D1117] border border-stroke-3 rounded-md text-white placeholder-grey focus:outline-none focus:ring-2 focus:ring-background-11"
                placeholder="e.g. 10"
              />
            </div>
          </div>

          <div className="mt-2 rounded-xl bg-[#3E14CB] px-4 py-3">
            <p className="text-[12px] font-normal text-[#C3B9FF]">
              Typical vesting schedules last 12-48 months for cliffs and gradual unlocks.
            </p>
          </div>
        </>
      )}
    </div>

    <div className="flex flex-col gap-6 mt-12">
      <h3 className="text-lg font-semibold text-white mb-2">Links & Community</h3>
      <div className="flex flex-col gap-6">
        <input
          type="email"
          value={formData.email}
          onChange={(e) => onInputChange('email', e.target.value)}
          className="w-full px-3 py-3 bg-[#0D1117] border border-stroke-3 rounded-md text-white placeholder-grey focus:outline-none focus:ring-2 focus:ring-background-11"
          placeholder="Email"
        />
        <input
          type="text"
          value={formData.telegram}
          onChange={(e) => onInputChange('telegram', e.target.value)}
          className="w-full px-3 py-3 bg-[#0D1117] border border-stroke-3 rounded-md text-white placeholder-grey focus:outline-none focus:ring-2 focus:ring-background-11"
          placeholder="Telegram"
        />
        <input
          type="url"
          value={formData.website}
          onChange={(e) => onInputChange('website', e.target.value)}
          className="w-full px-3 py-3 bg-[#0D1117] border border-stroke-3 rounded-md text-white placeholder-grey focus:outline-none focus:ring-2 focus:ring-background-11"
          placeholder="Website"
        />
        <input
          type="text"
          value={formData.twitter}
          onChange={(e) => onInputChange('twitter', e.target.value)}
          className="w-full px-3 py-3 bg-[#0D1117] border border-stroke-3 rounded-md text-white placeholder-grey focus:outline-none focus:ring-2 focus:ring-background-11"
          placeholder="Twitter"
        />
        {['Discord', 'TikTok', 'Twitch'].map((placeholder) => (
          <input
            key={placeholder}
            type="text"
            className="w-full px-3 py-3 bg-[#0D1117] border border-stroke-3 rounded-md text-white placeholder-grey focus:outline-none focus:ring-2 focus:ring-background-11"
            placeholder={placeholder}
          />
        ))}
      </div>
    </div>
  </div>
);

export default Step3SaleSetup;

