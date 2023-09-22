import { Routes, Route } from 'react-router-dom';
import routes from '@/routes';

export const Auth = ()=> {
  return (
    <div className="relative min-h-screen w-full">
      <Routes>
        {routes.map(
          ({ layout, pages }) =>
            layout === 'auth' &&
            pages.map(({ path, element }) => (
              <Route path={path} element={element} />
            ))
        )}
      </Routes>
    </div>
  );
};
