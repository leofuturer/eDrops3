import { Field, FieldProps, Form, Formik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import API from '../../api/lib/api';
import { customerResendVerifyEmail, userForgetPass } from '../../api/lib/serverConfig';
import MessageLayout from '../../component/layout/MessageLayout';

function ForgetPass() {
  const [successMessage, setSuccessMessage] = useState(false);

  function handleHelp(email: string, helpType: 'resetPassword' | 'resendEmail') {
    const data = {
      email: email,
    };
    switch (helpType) {
      case 'resetPassword':
        API.Request(userForgetPass, 'POST', data, false)
          .then((res) => {
          }).catch((err) => {
            if (process.env.NODE_ENV === 'dev') {
              console.error(err); // Maybe take out as attackers can view console & brute force emails
            }
          }).finally(() => {
            // Display a success message either way so attackers can't brute-force customer emails
            setSuccessMessage(true);
          });
        break;
      case 'resendEmail':
        API.Request(customerResendVerifyEmail, 'POST', data, false)
          .then((res) => {
          })
          .catch((err) => {
            if (process.env.NODE_ENV === 'dev') {
              console.error(err); // Maybe take out as attackers can view console & brute force emails
            }
          }).finally(() => {
            // Display a success message either way so attackers can't brute-force customer emails
            setSuccessMessage(true);
          });;
        break;
    }
  }

  let submitAction: 'resetPassword' | 'resendEmail' = 'resetPassword';
  return (
    <MessageLayout
      title="Account Assistance"
      message="Please provide the email used during sign up to request help. If you do not receive an email, please check the spam folder or ensure it is typed correctly."
    >
      <Formik
        initialValues={{ email: '' }}
        validationSchema={Yup.object().shape({
          email: Yup.string().required('Email is required').email('Email is invalid'),
        })}
        onSubmit={(values, { setSubmitting }) => {
          switch (submitAction) {
            case 'resetPassword':
              handleHelp(values.email, 'resetPassword');
              break;
            case 'resendEmail':
              handleHelp(values.email, 'resendEmail');
              break;
          }
        }}
      >
        {({ handleSubmit }) => (
          <Form className="flex flex-col space-y-2 w-1/2">
            <Field
              name="email"
            >
              {({
                field,
                meta,
              }: FieldProps) => (
                <input
                  type="text"
                  className={`w-full outline outline-1 outline-gray-400 rounded shadow-inner focus:shadow-box-sm px-2 py-1 ${meta.touched ? meta.error ? 'outline-red-700 focus:shadow-red-700' : 'outline-green-600 focus:shadow-green-600' : 'outline-gray-400 focus:shadow-primary_light focus:outline-primary_light'}`}
                  placeholder="Email"
                  autoComplete="email"
                  {...field}
                />
              )}
            </Field>
            <button type="button" className="bg-secondary text-white px-4 py-2 rounded" onClick={() => { submitAction = 'resetPassword'; handleSubmit() }}>
              Reset Password
            </button>
            <button type="button" className="bg-secondary text-white px-4 py-2 rounded" onClick={() => { submitAction = 'resendEmail'; handleSubmit() }}>
              Resend Verification Email
            </button>
          </Form>
        )}
      </Formik>
      {
        successMessage && (
          <p className="">
            If there is an account associated with that email, the requested link has been sent. Please check
            your email for further instructions.
          </p>
        )
      }
    </MessageLayout >
  );
}

export default ForgetPass;
