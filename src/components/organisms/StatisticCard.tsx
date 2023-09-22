import classNames from 'classnames';
import { memo } from 'react';

import { Icon, Typography } from '@/components/atoms';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface StatisticsCardProps {
  color: Color;
  icon?: IconProp;
  title?: string;
  value?: string | number;
}

export type Color = 
 | 'blue'
 | 'green'
 | 'pink'
  
export const StatisticsCard: React.FC<StatisticsCardProps> = memo(({ color = 'pink', icon = 'house', title, value }) => {
  
  const iconClass = classNames('bg-clip-border mx-4 rounded-xl overflow-hidden text-white shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center', {
    'bg-gradient-to-tr from-pink-600 to-pink-400 from-pink-600 to-pink-400 shadow-pink-500/40': color === 'pink',
    'bg-gradient-to-tr from-blue-600 to-blue-400 from-blue-600 to-blue-400 shadow-blue-500/40': color === 'blue',
    'bg-gradient-to-tr from-green-600 to-green-400 from-green-600 to-green-400 shadow-green-500/40': color === 'green',
  });
    
  return (
    <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
      <div
        className={iconClass}
      >
        <Icon type="solid" name={icon} className="text-white"/>
      </div>
      <div className="p-4 text-right">
        <Typography className="font-normal text-gray-600">
          {title}
        </Typography>
        <Typography className="text-2xl">
          {value}
        </Typography>
      </div>
    </div>
  );
});
  
