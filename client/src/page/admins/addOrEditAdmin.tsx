import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { addAdmin, request, updateAdminProfile, updateUserBaseProfile, userBaseFind } from '../../api';
import FormGroup from '../../component/form/FormGroup';
import ManageRightLayout from '../../component/layout/ManageRightLayout';
import { AdminEditSchema, AdminSchema } from '../../schemas';
import { Admin, Signup } from '../../types';
import { formatPhoneNumber } from '../../utils/phone';

function AddOrEditAdmin() {
  const [initialInfo, setInitialInfo] = useState<Partial<Admin>>({
    phoneNumber: '',
    realm: '',
    username: '',
    email: '',
  });

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/manage/admins/editAdmin') {
      const { adminInfo: admin } = location.state;
      setInitialInfo({
        phoneNumber: admin.phoneNumber,
        realm: admin.realm,
        username: admin.username,
        email: admin.email,
      });
    }
  }, []);

  function handleSave(admin: Partial<Signup<Admin>>) {
    const userMes = {
      phoneNumber: formatPhoneNumber(admin.phoneNumber),
      realm: admin.realm,
      username: admin.username,
      email: admin.email,
    };
    if (location.pathname === '/manage/admins/editAdmin') {
      const { adminId } = location.state;
      request(updateAdminProfile.replace('id', adminId), 'PATCH', userMes, true)
        .then((res) =>
          request(`${userBaseFind}?filter={"where": {"email": "${userMes.email}"}}`, 'GET', {}, true))
        .then((res) =>
          request(updateUserBaseProfile.replace('id', res.data[0].id), 'PATCH', userMes, true))
        .then((res) => {
          navigate('/manage/admins');
        })
        .catch((err) => {
          console.error(err);
        });
    } else { // add new admin
      request(addAdmin, 'POST', {
        ...userMes,
        password: admin.password,
        confirmPassword: admin.confirmPassword,
        userType: 'admin',
      }, true).then((res) => {
        navigate('/manage/admins');
      }).catch((error) => {
        console.error(error);
      });
    }
  }

  return (
    <ManageRightLayout title={
      location.pathname === '/manage/admins/editAdmin' ? 'Edit Admin Info' : 'Add New Admin'}>
      <Formik
        initialValues={initialInfo}
        enableReinitialize={true}
        onSubmit={handleSave}
        validationSchema={location.pathname === '/manage/admins/editAdmin' ? AdminEditSchema : AdminSchema}
      >
        <Form className="flex flex-col space-y-2">
          <small className="">Fields with * are required</small>
          <FormGroup name="phoneNumber" type="text" required autoComplete="tel-national" />
          <FormGroup name="realm" type="text" />
          <FormGroup name="username" type="text" required autoComplete="username" />
          <FormGroup name="email" type="email" required autoComplete="email" />
          {location.pathname === '/manage/admins/addNewAdmin' && (
            <>
              <FormGroup name="password" type="password" required autoComplete="new-password" />
              <FormGroup name="confirmPassword" type="password" required autoComplete="new-password" />
            </>
          )}
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded-lg w-max"
          >
            Save
          </button>
        </Form>
      </Formik>
    </ManageRightLayout >
  );
}

export default AddOrEditAdmin;
