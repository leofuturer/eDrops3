import { ROUTES } from '@/router/routes';
import { useContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import { PusherContext } from '@/context/PusherContext';
import { api, DTO, OrderMessage  } from '@edroplets/api';
import { ROLES } from '@/lib/constants/roles';
import edropLogo from './edrop_logo.png';

export function ChatBox({ orderId }: { orderId: number }) {
  const pusher = useContext(PusherContext);

  const [typed, setTyped] = useState('');
  // const [worker, setWorker] = useState<any>(null); // TODO: Change to Worker type
  const [messages, setMessages] = useState<DTO<OrderMessage>[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<Record<number, DTO<OrderMessage>[]>>({});

  const [cookies] = useCookies(['userType', 'userId'])

  useEffect(() => {
  }, [])

  // For real time notifications
  useEffect(() => {
    if (pusher) {
      const channel = pusher.subscribe(`chat-${orderId}`);
      channel.bind('new-message', (msg: OrderMessage) => fetchMessages());
    }
  }, [orderId, pusher]);

  // For persistence of messages
  useEffect(() => {
    fetchMessages();
  }, [orderId]);

  function fetchMessages() {
    api.order.getMessages(orderId).then((messages) => {
      // console.log(res.data);
      setMessages(messages);
    }).catch((err) => {
      console.log(err);
    });
  }

  function handleSend() {
    const msg = {
      orderId: orderId,
      message: typed,
      userId: cookies.userId,
      timestamp: new Date(),
    }
    api.order.addMessage(orderId, msg).then((message) => {
      setMessages([...messages, msg]);
      setTyped('');
    }).catch((err) => {
      console.log(err);
    });
  }

  // Group messages by time (if they are close enough)
  // Return dict with grouped time as key and list of messages as value
  function groupMessages(messages: DTO<OrderMessage>[]) {
    const grouped: Record<number, DTO<OrderMessage>[]> = {};
    let trackedTime = 0;
    const current = new Date();
    messages.forEach((msg) => {
      // If the message is not from today, group it with that date
      const timestamp = new Date(msg.timestamp)
      console.log(msg, timestamp.getTime())
      if (timestamp.getDate() !== current.getDate() && timestamp.getMonth() !== current.getMonth() && timestamp.getFullYear() !== current.getFullYear()) {
        // Get epoch time of start of day
        const date = new Date(timestamp.getFullYear(), timestamp.getMonth(), timestamp.getDate()).getTime();
        if (grouped[date]) {
          grouped[date].push(msg);
        } else {
          grouped[date] = [msg];
        }
      }
      // If message from today, group messages that are linked within 5 minutes of each other
      else {
        const currentTime = timestamp.getTime();
        if (currentTime - trackedTime > 1000 * 60 * 5) {
          if (grouped[currentTime]) {
            grouped[currentTime].push(msg);
          } else {
            grouped[currentTime] = [msg];
          }
          trackedTime = currentTime;
        }
        else {
          if (grouped[trackedTime]) {
            grouped[trackedTime].push(msg);
          }
          else {
            grouped[trackedTime] = [msg];
          }
        }
      }
    });
    return grouped;
  }

  useEffect(() => {
    setFilteredMessages(groupMessages(messages));
  }, [messages]);

  function convertEpoch(epoch: string): string {
    const epochTime = parseInt(epoch);
    const date = new Date(epochTime);
    if (epochTime - new Date().getTime() < 1000 * 60 * 60 * 24) {
      return date.toLocaleTimeString([], { timeStyle: 'short' });
    }
    return date.toLocaleDateString([], { dateStyle: 'short' });
  }

  return (
    <div className="flex flex-col flex-grow w-full max-w-xl bg-white shadow-xl overflow-hidden">
      <div className="flex justify-center h-20 px-4 py-2 bg-gray-100">
        <span className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></span>
        <p></p>
      </div>
      <div className="flex flex-col flex-grow h-[50vh] px-4 py-8 space-y-2 overflow-auto">
        {Object.keys(filteredMessages).sort((a, b) => parseInt(a) - parseInt(b)).map((time, i) =>
          <>
            <small className="text-center">{convertEpoch(time)}</small>
            {filteredMessages[parseInt(time)].map((msg, j) =>
              <ChatMessage key={parseInt(time) + j} msg={msg} cookies={cookies} customerId={""}/>
            )}
          </>
        )}
      </div>
      {
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

export function OrderChat() {
  const [orderId, setOrderId] = useState(0);
  const navigate = useNavigate()
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (!id) {
      navigate(ROUTES.ManageOrders);
      return;
    }
    setOrderId(parseInt(id));
  }, [id]);

  useEffect(() => {
    if (!orderId) {
      api.order.get(orderId).then((order) => {
        setOrder(order);
      });
      console.log(order);
    }
  });

  return (
    console.log(orderId),
    <div className="w-screen h-screen flex justify-center">
      <ChatBox orderId={orderId} />
    </div>
  );
}

export default OrderChat;

function ChatMessage({ msg, cookies, customerId }: { msg: DTO<OrderMessage>, cookies: any, customerId: string }) {
  const [workerIDs, setWorkerIDs] = useState<string[]>([]); // State to hold worker IDs
  const [loading, setLoading] = useState(true); // Loading state to indicate when data is fetched

  // Fetch the worker IDs asynchronously
  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const workers = await api.worker.getAll();
        const workerIds = workers.map((worker) => worker.user.id).filter((id) => id !== undefined) as string[]; // Filter out undefined values and cast to string[]
        setWorkerIDs(workerIds); // Update the state with the worker IDs
      } catch (error) {
        console.error("Error fetching workers:", error);
      } finally {
        setLoading(false); // Mark as loaded
      }
    };

    fetchWorkers();
  }, []); // Empty dependency array means this runs once on component mount

  // Now that the workerIDs state is updated, you can check if the worker is true
  const workerTrue = workerIDs.includes(msg.userId);
  const self = msg.userId === cookies.userId || (cookies.userType === ROLES.Admin && workerTrue);
  const name = workerTrue ? 'Worker' : 'Customer';

  console.log(workerIDs, workerTrue);
  console.log(msg.userId, cookies.userId, self, workerTrue);

  // You can return a loading spinner or similar until the data is loaded
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`flex flex-row space-x-4 w-full ${self ? 'justify-end' : 'justify-start'}`}>
      {/* When it's not the self message */}
      {!self && (
        <span className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
          {cookies.userType === 'customer' ? (
            <img
              src={edropLogo}
              alt="Logo"
              className="h-[70%] w-[70%] object-contain"
            />
          ) : (
            <span className="text-black text-lg">C</span>
          )}
        </span>
      )}

      {/* Message content */}
      <div className={`${self ? 'bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg' : 'bg-gray-300 p-3 rounded-r-lg rounded-bl-lg'}`}>
        <p className="text-sm">
          {msg.message}
        </p>
      </div>

      {/* When it's the self message */}
      {self && (
        <span className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
          {cookies.userType === 'customer' ? (
            <span className="text-black text-sm">You</span>
          ) : (
            <img
              src={edropLogo}
              alt="Logo"
              className="h-[70%] w-[70%] object-contain"
            />
          )}
        </span>
      )}
    </div>
  );
  
}


