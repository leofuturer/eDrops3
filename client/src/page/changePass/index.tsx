import { Form, Formik } from 'formik';
import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import API from '../../api/lib/api';
import { AdminChangePass, customerChangePass, FoundryWorkerChangePass } from '../../api/lib/serverConfig';
import FormGroup from '../../component/form/FormGroup';
import ManageRightLayout from '../../component/layout/ManageRightLayout';
import Loading from '../../component/ui/Loading';
import { ChangePasswordSchema } from '../../schemas';

function ChangePassword() {
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
          <FormGroup name="oldPassword" type="password" required />
          <FormGroup name="newPassword" type="password" required />
          <FormGroup name="confirmNewPassword" type="password" required />
          {isLoading
            ? <Loading />
            : (
              <button
                type="submit"
                className="bg-green-500 text-white rounded-lg px-4 py-2"
              >
                Save
              </button>
            )}
        </Form>
      </Formik>
    </ManageRightLayout>
  );
}
export default ChangePassword;
