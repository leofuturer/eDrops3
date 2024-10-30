import MessageLayout from '@/component/layout/MessageLayout';
import { api } from '@edroplets/api';
import { Field, FieldProps, Form, Formik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';

export function ForgetPass() {
  const [successMessage, setSuccessMessage] = useState(false);

  enum HelpType {
    ResetPassword,
    ResendEmail,
  }

  function handleHelp(email: string, helpType: HelpType) {
    switch (helpType) {
      case HelpType.ResetPassword:
        api.user.forgotPassword(email).catch((err) => {
          if (import.meta.env.DEV) {
            console.error(err); // Maybe take out as attackers can view console & brute force emails
          }
        }).finally(() => {
          // Display a success message either way so attackers can't brute-force customer emails
          setSuccessMessage(true);
        });
        break;
      case HelpType.ResendEmail:
        api.user.verifyEmail(email).catch((err) => {
          if (import.meta.env.DEV) {
            console.error(err); // Maybe take out as attackers can view console & brute force emails
          }
        }).finally(() => {
          // Display a success message either way so attackers can't brute-force customer emails
          setSuccessMessage(true);
        });;
        break;
    }
  }

  let submitAction: HelpType = HelpType.ResetPassword;
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
          handleHelp(values.email, submitAction);
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
            <button type="button" className="bg-secondary text-white px-4 py-2 rounded" onClick={() => { submitAction = HelpType.ResetPassword; handleSubmit() }}>
              Reset Password
            </button>
            <button type="button" className="bg-secondary text-white px-4 py-2 rounded" onClick={() => { submitAction = HelpType.ResendEmail; handleSubmit() }}>
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
