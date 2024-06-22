'use client';

// @refresh reset
import { useReducer } from 'react';
import { ContractReadMethods } from './ContractReadMethods';
// import { ContractWriteMethods } from "./ContractWriteMethods";
import { Address, Balance } from '~~/components/scaffold-stark';
import {
  useDeployedContractInfo,
  useNetworkColor,
} from '~~/hooks/scaffold-stark';
import { useTargetNetwork } from '~~/hooks/scaffold-stark/useTargetNetwork';
import { ContractName } from '~~/utils/scaffold-stark/contract';
import { ContractVariables } from './ContractVariables';
import { ContractWriteMethods } from './ContractWriteMethods';

import {
  createContractCall,
  useScaffoldMultiWriteContract,
} from '~~/hooks/scaffold-stark/useScaffoldMultiWriteContract';

type ContractUIProps = {
  contractName: ContractName;
  className?: string;
};

/**
 * UI component to interface with deployed contracts.
 **/
export const ContractUI = ({
  contractName,
  className = '',
}: ContractUIProps) => {
  const [refreshDisplayVariables, triggerRefreshDisplayVariables] = useReducer(
    (value) => !value,
    false
  );
  const { targetNetwork } = useTargetNetwork();

  const networkColor = useNetworkColor();

  const { data } = useDeployedContractInfo('JobBoard');

  const { writeAsync } = useScaffoldMultiWriteContract({
    calls: [
      createContractCall('Eth', 'approve', [data?.address, 1 * 10 ** 15]),
      createContractCall('JobBoard', 'stake_org', [1 * 10 ** 15]),
    ],
  });

  return (
    <div
      className={`grid grid-cols-1 lg:grid-cols-6 px-6 lg:px-10 lg:gap-12 w-full max-w-7xl my-0 ${className}`}
    >
      <div className="col-span-5 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
        <div className="col-span-1 flex flex-col">
          <div className="bg-base-100 border-base-300 border shadow-md shadow-secondary rounded-3xl px-6 lg:px-8 mb-6 space-y-1 py-4">
            <div className="flex">
              <div className="flex flex-col gap-1">
                <span className="font-bold">{contractName}</span>
                <Address address={data?.address} />
                <div className="flex gap-1 items-center">
                  <span className="font-bold text-sm">Balance:</span>
                  <Balance
                    address={data?.address}
                    className="px-0 h-1.5 min-h-[0.375rem]"
                  />
                </div>
              </div>
            </div>
            {targetNetwork && (
              <p className="my-0 text-sm">
                <span className="font-bold">Network</span>:{' '}
                <span style={{ color: networkColor }}>
                  {targetNetwork.name}
                </span>
              </p>
            )}
          </div>

          <div className="flex items-center justify-center space-x-2">
              <p className="my-0 text-sm">Enter Content Type </p>
          </div>

          <div
            onClick={() => {
              writeAsync();
            }}
            className="bg-primary text-white px-4 py-2 rounded-md mt-4 cursor-pointer hover:bg-primary-dark transition-colors"
          >
            Upload Contents
          </div>
        </div>
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
          <div className="z-10">
            <div className="bg-base-100 rounded-3xl shadow-md shadow-secondary border border-base-300 flex flex-col mt-10 relative">
              <div className="h-[5rem] w-[5.5rem] bg-base-300 absolute self-start rounded-[22px] -top-[38px] -left-[1px] -z-10 py-[0.65rem] shadow-lg shadow-base-300">
                <div className="flex items-center justify-center space-x-2">
                  <p className="my-0 text-sm">Activities</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
