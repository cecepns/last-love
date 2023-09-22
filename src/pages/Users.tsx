import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ENV } from '@/utils/env';
import { useData } from '@/utils';
import { User, UserResponse } from '@/type';
import { Button, Typography } from '@/components/atoms';
import { Table } from '@/components/molecules';

export const Users: React.FC = () => {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const { data, loading } = useData<UserResponse>(`${ENV.API_URL}/v1/users?page=${page}&limit=10`);

  const users = useMemo(()=> data?.users ?? [], [data?.users]);
  const totalPages = useMemo(()=> data?.totalPages ?? 0, [data?.totalPages]);

  const handleShowDetail = useCallback((value: string) => {
    navigate('/dashboard/users/' + value);
  }, [navigate]);

  const columnsCarrier = useMemo(() => [
    {
      Header: 'No',
      accessor: 'no',
    },
    {
      Header: 'Images',
      accessor: 'images',
      Cell: ( data: User )=> (
        <div className="rounded-xl bg-gray-100 w-[50px] h-[50px] overflow-hidden">
          {data.images[0] ? (<img className="h-full w-full object-cover" src={data.images[0]} />) : ''} 
        </div>
      )
    },
    {
      Header: 'Name',
      accessor: 'name',
    },
    {
      Header: 'Email',
      accessor: 'email',
    },
    {
      Header: 'Detail',
      accessor: 'detail',
      Cell: (data: User)=> (
        <Button onClick={() => handleShowDetail(data.uid)}> Show detail </Button>
      )
    },
  ], [handleShowDetail]);

  const handleChangePage = useCallback((val:number) => {
    setPage(val);
  }, []);

  const tableConfig = {
    columns: columnsCarrier,
    data: users,
    page,
    loading,
    totalPages,
    setCurrentPage: (val: number) => handleChangePage(val)
  };

  return (
    <div className="mt-12">
      <div>
        <Typography>
          Data Users
        </Typography>
        <Table {...tableConfig}/>
      </div>

    </div> 
  );
};
