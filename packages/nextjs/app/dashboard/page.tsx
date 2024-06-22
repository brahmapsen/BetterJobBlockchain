import { JobDashboard } from './_components/JobDashboard';
import type { NextPage } from 'next';
import { getMetadata } from '~~/utils/scaffold-stark/getMetadata';

export const metadata = getMetadata({
  title: 'BetterJobs-Dashboard',
  description:
    'Dashboard to view all your activities and status on the Better Jobs platform.',
});

const Dashboard: NextPage = () => {
  return (
    <>
      <div className="text-center mt-8 bg-secondary p-10">
        <h1 className="text-4xl my-0">Dashboard</h1>
        <p className="text-neutral">
          Better Jobs platform
          <br /> View your {'     '}
          <code className="italic bg-base-300 text-base font-bold [word-spacing:-0.5rem] px-1">
            activities
          </code>
          {'   '}
        </p>
      </div>
      <JobDashboard />
    </>
  );
};

export default Dashboard;
