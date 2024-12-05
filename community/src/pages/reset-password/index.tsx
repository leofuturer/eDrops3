import { Formik, Form } from 'formik';
import { useEffect, useState } from 'react';
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '@edroplets/api';
import FormGroup from '../../components/form/FormGroup';
import { ResetPasswordSchema } from '@edroplets/schemas';
import { ROUTES } from '@/router/routes';


function MessageLayout({children, title, message}: {children: React.ReactNode, title: string, message: string}) {
    return (
        <div className="flex items-center justify-center py-10">
            <div className="flex flex-col items-center space-y-4 shadow-box w-2/3 p-8 rounded-md">
                <h3 className="text-primary text-2xl font-bold border-b-2 border-primary pb-2 w-1/2 text-center">{title}</h3>
                    <p className="w-1/2 text-center">
                        {message}
                    </p>
                    {children}
            </div>
        </div>
    )
}

export function ResetPassword() {
  const [errorDetected, setErrorDetected] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [resetToken, setResetToken] = useState('');

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const resetToken = searchParams.get('reset_token');
    resetToken ? setResetToken(resetToken) : navigate(ROUTES.ForgotPassword);
  }, [searchParams])

  function handleReset(newPassword: string) {
    api.user.resetPassword(newPassword, resetToken).then(() => {
      setPasswordChanged(true);
      setErrorDetected(false);
    }).catch((err) => {
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
        onSubmit={(values) => {
          handleReset(values.newPassword)
        }}
      >
        <Form className="flex flex-col space-y-2 items-center">
          <FormGroup name="newPassword" type="password" required autoComplete="new-password"/>
          <FormGroup name="confirmNewPassword" type="password" required autoComplete="new-password" />
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 w-max rounded"
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

export default ResetPassword;