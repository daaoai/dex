import type { launchTags, distributionOptions, targetAudienceOptions, governanceModelOptions } from '@/constants/launchForm';

export type DistributionOption = (typeof distributionOptions)[number];
export type TargetAudienceOption = (typeof targetAudienceOptions)[number];
export type GovernanceModelOption = (typeof governanceModelOptions)[number];
export type LaunchTag = (typeof launchTags)[number];

export interface VestingFields {
  totalDuration: string;
  cliffPeriod: string;
  initialUnlock: string;
  finalUnlock: string;
}

export interface TokenFormData {
  tokenName: string;
  tickerSymbol: string;
  description: string;
  raisedToken: string;
  raisedAmount: string;
  website: string;
  twitter: string;
  telegram: string;
  tag: LaunchTag;
  image: File | null;
  totalSupply: string;
  supplyEmission: string;
  inflationDeflation: 'Inflation' | 'Deflation';
  rate: string;
  frequency: string;
  duration: string;
  treasuryAllocation: number;
  collaboratorsAllocation: number;
  publicAllocation: number;
  airdropAllocation: number;
  liquidityAllocation: number;
  email?: string;
  distributionPlan: Record<DistributionOption, boolean>;
  tokenUseDisclosure: Record<string, boolean>;
  targetAudience: TargetAudienceOption | '';
  governanceModel: GovernanceModelOption | '';
  enableVestingSchedule: boolean;
  vesting: VestingFields;
  tokenomicsEnabled: boolean;
}

