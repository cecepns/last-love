import { ChangeEvent, useCallback, useMemo, useState } from 'react';

import { Button, Loading } from '@/components/atoms';
import { Input } from '@/components/molecules';
import Select, { CSSObjectWithLabel, MultiValue } from 'react-select';
import { ENV, pushNotification, useData } from '@/utils';
import { UserNotif, UserResponseNotif } from '@/type';

const initialFormValues: FormType = {
  title: '',
  body: '',
  tokens: [],
};

export type ResponseSendNotif = {
  successCount: string;
  failureCount: string;
}

export type FormType = {
  title: string;
  body: string;
  tokens: string[];
}

export const SendNotification: React.FC = () => {
  const [loadingNotif, setLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [form, setForm] = useState<FormType>(initialFormValues);
  const [listUsers, setListUsers] = useState<MultiValue<UserNotif>>([]);

  const { data, loading: loadingUsers } = useData<UserResponseNotif>(`${ENV.API_URL}/v1/notifications`);
  
  const users = useMemo(()=> data?.users ?? [], [data?.users]);

  const inputChangeHandler = useCallback(
    (name: string) => (value: string | boolean) => {
      setForm(old => ({ ...old, [name]: value }));
    },
    [],
  );

  const handleChange = useCallback((v: MultiValue<UserNotif>) => {
    setIsChecked(false);
    setListUsers(v);
    
    const tokensArray = v.map((item) => item.value);

    setForm((old) => ({ ...old, tokens: tokensArray }));

  }, []);

  const handleSendNotif = useCallback(async () => {
    setLoading(true);
    try {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      form.tokens.map(token => {
        pushNotification({
          to: token,
          notification: {
            title: form.title,
            body: form.body,
          },
        });
      });
      setLoading(false);
      setListUsers([]);
      setForm(initialFormValues);
      alert('Success send notifications');
    } catch (error) {
      alert('Failed send notifications');
      setLoading(false);
    }    
  }, [form]);

  const handleSelectAll = useCallback((v: ChangeEvent<HTMLInputElement>) => {
    if(v.target.checked) {
      setListUsers(users);
      setIsChecked(true);

      const tokensArray = users.map((item) => item.value);

      setForm((old) => ({ ...old, tokens: tokensArray }));
    } else {
      setListUsers([]);
      setIsChecked(false);
    }
  }, [users]);

  const MyOption = useCallback((props:any) => {
    const { innerProps, innerRef } = props;
    if (props.value === 'selectall') {
      return <div className="px-3 py-2">
        <div className="flex items-center border-b border-gray-400 pb-3">
          <label htmlFor="selectall"> Select All </label>
          <input
            type="checkbox"
            id="selectall"
            name="selectall"
            defaultChecked={isChecked}
            onChange={handleSelectAll}
            className="p-2 m-0 ml-3 w-4 h-4"
          />
        </div>
        
      </div>;
    }
    return (
      <div className="px-3 text-sm py-2 cursor-pointer hover:bg-primary hover:text-white" ref={innerRef} {...innerProps}>{props.label}</div>
    );
  }, [handleSelectAll, isChecked]);

  if(loadingUsers) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col w-1/2 mt-5">
      <div className="p-6 flex flex-col gap-4">
        <Select
          isMulti
          name="colors"
          value={listUsers}
          options={[{ label: 'Select All', value: 'selectall' }, ...users]}
          className="basic-multi-select"
          components={{ Option: MyOption }}
          onChange={handleChange}
          classNamePrefix="select"
          styles={{
            valueContainer: (base: CSSObjectWithLabel) => ({
              ...base,
              overflow: 'auto',
              maxHeight: '100px',
            }),
          }}
        />
        <div className="w-full min-w-[200px] h-11">
          <Input label="Title" className="h-11" value={form.title} onChange={inputChangeHandler('title')} />
        </div>
        <div className="w-full min-w-[200px] h-24">
          <Input isTextArea label="Description" className="h-24" value={form.body} onChange={inputChangeHandler('body')} />
        </div>
        <div className="w-full min-w-[200px] h-11">
          <Button className="h-11 w-full" disabled={loadingNotif} onClick={handleSendNotif}>
            {loadingNotif ? 'Loading...' : 'Send Notification'}
          </Button>
        </div>
      </div>
    </div>
  );
};
