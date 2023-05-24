import { Form, Formik } from 'formik';
import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../api';
import FormGroup from '../../../component/form/FormGroup';
import ManageRightLayout from '../../../component/layout/ManageRightLayout';
import Loading from '../../../component/ui/Loading';
import { ChangePasswordSchema } from '../../../schemas';
import { ROUTES } from '@/router/routes';

export function ChangePassword() {
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const [cookies] = useCookies(['userType']);

  function handleChangePass(values: {
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }, { setErrors }: { setErrors: any }) {
    setIsLoading(false);
    // check if errors is empty
    api.user.changePassword(values.oldPassword, values.newPassword)
      .then((res) => {
        alert('Password successfully changed');
        navigate(ROUTES.ManageProfile);
      })
      .catch((error) => {
        console.error(error.response.data.error.message);
        if (error.response.data.error.message === 'Invalid current password') {
          setErrors({ oldPassword: ['The current password is incorrect!'] });
        }
        setIsLoading(false);
      });
  }

  return (
    <ManageRightLayout title="Change Password">
      <Formik
        initialValues={{
          oldPassword: '',
          newPassword: '',
          confirmNewPassword: '',
        }}
        validationSchema={ChangePasswordSchema}
        onSubmit={(values, { setErrors }) => handleChangePass(values, { setErrors })}
      >
        <Form className="flex flex-col space-y-2">
          <FormGroup name="oldPassword" type="password" required autoComplete="current-password"/>
          <FormGroup name="newPassword" type="password" required autoComplete="new-password"/>
          <FormGroup name="confirmNewPassword" type="password" required autoComplete="new-password"/>
          {isLoading
            ? <Loading />
            : (
              <button
                type="submit"
                className="bg-green-500 text-white rounded-lg px-4 py-2 w-max"
              >
                Save
              </button>
            )}
        </Form>
      </Formik>
    </ManageRightLayout>
  );
}
