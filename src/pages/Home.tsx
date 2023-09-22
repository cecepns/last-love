import { StatisticsCard } from '@/components/organisms';
import { ENV } from '@/utils';
import { useData } from '@/utils';
import { useMemo } from 'react';
import { UserResponse } from '@/type';

export const Home: React.FC = () => {
  const { data } = useData<UserResponse>(`${ENV.API_URL}/v1/users/`);
  
  const totalUsers = useMemo(()=> data?.totalUsers ?? 0, [data?.totalUsers]);

  return (
    <div className="mt-12">
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
        <StatisticsCard
          title="User"
          icon="user"
          value={totalUsers}
          color="green"
        />
      </div>
    </div> 
  );
};
