import { Formik } from 'formik';
import { useState } from 'react';
import { Form, NavLink, useSearchParams } from 'react-router-dom';
import { request } from '../../api';
import { customerResetPass } from '../../api';
import FormGroup from '../../component/form/FormGroup';
import MessageLayout from '../../component/layout/MessageLayout';
import { ResetPasswordSchema } from '../../schemas';

function ResetPassword() {
  const [errorDetected, setErrorDetected] = useState(false);
  const [errorDetectedPOST, setErrorDetectedPOST] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  function handleReset({ newPassword, confirmNewPassword }: { newPassword: string, confirmNewPassword: string }) {
    const resetToken = searchParams.get('resetToken');
    // possible errors: empty reset token, passwords not matching,
    // password not satisfying the minimum requirement
    if (!resetToken) {
      setPasswordChanged(false);
      setErrorDetected(true);
    } else {
      const body = {
        newPassword: newPassword,
        accessToken: resetToken,
      };
      request(customerResetPass, 'POST', body, false)
        .then((res) => {
          setPasswordChanged(true);
          setErrorDetectedPOST(false);
        })
        .catch((err) => {
          console.log(err);
          setErrorDetectedPOST(true);
          setPasswordChanged(false);
        });
    }
  }

  return (
    <MessageLayout
      title="Reset Password"
      message="Please enter your new password. The password should contain
        at least a number, capital letter, and lowercase letter,
        and be at least 8 characters long."
    >
      <Formik
        initialValues={{ newPassword: '', confirmNewPassword: '' }}
        validationSchema={ResetPasswordSchema}
        onSubmit={handleReset}
      >
        <Form>
          <FormGroup name="newPassword" type="password" required autoComplete="new-password" />
          <FormGroup name="confirmNewPassword" type="password" required autoComplete="new-password" />
          <button
            type="submit"
            className="bg-secondary text-white px-4 py-2 w-max"
          >
            Change Password
          </button>
        </Form>
      </Formik>
      {errorDetected && (
        <div>
          <div className="help-text">
            It appears that the link to reset your password has expired.
          </div>
          <div className="link">
            <NavLink to="/forgetPass">Resend Email for Password Reset or Email Verification</NavLink>
          </div>
          <div className="link">
            <a href="mailto:service@edrops.org">Contact Us for Help</a>
          </div>
        </div>
      )}
      {errorDetectedPOST && (
        <div>
          <div className="help-text">
            Error: Failed to change password. Please confirm that
            the email for your account is verified and the password
            reset link has not expired.
          </div>
          <div className="link">
            <NavLink to="/forgetPass">Resend Email for Password Reset or Email Verification</NavLink>
          </div>
          <div className="link">
            <a href="mailto:service@edrops.org">Contact Us for Help</a>
          </div>
        </div>
      )}
      {passwordChanged && (
        <div>
          <div className="help-text">
            Your password has successfully been reset.
          </div>
          <div className="link">
            <NavLink to="/login">Login to Your Account</NavLink>
          </div>
        </div>
      )}
    </MessageLayout >
  );
}

export default ResetPassword;
