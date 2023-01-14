
import Pusher from 'pusher-js';
import React, { useEffect, useState } from 'react';
import { request, customerGetApiToken } from '../api';

const usePusher = () => {
  const [pusher, setPusher] = useState<Pusher | null>(null);
  const [key, setKey] = useState<string>('');

  useEffect(() => {
    request(customerGetApiToken, 'GET', {}, true)
      .then((res) => {
        if (res.status === 200) {
          setKey(res.data.info.key);
        }
      })
      .catch((err) => {
        // console.error(err);
      });
  }, [])

  useEffect(() => {
    if (key) {
      const client = new Pusher(key, {
        cluster: 'us3',
        // encrypted: true, // TODO: This is not working, see docs to look into message encryption
      });
      setPusher(client);
    }
  }, [key])

  return pusher;
}

export const PusherContext = React.createContext<ReturnType<typeof usePusher>>(null);

export function PusherContextProvider({ children }: { children: React.ReactNode }) {
  return (
    <PusherContext.Provider value={usePusher()}>
      {children}
    </PusherContext.Provider>
  )
}
export default PusherContextProvider;