import { getPublicClient } from '@/utils/publicClient';
import { Abi, Hex, MulticallResponse } from 'viem';

export const multicallWithSameAbi = async ({
  chainId,
  contracts,
  abi,
  allMethods,
  allParams,
}: {
  chainId: number;
  contracts: Hex[];
  abi: Abi;
  allMethods: string[];
  allParams: unknown[][];
}) => {
  if (contracts.length && contracts.length === allMethods.length && contracts.length === allParams.length) {
    const results: unknown[] = [];
    const publicClient = getPublicClient(chainId);

    for (let i = 0; i < contracts.length; i += 200) {
      const contractsChunk = contracts.slice(i, i + 200);
      const methodsChunk = allMethods.slice(i, i + 200);
      const paramsChunk = allParams.slice(i, i + 200);

      const multiCallResults = (await publicClient.multicall({
        contracts: contractsChunk.map((contract, idx) => ({
          address: contract,
          abi,
          functionName: methodsChunk[idx],
          args: paramsChunk[idx],
        })),
      })) as MulticallResponse[];

      results.push(...multiCallResults.map((result) => result.result));
    }
    return results;
  }
  return [];
};
export const multicallForSameContract = async ({
  chainId,
  params,
  abi,
  address,
  functionNames,
}: {
  chainId: number;
  params: (bigint | string | Hex | number)[][];
  abi: Abi;
  address: Hex;
  functionNames: string[];
}) => {
  const results: unknown[] = [];
  const publicClient = getPublicClient(chainId);

  for (let i = 0; i < params.length; i += 200) {
    const paramsChunk = params.slice(i, i + 200);
    const functionNamesChunk = functionNames.slice(i, i + 200);

    const multiCallResults = (await publicClient.multicall({
      contracts: paramsChunk.map((param, index) => ({
        address,
        abi,
        functionName: functionNamesChunk[index],
        args: param,
      })),
    })) as MulticallResponse[];

    results.push(...multiCallResults.map((result) => result.result));
  }
  return results;
};
