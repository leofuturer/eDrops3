import React from 'react';
import { Link } from  'react-router-dom';

import './home.css';
import Cookies from "js-cookie";

class Home extends React.Component{
    render(){
        return (
            <div>
                <div className="clearfix objectImg">
                    <div className="col-md-4 cadImg">
                        <div className="txt">
                            <h1>EWOD CAD</h1>
                            <div className="txt-bg">
                                SEE IN ACTION
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 foundryImg">
                        <div className="txt">
                            <h1>Foundry service</h1>
                            <div className="txt-bg">
                                {
                                    Cookies.get('userType') === 'customer'
                                        ? <Link to="/upload">UPLOAD MASK FILE</Link>
                                        : <Link to="/login">UPLOAD MASK FILE</Link>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 ewodImg">
                        <div className="txt">
                            <h1>EWOD control system</h1>
                            <div className="txt-bg">
                                VIEW DETAILS
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container-content">
                    <div className="title-div">
                        <Link to="/allItems"><h1>Products</h1></Link>
                        <div className="hr-line"></div>
                    </div>
                    <div className="content-icon clearfix">
                        <div className="icon-div">
                            <figure className="figure-img">
                                <a href="">
                                    <img src="../../../static/img/IMG_2943.jpg" alt=""/>
                                </a>
                                <h4>EWOD Control System</h4>
                            </figure>
                        </div>
                        <div className="icon-div icon-center">
                            <figure className="figure-img">
                                <a href="">
                                    <img src="../../../static/img/IMG_2941.jpg" alt=""/>
                                </a>
                                <h4>EWOD Chip v1</h4>
                            </figure>
                        </div>
                        <div className="icon-div">
                            <figure className="figure-img">
                                <a href="">
                                    <img src="../../../static/img/IMG_2936.jpg" alt=""/>
                                </a>
                                <h4>EWOD Chip v2</h4>
                            </figure>
                        </div>
                    </div>
                </div>
                {/* <div className="bottom-img-content"></div> */}
            </div>
        );
    }
}

export default Home;