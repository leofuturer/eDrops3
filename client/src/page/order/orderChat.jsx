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
          this.appendMessageToContainer(data.message, data.user_id);
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
        this.setState({
          messages: res.data.message_arr,
        });
        this.state.messages.forEach( (element) => {
          this.appendMessageToContainer(element.message, element.user_id);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  appendMessageToContainer(msg, id){
    var message = msg;
    var messageObj = {message: message, user_id: id};
    var messageContainer = document.getElementById('message-container');
    if (message != null && message != ''){
      const messageElement = document.createElement('div');
      let user;
      id === 0 ? user = "Worker" : user = "Customer";
      messageElement.innerText = user + ": " + message;
      if (id === this.state.userType){
        messageElement.style.textAlign = 'right';
      }
      else{
        messageElement.style.textAlign = 'left';
      }
      messageContainer.append(messageElement);
    }
  }

  afterSubmission(event){
    event.preventDefault();
    var messageInput = document.getElementById('message-input');
    var message = messageInput.value;
    const data = {
      msg: message,
      user_id: this.state.userType,
      orderId: this.state.orderId
    };
    const appendUrl = addOrderMessage.replace('id', this.state.orderId);
    API.Request(appendUrl, 'POST', data, true)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    messageInput.value = '';
  }

  render() {
    return (
      <div>
      <div className="order-chat-frame">
            <div className="order-chat-title-container">
              <h2>Order Chat for Order #{this.state.orderId}</h2>
            </div>
                <div id="message-container">
                  <div>Use the chat below to communicate about the order!</div>
                </div>
              <form id="send-container" onSubmit={this.afterSubmission}>
                  <input type="text" id="message-input"></input>
                  <button type="submit" id="send-button">Send</button>
                </form>
            </div> 
      </div>
    );
  }
}

export default OrderChat;
