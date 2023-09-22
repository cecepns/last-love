import { Routes, Route } from 'react-router-dom';

import { DashboardNavbar, Sidenav } from '@/components/molecules';
import routes, { Layout, PageRoutes } from '@/routes';

export const Dashboard = ()=> {
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
