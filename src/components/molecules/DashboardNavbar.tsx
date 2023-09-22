import { useLocation, Link } from 'react-router-dom';

import { Breadcrumb, Button, Icon, Typography } from '@/components/atoms';
import { useSession, useSideNav } from '@/hooks';

export const DashboardNavbar = () => {
  const { pathname } = useLocation();
  const [, setOpenSideNav] = useSideNav();
  const [session] = useSession();

  const [layout, page] = pathname.split('/').filter((el) => el);

  return (
    <div className="rounded-xl transition-all px-0 py-1">
      <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
        <div className="capitalize">
          <Breadcrumb className="bg-transparent p-0 transition-all">
            <Link to={`/${layout}`}>
              <Typography
                className="text-gray-900 font-normal opacity-50 transition-all hover:text-blue-500 hover:opacity-100"
              >
                {layout}
              </Typography>
            </Link>
            <Typography
              className="font-normal text-gray-900"
            >
              {page}
            </Typography>
          </Breadcrumb>
          <Typography className="text-gray-900 block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed">
            {page}
          </Typography>
        </div>
        <div className="flex items-center justify-end">
          <div className="flex space-x-6">
            <div className="flex items-center">
              <Icon type="solid" name="user" size="1x" className="text-black-500 mr-2"/>
              <div className="flex min-w-[50px] w-max">
                <Typography variant="small">Hi</Typography>
                <Typography className="font-bold" variant="small">{', '} {session?.user.displayName || session?.user.email} </Typography>
              </div>
            </div>

            <Button variant="text" className="p-0 block xl:hidden" onClick={setOpenSideNav}>
              <Icon type="solid" name="bars" className="text-gray-500"/>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
