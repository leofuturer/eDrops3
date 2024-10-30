import { api } from '@edroplets/api';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { SignupInfo } from "../lib/types";
import { FormInput } from '@/components/ui/FormInput';
import {
  DTO, User
} from '@edroplets/api';
import { UserSchema, UserSubmitSchema } from '@edroplets/schemas';
import {
  Form,
  Formik
} from 'formik';
import { ValidationError } from 'yup';

export function Signup() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<string[] | null>(null);

  const [initialInfo, setInitialInfo] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleRegister = (userData: DTO<User>) => {
    api.user.create(userData)
      .then((res) => {
        // console.log(res);
        navigate('/check-email');
      })
      .catch((err: Error & { [key: string]: string[] }) => {
        if (err.message) {
          setErrors([err.message]);
        } else {
          const allErrors = [];
          for (const key in err) {
            allErrors.push(...err[key]);
          }
          setErrors(allErrors);
        }
      });
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center px-8">
      <div className="flex flex-col items-center sm:border-2 sm:shadow-xl rounded-md pt-4 pb-10 px-4 w-full sm:w-2/3">
        <div className="max-w-xs">
          <img src="/img/edroplets-banner.png" alt="eDroplets Logo" className="" />
        </div>
        <Formik
          validationSchema={UserSchema}
          initialValues={initialInfo}
          onSubmit={(values, actions) => UserSubmitSchema.validate(values, { abortEarly: false }).then(() => {
					  const { confirmPassword, ...userData } = values;
					  handleRegister(userData);
          }).catch((err: ValidationError) => {
					  const errors = err.inner.reduce((acc: object, curr: ValidationError) => ({
              ...acc,
              [curr.path as string]: curr.message,
            }), {});
					  actions.setErrors(errors);
          })}
        >
          <Form className="flex flex-col items-center justify-center space-y-4 w-full md:w-2/3">
            <FormInput name="email" displayName="Email" autoComplete="email" />
            <FormInput name="username" displayName="Username" autoComplete="username" />
            <FormInput name="password" displayName="Password" type="password" autoComplete="new-password" />
            <FormInput name="confirmPassword" displayName="Confirm Password" type="password" autoComplete="new-password" />
            <button type="submit" className="w-full h-16 bg-primary text-white text-lg rounded-md mt-8">Sign Up</button>
          </Form>
        </Formik>
      </div>
    </div>
  );
}

export default Signup;
