import FormGroup from '@/component/form/FormGroup';
import { api } from '@edroplets/api';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';

export function AdminProfile({ adminId }: { adminId: string }) {
  const [initialInfo, setInitialInfo] = useState({
    username: '',
    email: '',
    phoneNumber: '',
  });

  useEffect(() => {
    api.admin.get(adminId).then((admin) => {
      setInitialInfo({
        username: admin.user.username,
        email: admin.user.email,
        phoneNumber: admin.phoneNumber as string,
      })
    })
  }, [])

  return (
    <Formik
      initialValues={initialInfo}
      enableReinitialize={true}
      onSubmit={(values) => {
        api.admin.update(adminId, values);
      }}>
      <Form className="flex flex-col space-y-2">
        <FormGroup name="username" />
        <FormGroup name="email" />
        <FormGroup name="phoneNumber" />
        <button type="submit" className="w-max bg-green-600 text-white rounded-md px-4 py-2">Save</button>
      </Form>
    </Formik>
  )
}

export default AdminProfile