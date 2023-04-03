
import Pusher from 'pusher-js';
import React, { useEffect, useState } from 'react';
import { request, customerGetApiToken } from '../api';

const useChat = () => {
  const [chats, setChats] = useState<number[]>([]);

  const [key, setKey] = useState<string>(''); // Note that key must be initialized before pusher for buildClient to work
  const [pusher, setPusher] = useState<Pusher>(buildClient());

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

  return {
    pusher,
    chats,
    addChat: (chatId: number) => !chats.includes(chatId) && setChats([...chats, chatId]),
    removeChat: (chatId: number) => setChats(chats.filter((id) => id !== chatId)),
  };
}

export const ChatContext = React.createContext<ReturnType<typeof useChat>>({} as ReturnType<typeof useChat>);

export function ChatContextProvider({ children }: { children?: React.ReactNode }) {
  return (
    <ChatContext.Provider value={useChat()}>
      {children}
    </ChatContext.Provider>
  )
}