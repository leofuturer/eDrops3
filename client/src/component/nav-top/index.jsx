import React from 'react';
import {NavLink} from  'react-router-dom';
import Cookies from 'js-cookie';
import Cart from '../../page/shop/cart.jsx'

class NavTop extends React.Component{
    constructor(props){
        super(props);
        this.state= {
            show: false,
            drownH: '130px'
        }
    }
    signout() {
        this.setState({show:false});
        Cookies.remove('username');
        Cookies.remove('userId');
        Cookies.remove('access_token');
        Cookies.remove('userType');
        this.props.history.push('/home') 
    }
    handleHideDrown() {
        this.setState({show:false});
    }
    showDrowpn() {
        if(Cookies.get('userType') != 'customer'){
            this.setState({drownH:'60px'});
        }
        this.setState({show:!this.state.show});
    }
    render() {
        var show= this.state.show ? "block": "none";
        var drownHeight = this.state.drownH;
        var drown = {
            display:show
        }
        var drwonH = {
            height: drownHeight
        }

        // 4/23/2020: both username and email are set for the cookie
        // when login is successful, so only need to check one - DY
        var notLoggedIn = (Cookies.get('username') === undefined);
        return (
            //At this time the className "header-div" has no use
            <header className="header-div">
                <nav className="container-nav">
                    <div className="header-brand">
                        <a href="/home">EDrop</a>
                    </div>
                    <div className="">
                        <ul className="ul-nav">
                            <li><NavLink to="/home" activeClassName="active">Home</NavLink></li>
                            <li><NavLink to="#" activeClassName="active">EWOD CAD</NavLink></li>
                            <li><NavLink to="/project" activeClassName="active">EWOD Control System</NavLink></li>
                            <li><NavLink to="#">Community</NavLink></li>
                            <li><NavLink to="#">Support</NavLink></li>
                            <li>
                                { // 4/23/2020: Only provide link to cart if customer is logged in - DY
                                    notLoggedIn
                                        ? <NavLink to="/login"><i className="fa fa-shopping-cart"></i></NavLink>
                                        : <NavLink to="#"><i className="fa fa-shopping-cart"></i></NavLink> //to be implemented                               
                                }
                            </li>

                            { /* Should we be using NavLink or href? NavLink prevents page reloading */ }
                            <li><a href="#"><i className="fa fa-search"></i></a></li>
                            {
                                Cookies.get('userType') === 'customer'
                                    ? <li><a href="/upload"><i className="fa fa-upload"></i></a></li>
                                    : null
                            }
                            {
                                notLoggedIn ? null
                                    : (Cookies.get('userType') === 'customer'
                                        ? <li><a href="/manage/files"><i className="fa fa-database"></i></a></li>
                                        : (Cookies.get('userType') === 'admin'
                                            ? <li><a href="/manage/allfiles"><i className="fa fa-database"></i></a></li>
                                            : null)
                                    )
                            }
                            {
                                notLoggedIn ? <li><NavLink to="/login">Login</NavLink></li>
                                :
                                    <li className="li-username">
                                        {/* 4/23/2020: Only show username to avoid text that's too long, which will break the CSS */}
                                        <a onClick={()=>this.showDrowpn()}  style={{cursor:'pointer'}}>{Cookies.get('username')}</a>
                                        <div style={drown} className="div-drownup">
                                            <ul className="list-styled" style={drwonH}>
                                                <li onClick={()=>this.handleHideDrown()}>
                                                    <i className="fa fa-dashboard" style={{paddingRight:'15px'}}></i>
                                                    <NavLink to={Cookies.get('userType') === 'customer' ? "/manage/profile" : (Cookies.get('userType') === 'admin'
                                                        ?"/manage/profile" : "/manage/profile")
                                                    }>Your Dashboard</NavLink>
                                                </li>
                                                {
                                                    Cookies.get('userType') == 'customer'
                                                        ?
                                                            <li onClick={()=>this.handleHideDrown()}>
                                                                <i className="fa fa-upload" style={{paddingRight:'15px'}}></i>
                                                                <NavLink to="/upload">Upload a file</NavLink>
                                                            </li>
                                                        :   null
                                                }
                                                {
                                                    Cookies.get('userType') == 'customer'
                                                        ?
                                                            <li onClick={()=>this.handleHideDrown()}>
                                                                <i className="fa fa-database" style={{paddingRight:'15px'}}></i>
                                                                <NavLink to="/manage/files">Your Projects</NavLink>
                                                            </li>
                                                        :   null
                                                }
                                                <li onClick={()=>this.signout()}>
                                                    <i className="fa fa-sign-out" style={{paddingRight:'15px'}}></i>
                                                    {/* Change from NavLink to href to force page redirect
                                                    Otherwise user may stay on sensitive pages */}
                                                    <a href="/home">Logout</a>
                                                </li>
                                            </ul>
                                        </div>
                                    </li>
                            }
                            {
                                notLoggedIn
                                    ? <li><NavLink to="/register">Sign Up</NavLink></li>
                                    : null
                            }
                        </ul>
                    </div>
                </nav>       
            </header>
        );
    }
}

export default NavTop;