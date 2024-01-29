import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import CsvDownloader from 'react-csv-downloader';
import moment from 'moment';

import { ENV } from '@/utils/env';
import { useData } from '@/utils';
import { User, UserResponse } from '@/type';
import { Button, Icon, Typography } from '@/components/atoms';
import { Table } from '@/components/molecules';

import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/config';

export const Users: React.FC = () => {
  const [loadingCsv, setLoadingCsv] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const { data, loading } = useData<UserResponse>(`${ENV.API_URL}/v1/users?page=${page}&limit=10`);

  const users = useMemo(()=> data?.users.filter((v) => v.email !== 'admin.lastlove@gmail.com') ?? [], [data?.users]);
  const totalPages = useMemo(()=> data?.totalPages ?? 0, [data?.totalPages]);

  const handleShowDetail = useCallback((value: string) => {
    navigate('/dashboard/users/' + value);
  }, [navigate]);

  const columnDataUsers = useMemo(() => [
    { displayName: 'Email', id: 'email' },
    { displayName: 'Name', id: 'name' },
    { displayName: 'Questions & Answeres', id: 'questions' }
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

  const tableConfig = {
    columns: columnsCarrier,
    data: users,
    page,
    loading,
    totalPages,
    setCurrentPage: (val: number) => handleChangePage(val)
  };

  const fetchDataFromFirestore = async () => {
    try {
      setLoadingCsv(true);
      const collection1 = await getDocs(collection(db, 'Users'));
      const collection2 = await getDocs(collection(db, 'UserInfo'));

      console.log('collection 1', collection1);
      console.log('collection 2', collection2);
  
      const newData1:any = collection1.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      const newData2:any = collection2.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  
      const mergedData = newData1.map((data1:any) => {
        const matchingData2 = newData2.find((data2:any) => data2.id === data1.uid);
  
        if (matchingData2) {
          const pertanyaanArray = matchingData2.answeres ? Object.entries(matchingData2.answeres).map(([pertanyaanKey, jawaban]) => ({ pertanyaan: pertanyaanKey, jawaban })) : [];
          return { ...data1, pertanyaan: pertanyaanArray };
        }
  
        return data1;
      });
  
      const csvData = mergedData.map(({ email, name, pertanyaan }:any) => {
        const questionsString = Array.isArray(pertanyaan)
          ? pertanyaan.map(({ pertanyaan, jawaban }, index) => `${index + 1}.${pertanyaan} = ${jawaban}`).join(', ')
          : '';
        return { email, name, questions: questionsString };
      });
  
      setLoadingCsv(false);
      return csvData;
    } catch (error) {
      setLoadingCsv(false);
      console.error('Error fetching collections:', error);
      throw error;
    }
  };
  
  const asyncFnComputeDate = async () => {
    try {
      const csvData = await fetchDataFromFirestore();
      console.log('CSV', csvData);
      return csvData;
    } catch (error) {
      alert(error);
      // Handle error appropriately
    }
  };

  return (
    <div className="mt-12">
      <div>
        <Typography>
          Data Users
        </Typography>

        <div className="relative">

          <CsvDownloader
            className="absolute z-10 top-[30px] z-index-1"
            disabled={loadingCsv}
            datas={asyncFnComputeDate}
            columns={columnDataUsers}
            filename={`users-data-${moment().format('DD-MM-YYYY HH:mm')}`}
          > 
            <Button disabled={loadingCsv}>
              {loadingCsv ? 'loading...' : 'Export data' }
              <Icon name="file-csv"/>
            </Button>
          </CsvDownloader>
          
          <Table {...tableConfig}/>
        </div>
      </div>

    </div> 
  );
};
