
import Pusher from 'pusher-js';
import React, { useEffect, useState } from 'react';
import { request, customerGetApiToken } from '../api';

const usePusher = () => {
  const [pusher, setPusher] = useState<Pusher>(buildClient());
  const [key, setKey] = useState<string>('');

  useEffect(() => {
    request(customerGetApiToken, 'GET', {}, false)
      .then((res) => {
        if (res.status === 200) {
          setKey(res.data.info.key);
        }
      })
      .catch((err) => {
        // console.error(err);
      });
  }, [])

  function buildClient(): Pusher {
    const client = new Pusher(key, {
      cluster: 'us3',
      // encrypted: true, // TODO: This is not working, see docs to look into message encryption
    });
    return client;
  }

  useEffect(() => {
    setPusher(buildClient());
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