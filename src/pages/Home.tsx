import { useEffect, useMemo, useState } from 'react';

import { StatisticsCard } from '@/components/organisms';
import { ENV } from '@/utils';
import { useData } from '@/utils';
import { Gender, QuestionResponse, QuotesResponse, UserResponse } from '@/type';
import { collection, getCountFromServer } from 'firebase/firestore';
import { db } from '@/config';

export const Home: React.FC = () => {
  const [count, setCount] = useState({
    totalUsers: 0,
  });
  const { data } = useData<UserResponse>(`${ENV.API_URL}/v1/users?page=1&limit=1`);
  const { data: dataQuestion } = useData<QuestionResponse>(`${ENV.API_URL}/v1/questions?page=1&limit=1`);
  const { data: dataQuotes } = useData<QuotesResponse>(`${ENV.API_URL}/v1/quotes?page=1&limit=1`);
  const { data: dataGender } = useData<Gender>(`${ENV.API_URL}/v1/users/gender`);
  
  const totalQuotes = useMemo(()=> dataQuotes?.totalQuotes ?? 0, [dataQuotes?.totalQuotes]);
  const totalUsers = useMemo(()=> {
    if(data?.totalUsers) {
      if(data?.totalUsers > 0) {
        return ((data?.totalUsers + count.totalUsers) - 1);
      }
      return 0;
    }
    return 0;
  }, [count.totalUsers, data?.totalUsers]);
  const totalQuestion = useMemo(()=> dataQuestion?.totalQuestions ?? 0, [dataQuestion?.totalQuestions]);
  const totalGender = useMemo(()=> dataGender ?? { male: 0, female: 0, lgbtqia: 0 }, [dataGender]);

  useEffect(() => {
    const fn = async () => {
      const coll = collection(db, 'UsersOld');
      const snapshot = await getCountFromServer(coll);
      const totalUsersOld = snapshot.data().count;

      setCount(prev => ({ ...prev, totalUsers:totalUsersOld }));
    };

    fn();
  }, []);

  return (
    <div className="mt-12">
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
        <StatisticsCard
          title="Total Users"
          icon="users"
          value={totalUsers}
          color="purple"
        />
        <StatisticsCard
          title="Total Questions"
          icon="question"
          value={totalQuestion}
          color="purple"
        />
        <StatisticsCard
          title="Total Quotes"
          icon="image-polaroid"
          value={totalQuotes}
          color="purple"
        />
        <StatisticsCard
          title="Total Male"
          icon="user"
          value={totalGender.male}
          color="purple"
        />
        <StatisticsCard
          title="Total Female"
          icon="user-vneck-hair-long"
          value={totalGender.female}
          color="purple"
        />
        <StatisticsCard
          title="Total LGBTQIA+"
          icon="heart"
          value={totalGender.lgbtqia}
          color="purple"
        />
      </div>
    </div> 
  );
};
