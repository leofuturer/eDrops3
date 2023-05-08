import { Tab } from '@headlessui/react';
import { useContext } from 'react';
import { ChatContext } from '../../context/ChatContext';
import { ChatBox } from '../../page/subpage/order-chat';

function ChatModal() {
  const chat = useContext(ChatContext);
  return (
    <div>
      {chat.chats.length > 0 && (
        <div className="absolute bottom-0 right-4 bg-secondary rounded-t-lg pt-2 px-2 flex flex-col space-y-2">
          <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-lg p-1 bg-white">
              {chat.chats.map((id) => (
                <Tab key={id} className="shadow-box rounded-lg px-2 py-1">{id} <button type="button" onClick={() => chat.removeChat(id)}>x</button></Tab>
              ))}
            </Tab.List>
            <Tab.Panels className="">
              {chat.chats.map((id) => (
                <Tab.Panel key={id}>
                  <ChatBox orderId={id} />
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </div>
      )}
    </div>
  )
}

export default ChatModal