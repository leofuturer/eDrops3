import React from 'react';
import { NavLink } from 'react-router-dom';
import Cookies from 'js-cookie';
import './home.css';
import IMG_2943 from '../../../static/img/IMG_2943.jpg';
import IMG_2941 from '../../../static/img/IMG_2941.jpg';
import IMG_2936 from '../../../static/img/IMG_2936.jpg';
import { controlSysId } from '../../constants';
import SEO from '../../component/header/seo.jsx';
import { metadata } from './metadata.jsx';

class Home extends React.Component {
  render() {
    const controlSysPageLink = `/product?id=${controlSysId}`;
    return (
      <div>
        <SEO title="eDrops | Home"
              description="" 
              metadata={ metadata }/>
        <div className="clearfix objectImg">
          <div className="col-md-4 cadImg">
            <div className="txt">
              <h1>EWOD<br/>CAD</h1>
              <div className="txt-bg">
                SEE IN ACTION
              </div>
            </div>
          </div>
          <div className="col-md-4 foundryImg">
            <div className="txt">
              <h1>Foundry<br/>Service</h1>
              <div className="txt-bg">
                {
                  Cookies.get('userType') === 'customer'
                    ? <NavLink to="/upload">UPLOAD MASK FILE</NavLink>
                    : <NavLink to="/login">UPLOAD MASK FILE</NavLink>
                }
              </div>
            </div>
          </div>
          <div className="col-md-4 ewodImg">
            <div className="txt">
              <h1>EWOD Control<br/>System</h1>
              <div className="txt-bg">
                <NavLink to={controlSysPageLink}>VIEW DETAILS</NavLink>
              </div>
            </div>
          </div>
        </div>

        <div className="container-content">
          <div className="title-div">
            <NavLink to="/allItems"><h1>Products</h1></NavLink>
            <div className="hr-line" />
          </div>
          <div className="content-icon clearfix">
            <div className="icon-div">
              <figure className="figure-img">
                <a href="">
                  <img src={IMG_2943} alt="" />
                </a>
                <h4>EWOD Control System</h4>
              </figure>
            </div>
            <div className="icon-div icon-center">
              <figure className="figure-img">
                <a href="">
                  <img src={IMG_2941} alt="" />
                </a>
                <h4>EWOD Chip v1</h4>
              </figure>
            </div>
            <div className="icon-div">
              <figure className="figure-img">
                <a href="">
                  <img src={IMG_2936} alt="" />
                </a>
                <h4>EWOD Chip v2</h4>
              </figure>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
