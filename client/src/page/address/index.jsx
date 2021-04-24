import React from 'react';
import './address.css';
import Cookies from 'js-cookie';
import $ from 'jquery';
import API from '../../api/api';
import { customerAddresses } from '../../api/serverConfig';
import AddressTemplate from './addressTemplate.jsx';
import loadingGif from '../../../static/img/loading80px.gif';

class Address extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addressList: [],
      isLoading: true,
    };
    this.handleAddNewAddress = this.handleAddNewAddress.bind(this);
    this.handleUpdateAddress = this.handleUpdateAddress.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  handleAddNewAddress() {
    const _this = this;
    _this.props.history.push('/manage/address/newAddress');
  }

  handleUpdateAddress() {
    const _this = this;
    _this.props.history.push('/manage/address/updateAddress');
  }

  handleDeleteAddress(addrIndex) {
    // console.log(this.state.addressList);
    // console.log(addrIndex);
    const _this = this;
    const address = _this.state.addressList[addrIndex];
    const addressId = address.id;
    let url = customerAddresses.replace('id', Cookies.get('userId'));
    url += `/${addressId}`;

    // Use axios to send request
    /*
        let data = {};
        let classSelector = '.card' + address.id;
        API.Request(url, 'DELETE', data, true)
        .then((res) => {
            //console.log(res);
            $(classSelector).remove();
            console.log('Address deleted');
            console.log(url);
        })
        .catch((err) => {
            console.log(err);
        })
        */

    // Use ajax to send request --- works well

    url += `?access_token=${Cookies.get('access_token')}`;
    const xhr = new XMLHttpRequest();
    const classSelector = `.card${address.id}`;
    xhr.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 204) {
        // console.log('111');
        $(classSelector).remove();
        // console.log(this.responseText);
      }
    };
    xhr.open('DELETE', url, true);
    xhr.send();

    const addresses = this.state.addressList.filter((i) => i.id !== addressId);
    this.setState({ addressList: addresses });
    // console.log(addresses);
    // Use jquery ajax to send request
    /*
        let address = _this.props.addressTem;
        url += '?access_token=' + Cookies.get('access_token');
        let classSelector = '.card' + address.id;
        $.ajax({
           url: url,
           success: function() {
               $(classSelector).remove();
           }
        });
        */
  }

  componentDidMount() {
    const _this = this;
    const url = customerAddresses.replace('id', Cookies.get('userId'));
    const data = {};
    API.Request(url, 'GET', data, true)
      .then((res) => {
        // console.log(res.data);
        _this.setState({
          addressList: res.data,
          isLoading: false,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <div className="right-route-content">
        <div className="profile-content">
          <h2>Address Book</h2>
        </div>
        <div id="address-list">
          { this.state.isLoading
            ? <img className="loading-GIF" src={loadingGif} alt="" />
            : ( <div>
                  {
                    this.state.addressList.map((oneAddress, index) => 
                      <AddressTemplate 
                        key={index} 
                        addressTem={oneAddress} 
                        addressNum={index + 1} 
                        onDeletion={() => this.handleDeleteAddress(index)} />)
                  }
                  <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                    <div className="card-view">
                      <div className="row row-add-new">
                        <div className="col-md-4 col-sm-4 col-xs-4" />
                        <div className="col-md-4 col-sm-4 col-xs-4">
                          <button className="btn btn-success" onClick={this.handleAddNewAddress}>
                            <i>+</i>
                            <span className="btn-txt-padding">Add New</span>
                          </button>
                        </div>
                        <div className="col-md-4 col-sm-4 col-xs-4" />
                      </div>
                    </div>
                  </div>
                </div>
          )}
        </div>
      </div>
    );
  }
}

export default Address;
