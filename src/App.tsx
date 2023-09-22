import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import { Auth, Dashboard } from '@/layouts';
import { useSession } from '@/hooks';

function App() {
  const [isInit, setIsInit] = useState<boolean>(false);
  const navigate = useNavigate();
  const [, setSesstion] = useSession();

  useEffect(() => {
    const initFn = async () => {
      const sessionToken = localStorage.getItem('sessionToken');

      if(sessionToken) {
        const sessionAccount = localStorage.getItem('sessionAccount');
        if(sessionAccount) {
          setSesstion(JSON.parse(sessionAccount));
          navigate('dashboard/home');
        }
      } else if (!sessionToken) {
        localStorage.removeItem('sessionToken');
        localStorage.removeItem('sessionAccount');
        navigate('auth/signin');
      }
    };
    if (!isInit) {
      setIsInit(true);
      initFn();
    }
  }, [isInit, navigate, setSesstion]);
  
  return (
    <Routes>
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/auth/*" element={<Auth />} />
      <Route path="*" element={<Navigate to="/auth/signin" replace />} />
    </Routes>
  );
}

export default App;
