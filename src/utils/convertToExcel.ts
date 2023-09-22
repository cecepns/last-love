import { downloadExcel } from 'react-export-table-to-excel';

export const convertToExcel = (header:string[], body: Array<{
  [key: string]: string | number | boolean;
}> | Array<(string | number | boolean)[]>)=> {

  downloadExcel({
    fileName: 'carrywise-' + new Date().toLocaleDateString(),
    sheet: 'react-export-table-to-excel',
    tablePayload:  {
      header,
      body,
    },
  });
};
