import { Formik, Form } from 'formik';
import { useEffect, useState } from 'react';
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { request } from '../../api';
import { userResetPass } from '../../api';
import FormGroup from '../../component/form/FormGroup';
import MessageLayout from '../../component/layout/MessageLayout';
import { ResetPasswordSchema } from '../../schemas';
import { ROUTES } from '@/router/routes';

export function ResetPassword() {
  const [errorDetected, setErrorDetected] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [resetToken, setResetToken] = useState('');

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const resetToken = searchParams.get('reset_token');
    resetToken ? setResetToken(resetToken) : navigate('/forgetPass');
  }, [searchParams])

  function handleReset({ newPassword, confirmNewPassword }: { newPassword: string, confirmNewPassword: string }) {
    const body = {
      newPassword: newPassword,
      accessToken: resetToken,
    };
    request(userResetPass, 'POST', body, false)
      .then((res) => {
        setPasswordChanged(true);
        setErrorDetected(false);
      })
      .catch((err) => {
        console.log(err);
        setErrorDetected(true);
        setPasswordChanged(false);
      });
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
        <Form className="flex flex-col space-y-2 items-center">
          <FormGroup name="newPassword" type="password" required autoComplete="new-password" />
          <FormGroup name="confirmNewPassword" type="password" required autoComplete="new-password" />
          <button
            type="submit"
            className="bg-secondary text-white px-4 py-2 w-max rounded"
          >
            Change Password
          </button>
        </Form>
      </Formik>
      {errorDetected && (
        <div className="flex flex-col items-center">
          <div className="text-center">
            Failed to change password. Please confirm that
            the email for your account is verified and the password
            reset link has not expired.
          </div>
          <div className="text-center text-primary_lig">
            <NavLink to={ROUTES.ForgotPassword}>Resend Email for Password Reset or Email Verification</NavLink>
          </div>
          <div className="text-center text-primary_lig">
            <a href="mailto:info@edroplets.org">Contact Us for Help</a>
          </div>
        </div>
      )}
      {passwordChanged && (
        <div className="flex flex-col items-center">
          <div className="text-center">
            Your password has successfully been reset.
          </div>
          <div className="text-center text-primary_light">
            <NavLink to={ROUTES.Login}>Login to Your Account</NavLink>
          </div>
        </div>
      )}
    </MessageLayout >
  );
}