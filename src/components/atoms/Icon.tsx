import React, { CSSProperties, memo, useCallback } from 'react';
import { camelCase } from 'lodash';
import {
  FontAwesomeIcon,
  FontAwesomeIconProps
} from '@fortawesome/react-fontawesome';
import * as light from '@fortawesome/pro-light-svg-icons';
import * as solid from '@fortawesome/pro-solid-svg-icons';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';

interface IconProps {
  name: IconProp;
  type?: 'light' | 'solid';
  size?: IconSize;
  className?: string;
  style?: CSSProperties;
}

export type IconSize =
  | '2xs'
  | 'xs'
  | 'sm'
  | 'lg'
  | 'xl'
  | '2xl'
  | '1x'
  | '2x'
  | '3x'
  | '4x'
  | '5x'
  | '6x'
  | '7x'
  | '8x'
  | '9x'
  | '10x';

export const Icon: React.FC<IconProps> = memo(
  ({ name, type = 'light', size = 'xl', className, style }) => {
    const getIcon = useCallback((t: string, n: string): IconProp => {
      const icons: { [key: string]: unknown } =
        {
          light,
          solid,
        }[t] || light;
      return icons[n] as IconProp;
    }, []);

    const iconType = getIcon(type, camelCase(`fa-${name}`));
    const RawIcon: React.FC<FontAwesomeIconProps> = FontAwesomeIcon;

    return (
      <RawIcon
        icon={iconType}
        size={size}
        className={className}
        style={style}
      />
    );
  },
);

