import { useCallback, useMemo, useState } from 'react';

import CsvDownloader from 'react-csv-downloader';

import { Button, Icon, Typography } from '@/components/atoms';
import { Question, QuestionResponse } from '@/type';
import { ENV, downloadJson, useData } from '@/utils';
import { Table } from '@/components/molecules';
import moment from 'moment';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/config';

export const Questions: React.FC = () => {
  const [loadingDownloadFile, setloadingDownloadFile] = useState({
    csv: false,
    json: false,
  });
  const [page, setPage] = useState(1);
  const { data, loading } = useData<QuestionResponse>(`${ENV.API_URL}/v1/questions?page=${page}&limit=10`);

  const questions = useMemo(()=> data?.questions ?? [], [data?.questions]);
  const totalPages = useMemo(()=> data?.totalPages ?? 0, [data?.totalPages]);

  const columnDataQuestions = useMemo(() => [
    { displayName: 'Options', id: 'options' },
    { displayName: 'Questions', id: 'question' }
  ], []);

  const columnsCarrier = useMemo(() => [
    {
      Header: 'No',
      accessor: 'no',
    },
    {
      Header: 'Question',
      accessor: 'question',
    },
    {
      Header: 'Options',
      accessor: 'options',
      Cell: (value: Question) => {
        const joinedOptions = Object.entries(value.options)
          .map(([key, value]) => `${parseInt(key) + 1}. ${value}`)
          .join(', ');

        return (
          <span>{joinedOptions}</span>
        );
      }
    },
  ], []);

  const handleChangePage = useCallback((val:number) => {
    setPage(val);
  }, []);

  const tableConfig = {
    columns: columnsCarrier,
    page,
    totalPages,
    data:questions,
    loading,
    setCurrentPage: (val: number) => handleChangePage(val)
  };

  const handleDownloadCsv = useCallback(async (name:string)=> {
    setloadingDownloadFile(prev => ({
      ...prev,
      [name]: true
    }));
    try {
      const res = await getDocs(collection(db, 'Questions'));

      const raw = res.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  
      const data:any = raw.map(({ question, options }: any) => {
        const optionRaw = Object.entries(options)
          .map(([key, value]) => `${parseInt(key) + 1}. ${value}`)
          .join(', ');
  
        return { question, options: optionRaw };
      });

      if (name === 'json') {
        downloadJson(data, 'questions');
      }

      setloadingDownloadFile(prev => ({
        ...prev,
        [name]: false
      }));
  
      return data;
    } catch (error) {
      setloadingDownloadFile(({ json: false, csv: false }));
    }

  }, []);

  return (
    <div className="mt-12">
      <div>
        <Typography>
          Data Questions
        </Typography>
      </div>

      <div className="relative">
        <div className="space-x-5 absolute z-10 top-[30px] z-index-1 flex">
          <CsvDownloader
            disabled={loadingDownloadFile.csv}
            datas={() => handleDownloadCsv('csv')}
            columns={columnDataQuestions}
            filename={`questions-data-${moment().format('DD-MM-YYYY HH:mm')}`}
          > 
            <Button disabled={loadingDownloadFile.csv}>
              {loadingDownloadFile.csv ? 'loading...' : 'Export data' }
              <Icon name="file-csv"/>
            </Button>
          </CsvDownloader>

          <Button disabled={loadingDownloadFile.json} onClick={() => handleDownloadCsv('json')}>
            {loadingDownloadFile.json ? 'Loading...' : 'Download JSON'}
            <Icon name="file"/>
          </Button>
        </div>

        <Table {...tableConfig}/>
      </div>

    </div> 
  );
};
