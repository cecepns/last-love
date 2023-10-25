import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useData = <T = undefined>(url: string) => {
  const [state, setState] = useState<T>();
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const dataFetch = async () => {
      setLoading(true);
      try {
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('sessionToken')}`
          }
        });

        if (!response.ok) {
          if(response.status === 403) {
            localStorage.removeItem('sessionToken');
            navigate('/auth/signin');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        setLoading(false);
        setState(data);
      } catch (error) {

        setLoading(false);
        console.log(error);
      }
    };

    dataFetch();
  }, [navigate, url]);

  return { data: state, loading };
};
