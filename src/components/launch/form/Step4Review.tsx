'use client';

import type { TokenFormData } from '@/types/launchForm';

interface Step4ReviewProps {
  formData: TokenFormData;
}

const Step4Review: React.FC<Step4ReviewProps> = ({ formData }) => (
  <div className="space-y-10">
    <div>
      <h2 className="text-xl font-bold text-white mb-2">Step 4 - Review & Launch</h2>
      <p className="text-[#8C95A8] text-sm">Review details before deploying your token on-chain.</p>
    </div>

    <div className="rounded-3xl border border-[#1F2530] bg-[#0D1117] p-8 space-y-10">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-[#131926] rounded-full flex items-center justify-center text-2xl font-bold text-white">
            {formData.tokenName.charAt(0) || 'T'}
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold text-white">
              {formData.tokenName || 'Token Name'} ({formData.tickerSymbol || 'TICKER'})
            </h3>
            <span className="inline-flex items-center rounded-md bg-[#3E14CB] px-3 py-1 text-xs font-semibold text-white">
              BNB Chain
            </span>
          </div>
        </div>

        <div className="grid gap-4 text-sm text-[#C2C2C2]">
          <div>
            <p className="uppercase text-xs tracking-wide text-[#8C95A8]">Creator Wallet</p>
            <p className="font-mono text-white">0xA1B2...54Jc</p>
          </div>
          <div>
            <p className="uppercase text-xs tracking-wide text-[#8C95A8]">Launch Date</p>
            <p className="text-white">Oct 25, 2025 at 17:00 UTC</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-white font-semibold mb-4">Allocations (%)</h4>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            {[
              { label: 'Treasury', value: formData.treasuryAllocation },
              { label: 'Team', value: formData.collaboratorsAllocation },
              { label: 'Public', value: formData.publicAllocation },
              { label: 'Airdrop', value: formData.airdropAllocation },
              { label: 'Liquidity', value: formData.liquidityAllocation },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl border border-[#1F2530] bg-[#131926] px-4 py-5 text-center">
                <p className="text-xs uppercase tracking-wide text-[#8C95A8]">{label}</p>
                <p className="mt-2 text-lg font-semibold text-white">{value || 0}%</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Token Parameters</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-[#C2C2C2]">
            {[
              { label: 'Token Parameters', value: `${formData.totalSupply || '—'} BNB` },
              { label: 'Raised Token', value: `${formData.raisedAmount || '0'} BNB / 5rd BNB` },
              {
                label: 'Inflation / Deflation',
                value: formData.tokenomicsEnabled
                  ? `${formData.inflationDeflation} - ${formData.rate || '0%'} ${formData.frequency || ''}`
                  : 'Disabled',
              },
              { label: 'Vesting', value: formData.enableVestingSchedule ? 'Enabled' : 'Disabled' },
              { label: 'Visibility Mode', value: 'Public Launch' },
              { label: 'Estimated Gas', value: '0.02 ETH' },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl border border-[#1F2530] bg-[#131926] px-4 py-4 space-y-2">
                <p className="text-xs uppercase tracking-wide text-[#8C95A8]">{label}</p>
                <p className="text-white font-semibold">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Vesting Details</h4>
          <div className="overflow-x-auto rounded-xl border border-[#1F2530] bg-[#131926]">
            <table className="w-full text-sm text-[#C2C2C2]">
              <thead className="text-[#8C95A8] uppercase tracking-wide text-xs">
                <tr>
                  <th className="py-3 px-4 text-left">Category</th>
                  <th className="py-3 px-4 text-left">Type</th>
                  <th className="py-3 px-4 text-left">Duration</th>
                  <th className="py-3 px-4 text-left">Cliff</th>
                  <th className="py-3 px-4 text-left">Unlock %</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-[#1F2530]">
                  <td className="py-3 px-4 text-white">Team</td>
                  <td className="py-3 px-4">Linear</td>
                  <td className="py-3 px-4">12 Months</td>
                  <td className="py-3 px-4">3 Months</td>
                  <td className="py-3 px-4">25%</td>
                </tr>
                <tr className="border-t border-[#1F2530]">
                  <td className="py-3 px-4 text-white">Advisors</td>
                  <td className="py-3 px-4">Cliff</td>
                  <td className="py-3 px-4">6 Months</td>
                  <td className="py-3 px-4">—</td>
                  <td className="py-3 px-4">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <button className="inline-flex items-center justify-center rounded-lg border border-[#3E14CB] bg-[#3E14CB]/10 px-5 py-3 text-sm font-semibold text-[#C9B7FF] transition hover:bg-[#3E14CB]/20">
            Generate Whitepaper (PDF) & Email
          </button>
        </div>
      </div>
    </div>

    <div className="rounded-3xl border border-[#1F2530] bg-[#0D1117] p-8 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white">Compliance Declaration</h3>
        <p className="text-xs uppercase tracking-wide text-[#8C95A8] mt-2">Disclosure and Limitation of Liability</p>
      </div>
      <div className="max-h-64 overflow-y-auto pr-2 text-sm text-[#C2C2C2] space-y-4">
        <p>
          Synthari is a decentralized software protocol that provides open-source tools allowing users to create, deploy,
          and interact with digital assets, including custom tokens and liquidity pools, directly on compatible
          blockchains.
        </p>
        <p>
          Synthari does not issue, endorse, control, audit, market, or otherwise participate in any tokens or smart
          contracts created by third-party users. Users of the Synthari protocol act independently and are solely
          responsible for their own compliance with applicable laws, regulations, and technical requirements.
        </p>
        <p>
          By using the Synthari interface, smart contracts, or any related software (collectively, the “Platform”), you
          acknowledge, understand, and agree to the following:
        </p>
        <p>
          <strong>Independent Creation:</strong> Tokens or smart contracts created using Synthari are generated by users
          through autonomous, permissionless code execution. Synthari does not custody, validate, or approve such assets
          and has no control over their function, supply, governance, or distribution.
        </p>
        <p>
          <strong>No Jurisdictional Representation:</strong> Synthari makes no representations as to the legal status of
          any token or activity under the laws of any jurisdiction. It is the sole responsibility of each user to ensure
          that their use of the Platform complies with applicable securities, commodities, tax,
          anti-money-laundering&nbsp;(AML), know-your-customer&nbsp;(KYC), and consumer-protection laws in their country
          or region.
        </p>
        <p>
          <strong>No Audit or Verification:</strong> Synthari does not conduct audits or security reviews of user-created
          tokens, smart contracts, or associated code. Users are encouraged to obtain independent third-party audits
          before deploying or interacting with any contract or token.
        </p>
        <p>
          <strong>Proper Use and Security:</strong> Users are responsible for their own private keys, wallets, and
          blockchain interactions. Synthari shall not be liable for losses arising from user error, software malfunction,
          smart-contract vulnerabilities, or misuse of the Platform.
        </p>
        <p>
          <strong>No Marketing or Promotion:</strong> Synthari does not market, promote, or facilitate the sale or
          distribution of any tokens created through the Platform. Any marketing, fundraising, or promotional activity by
          a user or third party is undertaken entirely at their own risk and discretion.
        </p>
        <p>
          <strong>No Governance or Administrative Role:</strong> Synthari does not participate in, manage, or oversee the
          governance, operation, or ongoing maintenance of user-created tokens or projects. All governance rights,
          decisions, and liabilities rest exclusively with the token creators and their communities.
        </p>
        <p>
          <strong>No Financial Advice or Endorsement:</strong> The Synthari Platform and its documentation are provided
          for informational and technical purposes only. Nothing on the Platform constitutes financial, investment, legal,
          or tax advice. Users should consult independent professionals before engaging in any blockchain-related
          activity.
        </p>
        <p>
          <strong>Limitation of Liability:</strong> To the fullest extent permitted by law, Synthari, its affiliates,
          developers, contributors, and service providers disclaim all warranties and shall not be liable for any
          damages, claims, losses, or liabilities arising out of or related to your use of the Platform.
        </p>
        <p>
          <strong>Assumption of Risk:</strong> You acknowledge that blockchain systems, decentralized protocols, and
          digital assets involve inherent technological and regulatory risks, including potential loss of value,
          smart-contract bugs, and evolving legal frameworks. You assume all risks associated with your use of the
          Platform.
        </p>
        <p>
          By accessing or using the Synthari Platform, you agree that you do so voluntarily, at your own risk, and
          without any expectation of recourse against Synthari or its affiliates.
        </p>
        <p>
          For questions regarding your responsibilities or applicable laws in your jurisdiction, you should seek
          independent legal advice.
        </p>
      </div>
      <label className="flex items-center gap-3 text-sm text-[#C2C2C2]">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border border-[#3E14CB] bg-transparent text-[#3E14CB] focus:ring-[#3E14CB]"
        />
        I acknowledge and agree to the compliance terms.
      </label>
    </div>
  </div>
);

export default Step4Review;

