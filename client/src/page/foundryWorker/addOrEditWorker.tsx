import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../../api/lib/api';
import {
  addFoundryWorker, editFoundryWorker
} from '../../api/lib/serverConfig';
import FormGroup from '../../component/form/FormGroup';
import ManageRightLayout from '../../component/layout/ManageRightLayout';
import { WorkerSchema } from '../../schemas';
import { AddressSchema } from '../../schemas/shopify';
import { Address, Worker } from '../../types';

function AddOrEditWorker() {
  const [initialInfo, setInitialInfo] = useState<Partial<Worker & Address>>({
    street: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    country: '',
    state: '',
    city: '',
    zipCode: '',
    username: '',
    email: '',
    affiliation: '',
  });

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(location)
    if (location.pathname === '/manage/foundryworkers/editworker') {
      const { workerInfo } = location.state;
      setInitialInfo({
        street: workerInfo.street,
        firstName: workerInfo.firstName,
        lastName: workerInfo.lastName,
        phoneNumber: workerInfo.phoneNumber,
        country: workerInfo.country,
        state: workerInfo.state,
        city: workerInfo.city,
        zipCode: workerInfo.zipCode,
        username: workerInfo.username,
        email: workerInfo.email,
        affiliation: workerInfo.affiliation,
      });
    }
  }, []);

  function handleSave(worker: Partial<Worker & Address>) {
    const data = {
      street: worker.street,
      firstName: worker.firstName,
      lastName: worker.lastName,
      phoneNumber: worker.phoneNumber,
      country: worker.country,
      state: worker.state,
      city: worker.city,
      zipCode: worker.zipCode,
      userType: 'worker',
      username: worker.username,
      email: worker.email,
      affiliation: worker.affiliation,
    };
    if (location.pathname === '/manage/foundryworkers/addfoundryworker') {
      API.Request(addFoundryWorker, 'POST', data, true)
        .then((res) => {
          navigate('/manage/foundryworkers');
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      const { workerId } = location.state;
      // console.log(workerId);
      API.Request(editFoundryWorker.replace('id', workerId), 'PATCH', data, true)
        .then((res) => {
          navigate('/manage/foundryworkers');
        })
        // .then((res) => {
        //   url = `${userBaseFind}?filter={"where": {"email": "${data.email}"}}`;
        //   API.Request(url, 'GET', {}, true)
        //     .then((res) => {
        //       // console.log(res.data[0]);
        //       const userBaseId = res.data[0].id;
        //       url = updateUserBaseProfile.replace('id', userBaseId);
        //       API.Request(url, 'PATCH', data, true)
        //         .then((res) => {
        //           _this.props.history.push('/manage/foundryworkers');
        //         })
        //         .catch((err) => {
        //           console.error(err);
        //         });
        //     })
        //     .catch((err) => {
        //       console.error(err);
        //     });
        // })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  return (
    <ManageRightLayout title={
      location.pathname === '/manage/foundryworkers/editworker' ? 'Edit Foundry Worker Profile' : 'Add New Foundry Worker'
    }>
      <Formik
        initialValues={initialInfo}
        enableReinitialize={true}
        validationSchema={WorkerSchema.concat(AddressSchema)}
        onSubmit={handleSave}
      >

        <Form className="flex flex-col space-y-2">
          <small className="">Fields with * are required</small>
          <FormGroup name="email" type="email" required autoComplete="email"/>
          <FormGroup name="username" type="text" required autoComplete="username"/>
          {location.pathname === '/manage/foundryworkers/addfoundryworker' && (
            <>
              <FormGroup name="password" type="password" required autoComplete="new-password"/>
              <FormGroup name="confirmPassword" type="password" required autoComplete="new-password"/>
            </>
          )}
          <FormGroup name="firstName" type="text" required autoComplete="given-name"/>
          <FormGroup name="lastName" type="text" required autoComplete="family-name"/>
          <FormGroup name="phoneNumber" type="text" required autoComplete="tel-national"/>
          <FormGroup name="affiliation" type="text" required autoComplete="organization" />
          <FormGroup name="street" type="text" required autoComplete="address-line1"/>
          <FormGroup name="city" type="text" required autoComplete="address-level2"/>
          <FormGroup name="state" displayName="State or Province" type="text" required autoComplete="address-level1"/>
          <FormGroup name="zipCode" displayName="Zip or Postal Code" type="text" required autoComplete="postal-code"/>
          <FormGroup name="country" type="text" required autoComplete="country-name"/>
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg w-max">Save</button>
        </Form>
      </Formik>
    </ManageRightLayout >
  );
}

export default AddOrEditWorker;
