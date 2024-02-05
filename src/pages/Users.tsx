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
  const [loadingDownloadFile, setloadingDownloadFile] = useState({
    csv: false,
    json: false,
  });
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
    { displayName: 'isPaid', id: 'isPaid' },
    { displayName: 'isVerified', id: 'isVerified' },
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

  const fetchDataFromFirestore = useCallback(async () => {
    try {
      const users = await getDocs(collection(db, 'Users'));
      const userInfo = await getDocs(collection(db, 'UserInfo'));

      const usersOld = await getDocs(collection(db, 'UsersOld'));
      const userInfoOld = await getDocs(collection(db, 'UserInfoOld'));

      const newData1:any = users.docs.map((doc) => ({ ...doc.data(), id: doc.id })).concat(usersOld.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      const newData2:any = userInfo.docs.map((doc) => ({ ...doc.data(), id: doc.id })).concat(userInfoOld.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  
      const mergedData = newData1.map((data1:any) => {
        const matchingData2 = newData2.find((data2:any) => data2.id === data1.uid);
  
        if (matchingData2) {
          const pertanyaanArray = matchingData2.answeres ? Object.entries(matchingData2.answeres).map(([pertanyaanKey, jawaban]) => ({ pertanyaan: pertanyaanKey, jawaban })) : [];
          return { ...data1, pertanyaan: pertanyaanArray };
        }
  
        return data1;
      });
  
      const csvData = mergedData.map(({ email, name, isPaid, isVerified, pertanyaan }:any) => {
        const questionsString = Array.isArray(pertanyaan)
          ? pertanyaan.map(({ pertanyaan, jawaban }, index) => `${index + 1}.${pertanyaan} = ${jawaban}`).join(', ')
          : '';
        return { email, name, isPaid, isVerified, questions: questionsString };
      });

      return csvData;
    } catch (error) {
      setloadingDownloadFile(({ json: false, csv: false }));
      throw error;
    }
  }, []);
  
  const handleDownloadCsv = useCallback(async () => {
    try {
      setloadingDownloadFile(prev => ({ ...prev, csv: true }));
      const csvData = await fetchDataFromFirestore();
      setloadingDownloadFile(prev => ({ ...prev, csv: false }));
      return csvData;
    } catch (error) {
      alert(error);
    }
  }, [fetchDataFromFirestore]);

  const handleDownloadJson = useCallback(async () => {
    try {
      setloadingDownloadFile(prev => ({ ...prev, json: true }));

      const data = await fetchDataFromFirestore();

      const jsonString = JSON.stringify(data);

      const blob = new Blob([jsonString], { type: 'application/json' });

      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = `users-data-${moment().format('DD-MM-YYYY HH:mm')}.json`;

      document.body.appendChild(downloadLink);

      downloadLink.click();

      document.body.removeChild(downloadLink);
      setloadingDownloadFile(prev => ({ ...prev, json: false }));
    } catch (error) {
      alert(error);
    }
  }, [fetchDataFromFirestore]);

  return (
    <div className="mt-12">
      <div>
        <Typography>
          Data Users
        </Typography>

        <div className="relative">

          <div className="space-x-5 absolute z-10 top-[30px] z-index-1 flex">
            <CsvDownloader
              disabled={loadingDownloadFile.csv}
              datas={handleDownloadCsv}
              columns={columnDataUsers}
              filename={`users-data-${moment().format('DD-MM-YYYY HH:mm')}`}
            > 
              <Button disabled={loadingDownloadFile.csv}>
                {loadingDownloadFile.csv ? 'loading...' : 'Export data' }
                <Icon name="file-csv"/>
              </Button>
            </CsvDownloader>

            <Button disabled={loadingDownloadFile.json} onClick={handleDownloadJson}>
              {loadingDownloadFile.json ? 'Loading...' : 'Download JSON'}
              <Icon name="file"/>
            </Button>
          </div>
          
          <Table {...tableConfig}/>
        </div>
      </div>

    </div> 
  );
};
