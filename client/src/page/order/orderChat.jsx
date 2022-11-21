/* eslint-disable */
import React from 'react';
import queryString from 'query-string';
import Cookies from 'js-cookie';
import API from '../../api/api';
import { pusher } from '../../app.jsx';
import {
  customerGetProfile,
  adminGetProfile,
  foundryWorkerGetProfile,
  getOrderMessagesById,
  addOrderMessage,
} from '../../api/serverConfig';

// Customers have chat_id of 1
// Admins/workers have chat_id of 0

class OrderChat extends React.Component {
  constructor(props) {
    super(props);
    window.orderChat = this;
    this.state = {
      orderId: queryString.parse(this.props.location.search, { ignoreQueryPrefix: true }).id,
    };
    this.afterSubmission = this.afterSubmission.bind(this); //  otherwise, can't get the username
  }
  
  componentDidMount() {
    const _this = this;
    // For real time notifications
    pusher.getInstance().getPrivateValue()
    .then((instance) => {
      const channel = instance.subscribe(`chat-${this.state.orderId}`);
      channel.bind('new-message', data => {
        this.appendMessageToContainer(data.message, data.userConvId);
      });
    })
    
    const userType = Cookies.get('userType');
    let InitUrl;
    let userTypeId;
    if (userType === 'customer') {
      InitUrl = customerGetProfile;
      userTypeId = 1;
    } else if (userType === 'admin') {
      InitUrl = adminGetProfile;
      userTypeId = 0;
      const element = document.getElementById('send-container');
      element.remove();
    } else {
      InitUrl = foundryWorkerGetProfile;
      userTypeId = 0;
    }
    const userURL = InitUrl.replace('id', Cookies.get('userId'));
    API.Request(userURL, 'GET', {}, true)
    .then((res) => {
      this.setState({
        userType: userTypeId,
      });
      this.loadMessages()
    })
    .catch((err) => {
      console.log(err);
    });
  }
  
  loadMessages() {
    const messageUrl = getOrderMessagesById.replace('id', this.state.orderId);
    API.Request(messageUrl, 'GET', {}, true)
    .then((res) => {
      console.log(res.data);
      this.setState({
        messages: res.data,
      });
      this.state.messages.forEach( (element) => {
        this.appendMessageToContainer(element.message, element.userConvId);
      });
    })
    .catch((err) => {
      console.log(err);
    });
  }
  
  appendMessageToContainer(msg, id){
    const message = msg;
    const messageContainer = document.getElementById('chat');
    if (message != null && message != ''){
      const messageBubble = document.createElement('div');
      messageBubble.classList.add('msg');
      let user;
      id === 0 ? user = "Worker" : user = "Customer";
      messageBubble.innerText = user + ": " + message;
      if (id === this.state.userType){
        messageBubble.classList.add('sent');
      }
      else{
        messageBubble.classList.add('rcvd');
      }
      messageContainer.append(messageBubble);
    }
  }
  
  afterSubmission(event){
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
  
  render() {
    return (
      <div className="order-chat-frame">
        <div className="order-chat-title-container">
          <h2>Order Chat for Order #{this.state.orderId}</h2>
          <p>Use the chat below to communicate about the order!</p>
        </div>
        <div className="chat" id="chat">
        </div>
        <form id="send-container" onSubmit={this.afterSubmission}>
          <input type="text" size="50" className="input-box send" placeholder="Type your message here..." id="message-input"></input>
          <button type="submit" className="send chat-button" id="send-button">Send</button>
        </form>
      </div> 
      );
    }
  }
  
  export default OrderChat;
  
