export type TokenUseDisclosure = {
  networkFeatures: 'Yes' | 'No' | '';
  premiumFeatures: 'Yes' | 'No' | '';
  communityDriven: 'Yes' | 'No' | '';
};

export type DistributionPlan = {
  governance: boolean;
  staking: boolean;
  accessToServices: boolean;
  airdrop: boolean;
  communityRewards: boolean;
  liquidity: boolean;
};

export type SupplyEmission = 'Fixed Supply' | 'Dynamic Supply';
export type InflationDeflation = 'Inflation' | 'Deflation';
export type VestingType = 'Linear Vesting' | 'Cliff Vesting';
export type ReleaseFrequency = 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Semi-Annual' | 'Annual';

export type VestingSchedule = {
  enabled: boolean;
  vestingType: VestingType | '';
  releaseFrequency: ReleaseFrequency | '';
  totalDurationMonths: number;
  cliffPeriodMonths: number;
  initialUnlockMonths: number;
  finalUnlockPercent: number;
};

export type SaleParameters = {
  softCap: string;
  hardCap: string;
  startDate: string;
  endDate: string;
  perWalletLimitPercent: number;
};

export type CommunityLinks = {
  website: string;
  twitter: string;
  telegram: string;
  discord: string;
  tiktok: string;
  twitch: string;
};

export type Allocations = {
  treasury: number;
  collaborators: number;
  public: number;
  airdrop: number;
  liquidity: number;
};

export type TokenFormData = {
  // Step 1: Set Up
  image: File | null;
  tokenName: string;
  tokenSymbol: string;
  tokenUseDisclosure: TokenUseDisclosure;
  raisedToken: string;
  amount: string;
  distributionPlan: DistributionPlan;
  targetAudience: string;

  // Step 2: Tokenomics
  totalSupply: string;
  supplyEmission: SupplyEmission;
  inflationDeflation: InflationDeflation;
  rate: string;
  frequency: string;
  duration: string;
  allocations: Allocations;

  // Step 3: Sale Setup
  saleParameters: SaleParameters;
  vestingSchedule: VestingSchedule;
  communityLinks: CommunityLinks;

  // Step 4: Review & Launch
  complianceAccepted: boolean;
  email?: string;
};

export type FormErrors = {
  [key in keyof TokenFormData]?: string | FormErrors;
};

export type VestingDetail = {
  category: string;
  type: string;
  duration: string;
  cliff: string;
  unlockPercent: string;
};

