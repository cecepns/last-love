import { useEffect, useState } from 'react';

export const useData = <T = undefined>(url: string) => {
  const [state, setState] = useState<T>();

  useEffect(() => {
    const dataFetch = async () => {
      try {
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('sessionToken')}`
          }
        });

        if (!response.ok) {
          if(response.status === 403) {
            localStorage.removeItem('sessionToken');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
  
        setState(data);
      } catch (error) {
        console.log(error);
      }
    };

    dataFetch();
  }, [url]);

  return { data: state };
};
