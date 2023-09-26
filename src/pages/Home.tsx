import { StatisticsCard } from '@/components/organisms';
import { ENV } from '@/utils';
import { useData } from '@/utils';
import { useMemo } from 'react';
import { QuestionResponse, UserResponse } from '@/type';

export const Home: React.FC = () => {
  const { data } = useData<UserResponse>(`${ENV.API_URL}/v1/users/`);
  const { data: dataQuestion } = useData<QuestionResponse>(`${ENV.API_URL}/v1/questions`);
  
  const totalUsers = useMemo(()=> data?.totalUsers ?? 0, [data?.totalUsers]);
  const totalQuestion = useMemo(()=> dataQuestion?.totalQuestions ?? 0, [dataQuestion?.totalQuestions]);

  return (
    <div className="mt-12">
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
        <StatisticsCard
          title="Total Users"
          icon="user"
          value={totalUsers}
          color="green"
        />
        <StatisticsCard
          title="Total Questions"
          icon="question"
          value={totalQuestion}
          color="green"
        />
      </div>
    </div> 
  );
};
