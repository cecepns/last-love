import classNames from 'classnames';
import React, { memo, useCallback } from 'react';

interface CheckboxProps {
  value?: boolean;
  label: string;
  wrapperClassName?: string;
  onChange?: (val: boolean) => void;
}

export const Checkbox: React.FC<CheckboxProps> = memo(({
  label,
  onChange,
  value,
  wrapperClassName
}) => {

  const handleCheckbockChange = useCallback(() => {
    if(onChange) {
      onChange(!value);
    }
  }, [onChange, value]);

  const wrapperClass = classNames('relative inline-block w-8 h-4 cursor-pointer rounded-full', {
    [`${wrapperClassName}`]: !!wrapperClassName,
  });

  const inputClass = classNames(
    'peer appearance-none w-8 h-4 absolute bg-gray-100 rounded-full cursor-pointer transition-colors duration-300 checked:bg-blue-500 peer-checked:border-blue-500 peer-checked:before:bg-blue-500');

  const labelClass = classNames(
    'peer-checked:translate-x-full bg-white w-5 h-5 border border-gray-100 rounded-full shadow-md absolute top-2/4 -left-1 -translate-y-2/4 transition-all duration-300 cursor-pointer before:content[] before:block before:bg-gray-500 before:w-10 before:h-10 before:rounded-full before:absolute before:top-2/4 before:left-2/4 before:-translate-y-2/4 before:-translate-x-2/4 before:transition-opacity before:opacity-0 hover:before:opacity-10 peer-checked:border-blue-500 peer-checked:before:bg-blue-500');

  return (
    <div className={wrapperClass}>
      <input
        className={inputClass}
        id={label}
        type="checkbox"
        onChange={handleCheckbockChange}
        placeholder=" "
      />
      <label className={labelClass} htmlFor={label}>
        <div className="pointer-events-none inline-block top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 p-5 rounded-full"></div>
      </label>
    </div>
  );
});
