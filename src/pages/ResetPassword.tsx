import { useCallback, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Button } from '@/components/atoms';
import { Input } from '@/components/molecules';
import { confirmPasswordReset } from 'firebase/auth';
import { auth } from '@/config';

const initialFormValues = {
  password: '',
};

export const ResetPassword: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [form, setForm] = useState(initialFormValues);
  const [searchParams] = useSearchParams();

  const inputChangeHandler = useCallback(
    (name: string) => (value: string | boolean) => {
      setForm(old => ({ ...old, [name]: value }));
    },
    [],
  );

  const handleResetPassword = useCallback(async () => {
    setLoading(true);
    const oobCode = searchParams.get('oobCode');
    try {
      if (oobCode) {
        await confirmPasswordReset(auth, oobCode, form.password);
      } else {
        alert('Something is wrong; try again later!');
        console.log('missing oobCode');
      }
      setLoading(false);
      setForm({ password: '' });
      alert('Success Reset Password');
    } catch (error) {
      setLoading(false);
      alert('Something is wrong; try again later.');
    }
  }, [form.password, searchParams]);
  
  return (
    <div className="flex flex-col bg-clip-border rounded-xl bg-white shadow-lg absolute top-2/4 left-2/4 w-full max-w-[24rem] -translate-y-2/4 -translate-x-2/4">
      <div className="relative bg-clip-border mx-4 rounded-xl overflow-hidden shadow-md -mt-6 mb-4 grid h-28 place-items-center">
        <img src="/assets/img/logo.png" className="w-[180px]" alt="logo"/>
      </div>
      <div className="p-6 flex flex-col gap-4">
        <div className="relative w-full min-w-[200px] h-11">
          <Input label="New Password" className="h-11" onChange={inputChangeHandler('password')} />
        </div>
        <div className="relative w-full min-w-[200px] h-11">
          <Button className="h-11 w-full" disabled={loading} onClick={handleResetPassword}>
            {loading ? 'Loading...' : 'Reset Password'}
          </Button>
        </div>
      </div>
    </div>
  );
};
