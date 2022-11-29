import React from 'react';
import { NavLink } from 'react-router-dom';
import Cookies from 'js-cookie';
import './home.css';
import { controlSysId, testBoardId, pcbChipId } from '../../constants';
import SEO from '../../component/header/seo.js';
import { metadata } from './metadata';

class Home extends React.Component {
  render() {
    const controlSysPageLink = `/product?id=${controlSysId}`;
    const pcbChipPageLink = `/product?id=${pcbChipId}`;
    const testBoardPageLink = `/product?id=${testBoardId}`;
    return (
      <div>
        <SEO title="eDrops | Home"
          description=""
          metadata={metadata} />
        <div className="clearfix objectImg">
          <div className="col-md-4 cadImg">
            <div className="txt">
              <h1>DMF<br /> CAD</h1>
              <div className="txt-bg">
                <a href="http://cad.edrops.org" target="_blank" rel="noopener noreferrer">
                  DESIGN CHIP
                </a>
              </div>
            </div>
          </div>
          <div className="col-md-4 foundryImg">
            <div className="txt">
              <h1>Foundry<br />Service</h1>
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
              <h1>DMF<br />Control System</h1>
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
              <NavLink to={controlSysPageLink}>
                <figure className="figure-img">
                  <img src="/img/IMG_2943.jpg" alt="" />
                  <h4>Digital Microfluidics Control System</h4>
                </figure>
              </NavLink>
            </div>
            <div className="icon-div icon-center">
              <NavLink to={pcbChipPageLink}>
                <figure className="figure-img">
                  <img src="/img/pcb_chip.jpg" alt="" />
                  <h4>PCB-based Digital Microfluidics Chip</h4>
                </figure>
              </NavLink>
            </div>
            <div className="icon-div">
              <NavLink to={testBoardPageLink}>
                <figure className="figure-img">
                  <img src="/img/control_board.jpg" alt="" />
                  <h4>Control System Inspection Board</h4>
                </figure>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;