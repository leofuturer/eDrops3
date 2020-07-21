import React from 'react';
import {NavLink} from  'react-router-dom';
import { withRouter } from 'react-router';
import './allItems.css';
import ItemCard from "./itemCard.jsx";

const productIds = [
    'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzQ1OTU3Njc0NDM0OTA=', //EWOD control system
    'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzQ1OTU3NjgwOTg4NTA=', // test board
    'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzM3NjY5NjA3MTc4NTg=', // manufacturing service
]
class AllItems extends React.Component{
    constructor(props){
        super(props);  
        let _this = this;
        this.state = {
            products: []
        }        
    }

    componentDidMount(){
        let _this = this;
        this.props.shopifyClient.product.fetchMultiple(productIds)
        .then((res) => {
            _this.setState({
                products: res
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
                {
                    this.state.products.map((product, index) =>
                        <ItemCard product={product} key={product.id} id={product.id}/>
                    )
                }
                </div>
            
            </div>
           
        );
    }
};

AllItems = withRouter(AllItems);
export default AllItems;
