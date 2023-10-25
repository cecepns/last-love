import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/atoms';
import { Input } from '@/components/molecules';
import { UserCredential, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/config';
import { useSession } from '@/hooks';

const initialFormValues = {
  email: '',
  password: '',
};

export const Login: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [form, setForm] = useState(initialFormValues);
  const navigate = useNavigate();
  const [, setSesstion] = useSession();

  const inputChangeHandler = useCallback(
    (name: string) => (value: string | boolean) => {
      setForm(old => ({ ...old, [name]: value }));
    },
    [],
  );

  const handleLogin = useCallback(() => {
    setLoading(true);
    signInWithEmailAndPassword(auth, form.email, form.password)
      .then((userCredential: UserCredential) => {
        setLoading(false);

        const { user } = userCredential;

        user.getIdToken(true).then((token) => {
          console.log(token);
          // console.log(user);
          // console.log(userCredential);
          localStorage.setItem('sessionToken', token);
          localStorage.setItem('sessionAccount', JSON.stringify(userCredential));
          navigate('/dashboard/home');
          setSesstion(userCredential);
        });
      })
      .catch((error) => {
        setLoading(false);
        const { message } = error;
        alert(message);
        
      });
  }, [form.email, form.password, navigate, setSesstion]);
  
  return (
    <div className="flex flex-col bg-clip-border rounded-xl bg-white shadow-lg absolute top-2/4 left-2/4 w-full max-w-[24rem] -translate-y-2/4 -translate-x-2/4">
      <div className="relative bg-clip-border mx-4 rounded-xl overflow-hidden shadow-md -mt-6 mb-4 grid h-28 place-items-center">
        <img src="/assets/img/logo.png" className="w-[180px]" alt="logo"/>
      </div>
      <div className="p-6 flex flex-col gap-4">
        <div className="relative w-full min-w-[200px] h-11">
          <Input label="Email" className="h-11" onChange={inputChangeHandler('email')} />
        </div>
        <div className="relative w-full min-w-[200px] h-11">
          <Input label="Password" type="password" className="h-11" onChange={inputChangeHandler('password')} />
        </div>
        <div className="relative w-full min-w-[200px] h-11">
          <Button className="h-11 w-full" disabled={loading} onClick={handleLogin}>
            {loading ? 'Loading...' : 'Sign in'}
          </Button>
        </div>
      </div>
    </div>
  );
};
