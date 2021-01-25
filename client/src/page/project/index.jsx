import React from 'react';
import './project.css';
import IMG_2943 from "../../../static/img/IMG_2943.jpg";
import IMG_2941 from "../../../static/img/IMG_2941.jpg";
import IMG_2936 from "../../../static/img/IMG_2936.jpg";

class Project extends React.Component{
    render(){
        return(
            <div className="project-content">
                <ul id="myTab" className="nav nav-tabs">
                    <li className="active">
                        <a href="#uploads" data-toggle="tab">
                            My Uploads
                        </a>
                    </li>
                    <li>
                        <a href="#designer" data-toggle="tab">
                            My Public Designer
                        </a>
                    </li>
                    <li>
                        <a href="#favorites" data-toggle="tab">
                            Favorites
                        </a>
                    </li>
                    <li>
                        <a href="#ordered" data-toggle="tab">
                            Ordered
                        </a>
                    </li>
                </ul>
                <div className="tab-content tab-margin">
                    <div className="tab-pane fade in active" id="uploads">
                        <div className="content-icon clearfix">
                            <div className="icon-div">
                                <figure className="figure-img">
                                    <a href="">
                                        <img src={IMG_2943} alt=""/>
                                    </a>
                                    <h4>EWOD Control System</h4>
                                </figure>
                            </div>
                            <div className="icon-div icon-center">
                                <figure className="figure-img">
                                    <a href="">
                                        <img src={IMG_2941} alt=""/>
                                    </a>
                                    <h4>EWOD Chip v1</h4>
                                </figure>
                            </div>
                            <div className="icon-div">
                                <figure className="figure-img">
                                    <a href="">
                                        <img src={IMG_2936} alt=""/>
                                    </a>
                                    <h4>EWOD Chip v2</h4>
                                </figure>
                            </div>
                        </div>
                    </div>
                    <div className="tab-pane fade in" id="designer">
                        <div className="content-icon clearfix">
                            <div className="icon-div">
                                <figure className="figure-img">
                                    <a href="">
                                        <img src={IMG_2941} alt=""/>
                                    </a>
                                    <h4>EWOD Control System</h4>
                                </figure>
                            </div>
                            <div className="icon-div icon-center">
                                <figure className="figure-img">
                                    <a href="">
                                        <img src={IMG_2943} alt=""/>
                                    </a>
                                    <h4>EWOD Chip v1</h4>
                                </figure>
                            </div>
                            <div className="icon-div">
                                <figure className="figure-img">
                                    <a href="">
                                        <img src={IMG_2936} alt=""/>
                                    </a>
                                    <h4>EWOD Chip v2</h4>
                                </figure>
                            </div>
                        </div>
                    </div>
                    <div className="tab-pane fade in" id="favorites">
                        <div className="content-icon clearfix">
                            <div className="icon-div">
                                <figure className="figure-img">
                                    <a href="">
                                        <img src={IMG_2941} alt=""/>
                                    </a>
                                    <h4>EWOD Control System</h4>
                                </figure>
                            </div>
                            <div className="icon-div icon-center">
                                <figure className="figure-img">
                                    <a href="">
                                        <img src={IMG_2943} alt=""/>
                                    </a>
                                    <h4>EWOD Chip v1</h4>
                                </figure>
                            </div>
                            <div className="icon-div">
                                <figure className="figure-img">
                                    <a href="">
                                        <img src={IMG_2936} alt=""/>
                                    </a>
                                    <h4>EWOD Chip v2</h4>
                                </figure>
                            </div>
                        </div>
                    </div>
                    <div className="tab-pane fade in" id="ordered">
                        <div className="content-icon clearfix">
                            <div className="icon-div">
                                <figure className="figure-img">
                                    <a href="">
                                        <img src={IMG_2943} alt=""/>
                                    </a>
                                    <h4>EWOD Control System</h4>
                                </figure>
                            </div>
                            <div className="icon-div icon-center">
                                <figure className="figure-img">
                                    <a href="">
                                        <img src={IMG_2941} alt=""/>
                                    </a>
                                    <h4>EWOD Chip v1</h4>
                                </figure>
                            </div>
                            <div className="icon-div">
                                <figure className="figure-img">
                                    <a href="">
                                        <img src={IMG_2936} alt=""/>
                                    </a>
                                    <h4>EWOD Chip v2</h4>
                                </figure>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
};

export default Project;