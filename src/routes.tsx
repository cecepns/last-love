import React from 'react';
import { Home, Questions, Login, Users, UserDetail, Quotes, SendNotification } from '@/pages';
import { Icon } from '@/components/atoms';

export interface PageRoutes {
  icon?: React.ReactNode;
  name?: string;
  path: string;
  element: React.ReactNode;
}

export interface Layout {
  layout: string;
  title?: string;
  pages: PageRoutes[];
}

export const routes: Layout[] = [
  {
    layout: 'dashboard',
    pages: [
      {
        icon: <Icon type="solid" name="house" className="text-white"/>,
        name: 'home',
        path: '/home',
        element: <Home />,
      },
      {
        icon: <Icon type="solid" name="user" className="text-white"/>,
        name: 'users',
        path: '/users',
        element: <Users />,
      },
      {
        name: 'users detail',
        path: '/users/:uid',
        element: <UserDetail />,
      },
      {
        icon: <Icon type="solid" name="image-polaroid" className="text-white"/>,
        name: 'quotes',
        path: '/quotes',
        element: <Quotes />,
      },
      {
        icon: <Icon type="solid" name="user" className="text-white"/>,
        name: 'questions',
        path: '/questions',
        element: <Questions />,
      },
      {
        icon: <Icon type="solid" name="bell" className="text-white"/>,
        name: 'send notification',
        path: '/send-notification',
        element: <SendNotification />,
      },
    ],
  },
  {
    layout: 'auth',
    pages: [
      {
        icon: <Icon type="solid" name="user" className="text-white"/>,
        name: 'signin',
        path: '/signin',
        element: <Login />,
      },
    ]
  }
];

export default routes;
