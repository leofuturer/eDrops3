import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../../api/api';

function UpdateAddress() {
  const [street, setStreet] = useState('');
  const [streetLine2, setStreetLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [zipCode, setZipCode] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  const [cookies] = useCookies(['userId'])

  useEffect(() => {
    const { addressInfo } = location.state;
    setStreet(addressInfo.street);
    setStreetLine2(addressInfo.streetLine2);
    setCity(addressInfo.city);
    setState(addressInfo.state);
    setCountry(addressInfo.country);
    setZipCode(addressInfo.zipCode);
  }, []);

  function handleUpdateAddress() {
    const { addressId } = location.state;
    const addressMes = {
      street: street,
      streetLine2: streetLine2,
      city: city,
      state: state,
      country: country,
      zipCode: zipCode,
    };
    const url = `customerAddresses.replace('id', cookies.userId)/${addressId}`;
    API.Request(url, 'PATCH', addressMes, true)
      .then((res) => {
        navigate('/manage/address');
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full border-b-2 border-primary_light flex justify-center py-8">
        <h2 className="text-2xl">Update Address</h2>
      </div>
      <div className="w-full py-8">
        <form action="">
          <div className="form-group">
            <label className="col-md-4 col-sm-4 col-xs-4 control-label">
              <span>Street</span>
            </label>
            <div className="col-md-8 col-sm-8 col-xs-8">
              <input
                type="text"
                value={street}
                className="form-control"
                onChange={(v) => this.handleChange('street', v.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-4 col-sm-4 col-xs-4 control-label">
              <span>Street Line 2</span>
            </label>
            <div className="col-md-8 col-sm-8 col-xs-8">
              <input
                type="text"
                value={streetLine2}
                className="form-control"
                onChange={(v) => this.handleChange('streetLine2', v.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-4 col-sm-4 col-xs-4 control-label">
              <span>City</span>
            </label>
            <div className="col-md-8 col-sm-8 col-xs-8">
              <input
                type="text"
                value={city}
                className="form-control"
                onChange={(v) => this.handleChange('city', v.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-4 col-sm-4 col-xs-4 control-label">
              <span>State</span>
            </label>
            <div className="col-md-8 col-sm-8 col-xs-8">
              <input
                type="text"
                value={state}
                className="form-control"
                onChange={(v) => this.handleChange('state', v.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-4 col-sm-4 col-xs-4 control-label">
              <span>Zip Code</span>
            </label>
            <div className="col-md-8 col-sm-8 col-xs-8">
              <input
                type="text"
                value={zipCode}
                className="form-control"
                onChange={(v) => this.handleChange('zipCode', v.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-4 col-sm-4 col-xs-4 control-label">
              <span>Country</span>
            </label>
            <div className="col-md-8 col-sm-8 col-xs-8">
              <input
                type="text"
                value={country}
                className="form-control"
                onChange={(v) => this.handleChange('country', v.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <div className="col-md-10 col-sd-10 col-xs-10" />
            <div className="btn-group col-md-2 col-sd-2 col-xs-2 text-right" role="group" aria-label="...">
              <button type="button" className="btn btn-success" onClick={handleUpdateAddress}>Update Address</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateAddress;
