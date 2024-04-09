import { useEffect, useState } from 'react';
import { DocumentSnapshot, collection, getCountFromServer, getDocs, limit, query, startAfter, where } from 'firebase/firestore';
import { db } from '@/config';
import { Maybe } from 'graphql/jsutils/Maybe';

interface UseFirebaseProps {
  collectionName: string;
  fieldSearch?: string;
  keywordSearch?: string;
  cursor?: Maybe<DocumentSnapshot>;
  limitData?: number;
}

export const useFirebase = ({
  collectionName,
  fieldSearch,
  keywordSearch,
  cursor,
  limitData = 10,
} : UseFirebaseProps) => {
  const [isInit, setIsInit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);
  const [error, setError] = useState<string>('');
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const fn = async () => {
      try {
        setLoading(true);
        const refDb = collection(db, collectionName);

        const queries = [
          ...(fieldSearch && keywordSearch ? [
            where(fieldSearch, '>=', keywordSearch),
            where(fieldSearch, '<=', keywordSearch + '\uf8ff')
          ]
            : []
          ),
          ...(cursor ? [startAfter(cursor)] : []),
          limit(limitData)
        ];

        const querySnapshot = await getDocs(query(refDb, ...queries));

        const queryPages = [
          ...(fieldSearch && keywordSearch ? [
            where(fieldSearch, '>=', keywordSearch),
            where(fieldSearch, '<=', keywordSearch + '\uf8ff')
          ]
            : []
          )
        ];
        const getPages = (await getCountFromServer(query(refDb, ...queryPages))).data().count;

        setLoading(false);
        setIsInit(false);
        setTotalPages(getPages);
        setData(querySnapshot);
      } catch (err) {
        setLoading(false);
        setError('Failed get data'); 
      }
    };

    if(!isInit) {
      fn();
    }
  }, [collectionName, cursor, fieldSearch, isInit, keywordSearch, limitData]);

  return { loading, data, totalPages, error };
};
