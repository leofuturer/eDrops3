/* eslint-disable */
import { useContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useSearchParams } from 'react-router-dom';
import API from '../../api/api';
import {
  addOrderMessage, adminGetProfile, customerGetProfile, foundryWorkerGetProfile,
  getOrderMessagesById
} from '../../api/serverConfig';
import { PusherContext } from '../../App';

// Customers have chat_id of 1
// Admins/workers have chat_id of 0

interface Message {
  message: string;
  userConvId: number;
}

function OrderChat() {
  const pusher = useContext(PusherContext);

  const [orderId, setOrderId] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [userTypeId, setUserTypeId] = useState(0);


  const [searchParams, setSearchParams] = useSearchParams();
  const [cookies] = useCookies(['userType', 'userId'])

  useEffect(() => {
    setOrderId(searchParams.get('id') as string);
  }, [searchParams]);

  useEffect(() => {
    // For real time notifications
    if (pusher) {
      const channel = pusher.subscribe(`chat-${orderId}`);
      channel.bind('new-message', (data: Message) => appendMessageToContainer(data.message, data.userConvId));

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
          const element = document.getElementById('send-container');
          element.remove();
          break;
        default:
        case 'foundryWorker':
          initUrl = foundryWorkerGetProfile;
          userTypeId = 0;
          break;
      }
      API.Request(initUrl.replace('id', cookies.userId), 'GET', {}, true)
        .then((res) => {
          setUserTypeId(userTypeId);
          loadMessages();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  function loadMessages() {
    API.Request(getOrderMessagesById.replace('id', orderId), 'GET', {}, true)
      .then((res) => {
        console.log(res.data);
        setMessages(res.data);
        messages.forEach((msg) => {
          appendMessageToContainer(msg);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function appendMessageToContainer(msg: Message) {
    const { message, userConvId: id } = msg;
    const messageContainer = document.getElementById('chat');
    if (message != null && message != '') {
      const messageBubble = document.createElement('div');
      messageBubble.classList.add('msg');
      const user = id === 0 ? 'Worker' : 'Customer';
      messageBubble.innerText = user + ": " + message;
      if (id === userTypeId) {
        messageBubble.classList.add('sent');
      }
      else {
        messageBubble.classList.add('rcvd');
      }
      messageContainer.append(messageBubble);
    }
  }

  function afterSubmission(event) {
    event.preventDefault();
    var messageInput = document.getElementById('message-input');
    var msg = messageInput.value;
    const data = {
      "orderId": Number(this.state.orderId),
      "message": String(msg),
      "userConvId": Number(this.state.userType),
      "messageDate": new Date(),
    };

    const appendUrl = addOrderMessage;//.replace('id', this.state.orderId);
    API.Request(appendUrl, 'POST', data, false)
      .then((res) => {
        messageInput.value = '';
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className="order-chat-frame">
      <div className="order-chat-title-container">
        <h2>Order Chat for Order #{orderId}</h2>
        <p>Use the chat below to communicate about the order!</p>
      </div>
      <div className="chat" id="chat">
      </div>
      <form id="send-container" onSubmit={afterSubmission}>
        <input type="text" size={50} className="input-box send" placeholder="Type your message here..." id="message-input"></input>
        <button type="submit" className="send chat-button" id="send-button">Send</button>
      </form>
    </div>
  );
}

export default OrderChat;

