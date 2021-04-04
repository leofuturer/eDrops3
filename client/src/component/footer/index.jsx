import React from 'react';
import IMG_2943 from "../../../static/img/IMG_2943.jpg";
import IMG_2941 from "../../../static/img/IMG_2941.jpg";
import {controlSysId, univEwodChipId} from "../../constants";
import { NavLink } from  'react-router-dom';

class FooterPage extends React.Component {
    render(){
        let controlSysPageLink = `/product?id=${controlSysId}`;
        let ewodChipPageLink = `/product?id=${univEwodChipId}`;
        return(
            <footer className="footer-top-level">
                <div className="hr-div-login"></div>
                <div>
                    <div className="top-title">
                        <h3 className="edrop-txt">EDrop</h3>
                        <p className="i-p">
                            {/* <i className="fa fa-twitter"></i> */}
                            {/* <i className="fa fa-facebook"></i> */}
                            {/* <i className="fa fa-youtube"></i> */}
                        </p>
                        <p>
                            &copy; EDrop 2018-2021
                        </p>
                    </div>
                    <div className="top-title">
                        <h3 className="other-txt">Contact</h3>
                        <div>
                            <div>Phone: +1 234-567-8999</div>
                            <div>Email: edropwebsite@gmail.com</div>
                        </div>
                        <div style={{marginTop:'15px'}}>
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
                        <p className="pic-div">
                            <NavLink to={controlSysPageLink}>EWOD Control System</NavLink>
                            <img className="right-inline" 
                                src={IMG_2943}
                                alt="" width="30" height="30"/>
                        </p>
                        <p className="pic-div">
                            <NavLink to={ewodChipPageLink}>Universal EWOD Chip</NavLink>
                            <img className="right-inline" 
                                src={IMG_2941} 
                                alt="" width="30" height="30"/>
                        </p>
                    </div>
                </div>
                <div className="footer-bottom"></div>
            </footer>
        );
    }
}

export default FooterPage;
