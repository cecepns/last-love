import { ChangeEvent, memo, useCallback, useEffect, useRef, useState } from 'react';
import { Input } from '@/components/molecules';
import { debounce } from 'lodash';
// import classNames from 'classnames';
import { Icon } from '@/components/atoms';
import { ENV } from '@/utils';
import { UserDetailResponse } from '@/type';

export type AddressApi = {
  osm_id: number;
  display_name: string;
  lon: string;
  lat: string;
};

interface InputSearchAddressProps {
  value?: string;
  label?: string;
  onClickAddress?: (value: UserDetailResponse) => void;
  onChange?: (value: string) => void;
  icon?: React.ReactNode;
}

export const DropdownSelect: React.FC<InputSearchAddressProps> = memo(({
  value,
  label,
  onClickAddress,
}) => {
  const [search, setSearch] = useState<string>('');
  const [showList, setShowList] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [foundAddresses, setFoundAddresses] = useState<UserDetailResponse[]>([]);

  const selectRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setShowList(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClickUser = useCallback(
    (value: UserDetailResponse) => {
      // if(onClickAddress) {
      setShowList(false);
      onClickAddress(value);
      // }
    }, [onClickAddress]);

  //   const handleChange = useCallback(
  //     (value: string) => {
  //       if(onChange) {
  //         onChange(value);
  //       }
  //     }, [onChange]);

  const searchHandler = useCallback(
    async (directSearch?: string) => {
      setLoading(true);
      try {
        if (directSearch || search.length > 2) {
          setShowList(true);
          setFoundAddresses([]);
          const raw = await fetch(
            `${ENV.API_URL}/v1/users?page=1&limit=10`,
            { headers: {
              'Authorization': `Bearer ${localStorage.getItem('sessionToken')}`
            } }
          );
          const result = await raw.json();
          console.log(result);
          setFoundAddresses(result?.users ?? []);
          setLoading(false);

          if(onClickAddress) {
            onClickAddress(result[0]);
          }
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        setLoading(false);
        console.log('[SearchLocationScreen > searchHandler]', err);
      }
    },
    [onClickAddress, search, setLoading],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const searchAddressFn = useCallback(
    debounce((val: unknown) => searchHandler(val), 1000),
    [],
  );

  const fetchResults = useCallback((val:string) => {
    // handleChange(val);
    setSearch(val);
    searchAddressFn(val);
  }, [searchAddressFn]);

  const onFocus = useCallback(() => {
    setShowList(true);
    setTimeout(() => {
      if (searchRef && searchRef?.current) {
        setSearch('');
        searchRef?.current?.focus();
      }
    });
  }, []);

  //   const listClass = useCallback((item?: AddressApi) => classNames('w-full text-left py-2 px-4 border-b border-blue-gray-50 cusor-pointer', {
  //     'bg-blue-500 text-white': value === item?.display_name,
  //     'cursor-pointer text-gray-700 hover:text-black hover:bg-blue-100': value !== item?.display_name,
  //     'text-sm': !item
  //   }), [value]);

  return (
    <div className="relative w-full">
      <Input onFocus={onFocus} label={label} value={value} readOnly />
      {showList && (
        <div className="absolute w-full bg-gray-100 shadow-lg z-10 border border-gray-400">
          <div className="border-b border-gray-500 p-2">
            <input
              ref={searchRef}
              onChange={(e: ChangeEvent<HTMLInputElement>) => fetchResults(e.target.value)}
              value={search}
              placeholder="Search..."
              className="w-full outline-none text-sm border border-gray-400 rounded px-2 leading-8 focus:border-blue-500"
            />
          </div>
          <div className="z-10 min-h-[50px] max-h-[200px] pt-1 overflow-y-auto" ref={selectRef}>
            {!loading ? foundAddresses.length > 0 ? foundAddresses.map((item, idx: number) => (
              <div key={idx} className="w-full text-left py-2 px-4 border-b border-blue-gray-50 cusor-pointer" onClick={()=> handleClickUser(item)}>
                {item.user.email}
              </div>
            )) : (
              <div className="w-full text-left py-2 px-4 border-b border-blue-gray-50 cusor-pointer">
                No list.
              </div>
            ) : (
              <div className="w-full h-10 pt-2 flex justify-center items-center">
                <Icon name="spinner-third" className="fa-spin" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

