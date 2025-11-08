'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/shadcn/components/ui/button';
import ProgressBar from '@/components/launch/ProgressBar';
import LaunchDisclaimer from '@/components/launch/LaunchDisclaimer';
import Step1Setup from '@/components/launch/form/Step1Setup';
import Step2Tokenomics from '@/components/launch/form/Step2Tokenomics';
import Step3SaleSetup from '@/components/launch/form/Step3SaleSetup';
import Step4Review from '@/components/launch/form/Step4Review';
import {
  distributionOptions,
  governanceModelOptions,
  targetAudienceOptions,
  launchTags as launchTagOptions,
} from '@/constants/launchForm';
import { createInitialTokenFormData } from '@/utils/launchFormDefaults';
import type { DistributionOption, TokenFormData } from '@/types/launchForm';

export default function LaunchTokenPage() {
  const router = useRouter();
  const [currentFormStep, setCurrentFormStep] = useState(1);
  const [formData, setFormData] = useState<TokenFormData>(createInitialTokenFormData);

  const [isLaunching, setIsLaunching] = useState(false);

  // Navigate to any step
  const goToStep = (step: number) => {
    setCurrentFormStep(step);
  };

  const handleInputChange = <K extends keyof TokenFormData>(field: K, value: TokenFormData[K]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAllocationChange = (field: keyof TokenFormData, value: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleDistributionOption = (option: DistributionOption) => {
    setFormData((prev) => ({
      ...prev,
      distributionPlan: {
        ...prev.distributionPlan,
        [option]: !prev.distributionPlan[option],
      },
    }));
  };

  const handleTokenUseDisclosureChange = (key: string, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      tokenUseDisclosure: {
        ...prev.tokenUseDisclosure,
        [key]: value,
      },
    }));
  };

  const handleSupplyEmissionChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      supplyEmission: value,
      tokenomicsEnabled: !!value,
    }));
  };

  const handleLaunch = async () => {
    setIsLaunching(true);
    try {
      // TODO: Implement token launch logic
      console.log('Launching token with data:', formData);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error('Error launching token:', error);
    } finally {
      setIsLaunching(false);
    }
  };

  const handleNext = () => {
    if (currentFormStep < 4) {
      setCurrentFormStep(currentFormStep + 1);
    } else {
      handleLaunch();
    }
  };

  const handleBack = () => {
    if (currentFormStep > 1) {
      setCurrentFormStep(currentFormStep - 1);
    } else {
      // Go back to disclaimer
      router.push('/launch/disclaimer');
    }
  };

  const renderFormStep = () => {
    switch (currentFormStep) {
      case 1:
        return (
          <Step1Setup
            formData={formData}
            distributionOptions={distributionOptions}
            targetAudienceOptions={targetAudienceOptions}
            governanceModelOptions={governanceModelOptions}
            onInputChange={(field, value) => handleInputChange(field, value)}
            onToggleDistribution={toggleDistributionOption}
            onTokenUseDisclosureChange={handleTokenUseDisclosureChange}
          />
        );
      case 2:
        return (
          <Step2Tokenomics
            formData={formData}
            onInputChange={(field, value) => handleInputChange(field, value)}
            onAllocationChange={(field, value) => handleAllocationChange(field, value)}
            onSupplyEmissionChange={handleSupplyEmissionChange}
          />
        );
      case 3:
        return (
          <Step3SaleSetup
            formData={formData}
            onInputChange={(field, value) => handleInputChange(field, value)}
            tags={launchTagOptions}
          />
        );
      case 4:
        return <Step4Review formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="bg-[#02010F]">
        <div className="px-8 pt-8 w-full">
          {/* Header */}
          <div className="mb-4">
            <h1 className="text-xl font-bold text-[#EDEDED] mb-2">LAUNCH TOKEN</h1>
            <p className="font-normal text-[#858991] text-sm">
              Create and deploy your own token securely and autonomously - Synthari gives you the tools, you control the
              outcome.
            </p>
          </div>
        </div>

        {/* Full Width Progress Bar */}
        <div className="w-full px-8 pb-12">
          <ProgressBar currentStep={currentFormStep} totalSteps={4} onStepClick={goToStep} />
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto border border-[#20242C] rounded-2xl my-12">
        {/* Form */}
        <div className="rounded-lg p-8">
          {renderFormStep()}

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between w-full">
            <Button
              onClick={handleBack}
              variant="outline"
              className="bg-transparent border border-stroke-3 text-white hover:bg-background-5 px-8 py-3"
            >
              Back
            </Button>

            <Button
              onClick={handleNext}
              disabled={isLaunching || !formData.tokenName || !formData.tickerSymbol}
              className="bg-gradient-to-r from-[#7036FF] to-[#AE8DFF] border border-[#7F5FFA] hover:from-[#AE8DFF] hover:to-[#7036FF] text-white font-bold py-3 px-8 rounded-md text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLaunching ? 'LAUNCHING...' : currentFormStep === 4 ? 'Launch Token' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
      <LaunchDisclaimer />
    </div>
  );
}
