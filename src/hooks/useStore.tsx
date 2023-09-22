import {
  GlobalProviderProps,
  GlobalStateContextProps,
  initialStoreValue
} from '@/constants';
import { UserCredential } from 'firebase/auth';
import { createContext, useContext, useState } from 'react';

const GlobalStateContext = createContext<GlobalStateContextProps | any>(undefined);

export const GlobalStateProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  const [valueStore, dispatch] = useState(initialStoreValue);

  return (
    <GlobalStateContext.Provider value={{ valueStore, dispatch }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useSideNav = (): [boolean, typeof setter] => {
  const store = useContext(GlobalStateContext);
  const key = 'openSideNav';

  if (!store) {
    throw Error(`cannot find store with key: ${key}`);
  }

  const objectStore = store.valueStore[key];

  const setter = () => {
    store.dispatch({ ...store.valueStore, [key]: !store.valueStore[key] });
  };

  return [objectStore, setter];
};

export const useSession = (): [UserCredential, typeof setter] => {
  const store = useContext(GlobalStateContext);
  const key = 'session';

  if (!store) {
    throw Error(`cannot find store with key: ${key}`);
  }

  const objectStore = store.valueStore[key];

  const setter = (session:UserCredential) => {
    store.dispatch({ ...store.valueStore, [key]: session });
  };

  return [objectStore, setter];
};
