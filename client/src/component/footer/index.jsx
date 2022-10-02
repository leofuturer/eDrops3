import React from 'react';
import { NavLink } from 'react-router-dom';
import IMG_2943 from '../../../static/img/IMG_2943.jpg';
import IMG_2941 from '../../../static/img/IMG_2941.jpg';
import pcb_chip from '../../../static/img/pcb_chip.jpg'
import { controlSysId, pcbChipId, univEwodChipId } from '../../constants';
import eDropsLogo from "../../../static/img/edrop_logo.png";

class FooterPage extends React.Component {
  render() {
    const controlSysPageLink = `/product?id=${controlSysId}`;
    const pcbChipPageLink = `/product?id=${pcbChipId}`;
    return (
      <footer className="footer-top-level">
        <div className="hr-div-login" />
        <div>
          <div className="top-title">
            <div>
              <img className="website-footer-logo" src={eDropsLogo} alt="" />
            </div>
            <h3 className="edrop-txt">eDrops</h3>
            {/* <p className="i-p"> */}
              {/* <i className="fa fa-twitter"></i> */}
              {/* <i className="fa fa-facebook"></i> */}
              {/* <i className="fa fa-youtube"></i> */}
            {/* </p> */}
            <p>
              &copy; eDrops 2018-2022
            </p>
          </div>
          <div className="top-title">
            <h3 className="other-txt">Contact</h3>
            <div>
              {/* <div>Phone: +1 234-567-8999</div> */}
              <a href="mailto:service@edrops.org">Email: service@edrops.org</a>
            </div>
            <div style={{ marginTop: '15px' }}>
              <div>420 Westwood Plaza</div>
              <div>Los Angeles, CA 90095</div>
              <div>United States</div>
            </div>
          </div>
          <div className="top-title">
            <h3 className="other-txt">About Us</h3>
            <p className="about-p">
              This is a portal site for displaying the general idea
              of the EWOD cybermanufacturing ecosystem, which is
              still under construction. We're working hard in
              building the fully-functional site that can help
              expanding the field of digital microfluidics.
            </p>
          </div>
          <div className="top-title">
            <h3 className="other-txt">Featured Products</h3>
            <NavLink to={controlSysPageLink} className="pic-div">
              <p>Digital Microfluidics Control System</p>
              <img
                className="right-inline"
                src={IMG_2943}
                alt=""
                width="30"
                height="30"
              />
            </NavLink>
            <NavLink to={pcbChipPageLink} className="pic-div">
              <p>PCB-based Digital Microfluidics Chip</p>
              <img
                className="right-inline"
                src={pcb_chip}
                alt=""
                width="30"
                height="30"
              />
            </NavLink>
          </div>
        </div>
        <div className="footer-bottom" />
      </footer>
    );
  }
}

export default FooterPage;