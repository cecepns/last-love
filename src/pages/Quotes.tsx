import { useCallback, useMemo, useState } from 'react';

import imageCompression from 'browser-image-compression';

import { Button, Typography } from '@/components/atoms';
import { Table } from '@/components/molecules';
import { ENV, useData } from '@/utils';
import { Quote, QuotesResponse } from '@/type';
import Modal from '@/components/molecules/Modal';
// import { generateUniqueRandomString } from '@/utils';

export const Quotes: React.FC = () => {
  // const uniqueRandomString = generateUniqueRandomString(10);

  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, loading } = useData<QuotesResponse>(`${ENV.API_URL}/v1/quotes?page=${page}&limit=10`);
  const quotes = useMemo(()=> data?.quotes ?? [], [data?.quotes]);

  const columns = useMemo(() => [
    {
      Header: 'No',
      accessor: 'no',
    },
    {
      Header: 'Image',
      accessor: 'image',
      Cell: ( data: Quote )=> (
        <div className="bg-gray-100 w-[150px] h-[150px] overflow-hidden">
          <img className="h-full w-full object-cover" src={data.image} />
        </div>
      )
    },
  ], []);

  const handleChangePage = useCallback((val:number) => {
    setPage(val);
  }, []);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const tableConfig = {
    columns,
    data: quotes,
    page,
    loading,
    totalPages: data?.totalPages,
    setCurrentPage: (val: number) => handleChangePage(val)
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = event.target.files && event.target.files[0];

    if(imageFile) {

      const options = {
        maxSizeMB: .3,
        onProgress: (e:number) => console.log(e)
      };
  
      try {
        const compressedFile = await imageCompression(imageFile, options);
  
        console.log(compressedFile.size/1024/1024);
  
        console.log(compressedFile);
  
      } catch (error) {
        console.log(error);
      }
    }

  };

  return (
    <div className="mt-12">
      <div>
        <Typography>
          Data Quotes
        </Typography>
      </div>

      <div className="w-full flex justify-end">
        <Button onClick={openModal}> Add quotes</Button>
      </div>

      <Table {...tableConfig}/>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="p-5">
          <input type="file" onChange={handleImageUpload}/>
        </div>
      </Modal>

    </div> 
  );
};
