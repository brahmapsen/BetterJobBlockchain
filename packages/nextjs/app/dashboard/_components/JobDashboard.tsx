'use client';

import { useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { ContractUI } from '~~/app/dashboard/_components/contract';
import { ContractName } from '~~/utils/scaffold-stark/contract';
import { getAllContracts } from '~~/utils/scaffold-stark/contractsData';

const selectedContractStorageKey = 'scaffoldStark2.selectedContract';
const contractsData = getAllContracts();
const contractNames = Object.keys(contractsData) as ContractName[];

export function JobDashboard() {
  const [selectedContract, setSelectedContract] = useLocalStorage<ContractName>(
    selectedContractStorageKey,
    contractNames[0],
    { initializeWithValue: false }
  );

  useEffect(() => {
    if (!contractNames.includes(selectedContract)) {
      setSelectedContract(contractNames[0]);
    }
  }, [selectedContract, setSelectedContract]);

  return (
    <div className="flex flex-col gap-y-6 lg:gap-y-8 py-8 lg:py-12 justify-center items-center">
      {contractNames.length === 0 ? (
        <p className="text-3xl mt-14">No contracts found!</p>
      ) : (
        <>
          <ContractUI
              key={contractNames[0]}
              contractName={contractNames[0]}
            />
          
        </>
      )}
    </div>
  );
}
