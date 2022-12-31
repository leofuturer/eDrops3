import { useContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useSearchParams } from 'react-router-dom';
import API from '../../api/lib/api';
import {
  addOrderMessage, adminGetProfile, customerGetProfile, foundryWorkerGetProfile,
  getOrderMessagesById
} from '../../api/lib/serverConfig';
import { PusherContext } from '../../App';
import MessageLayout from '../../component/layout/MessageLayout';

// Customers have chat_id of 1
// Admins/workers have chat_id of 0

interface Message {
  message: string;
  userConvId: number;
}

function OrderChat() {
  const pusher = useContext(PusherContext);

  const [orderId, setOrderId] = useState(0);
  const [typed, setTyped] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [userTypeId, setUserTypeId] = useState(0);


  const [searchParams, setSearchParams] = useSearchParams();
  const [cookies] = useCookies(['userType', 'userId'])

  useEffect(() => {
    setOrderId(parseInt(searchParams.get('id') as string, 10));
  }, [searchParams]);

  useEffect(() => {
    // For real time notifications
    if (pusher) {
      const channel = pusher.subscribe(`chat-${orderId}`);
      channel.bind('new-message', (msg: Message) => setMessages([...messages, msg]));
    }
  }, []);

  useEffect(() => {
    let initUrl;
    let userTypeId: number;
    switch (cookies.userType) {
      case 'customer':
        initUrl = customerGetProfile;
        userTypeId = 1;
        break;
      case 'admin':
        initUrl = adminGetProfile;
        userTypeId = 0;
        break;
      default:
      case 'foundryWorker':
        initUrl = foundryWorkerGetProfile;
        userTypeId = 0;
        break;
    }
    API.Request(initUrl.replace('id', cookies.userId), 'GET', {}, true)
      .then((res) => {
        // console.log(res);
        setUserTypeId(userTypeId);
        return API.Request(getOrderMessagesById.replace('id', orderId.toString()), 'GET', {}, true)
      })
      .then((res) => {
        console.log(res.data);
        const newMessages = res.data;
        setMessages([...messages, ...newMessages])
      })
      .catch((err) => {
        console.log(err);
      });
  }, [orderId]);

  function handleSend() {
    const msg = {
      message: typed,
      userConvId: userTypeId,
    }
    const data = {
      orderId: orderId,
      messageDate: new Date(),
      ...msg
    };
    API.Request(addOrderMessage, 'POST', data, false)
      .then((res) => {
        setMessages([...messages, msg]);
        setTyped('');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <MessageLayout
      title={`Order Chat for Order #${orderId}`}
      message="Use the chat below to communicate about the order!">
      <div className="flex flex-col flex-grow w-full max-w-xl bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="flex flex-col flex-grow h-[50vh] px-4 py-8 space-y-2 overflow-auto">
          {messages.map((msg, i) =>
            <ChatMessage key={i} message={msg.message} userConvId={msg.userConvId} />
          )}
        </div>
        {cookies.userType !== 'admin' &&
          <div className="bg-gray-300 p-4 w-full flex items-center">
            <input
              className="flex items-center h-10 w-full rounded-l px-3 text-sm focus:outline-none"
              type="text"
              placeholder="Type your message…"
              value={typed}
              onChange={(e) => { setTyped(e.target.value) }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSend();
                }
              }}
            />
            <div className="bg-blue-600 h-10 w-10 flex items-center justify-center rounded-r cursor-pointer" onClick={handleSend}>
              <i className="fa fa-paper-plane text-white"></i>
            </div>
          </div>
        }
      </div>
    </MessageLayout>
  );
}

export default OrderChat;

function ChatMessage({ message, userConvId }: Message) {
  const self: boolean = userConvId === 1;
  return (
    <div className={`flex flex-row space-x-4 w-full ${self ? 'justify-end' : 'justify-start'} `}>
      {!self && <span className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></span>}
      <div className={`${self ? 'bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg' : 'bg-gray-300 p-3 rounded-r-lg rounded-bl-lg'}`}>
        <p className="text-sm">
          {message}
        </p>
      </div>
      {self && <span className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></span>}
    </div>
  );
}

