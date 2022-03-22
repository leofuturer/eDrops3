import React from 'react';

import NavTop from 'component/nav-top/index.jsx';
import Footer from 'component/footer/index.jsx';
// import { CartProvider } from '../../context/CartProvider.jsx'
import CartContext from '../../context/CartContext'

import './index.css';
import SEO from '../header/seo.jsx';
import { metadata } from './metadata.jsx';

class Layout extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      cartItems: 0,
      productItems: 0,
      chipItems: 0,
    };
  }

  render() {
    return (
      <div className="content">
        <SEO title="eDrops"
          description=""
          metadata={metadata} />
        <div className="wrapper">
          <CartContext.Provider
            value = {{
              items: this.state.cartItems,
              setCartQuantity: () => {
                  const quantity = this.state.productItems + this.state.chipItems;
                  this.setState({cartItems: quantity});
              },
              setProductQuantity: (quantity) => {
                this.setState({productItems: quantity})
              },
              setChipQuantity: (quantity) => {
                this.setState({chipItems: quantity})
              }
            }}
          >
            <NavTop />
            {this.props.children}
          </CartContext.Provider>
        </div>
        <Footer />
      </div>
    );
  }
}

export default Layout;
