import FormGroup from '@/component/form/FormGroup';
import ManageRightLayout from '@/component/layout/ManageRightLayout';
import { formatPhoneNumber } from '@/lib/phone';
import { ROUTES } from '@/router/routes';
import { Admin, api, DTO, User } from '@edroplets/api';
import { AdminSchema, AdminSubmitSchema } from '@edroplets/schemas';
import { Form, Formik } from 'formik';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ValidationError } from 'yup';

export function AddAdmin() {
  const [initialInfo] = useState<DTO<Admin & User> & {
    confirmPassword: string;
  }>({
    phoneNumber: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();

  function handleAdd(admin: DTO<Admin & User>) {
    api.admin.create(admin).then((res) => {
      navigate(ROUTES.ManageAdmins);
    }).catch((error) => {
      console.error(error);
    });
  }

  return (
    <ManageRightLayout title='Add New Admin'>
      <Formik
        initialValues={initialInfo}
        enableReinitialize={true}
        onSubmit={(values, actions) => {
          AdminSubmitSchema.validate(values, { abortEarly: false }).then(() => {
            handleAdd({ ...values, phoneNumber: formatPhoneNumber(values.phoneNumber as string) });
          }).catch((err: ValidationError) => {
            const errors = err.inner.reduce((acc: object, curr: ValidationError) => {
              return {
                ...acc,
                [curr.path as string]: curr.message,
              };
            }, {});
            actions.setErrors(errors);
          })
        }}
        validationSchema={AdminSchema}
      >
        <Form className="flex flex-col space-y-2">
          <small className="">Fields with * are required</small>
          <FormGroup name="phoneNumber" type="text" required autoComplete="tel-national" />
          <FormGroup name="username" type="text" required autoComplete="username" />
          <FormGroup name="email" type="email" required autoComplete="email" />
          <FormGroup name="password" type="password" required autoComplete="new-password" />
          <FormGroup name="confirmPassword" type="password" required autoComplete="new-password" />
          <div className="flex items-center space-x-4">
            <NavLink to={ROUTES.ManageAdmins} className="bg-primary_light text-white px-4 py-2 w-max rounded-lg">Cancel</NavLink><button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-lg w-max"
            >
              Add
            </button>
          </div>
        </Form>
      </Formik>
    </ManageRightLayout >
  );
}

export default AddAdmin