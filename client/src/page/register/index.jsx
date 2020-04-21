import React from 'react';
import {withRouter} from 'react-router-dom';
import API from '../../api/api'
import { customerSignUp, findCustomerByWhere } from '../../api/serverConfig';
import {constraints} from './formConstraints';
import './register.css';
import _ from 'lodash';
import { resolve } from 'path';

var validate = require('validate.js');

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            address: "",
            firstName: "",
            lastName: "",
            phoneNumber: "",
            country: "United States",
            state: "",
            city: "",
            zipCode: "",
            userType: "person",
            username: "",
            email: "",
            password: "",
            confirmPassword: ""
            
        }
        this.handleRegister = this.handleRegister.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleValidateInput = this.handleValidateInput.bind(this);
        this.closestParent = this.closestParent.bind(this);
        this.showErrorsOrSuccessForInput = this.showErrorsOrSuccessForInput.bind(this);
        this.addError = this.addError.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    handleChange(key, value) {
        this.setState(
            {
                [key]: value
            }, () => {
                console.log(this.state.country);
            }
        );
     }

    /**
    * The method is used to display error messages adding <p>
    * behind the input
    */
    addError(messages, error) {
        var block = document.createElement("p");
        block.classList.add("help-block");
        block.classList.add("error");
        block.innerHTML = error;
        messages.appendChild(block);
    }

    closestParent(child, className) {
        if(!child || child == document) {
            return null;
        }
        if (child.classList.contains(className)) {
            return child;
        } else {
            return this.closestParent(child.parentNode, className);
        }
    }

    showErrorsOrSuccessForInput(input, errors) {
        var _this = this;
        var formGroup = this.closestParent(input.parentNode, "form-group");
        var messages = formGroup.querySelector(".messages");

        //remove old messages and reset the classes
        formGroup.classList.remove("has-error");
        formGroup.classList.remove("has-success");
        // and remove any old messages
        _.each(formGroup.querySelectorAll(".help-block.error, .text-muted, .text-success"), function(ele) {
            ele.remove();
            //el.parentNode.removeChild(ele);
        });

        if (errors) {
            // we first mark the group has having errors
            formGroup.classList.add("has-error");
            // then we append all the errors
             _.each(errors, function(error) {
            _this.addError(messages, error); //Attention: we must use the _this instead of this!!!
          });
        } else {
            // otherwise we simply mark it as success
            var messages2 = formGroup.querySelector(".messages");
            formGroup.classList.add("has-success");
            let successInfo = document.createElement("p");
            successInfo.classList.add("text-success");
            successInfo.innerHTML = "Looks good!";
            messages2.appendChild(successInfo);
        }
    }

    handleValidateInput(e) {
        let ele = e.target;
        let form = this.closestParent(e.target, "vertical-form");
        // console.log(form);
        let errors = validate(form, constraints) || {};
        // console.log(errors);
        this.showErrorsOrSuccessForInput(ele, errors[ele.name]);
    }

    handleFormSubmit(e) {
        let form = document.querySelector(".vertical-form");
        let noDupsFound = true; //not the cleanest way to do it but it'll work
        let errors = {};
        validate.async(form, constraints, {cleanAttributes: false})
        .then(success => {
            let customerName = document.getElementById("inputUsername").value;
            let url = `${findCustomerByWhere}?filter={"where": {"username": "${customerName}"}}`;    
            return API.Request(url, 'GET', {}, false); //GET, so no need to pass in anything
        })
        .then(res => {
            if (res.data.length !== 0) {            
                errors.username = ["Account already exists with this username"];
                let input1 = document.querySelector("#inputUsername");
                this.showErrorsOrSuccessForInput(input1, errors.username);
                noDupsFound = false;
            }

            let customerEmail = document.getElementById("inputEmail").value;          
            let url = `${findCustomerByWhere}?filter={"where": {"email": "${customerEmail}"}}`;
            return API.Request(url, 'GET', {}, false);
        })
        .then(res => {
            if(res.data.length !== 0){ //dup username
                errors.email = ["Account already exists with this email"];
                let emailInput = document.getElementById("inputEmail");
                this.showErrorsOrSuccessForInput(emailInput, errors.email);
            }
            else if(noDupsFound){ //passed no dup email and no dup username
                this.handleRegister(e);
            }
        })      
        .catch(errors => {
            console.log("Displaying errors");
            _.each(form.querySelectorAll("input.needValidation"), function(input) {
                //what's the purpose of this line?
                _this.showErrorsOrSuccessForInput(input, errors && errors[input.name]);
            });
        });
    }

    handleRegister(e) {
        let data = {
            address: this.state.address,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            phoneNumber: this.state.phoneNumber,
            country: this.state.country,
            state: this.state.state,
            city: this.state.city,
            zipCode: this.state.zipCode,
            userType: this.state.userType,
            username: this.state.username,
            email: this.state.email,
            password: this.state.password
        }
        // console.log(data); 
        API.Request(customerSignUp, 'POST', data, false)
        .then(res => {
            alert("Your have successfully signed up, please log in using your new account!");
            this.props.history.push('/login');
        })
        .catch(error => {
            console.error(error)
        });
    }

    render() {
        return (
            <div>
                <div className="login-input">
                    <div className="register-login-content">
                        <h3>Sign Up</h3>
                        <div className="border-h3"></div>
                        <form id="main" className="vertical-form" action="" noValidate>
                            <div className="input-content-register">
                                <div className="text-left reminder">
                                    <small className="text-muted">Fields with * are required</small>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="inputEmail" className="col-md-2 col-sm-2 col-xs-2 control-label">
                                        <span>Email*</span>
                                    </label>
                                    <div className="col-md-6 col-sm-6 col-xs-6 text-left">
                                        <input id="inputEmail" type="email" name="email" className="form-control needValidation" placeholder="Email" 
                                               onChange={v => this.handleChange('email', v.target.value)} onBlur={this.handleValidateInput}/>
                                    </div>
                                    <div className="col-md-4 col-sm-4 col-xs-4 messages">
                                        <small className="text-muted">Valid Email Required</small>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-md-2 col-sm-2 col-xs-2 control-label">
                                        <span>Username*</span>
                                    </label>
                                    <div className="col-md-6 col-sm-6 col-xs-6">
                                        <input type="text" id="inputUsername" name="username" className="form-control needValidation" placeholder="Username"
                                               onChange={v => this.handleChange('username', v.target.value)} onBlur={this.handleValidateInput} />
                                    </div>
                                    <div className="col-md-4 col-sm-4 col-xs-4 messages">
                                        <small className="text-muted">Username can only contain a-z, A-Z, 0-9 and _, 8-16 characters</small>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-md-2 col-sm-2 col-xs-2 control-label">
                                        <span>Password*</span>
                                    </label>
                                    <div className="col-md-6 col-sm-6 col-xs-6 text-left">
                                        <input type="password" name="password" className="form-control needValidation" placeholder="Password"
                                               onChange={v => this.handleChange('password', v.target.value)} onBlur={this.handleValidateInput}/>
                                    </div>
                                    <div className="col-md-4 col-sm-4 col-xs-4 messages">
                                        <small className="text-muted">Password should contain at least a number, capital letter and lowercase letter, and 8-20 characters</small>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-md-2 col-sm-2 col-xs-2 control-label">
                                        <span>Confirm Password*</span>
                                    </label>
                                    <div className="col-md-6 col-sm-6 col-xs-6 text-left">
                                        <input type="password" name="confirmPassword" className="form-control needValidation" placeholder="Confirm Password" 
                                               onChange={v => this.handleChange('confirmPassword', v.target.value)} onBlur={this.handleValidateInput}/>
                                    </div>
                                    <div className="col-md-4 col-sm-4 col-xs-4 messages">
                                        <small className="text-muted">Please retype your password</small>
                                    </div>
                                </div>
                                
                                <div className="form-group row">
                                    <label className="col-md-2 col-sm-2 col-xs-2 control-label">
                                        <span>First Name*</span>
                                    </label>
                                    <div className="col-md-6 col-sm-6 col-xs-6">

                                    {/* DY 4-14-2020: Update firstName and lastName and user type to required.
                                    Database schema requires these values. */}

                                        <input type="text" className="form-control needValidation" name="firstName" placeholder="First Name"
                                               onChange={v => this.handleChange('firstName', v.target.value)} onBlur={this.handleValidateInput}/>
                                    </div>
                                    {/* does name="firstName" need to be added here? */}
                                    <div className="col-md-4 col-sm-4 col-xs-4 messages">
                                        <small className="text-muted"></small>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-md-2 col-sm-2 col-xs-2 control-label">
                                        <span>Last Name*</span>
                                    </label>
                                    <div className="col-md-6 col-sm-6 col-xs-6">
                                        <input type="text" className="form-control needValidation" name="lastName" placeholder="Last Name"
                                               onChange={v => this.handleChange('lastName', v.target.value)} onBlur={this.handleValidateInput}/>
                                    </div>
                                    {/* does name="lastname" need to be added here? */}
                                    <div className="col-md-4 col-sm-4 col-xs-4 messages">
                                        <small className="text-muted"></small>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-md-2 col-sm-2 col-xs-2 control-label">
                                        <span>User Type*</span>
                                    </label>
                                    <div className="col-md-6 col-sm-6 col-xs-6 text-left">
                                        <label className="radio-inline">
                                            <input type="radio" name="userType" value="Person" 
                                            onClick={v => this.handleChange('userType', v.target.value)} onBlur={this.handleValidateInput}/> 
                                            <span className="txt-radio">Person</span>
                                        </label>
                                        <label className="radio-inline" style={{marginLeft:'80px'}}>
                                            <input type="radio" name="userType" value="Company"
                                            onClick={v => this.handleChange('userType', v.target.value)} onBlur={this.handleValidateInput}/>
                                            <span className="txt-radio">Company</span>
                                        </label>
                                    </div>
                                    <div className="col-md-4 col-sm-4 col-xs-4 messages">
                                        <small className="text-muted">Personal or associated with a company</small>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-md-2 col-sm-2 col-xs-2 control-label">
                                        <span>Phone Number</span>
                                    </label>
                                    <div className="col-md-6 col-sm-6 col-xs-6 text-left">

                                        <input type="text" name="phoneNumber" className="form-control needValidation" placeholder="Phone Number"
                                               onChange={v => this.handleChange('phoneNumber', v.target.value) } onBlur={this.handleValidateInput}/>
                                    </div>
                                    <div className="col-md-4 col-sm-4 col-xs-4 messages">
                                        <small className="text-muted">Include area code, and if outside the US, country code</small>
                                    </div>
                                    {/* <div className="col-md-4 col-sm-4 col-xs-4 messages-unset"></div> */}
                                </div>
   
                                <div className="form-group row">
                                    <label className="col-md-2 col-sm-2 col-xs-2 control-label">
                                        <span>Address</span>
                                    </label>
                                    <div className="col-md-6 col-sm-6 col-xs-6 text-left">
                                        <input type="text" className="form-control" placeholder="Address"
                                               onChange={v => this.handleChange('address', v.target.value)}/>
                                    </div>
                                    <div className="col-md-4 col-sm-4 col-xs-4 messages-unset"></div>
                                </div>

                                <div className="form-group row">
                                    <label className="col-md-2 col-sm-2 col-xs-2 control-label">
                                        <span>City</span>
                                    </label>
                                    <div className="col-md-6 col-sm-6 col-xs-6 text-left">
                                        <input type="text" className="form-control" placeholder="City"
                                               onChange={v => this.handleChange('city', v.target.value)}/>
                                    </div>
                                    <div className="col-md-4 col-sm-4 col-xs-4 messages-unset"></div>
                                </div>

                                <div className="form-group row">
                                    <label className="col-md-2 col-sm-2 col-xs-2 control-label">
                                        <span>State or Province</span>
                                    </label>
                                    <div className="col-md-6 col-sm-6 col-xs-6 text-left">
                                        <input type="text" className="form-control" placeholder="State or Province"
                                               onChange={v => this.handleChange('state', v.target.value)}/>
                                    </div>
                                    <div className="col-md-4 col-sm-4 col-xs-4 messages-unset"></div>
                                </div>

                                <div className="form-group row">
                                    <label className="col-md-2 col-sm-2 col-xs-2 control-label">
                                        <span>Zip or Postal Code</span>
                                    </label>
                                    <div className="col-md-6 col-sm-6 col-xs-6 text-left">
                                        <input type="text" className="form-control" placeholder="Zip or Postal Code"
                                               onChange={v => this.handleChange('zipCode', v.target.value)}/>
                                    </div>
                                    <div className="col-md-4 col-sm-4 col-xs-4 messages-unset"></div>
                                </div>

                                <div className="form-group row">
                                    <label className="col-md-2 col-sm-2 col-xs-2 control-label">
                                        <span>Country</span>
                                    </label>
                                    <div className="col-md-6 col-sm-6 col-xs-6 text-left">
                                        <select id="country" className="form-control" name="country" defaultValue="US" onChange={v => this.handleChange('country', v.target.value)}>
                                            <option value="US">United States</option>
                                            <option value="AF">Afghanistan</option>
                                            <option value="AX">Åland Islands</option>
                                            <option value="AL">Albania</option>
                                            <option value="DZ">Algeria</option>
                                            <option value="AS">American Samoa</option>
                                            <option value="AD">Andorra</option>
                                            <option value="AO">Angola</option>
                                            <option value="AI">Anguilla</option>
                                            <option value="AQ">Antarctica</option>
                                            <option value="AG">Antigua and Barbuda</option>
                                            <option value="AR">Argentina</option>
                                            <option value="AM">Armenia</option>
                                            <option value="AW">Aruba</option>
                                            <option value="AU">Australia</option>
                                            <option value="AT">Austria</option>
                                            <option value="AZ">Azerbaijan</option>
                                            <option value="BS">Bahamas</option>
                                            <option value="BH">Bahrain</option>
                                            <option value="BD">Bangladesh</option>
                                            <option value="BB">Barbados</option>
                                            <option value="BY">Belarus</option>
                                            <option value="BE">Belgium</option>
                                            <option value="BZ">Belize</option>
                                            <option value="BJ">Benin</option>
                                            <option value="BM">Bermuda</option>
                                            <option value="BT">Bhutan</option>
                                            <option value="BO">Bolivia</option>
                                            <option value="BA">Bosnia and Herzegovina</option>
                                            <option value="BW">Botswana</option>
                                            <option value="BV">Bouvet Island</option>
                                            <option value="BR">Brazil</option>
                                            <option value="IO">British Indian Ocean Territory</option>
                                            <option value="BN">Brunei Darussalam</option>
                                            <option value="BG">Bulgaria</option>
                                            <option value="BF">Burkina Faso</option>
                                            <option value="BI">Burundi</option>
                                            <option value="KH">Cambodia</option>
                                            <option value="CM">Cameroon</option>
                                            <option value="CA">Canada</option>
                                            <option value="CV">Cape Verde</option>
                                            <option value="KY">Cayman Islands</option>
                                            <option value="CF">Central African Republic</option>
                                            <option value="TD">Chad</option>
                                            <option value="CL">Chile</option>
                                            <option value="CN">China</option>
                                            <option value="CX">Christmas Island</option>
                                            <option value="CC">Cocos (Keeling) Islands</option>
                                            <option value="CO">Colombia</option>
                                            <option value="KM">Comoros</option>
                                            <option value="CG">Congo</option>
                                            <option value="CD">Congo, The Democratic Republic of The</option>
                                            <option value="CK">Cook Islands</option>
                                            <option value="CR">Costa Rica</option>
                                            <option value="CI">Cote D'ivoire</option>
                                            <option value="HR">Croatia</option>
                                            <option value="CU">Cuba</option>
                                            <option value="CY">Cyprus</option>
                                            <option value="CZ">Czech Republic</option>
                                            <option value="DK">Denmark</option>
                                            <option value="DJ">Djibouti</option>
                                            <option value="DM">Dominica</option>
                                            <option value="DO">Dominican Republic</option>
                                            <option value="EC">Ecuador</option>
                                            <option value="EG">Egypt</option>
                                            <option value="SV">El Salvador</option>
                                            <option value="GQ">Equatorial Guinea</option>
                                            <option value="ER">Eritrea</option>
                                            <option value="EE">Estonia</option>
                                            <option value="ET">Ethiopia</option>
                                            <option value="FK">Falkland Islands (Malvinas)</option>
                                            <option value="FO">Faroe Islands</option>
                                            <option value="FJ">Fiji</option>
                                            <option value="FI">Finland</option>
                                            <option value="FR">France</option>
                                            <option value="GF">French Guiana</option>
                                            <option value="PF">French Polynesia</option>
                                            <option value="TF">French Southern Territories</option>
                                            <option value="GA">Gabon</option>
                                            <option value="GM">Gambia</option>
                                            <option value="GE">Georgia</option>
                                            <option value="DE">Germany</option>
                                            <option value="GH">Ghana</option>
                                            <option value="GI">Gibraltar</option>
                                            <option value="GR">Greece</option>
                                            <option value="GL">Greenland</option>
                                            <option value="GD">Grenada</option>
                                            <option value="GP">Guadeloupe</option>
                                            <option value="GU">Guam</option>
                                            <option value="GT">Guatemala</option>
                                            <option value="GG">Guernsey</option>
                                            <option value="GN">Guinea</option>
                                            <option value="GW">Guinea-bissau</option>
                                            <option value="GY">Guyana</option>
                                            <option value="HT">Haiti</option>
                                            <option value="HM">Heard Island and Mcdonald Islands</option>
                                            <option value="VA">Holy See (Vatican City State)</option>
                                            <option value="HN">Honduras</option>
                                            <option value="HK">Hong Kong</option>
                                            <option value="HU">Hungary</option>
                                            <option value="IS">Iceland</option>
                                            <option value="IN">India</option>
                                            <option value="ID">Indonesia</option>
                                            <option value="IR">Iran, Islamic Republic of</option>
                                            <option value="IQ">Iraq</option>
                                            <option value="IE">Ireland</option>
                                            <option value="IM">Isle of Man</option>
                                            <option value="IL">Israel</option>
                                            <option value="IT">Italy</option>
                                            <option value="JM">Jamaica</option>
                                            <option value="JP">Japan</option>
                                            <option value="JE">Jersey</option>
                                            <option value="JO">Jordan</option>
                                            <option value="KZ">Kazakhstan</option>
                                            <option value="KE">Kenya</option>
                                            <option value="KI">Kiribati</option>
                                            <option value="KP">Korea, Democratic People's Republic of</option>
                                            <option value="KR">Korea, Republic of</option>
                                            <option value="KW">Kuwait</option>
                                            <option value="KG">Kyrgyzstan</option>
                                            <option value="LA">Lao People's Democratic Republic</option>
                                            <option value="LV">Latvia</option>
                                            <option value="LB">Lebanon</option>
                                            <option value="LS">Lesotho</option>
                                            <option value="LR">Liberia</option>
                                            <option value="LY">Libyan Arab Jamahiriya</option>
                                            <option value="LI">Liechtenstein</option>
                                            <option value="LT">Lithuania</option>
                                            <option value="LU">Luxembourg</option>
                                            <option value="MO">Macao</option>
                                            <option value="MK">Macedonia, The Former Yugoslav Republic of</option>
                                            <option value="MG">Madagascar</option>
                                            <option value="MW">Malawi</option>
                                            <option value="MY">Malaysia</option>
                                            <option value="MV">Maldives</option>
                                            <option value="ML">Mali</option>
                                            <option value="MT">Malta</option>
                                            <option value="MH">Marshall Islands</option>
                                            <option value="MQ">Martinique</option>
                                            <option value="MR">Mauritania</option>
                                            <option value="MU">Mauritius</option>
                                            <option value="YT">Mayotte</option>
                                            <option value="MX">Mexico</option>
                                            <option value="FM">Micronesia, Federated States of</option>
                                            <option value="MD">Moldova, Republic of</option>
                                            <option value="MC">Monaco</option>
                                            <option value="MN">Mongolia</option>
                                            <option value="ME">Montenegro</option>
                                            <option value="MS">Montserrat</option>
                                            <option value="MA">Morocco</option>
                                            <option value="MZ">Mozambique</option>
                                            <option value="MM">Myanmar</option>
                                            <option value="NA">Namibia</option>
                                            <option value="NR">Nauru</option>
                                            <option value="NP">Nepal</option>
                                            <option value="NL">Netherlands</option>
                                            <option value="AN">Netherlands Antilles</option>
                                            <option value="NC">New Caledonia</option>
                                            <option value="NZ">New Zealand</option>
                                            <option value="NI">Nicaragua</option>
                                            <option value="NE">Niger</option>
                                            <option value="NG">Nigeria</option>
                                            <option value="NU">Niue</option>
                                            <option value="NF">Norfolk Island</option>
                                            <option value="MP">Northern Mariana Islands</option>
                                            <option value="NO">Norway</option>
                                            <option value="OM">Oman</option>
                                            <option value="PK">Pakistan</option>
                                            <option value="PW">Palau</option>
                                            <option value="PS">Palestinian Territory, Occupied</option>
                                            <option value="PA">Panama</option>
                                            <option value="PG">Papua New Guinea</option>
                                            <option value="PY">Paraguay</option>
                                            <option value="PE">Peru</option>
                                            <option value="PH">Philippines</option>
                                            <option value="PN">Pitcairn</option>
                                            <option value="PL">Poland</option>
                                            <option value="PT">Portugal</option>
                                            <option value="PR">Puerto Rico</option>
                                            <option value="QA">Qatar</option>
                                            <option value="RE">Reunion</option>
                                            <option value="RO">Romania</option>
                                            <option value="RU">Russian Federation</option>
                                            <option value="RW">Rwanda</option>
                                            <option value="SH">Saint Helena</option>
                                            <option value="KN">Saint Kitts and Nevis</option>
                                            <option value="LC">Saint Lucia</option>
                                            <option value="PM">Saint Pierre and Miquelon</option>
                                            <option value="VC">Saint Vincent and The Grenadines</option>
                                            <option value="WS">Samoa</option>
                                            <option value="SM">San Marino</option>
                                            <option value="ST">Sao Tome and Principe</option>
                                            <option value="SA">Saudi Arabia</option>
                                            <option value="SN">Senegal</option>
                                            <option value="RS">Serbia</option>
                                            <option value="SC">Seychelles</option>
                                            <option value="SL">Sierra Leone</option>
                                            <option value="SG">Singapore</option>
                                            <option value="SK">Slovakia</option>
                                            <option value="SI">Slovenia</option>
                                            <option value="SB">Solomon Islands</option>
                                            <option value="SO">Somalia</option>
                                            <option value="ZA">South Africa</option>
                                            <option value="GS">South Georgia and The South Sandwich Islands</option>
                                            <option value="ES">Spain</option>
                                            <option value="LK">Sri Lanka</option>
                                            <option value="SD">Sudan</option>
                                            <option value="SR">Suriname</option>
                                            <option value="SJ">Svalbard and Jan Mayen</option>
                                            <option value="SZ">Swaziland</option>
                                            <option value="SE">Sweden</option>
                                            <option value="CH">Switzerland</option>
                                            <option value="SY">Syrian Arab Republic</option>
                                            <option value="TW">Taiwan, Province of China</option>
                                            <option value="TJ">Tajikistan</option>
                                            <option value="TZ">Tanzania, United Republic of</option>
                                            <option value="TH">Thailand</option>
                                            <option value="TL">Timor-leste</option>
                                            <option value="TG">Togo</option>
                                            <option value="TK">Tokelau</option>
                                            <option value="TO">Tonga</option>
                                            <option value="TT">Trinidad and Tobago</option>
                                            <option value="TN">Tunisia</option>
                                            <option value="TR">Turkey</option>
                                            <option value="TM">Turkmenistan</option>
                                            <option value="TC">Turks and Caicos Islands</option>
                                            <option value="TV">Tuvalu</option>
                                            <option value="UG">Uganda</option>
                                            <option value="UA">Ukraine</option>
                                            <option value="AE">United Arab Emirates</option>
                                            <option value="GB">United Kingdom</option>
                                            <option value="UM">United States Minor Outlying Islands</option>
                                            <option value="UY">Uruguay</option>
                                            <option value="UZ">Uzbekistan</option>
                                            <option value="VU">Vanuatu</option>
                                            <option value="VE">Venezuela</option>
                                            <option value="VN">Viet Nam</option>
                                            <option value="VG">Virgin Islands, British</option>
                                            <option value="VI">Virgin Islands, U.S.</option>
                                            <option value="WF">Wallis and Futuna</option>
                                            <option value="EH">Western Sahara</option>
                                            <option value="YE">Yemen</option>
                                            <option value="ZM">Zambia</option>
                                            <option value="ZW">Zimbabwe</option>
                                        </select>
                                    </div>
                                    <div className="col-md-4 col-sm-4 col-xs-4 messages-unset"></div>
                                </div>
                                
                                <div className="form-group login-btn">
                                    <input type="button" value="Sign Up" className="input-btn" 
                                           onClick={this.handleFormSubmit}/>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="hr-div-login"></div>
            </div>
        );
    }
};

Register = withRouter(Register);
export default Register;