import { Routes, Route, useNavigate } from 'react-router-dom';

import { DashboardNavbar, Sidenav } from '@/components/molecules';
import routes, { Layout, PageRoutes } from '@/routes';
import { useSession } from '@/hooks';
import { useEffect, useState } from 'react';

export const Dashboard = ()=> {
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
    <div className="min-h-screen bg-gray-100/[.5]">
      <Sidenav
        routes={routes}
      />
      <div className="p-4 xl:ml-80">
        <DashboardNavbar />
        <Routes>
          {routes.map(
            ({ layout, pages }: Layout) =>
              layout === 'dashboard' &&
              pages.map(({ path, element }: PageRoutes) => (
                <Route path={path} element={element} />
              ))
          )}
        </Routes>
      </div>
    </div>
  );
};
