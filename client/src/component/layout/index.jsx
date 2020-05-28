import React from 'react';

import NavTop from 'component/nav-top/index.jsx';
import Footer from 'component/footer/index.jsx';

import './index.css';

class Layout extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div className = "content">
                <div className="wrapper">
                    <NavTop/>
                        {this.props.children}
                    
                </div>
                <Footer/>
            </div>
        )
    }
}

export default Layout;