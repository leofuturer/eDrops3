import React from 'react';
import { withRouter } from 'react-router';
import ItemCard from './itemCard';
import { returnAllItems } from '../../api/serverConfig';
import API from '../../api/api';
import SEO from '../../component/header/seo';
import { metadata } from './metadata';

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
      <div className="flex flex-col items-center space-y-10 mb-10">
        <SEO
          title="eDrops | Products"
          description=""
          metadata={metadata}
        />
        <h3 className="border-b-2 border-secondary text-secondary w-[33%] min-w-min text-4xl font-bold text-center py-8">Products</h3>
        <div className="grid grid-cols-3 gap-10 px-[25%]">
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
