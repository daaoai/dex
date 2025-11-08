'use client';

import React from 'react';
import { Button } from '@/shadcn/components/ui/button';
import { useRouter } from 'next/navigation';
import LaunchDisclaimer from '@/components/launch/LaunchDisclaimer';

export default function DisclaimerPage() {
  const router = useRouter();

  const handleAccept = () => {
    router.push('/launch/form');
  };

  return (
    <div className="min-h-screen bg-black text-[#C2C2C2] py-20">
      <div className="container mx-auto  py-8 max-w-4xl border border-[#20242C] rounded-3xl px-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-lg font-medium text-white mb-2 underline underline-offset-4">Important Considerations</h1>
          <p className="text-[#858991] text-base py-4">Before proceeding, please carefully read the following:</p>
        </div>

        {/* Scrollable content box */}
        <div className="bg-black border border-stroke-3 rounded-2xl p-6 max-h-72 overflow-y-auto text-sm space-y-4">
          <p className="text-[#9AA0AE] text-sm">
            Ensure you have prepared and verified all necessary documents related to your token project, including but
            not limited to:
          </p>
          <p className="text-[#9AA0AE] text-sm">The Token Raise and Amount</p>
          <p className="text-[#9AA0AE] text-sm">
            An Intended Distribution Plan: DAO, Staking, Airdrop, Usage-Based Rewards etc.
          </p>
          <p className="text-[#9AA0AE] text-sm">The Total Token Supply:</p>
          <p className="text-[#9AA0AE] text-sm">
            Will there be a Vesting Schedule, and if so what Type (e.g., Fixed, Linear) and Frequency. If Linear, what
            is the Rate, Frequency and Duration.
          </p>

          <p className="text-[#9AA0AE] text-sm">Accuracy of Information:</p>
          <p className="text-[#9AA0AE] text-sm">
            You are solely responsible for the accuracy and completeness of the information you submit. Any false,
            misleading, or incomplete details may result in your token launch being delayed, rejected, or delisted.
          </p>

          <p className="text-[#9AA0AE] text-sm">No Financial or Legal Advice:</p>
          <p className="text-[#9AA0AE] text-sm">
            This platform does not provide investment, financial, or legal advice. Submitting your token does not imply
            endorsement, approval, or guarantee of listing or success.
          </p>

          <p className="text-[#9AA0AE] text-sm">Compliance:</p>
          <p className="text-[#9AA0AE] text-sm">
            You must ensure that your project complies with all applicable laws and regulations in your jurisdiction,
            including but not limited to securities, anti-money laundering, and data protection laws.
          </p>

          <p className="text-[#9AA0AE] text-sm">Risk Notice:</p>
          <p className="text-[#9AA0AE] text-sm">
            Launching and trading digital tokens involves significant risks, including potential loss of capital. Please
            consult with a professional advisor before proceeding.
          </p>
          <p className="text-[#9AA0AE] text-sm">Platform Rights:</p>
          <p className="text-[#9AA0AE] text-sm">
            The platform reserves the right to review, approve, reject, or remove any submitted token project at its
            sole discretion and without prior notice.
          </p>
          <p className="text-[#9AA0AE] text-sm">
            By proceeding to the form, you confirm that you have read, understood, and agree to the above disclaimer.
          </p>
        </div>
        <div className="mt-8 flex justify-end w-full">
          <Button
            onClick={handleAccept}
            className="w-fit bg-gradient-to-r from-[#7036FF] to-[#AE8DFF] border border-[#7F5FFA] hover:from-[#AE8DFF] hover:to-[#7036FF] text-[#C2C2C2] font-bold py-6 px-8 rounded-lg text-lg transition-all duration-300"
          >
            Accept
          </Button>
        </div>
      </div>
      <LaunchDisclaimer />
    </div>
  );
}
