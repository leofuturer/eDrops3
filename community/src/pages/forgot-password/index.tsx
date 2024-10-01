import { Field, FieldProps, Form, Formik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import { api } from '@edroplets/api';


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

export function ForgotPassword() {
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
                  className={`w-full outline outline-1 outline-gray-400 rounded shadow-inner focus:shadow-box-sm px-2 py-1 ${meta.touched ? meta.error ? 'outline-blue-700 focus:shadow-blue-700' : 'outline-green-600 focus:shadow-green-600' : 'outline-gray-400 focus:shadow-primary_light focus:outline-primary_light'}`}
                  placeholder="Email"
                  autoComplete="email"
                  {...field}
                />
              )}
            </Field>
            <button type="button" className="w-full h-16 bg-primary text-white text-lg rounded-md mt-8" onClick={() => { submitAction = HelpType.ResetPassword; handleSubmit() }}>
              Reset Password
            </button>
            <button type="button" className="w-full h-16 bg-primary text-white text-lg rounded-md mt-8" onClick={() => { submitAction = HelpType.ResendEmail; handleSubmit() }}>
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

export default ForgotPassword;