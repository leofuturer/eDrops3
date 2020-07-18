import React from 'react';

class FooterPage extends React.Component {
    render(){
        return(
            <footer className="footer-top-level">
                <div>
                    <div className="top-title">
                        <h3 className="edrop-txt">EDrop</h3>
                        <p className="i-p">
                            <i className="fa fa-twitter"></i>
                            <i className="fa fa-facebook"></i>
                            <i className="fa fa-youtube"></i>
                        </p>
                        <p>
                            &copy; EDrop 2018-2020
                        </p>
                    </div>
                    <div className="top-title">
                        <h3 className="other-txt">Contact</h3>
                        <div>
                            <div>Phone: +1 234-567-8999</div>
                            <div>Email: edropwebsite@gmail.com</div>
                        </div>
                        <div style={{marginTop:'15px'}}>
                            <div>1234 New Hampshire Avenue</div>
                            <div> Washington, DC 20037, United States</div>
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
                            <span className="left-inline">EWOD Control System</span>
                            <img className="right-inline" 
                                src="../../../static/img/IMG_2943.jpg" 
                                alt="" width="30" height="30"/>
                        </p>
                        <p className="pic-div">
                            <span className="left-inline">EWOD Chip v1</span>
                            <img className="right-inline" 
                                src="../../../static/img/IMG_2943.jpg" 
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