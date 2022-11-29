import React from 'react';
import { withRouter } from 'react-router';
import './allItems.css';
import ItemCard from './itemCard.jsx';
import { returnAllItems } from '../../api/serverConfig';
import API from '../../api/api';
import SEO from '../../component/header/seo.js';
import { metadata } from './metadata.jsx';

class AllItems extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchedProducts: false,
      products: [],
    };
  }

  componentDidMount() {
    const _this = this;
    API.Request(returnAllItems, 'GET', {}, false)
      .then((res) => {
        if (res.data) {
          _this.setState({
            products: res.data,
            fetchedProducts: true,
          });
        }
      }).catch((err) => console.log(err));
  }

  render() {
    return (
      <div className="all-items">
        <SEO
          title="eDrops | Products"
          description=""
          metadata={metadata}
        />
        <h3>Products</h3>
        <div className="border-h3" />
        <div className="all-products">
          {this.state.fetchedProducts
            ? this.state.products.map((product, index) => <ItemCard product={product} key={product.id} id={product.id} />)
            : <img className="loading-GIF" src="/img/loading80px.gif" alt="" />}
        </div>
      </div>
    );
  }
}

AllItems = withRouter(AllItems);
export default AllItems;
