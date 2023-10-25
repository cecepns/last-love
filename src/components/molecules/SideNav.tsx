import React, { memo, useCallback } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

import classNames from 'classnames';

import { Button, Icon, Typography } from '@/components/atoms';
import { Layout, PageRoutes } from '@/routes';
import { useSideNav } from '@/hooks';

export interface SidenavProps {
  routes: Layout[];
}

export const Sidenav: React.FC<SidenavProps> = memo(({ routes }) => {
  const [openSideNav, setOpenSideNav] = useSideNav();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    localStorage.removeItem('sessionToken');
    navigate('/auth/signin');
  }, [navigate]);

  return (
    <aside
      className={classNames('bg-gradient-to-br from-primary-700 to-primary fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0', {
        'translate-x-0': openSideNav,
        '-translate-x-80': !openSideNav
      })}
    >
      <div
        className="relative border-b border-white/20"
      >
        <Link to="/dashboard/home" className="flex items-center gap-4 py-6 px-8">
          <img src="/assets/img/logo-dashboard.png" className="w-full p-3" alt="logo"/>
        </Link>
        <Button 
          className="w-8 max-w-[32px] h-8 max-h-[32px] absolute right-0 top-2 grid rounded-br-none rounded-tl-none xl:hidden"
          onClick={setOpenSideNav}
          variant="text"
        >
          <Icon name="xmark" className="text-white"/>
        </Button>
      </div>
      <div className="m-4">
        {routes.map(({ layout, title, pages } : Layout, key:number) => layout === 'dashboard' && (
          <ul key={key} className="mb-4 flex flex-col gap-1">
            {title && (
              <li className="mx-3.5 mt-4 mb-2">
                <Typography className="text-white font-black uppercase opacity-75">
                  {title}
                </Typography>
              </li>
            )}
            {pages.map(({ icon, name, path }: PageRoutes) => name && icon && (
              <li key={name}>
                <NavLink to={`/${layout}${path}`}>
                  {({ isActive }) => (
                    <Button
                      className="flex items-center gap-4 p-4 capitalize text-white mb-2"
                      variant={isActive ? 'gradient' : 'text'}
                    >
                      {icon}
                      <Typography>
                        {name}
                      </Typography>
                    </Button>
                  )}
                </NavLink>
              </li>
            ))}
            <li>
              <Button
                className="flex items-center gap-4 p-4 capitalize text-white mb-2"
                variant="text"
                onClick={handleLogout}
              >
                <Icon name="right-from-bracket"/>
                <Typography>
                  Logout
                </Typography>
              </Button>
            </li>
          </ul>
        ))}
      </div>
    </aside>
  );
});
