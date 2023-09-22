import React, { ReactNode, memo } from 'react';
import classNames from 'classnames';

type BreadcrumbProps = {
  children: ReactNode;
  className?: string;
};

export const Breadcrumb: React.FC<BreadcrumbProps> = memo(({ children, className }) => {
  const breadCrumbCls = classNames('flex flex-wrap items-center w-full bg-opacity-60 rounded-md bg-transparent p-0 transition-all', {
    [`${className}`]: !!className,
  });

  return (
    <nav aria-label="breadcrumb">
      <ol className={breadCrumbCls}>
        {React.Children.map(children, (child, index) => {
          const isLast = index === React.Children.count(children) - 1;
          const className = isLast
            ? 'breadcrumb-item active'
            : 'flex items-center text-gray-900 antialiased font-sans text-sm font-normal leading-normal cursor-pointer transition-colors duration-300 hover:text-light-blue-500';

          return (
            <li className={className}>
              {child}
              {!isLast && <span className="text-gray-500 text-sm antialiased font-sans font-normal leading-normal mx-2 pointer-events-none select-none">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});
