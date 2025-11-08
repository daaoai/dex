'use client';

import type { TokenFormData } from '@/types/launchForm';

interface Step5ReviewProps {
  formData: TokenFormData;
}

const Step5Review: React.FC<Step5ReviewProps> = ({ formData }) => (
  <div>
    <h2 className="text-xl font-bold text-white mb-4">Step 4 - Review & Launch</h2>
    <p className="text-gray-400 mb-6">Review details before deploying your token on-chain.</p>

    <div className="bg-[#0D1117] border border-stroke-3 rounded-lg p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center">
          <span className="text-white text-xl font-bold">{formData.tokenName.charAt(0) || 'T'}</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-white">
              {formData.tokenName} ({formData.tickerSymbol})
            </h3>
            <span className="px-2 py-1 bg-[#3E14CB] text-white text-xs rounded">On Chain</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <span className="text-gray-400 text-sm">Creator Wallet:</span>
          <p className="text-white font-mono">0xA182...54Jc</p>
        </div>
        <div>
          <span className="text-gray-400 text-sm">Launch Date:</span>
          <p className="text-white">Oct 25, 2025 at 17:00 UTC</p>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-white font-semibold mb-3">Allocations (%)</h4>
        <div className="grid grid-cols-5 gap-2">
          {[
            { label: 'Treasury', value: formData.treasuryAllocation },
            { label: 'Team', value: formData.collaboratorsAllocation },
            { label: 'Public', value: formData.publicAllocation },
            { label: 'Airdrop', value: formData.airdropAllocation },
            { label: 'Liquidity', value: formData.liquidityAllocation },
          ].map(({ label, value }) => (
            <div key={label} className="bg-gray-800 rounded p-3 text-center">
              <div className="text-white font-semibold">{label}</div>
              <div className="text-[#3E14CB] font-bold">{value}%</div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <h4 className="text-white font-semibold mb-3">Token Parameters</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-between">
            <span className="text-gray-400">Token Parameters:</span>
            <span className="text-white">{formData.totalSupply} BNB</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Raised Token:</span>
            <span className="text-white">{formData.raisedAmount} BNB / 5th BNB</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Inflation/Deflation:</span>
            <span className="text-white">
              Yes ({formData.inflationDeflation} - {formData.rate} {formData.frequency})
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Vesting:</span>
            <span className="text-white">Yes - Linear</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Visibility Mode:</span>
            <span className="text-white">Public Launch</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Estimated Gas:</span>
            <span className="text-white">0.02 ETH</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-white font-semibold mb-3">Vesting Details</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left text-gray-400 py-2">Category</th>
                <th className="text-left text-gray-400 py-2">Type</th>
                <th className="text-left text-gray-400 py-2">Duration</th>
                <th className="text-left text-gray-400 py-2">Cliff</th>
                <th className="text-left text-gray-400 py-2">Unlock %</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-800">
                <td className="text-white py-2">Team</td>
                <td className="text-white py-2">Linear</td>
                <td className="text-white py-2">12 Months</td>
                <td className="text-white py-2">3 Months</td>
                <td className="text-white py-2">25%</td>
              </tr>
              <tr>
                <td className="text-white py-2">Advisors</td>
                <td className="text-white py-2">Cliff</td>
                <td className="text-white py-2">6 months</td>
                <td className="text-white py-2">-</td>
                <td className="text-white py-2">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-6">
        <button className="bg-[#3E14CB] text-white px-6 py-3 rounded-md font-medium hover:bg-[#3E14CB]/80 transition-colors">
          Generate Whitepaper (PDF) & Email
        </button>
      </div>
    </div>

    <div className="bg-[#0D1117] border border-stroke-3 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-2">Compliance Declaration</h3>
      <p className="text-gray-400 text-sm mb-4">Disclosure and Limitation of Liability</p>

      <div className="text-gray-300 text-sm space-y-3 mb-6">
        <p>
          This platform provides information for educational purposes only and is not intended as financial, investment,
          or legal advice. Users are solely responsible for their decisions and actions.
        </p>
        <p>
          The platform disclaims all warranties, express or implied, regarding the accuracy, completeness, or
          reliability of any information provided. Blockchain technology involves inherent risks including but not
          limited to technical failures, regulatory changes, and market volatility.
        </p>
        <p>
          Users acknowledge that cryptocurrency investments carry significant risk and may result in total loss of
          invested capital. Past performance does not guarantee future results.
        </p>
        <p>
          By proceeding with token creation, users agree to hold the platform harmless from any claims, damages, or
          losses arising from their use of the service.
        </p>
      </div>

      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <input
            type="checkbox"
            id="compliance-agreement"
            className="w-5 h-5 text-[#7036FF] bg-[#0D1117] border border-stroke-3 rounded focus:ring-[#7036FF] focus:ring-2"
          />
        </div>
        <label htmlFor="compliance-agreement" className="text-[#C2C2C2] cursor-pointer text-sm">
          I acknowledge and agree to the compliance terms.
        </label>
      </div>
    </div>
  </div>
);

export default Step5Review;

