import { Form, Formik } from 'formik';
import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { request } from '../../../api';
import { userChangePass } from '../../../api';
import FormGroup from '../../../component/form/FormGroup';
import ManageRightLayout from '../../../component/layout/ManageRightLayout';
import Loading from '../../../component/ui/Loading';
import { ChangePasswordSchema } from '../../../schemas';

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
    const data = {
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
    };
    // check if errors is empty
    request(userChangePass, 'POST', data, true)
      // .then((res) => {
      //   const userToken = Cookies.get('access_token');
      //   Cookies.remove('access_token');
      //   request(userChangePass, 'POST', data, true)
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
