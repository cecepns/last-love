import { useEffect, useMemo, useState } from 'react';

import { StatisticsCard } from '@/components/organisms';
import { ENV } from '@/utils';
import { useData } from '@/utils';
import { QuestionResponse, QuotesResponse, UserResponse } from '@/type';
import { collection, getCountFromServer, getDocs } from 'firebase/firestore';
import { db } from '@/config';

export const Home: React.FC = () => {
  const [count, setCount] = useState({
    totalUsers: 0,
    male: 0,
    female: 0,
    lgbt: 0,
  });
  const { data } = useData<UserResponse>(`${ENV.API_URL}/v1/users?page=1&limit=1`);
  const { data: dataQuestion } = useData<QuestionResponse>(`${ENV.API_URL}/v1/questions?page=1&limit=1`);
  const { data: dataQuotes } = useData<QuotesResponse>(`${ENV.API_URL}/v1/quotes?page=1&limit=1`);
  
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

  useEffect(() => {
    const fn = async () => {
      const coll = collection(db, 'UsersOld');
      const snapshot = await getCountFromServer(coll);
      
      const userInfo = await getDocs(collection(db, 'UserInfo'));
      const userInfoOld = await getDocs(collection(db, 'UserInfoOld'));
      
      const usersInfo = userInfo.docs.map((doc) => ({ ...doc.data(), id: doc.id })).concat(userInfoOld.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      
      const totalUsersOld = snapshot.data().count;
      const totalMale = usersInfo.filter((entry:any)=> entry?.answeres['You\'re seeking:'] === 'Male').length;
      const totalFemale = usersInfo.filter((entry:any)=> entry?.answeres['You\'re seeking:'] === 'Female').length;
      const totalLgbt = usersInfo.filter((entry:any)=> entry?.answeres['You\'re seeking:'] === 'LGBTQIA+').length;

      setCount({ totalUsers:totalUsersOld, male: totalMale, female: totalFemale, lgbt: totalLgbt });
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
          value={count.male}
          color="purple"
        />
        <StatisticsCard
          title="Total Female"
          icon="user-vneck-hair-long"
          value={count.female}
          color="purple"
        />
        <StatisticsCard
          title="Total LGBTQIA+"
          icon="heart"
          value={count.lgbt}
          color="purple"
        />
      </div>
    </div> 
  );
};
