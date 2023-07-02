
import Pusher from 'pusher-js';
import React, { useEffect, useState } from 'react';
import { api } from '@/api';

const usePusher = () => {
  const [key, setKey] = useState<string>(''); // Note that key must be initialized before pusher for buildClient to work
  const [pusher, setPusher] = useState<Pusher>(buildClient());

  useEffect(() => {
    api.user.getAPIToken().then((res) => {
      setKey(res.key);
    }).catch((err) => {
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
    key && setPusher(buildClient());
  }, [key])

  return pusher
}

export const PusherContext = React.createContext<ReturnType<typeof usePusher>>({} as ReturnType<typeof usePusher>);

export function PusherContextProvider({ children }: { children?: React.ReactNode }) {
  return (
    <PusherContext.Provider value={usePusher()}>
      {children}
    </PusherContext.Provider>
  )
}