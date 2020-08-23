import React from 'react';
import {NavLink} from  'react-router-dom';
import { withRouter } from 'react-router';
import './allItems.css';
import ItemCard from "./itemCard.jsx";
import {productIds} from "../../productId";

class AllItems extends React.Component{
    constructor(props){
        super(props);  
        let _this = this;
        this.state = {
            fetchedProducts: false,
            products: [],
        }        
    }

    componentDidMount(){
        let _this = this;
        this.props.shopifyClient.product.fetchMultiple(productIds)
        .then((res) => {
            _this.setState({
                products: res,
                fetchedProducts: true,
            });
        })
        .catch((err) => {
            console.log(err);
        });   
    }

    render() {
        return (
            <div className="all-items">
                <h3>Products</h3>
                <div className="border-h3"></div>
                <div className="all-products"> 
                    {this.state.fetchedProducts 
                    ? this.state.products.map((product, index) =>
                        <ItemCard product={product} key={product.id} id={product.id}/>)
                    : <img className="loading-GIF" src="../../../static/img/loading80px.gif" alt=""/>
                    }
                </div>
            </div>
        );
    }
};

AllItems = withRouter(AllItems);
export default AllItems;
