import { StatisticsCard } from '@/components/organisms';
import { ENV } from '@/utils';
import { useData } from '@/utils';
import { useMemo } from 'react';
import { Gender, QuestionResponse, QuotesResponse, UserResponse } from '@/type';

export const Home: React.FC = () => {
  const { data } = useData<UserResponse>(`${ENV.API_URL}/v1/users?page=1&limit=1`);
  const { data: dataQuestion } = useData<QuestionResponse>(`${ENV.API_URL}/v1/questions?page=1&limit=1`);
  const { data: dataQuotes } = useData<QuotesResponse>(`${ENV.API_URL}/v1/quotes?page=1&limit=1`);
  const { data: dataGender } = useData<Gender>(`${ENV.API_URL}/v1/users/gender`);
  
  const totalQuotes = useMemo(()=> dataQuotes?.totalQuotes ?? 0, [dataQuotes?.totalQuotes]);
  const totalUsers = useMemo(()=> data?.totalUsers ?? 0, [data?.totalUsers]);
  const totalQuestion = useMemo(()=> dataQuestion?.totalQuestions ?? 0, [dataQuestion?.totalQuestions]);
  const totalGender = useMemo(()=> dataGender ?? { male: '', female: '', lgbtqia: '' }, [dataGender]);

  return (
    <div className="mt-12">
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
        <StatisticsCard
          title="Total Users"
          icon="users"
          value={totalUsers}
          color="green"
        />
        <StatisticsCard
          title="Total Questions"
          icon="question"
          value={totalQuestion}
          color="green"
        />
        <StatisticsCard
          title="Total Quotes"
          icon="image-polaroid"
          value={totalQuotes}
          color="green"
        />
        <StatisticsCard
          title="Total Male"
          icon="user"
          value={totalGender.male}
          color="green"
        />
        <StatisticsCard
          title="Total Female"
          icon="user"
          value={totalGender.female}
          color="green"
        />
        <StatisticsCard
          title="Total LGBTQIA"
          icon="user"
          value={totalGender.lgbtqia}
          color="green"
        />
      </div>
    </div> 
  );
};
