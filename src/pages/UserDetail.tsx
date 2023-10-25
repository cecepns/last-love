import { useParams } from 'react-router-dom';

import { ENV } from '@/utils/env';
import { useData } from '@/utils';
import { useMemo } from 'react';
import { UserDetailResponse } from '@/type';
import { Icon } from '@/components/atoms';

export const UserDetail: React.FC = () => {
  const params = useParams();
  const { data } = useData<UserDetailResponse>(`${ENV.API_URL}/v1/users/get/${params.uid}`);
  
  const user = useMemo(() => data?.user, [data?.user]);

  return (
    <div className="mt-5">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <div className="text-center space-y-3 mb-5">
          <img
            src={user?.images[0]}
            alt={user?.name}
            className="w-32 h-32 mx-auto rounded-full object-cover"
          />
          <h1 className="text-3xl font-semibold mt-4">{user?.name || 'Name -'}</h1>
          <p className="text-gray-500 text-sm mt-2">{user?.email || 'Email -'}</p>
        </div>
        <div className="space-y-4">
          <p className="text-gray-500 text-sm">{user?.isVerified === 'false' ? <Icon name="circle-x" className="text-primary"/> : <Icon name="badge-check" className="text-primary"/>} isVerified</p>
          <p className="text-gray-500 text-sm">{user?.isPaid ? <Icon name="badge-check" className="text-primary"/> : <Icon name="circle-x" className="text-primary"/>} isPaid</p>
          <p className="text-gray-500 text-sm">{user?.questionCompleted ? <Icon name="badge-check" className="text-primary"/> : <Icon name="circle-x" className="text-primary"/>} Question completed</p>
          <a href={user?.partnerVideo} className="block text-gray-500 text-sm"><Icon name="video" className="text-primary"/> Video</a>
        </div>
      </div>
    </div>
  );
};
