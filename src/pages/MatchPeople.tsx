import { useCallback, useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/atoms';
import { Input, Table } from '@/components/molecules';
import Select from 'react-select';
import { UserNotif } from '@/type';
import { collection, doc, getDocs, setDoc, updateDoc, } from 'firebase/firestore';
import { db } from '@/config';
import { ENV, generateRandomString, pushNotification } from '@/utils';

const initialFormValues: FormType = {
  conversationChannel: '',
  user1: {
    uid: '',
    token: '',
    email: '',
  },
  user2: {
    uid: '',
    token: '',
    email: '',
  },
  messageNotification: '',
};

type FormType = {
  conversationChannel: string;
  user1: {
    uid: string;
    token: string;
    email: string;
  };
  user2: {
    uid: string;
    token: string;
    email: string;
  };
  messageNotification: string;
};

export const MatchPeople: React.FC = () => {  
  const [loading, setLoading] = useState({
    loadingFetch: false,
    loadingMatch: false,
    loadingMatchUser: false,
  });
  const [form, setForm] = useState<FormType>(initialFormValues);
  const [listUsers, setListUsers] = useState<UserNotif[]>([]);
  const [listMatch, setListMatch] = useState<any[]>([]);

  const inputChangeHandler = useCallback(
    (name: string) => (value: string | boolean | undefined) => {
      setForm(old => ({ ...old, [name]: value }));
    },
    [],
  );

  console.log(ENV.FIREBASE_PUSH_NOTIFICATION_API);

  const getListMatchData = useCallback(async () => {
    setLoading(prev => ({ ...prev, loadingMatchUser: true }));
    const res = await getDocs(collection(db, 'Matches'));

    const matches:any = res.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    setLoading(prev => ({ ...prev, loadingMatchUser: false }));
    setListMatch(matches);
  }, []);

  const handleSubmit = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, loadingMatch: true }));
    
      const idMatch = generateRandomString(20);
      const convRandom = generateRandomString(5);
    
      // INSERT MATCH
      await setDoc(doc(db, 'Matches', idMatch), {
        conversationChannel: form.conversationChannel + convRandom,
        user1: form.user1.uid,
        user2: form.user2.uid,
        emailUser1: form.user1.email,
        emailUser2: form.user2.email,
      });
    
      // UPDATE USERS MATCH
      const user1Ref = doc(db, 'Users', form.user1.uid);
      updateDoc(user1Ref, {
        isFoundMatch: true,
        activeMatch: idMatch
      });
    
      const user2Ref = doc(db, 'Users', form.user2.uid);
      updateDoc(user2Ref, {
        isFoundMatch: true,
        activeMatch: idMatch
      });
    
      [form.user1.token, form.user2.token].map(token => {
        pushNotification({
          to: token,
          notification: {
            title: 'Congratulations!',
            body: form.messageNotification,
          },
        });
      });
      
      getListMatchData();
      setForm(initialFormValues);
      setLoading(prev => ({ ...prev, loadingMatch: false }));
      alert('Success Add Match Users');
    } catch (err) {
      alert('Failed Add Match Users');
      setLoading(prev => ({ ...prev, loadingMatch: false }));
    }
  }, [form.conversationChannel, form.messageNotification, form.user1.email, form.user1.token, form.user1.uid, form.user2.email, form.user2.token, form.user2.uid, getListMatchData]);

  const columnsMatch = useMemo(() => [
    {
      Header: 'No',
      accessor: 'no',
    },
    {
      Header: 'MatchId',
      accessor: 'id',
    },
    {
      Header: 'Email User1',
      accessor: 'emailUser1',
    },
    {
      Header: 'Email User2',
      accessor: 'emailUser2',
    },
  ], []);

  const tableConfig = {
    columns: columnsMatch,
    data: listMatch,
    page: 1,
    loading: loading.loadingMatchUser,
    totalPages: 1,
  };
  
  useEffect(() => {
    const fn = async () => {
      setLoading(prev => ({ ...prev, loadingFetch: true }));
      const res = await getDocs(collection(db, 'Users'));

      const raw = res.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

      const users:any = raw.filter((item:any) => item.email).map((item:any) => {
        if(item?.email) {
          return {
            label: item?.email,
            value: {
              uid: item?.uid,
              token: item?.FCMToken,
              email: item?.email
            }
          };
        }
      });

      setLoading(prev => ({ ...prev, loadingFetch: false }));
      setListUsers(users);
    };

    fn();
  }, []);
  
  useEffect(() => {
    getListMatchData();
  }, [getListMatchData]);

  // if(loading) {
  //   return <Loading />;
  // }

  return (
    <div className="flex flex-col mt-5">
      <div className="p-6 w-1/2 flex flex-col gap-4">
        <div className="w-full min-w-[200px] h-11">
          <Input
            label="Conversation name"
            className="h-11"
            value={form.conversationChannel}
            onChange={inputChangeHandler('conversationChannel')}
          />
        </div>
        <Select
          className="basic-single"
          classNamePrefix="select"
          placeholder="Select User 1"
          options={listUsers}
          isLoading={loading.loadingFetch}
          onChange={v => inputChangeHandler('user1')(v?.value)}
          isClearable
        />
        <Select
          className="basic-single"
          classNamePrefix="select"
          placeholder="Select User 2"
          options={listUsers}
          isLoading={loading.loadingFetch}
          onChange={v => inputChangeHandler('user2')(v?.value)}
          isClearable
        />
        <div className="w-full min-w-[200px] h-24">
          <Input
            isTextArea
            label="Match Notification Message"
            className="h-24"
            value={form.messageNotification}
            onChange={inputChangeHandler('messageNotification')}
          />
        </div>
        <div className="w-full min-w-[200px] h-11">
          <Button
            disabled={
              loading.loadingMatch ||
              !form.conversationChannel ||
              !form.messageNotification ||
              listUsers.length === 0
            }
            className="h-11 w-full"
            onClick={handleSubmit}
          >
            {loading.loadingMatch ? 'Loading...' : 'Match User'}
          </Button>
        </div>

      </div>
      <div className="mt-5 border-t">
        <Table {...tableConfig}/>
      </div>
    </div>
  );
};
