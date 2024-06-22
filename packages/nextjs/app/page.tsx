'use client';

import Link from 'next/link';
import type { NextPage } from 'next';
import { BugAntIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Address } from '~~/components/scaffold-stark';
import { useAccount } from '@starknet-react/core';
import { Address as AddressType } from '@starknet-react/chains';
import { useScaffoldContract } from '~~/hooks/scaffold-stark/useScaffoldContract';
import {
  createContractCall,
  useScaffoldMultiWriteContract,
} from '~~/hooks/scaffold-stark/useScaffoldMultiWriteContract';
import { useDeployedContractInfo } from '~~/hooks/scaffold-stark';

const Home: NextPage = () => {
  const connectedAddress = useAccount();

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">A</span>
            <span className="block text-4xl font-bold">
              Portal to Crypto Jobs
            </span>
          </h1>
          <div className="flex justify-center items-center space-x-2">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress.address as AddressType} />
          </div>
          <p className="text-center text-lg">
            Go to Dashboard to view your activities and status. Get notified
            about events.{' '}
          </p>
          <p className="text-center text-lg">
            Candidates: Upload your artifacts and{' '}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              find your best Job match
            </code>{' '}
            <br />
            Recruiters: upload Job Postings and {' '}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              find your candidate match
            </code>
          </p>
        </div>
      </div>
    </>
  );
};

export default Home;
