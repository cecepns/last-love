import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import { Button, Icon, Loading, Typography } from '@/components/atoms';
import { Input } from '@/components/molecules';
import { convertToExcel } from '@/utils';
import { generatePaginationNumbers } from '@/utils/generatePaginationNumbers';
import classNames from 'classnames';

export interface IColumnType {
  accessor: string;
  Header: string;
  Cell?: (cell:unknown) => void;
}

export interface TableProps {
  columns: any[];
  data: any[] | undefined | null;
  totalPages?: number;
  page?: number;
  isConvertExcel?: boolean;
  loading?: boolean;
  setCurrentPage?: (value:number) => void;
}

export const Table: React.FC<TableProps> = memo(({
  columns,
  data,
  totalPages,
  page,
  setCurrentPage,
  loading = false,
  isConvertExcel = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const tableRef = useRef(null);
  
  const getNestedValue = useCallback((
    obj:any,
    accessor:string,
    idx:number,
    currentPage = page ?? 1,
    itemsPerPage = 10
  ) => {
    const keys = accessor.split('.');
  
    return keys.reduce((result, key) => {
      if (key === 'no') {
      // Calculate the row number based on the current page and items per page
        return (currentPage - 1) * itemsPerPage + idx + 1;
      }
      return result[key] || '-';
    }, obj);
  }, [page]);

  const filteredData = useMemo(() => {
    if(data) {
      return data.filter((row) =>
        columns.some((column) =>
          getNestedValue(row, column.accessor, 0)
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      );
    }
    return [];
   
  }, [columns, data, getNestedValue, searchTerm]);

  const columnsExcel = useMemo(() => columns.map(item => item.accessor).filter(x => x !== 'no') ?? [], [columns]);
  
  const bodyExcel = filteredData.map(obj => {
    const newObj:any = {};
    for (const prop of columnsExcel) {
      if (obj.hasOwnProperty(prop)) {
        newObj[prop] = obj[prop];
      }
    }
    return newObj;
  });

  const changePage = (page: number) => {
    if(setCurrentPage) {
      setCurrentPage(page);
    }
  };

  const visiblePaginationNumbers = generatePaginationNumbers(
    page ?? 1,
    totalPages ?? 1,
    5 // Jumlah angka paginasi yang ingin ditampilkan sebelum dan sesudah titik-titik
  );

  return (
    <div className="overflow-x-auto relative min-h-[330px]">
      <div className="p-6 overflow-x-scroll px-0 pt-0 pb-2">
        <div className="flex justify-end items-center my-5 space-x-4">
          {isConvertExcel && <Button onClick={() => convertToExcel(columnsExcel, bodyExcel)} variant="success" className="rounded"> <Icon name="file-excel"/> </Button>}
          <Input label="Search" className="max-w-[210px]" onChange={setSearchTerm}/>
        </div>
        
        <table className="w-full min-w-[640px] table-auto" ref={tableRef}>
          <thead>
            <tr>
              {(columns || []).map((el, _idx) => (
                <th
                  key={_idx}
                  className="border-b border-blue-gray-50 py-3 px-5 text-left"
                >
                  <Typography
                    variant="small"
                    className="text-[11px] font-bold uppercase text-blue-gray-400"
                  >
                    {el.Header}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(filteredData || []).map((row, _idx) => (
              <tr key={_idx}>
                {(columns || []).map((column, _idxColumn) => (
                  <td key={_idxColumn} className="py-3 px-5 border-b border-blue-gray-50">
                    <div className="block antialiased font-sans text-xs/[13px] text-blue-gray-600">
                      {column.Cell ? column.Cell(row) : getNestedValue(row, column?.accessor, _idx)}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {filteredData.length < 1 && !loading && (
          <div className="text-center my-10"> No data </div>
        )}

        <div className="flex space-x-2 mt-10 justify-end">
          {visiblePaginationNumbers.map((pageNumber, index) => (
            <div key={index}>
              {pageNumber === -1 ? (
                <span className="mx-1">...</span>
              ) : (
                <button
                  disabled={loading}
                  onClick={() => changePage(pageNumber)}
                  className={classNames('rounded-md w-[30px] h-[30px] cursor-pointer mx-1', {
                    'text-white bg-primary font-semibold': page === pageNumber,
                    'hover:bg-gray-300 hover:text-white': page !== pageNumber,
                  })}
                >
                  {pageNumber}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {loading && <Loading className="absolute top-0 w-full h-full" fullScreen={false}/>}
    </div>
  );
});
