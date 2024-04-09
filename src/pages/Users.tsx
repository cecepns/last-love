import { useCallback, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import CsvDownloader from 'react-csv-downloader';
import moment from 'moment';

import { downloadJson } from '@/utils';
import { User } from '@/type';
import { Button, Icon, Typography } from '@/components/atoms';
import { Table } from '@/components/molecules';

import { DocumentSnapshot, collection, getDocs } from 'firebase/firestore';

import { db } from '@/config';
import { useFirebase } from '@/hooks';
import { debounce } from 'lodash';

export const Users: React.FC = () => {
  const [loadingDownloadFile, setloadingDownloadFile] = useState({
    csv: false,
    json: false,
  });
  const [page, setPage] = useState<number>(1);
  const [keywordSearch, setKeywordSearch] = useState<string>('');
  const navigate = useNavigate();
  const cursors = useRef<Map<number, DocumentSnapshot>>(new Map());

  const { data, loading, totalPages } = useFirebase({
    collectionName: 'Users',
    fieldSearch: 'email',
    keywordSearch,
    cursor: cursors.current.get(page),
  });

  // console.log(data.docs);

  const tasks = useMemo(() => {
    return data?.docs?.map((doc:any) => doc.data()) ?? [];
  }, [data?.docs]);

  const handleShowDetail = useCallback((value: string) => {
    navigate('/dashboard/users/' + value);
  }, [navigate]);

  const handleChange = useCallback((v:string) => {
    cursors.current.set(
      page + 1,
      data.docs[data.docs.length - 1]
    );
    const debouncedSetKeywordSearch = debounce(() => {
      setKeywordSearch(v);
    }, 2000);
    debouncedSetKeywordSearch();
  }, [data.docs, page]);

  const columnDataUsers = useMemo(() => [
    { displayName: 'Email', id: 'email' },
    { displayName: 'Name', id: 'name' },
    { displayName: 'isPaid', id: 'isPaid' },
    { displayName: 'isVerified', id: 'isVerified' },
    { displayName: 'Questions & Answeres', id: 'questions' },
    { displayName: 'Open Questions & Answeres', id: 'openQuestions' },
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
    cursors.current.set(
      page + 1,
      data.docs[data.docs.length - 1]
    );
  }, [data.docs, page]);

  const tableConfig = {
    columns: columnsCarrier,
    data: tasks,
    page,
    loading,
    totalPages: Math.floor(totalPages / 10),
    onChangeSearch: (v:string) => handleChange(v),
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
  
      const csvData = mergedData.map(({ email, name, isPaid, isVerified, pertanyaan, openAnswer }:any) => {
        const questionsString = Array.isArray(pertanyaan)
          ? pertanyaan.map(({ pertanyaan, jawaban }, index) => `${index + 1}.${pertanyaan} = ${jawaban}`).join(', ')
          : '';

        const openQuestionsRaw = openAnswer ? Object.entries(openAnswer).map(([key, v]:any) => ({ openQuestions: key, jawaban: v })) : [];

        const openQuestions = openQuestionsRaw.map(({ openQuestions, jawaban }, index) => `${index + 1}.${openQuestions} = ${Array.isArray(jawaban) ? jawaban?.join(', ') : jawaban}`).join(', ');
        
        return { email, name, isPaid, isVerified, questions: questionsString, openQuestions };
      });

      return csvData;
    } catch (error) {
      setloadingDownloadFile(({ json: false, csv: false }));
      throw error;
    }
  }, []);

  const fetchDataFromFirestoreJson = useCallback(async () => {
    try {
      const users = await getDocs(collection(db, 'Users'));
      const userInfo = await getDocs(collection(db, 'UserInfo'));

      const usersOld = await getDocs(collection(db, 'UsersOld'));
      const userInfoOld = await getDocs(collection(db, 'UserInfoOld'));

      const newData1:any = users.docs.map((doc) => ({ ...doc.data(), id: doc.id })).concat(usersOld.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      const newData2:any = userInfo.docs.map((doc) => ({ ...doc.data(), id: doc.id })).concat(userInfoOld.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  
      const mergedData = newData1.map(({ email, name, isPaid, isVerified, uid, openAnswer }:any) => {
        const matchingData2 = newData2.find((data2:any) => data2.id === uid);

        const openQuestions = openAnswer ? Object.entries(openAnswer).map(([question, answers]:any) => {
          return { [question]: Array.isArray(answers) ? answers.join(', ') : answers };
        }) : [];

        return {
          email,
          name,
          isPaid,
          isVerified,
          questions: matchingData2?.answeres,
          openQuestions
        };
  
      });

      return mergedData;
    
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

      const data = await fetchDataFromFirestoreJson();
      
      downloadJson(data);

      setloadingDownloadFile(prev => ({ ...prev, json: false }));
    } catch (error) {
      alert(error);
    }
  }, [fetchDataFromFirestoreJson]);

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
