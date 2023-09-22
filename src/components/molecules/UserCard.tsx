import { memo } from 'react';
import { Button, Icon, Typography } from '@/components/atoms';

interface UserCardProps {
  img: string,
  name?: string,
  access?:string,
  date?: string,
  card?: number,
  expired?: string,
  action?: () => void,
}

export const UserCard: React.FC<UserCardProps> = memo(({ 
  img,
  name,
  access,
  date,
  card,
  expired
}) => {
  
  return (
    <div className="flex items-center justify-between gap-4 shadow-lg mb-3 p-5 rounded-md">
      <div className="flex gap-4">
        <img src={img} alt={name} className="inline-block relative object-cover object-center w-12 h-12 rounded-full shadow-lg"/>
        <div>
          <Typography
            className="mb-3 font-semibold text-blue-gray"
          >
            {name}
          </Typography>
          <div className="space-y-3">
            <div className="flex items-center">
              <Icon name="shield-keyhole" size="lg" className="mr-2" />
              <Typography className="text-xs font-normal text-blue-gray-400">
                {access}
              </Typography>
            </div>
            <div className="flex items-center">
              <Icon name="clock" size="lg" className="mr-2" />
              <Typography className="text-xs font-normal text-blue-gray-400">
                {date}
              </Typography>
            </div>
            <div className="flex items-center">
              <Icon name="credit-card" size="lg" className="mr-2" />
              <Typography className="text-xs font-normal text-blue-gray-400">
                {card}
              </Typography>
            </div>
            <div className="flex items-center">
              <Icon name="triangle-exclamation" size="lg" className="mr-2" />
              <Typography className="text-xs font-normal text-blue-gray-400">
                {expired}
              </Typography>
            </div>
          </div>

          <div className="flex gap-4 mt-5">
            <Button variant="primary">Accesso Manuale</Button>
          </div>
        </div>
      </div>
    </div>
  );
});
  
