import { distributionOptions, launchTags } from '@/constants/launchForm';
import type { DistributionOption, TokenFormData, VestingFields } from '@/types/launchForm';

const createEmptyDistributionPlan = (): Record<DistributionOption, boolean> => {
  return distributionOptions.reduce((acc, option) => {
    acc[option] = false;
    return acc;
  }, {} as Record<DistributionOption, boolean>);
};

const defaultVestingFields: VestingFields = {
  totalDuration: '',
  cliffPeriod: '',
  initialUnlock: '',
  finalUnlock: '',
};

export const createInitialTokenFormData = (): TokenFormData => ({
  tokenName: '',
  tickerSymbol: '',
  description: '',
  raisedToken: 'BNB',
  raisedAmount: '18',
  website: '',
  twitter: '',
  telegram: '',
  email: '',
  tag: launchTags[0],
  image: null,
  totalSupply: '',
  supplyEmission: 'Fixed Supply',
  inflationDeflation: 'Inflation',
  rate: '',
  frequency: '',
  duration: '',
  treasuryAllocation: 0,
  collaboratorsAllocation: 0,
  publicAllocation: 80,
  airdropAllocation: 0,
  liquidityAllocation: 20,
  distributionPlan: createEmptyDistributionPlan(),
  tokenUseDisclosure: {
    governance: false,
    staking: false,
    community: false,
  },
  targetAudience: '',
  governanceModel: '',
  enableVestingSchedule: false,
  vesting: { ...defaultVestingFields },
  tokenomicsEnabled: false,
});

