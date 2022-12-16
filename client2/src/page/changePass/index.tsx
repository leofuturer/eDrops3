import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/api';
import { AdminChangePass, customerChangePass, FoundryWorkerChangePass } from '../../api/serverConfig';

import { useCookies } from 'react-cookie';
import validate from 'validate.js';

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    oldPassword?: string[];
    newPassword?: string[];
    confirmPassword?: string[];
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const [cookies] = useCookies(['userType']);

  function handleChangePass(e) {
    setIsLoading(false);
    const data = {
      oldPassword,
      newPassword,
    };
    let url = '';
    switch (cookies.userType) {
      case 'customer':
        url = customerChangePass;
        break;
      case 'worker':
        url = FoundryWorkerChangePass;
        break;
      case 'admin':
        url = AdminChangePass;
        break;
    }
    // check if errors is empty
    if (!errors) {
      API.Request(url, 'POST', data, true)
        // .then((res) => {
        //   const userToken = Cookies.get('access_token');
        //   Cookies.remove('access_token');
        //   API.Request(userChangePass, 'POST', data, true)
        //     .then((res) => {
        //       alert('Password successfully changed');
        //       Cookies.set('access_token', userToken);
        //       props.history.push('/manage/profile');
        //     }).catch((error) => {
        //       // Reset user base password failed
        //       console.error(error);
        //       setState({
        //         isLoading: false,
        //       });
        //     });
        // })
        .then((res) => {
          alert('Password successfully changed');
          navigate('/manage/profile');
        })
        .catch((error) => {
          console.error(error.response.data.error.message);
          if (error.response.data.error.message === 'Invalid current password') {
            const ele = document.getElementsByName('oldPassword');
            const errors = ['The current password is incorrect!'];
            clearMessage(ele[0]);
            showErrors(ele[0], errors);
          }
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }

  function handleValidate() {
    const constraints = {
      oldPassword: {
        presence: true,
      },
      newPassword: {
        presence: true,
        length: {
          minimum: 6,
          maximum: 20,
        },
        format: {
          pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/,
          message: 'must contain at least one capital letter, one lowercase letter, and one number',
        },
      },
      confirmPassword: {
        presence: true,
        equality: {
          attribute: 'newPassword',
          message: '^Two passwords do not match',
        },
      },
    };
    const checkedErrors = validate({
      oldPassword,
      newPassword,
      confirmPassword,
    }, constraints) || {};
    setErrors(checkedErrors);
    console.log(checkedErrors)
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full border-b-2 border-primary_light flex justify-center py-8">
        <h2 className="text-2xl">Change Password</h2>
      </div>
      <div className="w-full py-8 grid grid-cols-4 gap-2">
        <label htmlFor="oldPassword" className="col-span-1">Old Password</label>
        <div className="relative col-span-1 flex items-center">
          <input
            type={showOldPassword ? 'text' : 'password'}
            id="oldPassword"
            className={`w-full px-1 shadow-inner focus:shadow-box-sm rounded outline outline-1 ${errors.oldPassword ? 'outline-red-500 focus:shadow-red-500' : 'outline-gray-400 focus:shadow-primary'}`}
            autoComplete="current-password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            onBlur={() => { handleValidate(); setShowOldPassword(false) }}
          />
          <i className={`fa ${showOldPassword ? 'fa-eye-slash' : 'fa-eye'} absolute right-1 text-gray-600 cursor-pointer`} onClick={() => setShowOldPassword(!showOldPassword)} />
        </div>
        <p className="col-span-2 text-red-500 text-xs">{errors.oldPassword && errors.oldPassword[0]}</p>
        <label htmlFor="newPassword" className="col-span-1">New Password</label>
        <div className="relative col-span-1 flex items-center">
          <input
            type={showNewPassword ? 'text' : 'password'}
            id="newPassword"
            className={`w-full px-1 shadow-inner focus:shadow-box-sm rounded outline outline-1 ${errors.newPassword ? 'outline-red-500 focus:shadow-red-500' : 'outline-gray-400 focus:shadow-primary'}`}
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            onBlur={() => { handleValidate(); setShowNewPassword(false) }}
          />
          <i className={`fa ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'} absolute right-1 text-gray-600 cursor-pointer`} onClick={() => setShowNewPassword(!showNewPassword)} />
        </div>
        <p className="col-span-2 text-red-500 text-xs">{errors.newPassword && errors.newPassword[0]}</p>
        <label htmlFor="confirmPassword" className="col-span-1">Confirm Password</label>
        <div className="relative col-span-1 flex items-center">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            className={`w-full px-1 shadow-inner focus:shadow-box-sm rounded outline outline-1 ${errors.confirmPassword ? 'outline-red-500 focus:shadow-red-500' : 'outline-gray-400 focus:shadow-primary'}`}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={() => { handleValidate(); setShowConfirmPassword(false) }}
          /><i className={`fa ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'} absolute right-1 text-gray-600 cursor-pointer`} onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
        </div>
        <p className="col-span-2 text-red-500 text-xs">{errors.confirmPassword && errors.confirmPassword[0]}</p>
        {isLoading
          ? <img className="loading-GIF" src="/img/loading80px.gif" alt="" />
          : (
            <div className="">
              <button
                type="button"
                className="bg-green-500 text-white rounded-lg px-4 py-2"
                onClick={handleChangePass}
              >
                Save
              </button>
            </div>
          )}
      </div>
    </div>
  );
}
export default ChangePassword;
