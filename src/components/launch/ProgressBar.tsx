'use client';

import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps?: number;
  onStepClick?: (step: number) => void;
}

export default function ProgressBar({ currentStep, totalSteps = 4, onStepClick }: ProgressBarProps) {
  const steps = Array.from({ length: totalSteps }, (_, index) => index + 1);
  // Fill bars based on completed steps; on step 1 nothing is filled
  const filledBars = Math.min(Math.max(currentStep - 1, 0), totalSteps);

  const handleStepClick = (step: number) => {
    if (onStepClick) {
      onStepClick(step);
    }
  };

  return (
    <div className="w-full flex items-center gap-4">
      {steps.map((step) => (
        <React.Fragment key={step}>
          <div
            className={`flex-1 h-2 rounded-full transition-all duration-300 cursor-pointer hover:opacity-80 ${
              step <= filledBars ? 'bg-[#3E14CB]' : 'bg-gray-600'
            }`}
            style={{ height: '8px' }}
            onClick={() => handleStepClick(step)}
          />
          {/* {index < totalSteps - 1 && <div className="w-2 bg-gray-700" style={{ height: '8px' }} />} */}
        </React.Fragment>
      ))}
    </div>
  );
}
