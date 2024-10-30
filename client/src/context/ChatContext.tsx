import React, { useState } from 'react';

const useChat = () => {
  const [chats, setChats] = useState<number[]>([]);

  return {
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