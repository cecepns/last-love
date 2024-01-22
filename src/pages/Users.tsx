import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CSVLink } from 'react-csv';
import moment from 'moment';

import { ENV } from '@/utils/env';
import { useData } from '@/utils';
import { User, UserResponse } from '@/type';
import { Button, Icon, Typography } from '@/components/atoms';
import { Table } from '@/components/molecules';

export const Users: React.FC = () => {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const { data, loading } = useData<UserResponse>(`${ENV.API_URL}/v1/users?page=${page}&limit=10`);
  const { data: dataAllUsers, loading: loadingUsersDownload } = useData<UserResponse>(`${ENV.API_URL}/v1/users?page=${page}&limit=10000`);

  const allUsers = useMemo(()=> dataAllUsers?.users.filter((v) => v.email !== 'admin.lastlove@gmail.com') ?? [], [dataAllUsers?.users]);
  const users = useMemo(()=> data?.users.filter((v) => v.email !== 'admin.lastlove@gmail.com') ?? [], [data?.users]);
  const totalPages = useMemo(()=> data?.totalPages ?? 0, [data?.totalPages]);

  const handleShowDetail = useCallback((value: string) => {
    navigate('/dashboard/users/' + value);
  }, [navigate]);

  console.log(users);

  const headersUsers = useMemo(() => [
    { label: 'Email', key: 'email' },
    { label: 'Name', key: 'name' },
    { label: 'Ispaid', key: 'isPaid' },
    { label: 'IsVerified', key: 'isVerified' }
  ], []);

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

  const getAllUsers = useCallback((_: unknown, done:any) => {
    try {
      if (!loadingUsersDownload) {
        return done(true);
      }
      done(false);
    } catch (error) {
      console.error(error);
      done(false); 
    }
  }, [loadingUsersDownload]);

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
        
        <div className="relative">
          
          <CSVLink className="absolute z-10 top-[30px] z-index-1 bg-primary hover:bg-primary-700 text-white px-2 py-2 justify-center middle none font-sans font-bold center transition-all  text-xs rounded-lg  flex items-center gap-4 capitalize w-[130px]"
            asyncOnClick={true}
            onClick={getAllUsers}
            filename={`users-data-${moment().format('DD-MM-YYYY HH:mm')}`}
            data={allUsers}
            headers={headersUsers}
          >
            {loadingUsersDownload ? 'loading...' : 'Export data' }
            <Icon name="file-csv"/>
          </CSVLink>
          
          <Table {...tableConfig}/>
        </div>
      </div>

    </div> 
  );
};
