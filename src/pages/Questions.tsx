import { useCallback, useMemo, useState } from 'react';

import { Typography } from '@/components/atoms';
import { Question, QuestionResponse } from '@/type';
import { ENV, useData } from '@/utils';
import { Table } from '@/components/molecules';

export const Questions: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, loading } = useData<QuestionResponse>(`${ENV.API_URL}/v1/questions?page=${page}&limit=10`);

  const questions = useMemo(()=> data?.questions ?? [], [data?.questions]);
  const totalPages = useMemo(()=> data?.totalPages ?? 0, [data?.totalPages]);

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

  return (
    <div className="mt-12">
      <div>
        <Typography>
          Data Questions
        </Typography>
      </div>

      <Table {...tableConfig}/>
    </div> 
  );
};
