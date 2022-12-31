import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import API from '../../api/lib/api';
import { addCustomer, updateCustomerProfile, updateUserBaseProfile, userBaseFind } from '../../api/lib/serverConfig';
import FormGroup from '../../component/form/FormGroup';
import ManageRightLayout from '../../component/layout/ManageRightLayout';
import { UserSchema, UserSubmitSchema } from '../../schemas';
import { Customer, Signup } from '../../types';

function AddOrEditUser() {
  const [initialInfo, setInitialInfo] = useState<Partial<Signup<Customer>>>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    customerType: 'person',
    username: '',
    email: '',
  });
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/manage/users/edituser') {
      const { customerInfo: customer } = location.state;
      setInitialInfo({
        firstName: customer.firstName,
        lastName: customer.lastName,
        phoneNumber: customer.phoneNumber,
        customerType: customer.userType,
        username: customer.username,
        email: customer.email,
      });
    }
  }, []);

  function handleSave(user: Partial<Signup<Customer>>) {
    const userMes = {
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      username: user.username,
      email: user.email,
    };
    if (location.pathname === '/manage/users/edituser') {
      // edit both customer and userBase instances
      const { customerId } = location.state;
      API.Request(updateCustomerProfile.replace('id', customerId), 'PATCH', userMes, true)
        .then((res) => API.Request(`${userBaseFind}?filter={"where": {"email": "${userMes.email}"}}`, 'GET', {}, true))
        .then((res) => API.Request(updateUserBaseProfile.replace('id', res.data[0].id), 'PATCH', userMes, true))
        .then((res) => navigate('/manage/users'))
        .catch((err) => {
          console.error(err);
        });
    } else { // add new customer
      API.Request(addCustomer, 'POST', {
        ...userMes,
        customerType: 'person',
        password: user.password,
        confirmPassword: user.confirmPassword,
      }, true).then((res) => {
        navigate('/manage/users');
      }).catch((error) => {
        console.error(error);
      });
    }
  }

  return (
    <ManageRightLayout title={
      location.pathname === '/manage/users/edituser' ? 'Edit Customer' : 'Add New User'
    }>
      <Formik
        initialValues={initialInfo}
        enableReinitialize={true}
        validationSchema={UserSchema}
        onSubmit={(values) => UserSubmitSchema.validate(values, { abortEarly: false }).then(() => {
          handleSave({...values}); })
        }>
        <Form className="flex flex-col space-y-2">
          <small className="">Fields with * are required</small>
          <FormGroup name="email" type="email" required autoComplete="email"/>
          <FormGroup name="username" type="text" required autoComplete="username"/>
          {location.pathname === '/manage/users/addNewUser' && (
            <>
              <FormGroup name="password" type="password" required autoComplete="new-password"/>
              <FormGroup name="confirmPassword" type="password" required autoComplete="new-password"/>
            </>
          )}
          <FormGroup name="firstName" type="text" required autoComplete="given-name"/>
          <FormGroup name="lastName" type="text" required autoComplete="family-name"/>
          <FormGroup name="phoneNumber" type="text" required autoComplete="tel-national"/>
          <div className="flex items-center space-x-4">
            <NavLink to="/manage/users" className="bg-primary_light text-white px-4 py-2 w-max rounded-lg">Cancel</NavLink>
            <button type="submit" className="bg-green-500 text-white px-4 py-2 w-max rounded-lg" >Save</button>
          </div>
        </Form>
      </Formik>
    </ManageRightLayout>
  );
}

export default AddOrEditUser;
