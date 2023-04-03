import { useContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useSearchParams } from 'react-router-dom';
import { addOrderMessage, getOrderMessagesById, request } from '../../api';
import { ChatContext } from '../../context/ChatContext';

// Customers have chat_id of 1
// Admins/workers have chat_id of 0

interface Message {
  message: string;
  timestamp: Date;
  userId: string;
}

export function ChatBox({ orderId }: { orderId: number }) {
  const chat = useContext(ChatContext);

  const [typed, setTyped] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  // const [filteredMessages, setFilteredMessages] = useState<Record<number, Message[]>>({});

  const [cookies] = useCookies(['userType', 'userId'])

  // For real time notifications
  useEffect(() => {
    if (chat.pusher) {
      const channel = chat.pusher.subscribe(`chat-${orderId}`);
      channel.bind('new-message', (msg: Message) => fetchMessages());
    }
  }, [orderId, chat.pusher]);

  // For persistence of messages
  useEffect(() => {
    fetchMessages();
  }, [orderId]);

  function fetchMessages() {
    request(getOrderMessagesById.replace('id', orderId.toString()), 'GET', {}, true).then((res) => {
      // console.log(res.data);
      setMessages(res.data)
    }).catch((err) => {
      console.log(err);
    });
  }

  function handleSend() {
    const msg = {
      message: typed,
      userId: cookies.userId,
      timestamp: new Date(),
    }
    const data = {
      orderId: orderId,
      ...msg
    };
    request(addOrderMessage, 'POST', data, false)
      .then((res) => {
        setMessages([...messages, msg]);
        setTyped('');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // Group messages by time (if they are close enough)
  // Return dict with grouped time as key and list of messages as value
  function groupMessages(messages: Message[]) {
    const grouped: Record<number, Message[]> = {};
    let trackedTime = 0;
    messages.forEach((msg) => {
      // If the message is not from today, group it with that date
      const current = new Date();
      if (msg.timestamp.getDate() !== current.getDate() && msg.timestamp.getMonth() !== current.getMonth() && msg.timestamp.getFullYear() !== current.getFullYear()) {
        // Get epoch time of start of day
        const date = new Date(msg.timestamp.getFullYear(), msg.timestamp.getMonth(), msg.timestamp.getDate()).getTime();
        if (grouped[date]) {
          grouped[date].push(msg);
        } else {
          grouped[date] = [msg];
        }
      }
      // If message from today, group messages that are linked within 5 minutes of each other
      else {
        const currentTime = msg.timestamp.getTime();
        if (currentTime - trackedTime > 1000 * 60 * 5) {
          if (grouped[trackedTime]) {
            grouped[trackedTime].push(msg);
          } else {
            grouped[currentTime] = [msg];
          }
          trackedTime = currentTime;
        }
      }
    });
    return grouped;
  }

  // useEffect(() => {
  //   setFilteredMessages(groupMessages(messages));
  // }, [messages]);

  return (
    <div className="flex flex-col flex-grow w-full max-w-xl bg-white shadow-xl rounded-t-lg overflow-hidden">
      <div className="flex flex-col flex-grow h-[50vh] px-4 py-8 space-y-2 overflow-auto">
        {/* {Object.keys(filteredMessages).sort((a, b) => parseInt(b) - parseInt(a)).map((time, i) =>
            <>
              <small>{new Date(time).toLocaleString()}</small>
              {filteredMessages[parseInt(time)].map((msg, j) =>
                <ChatMessage key={parseInt(time) + j} msg={msg} />
              )}
            </>
          )} */}
        {messages.map((msg, i) =>
          <ChatMessage key={i} msg={msg} />
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
  );
}

function OrderChat() {
  const [orderId, setOrderId] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    setOrderId(parseInt(searchParams.get('id') as string, 10));
  }, [searchParams]);

  return (
    <div className="w-screen h-screen flex justify-center">
      <ChatBox orderId={orderId} />
    </div>
  );
}

export default OrderChat;

function ChatMessage({ msg }: { msg: Message }) {
  const [cookies] = useCookies(['userId']);

  const self: boolean = msg.userId === cookies.userId;
  return (
    <div className={`flex flex-row space-x-4 w-full ${self ? 'justify-end' : 'justify-start'} `}>
      {!self && <span className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></span>}
      <div className={`${self ? 'bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg' : 'bg-gray-300 p-3 rounded-r-lg rounded-bl-lg'}`}>
        <p className="text-sm">
          {msg.message}
        </p>
      </div>
      {self && <span className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></span>}
    </div>
  );
}

