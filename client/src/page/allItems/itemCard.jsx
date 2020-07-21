import React from 'react';
import './itemCard.css'
import { withRouter } from 'react-router';
import {NavLink} from  'react-router-dom';

class ItemCard extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e){
        console.log(this.props.id);
        this.props.history.push(`/product?id=${this.props.id}`)
    }

    render(){
        return (
            <div className="card" >
                <NavLink to={`/product?id=${this.props.id}`}>
                    <div className="product-title">
                        <h4>{this.props.product.title}</h4>
                    </div>
                </NavLink>

                <NavLink to={`/product?id=${this.props.id}`}>
                    <img className="product-img" 
                        src={this.props.product.variants[0].image.src}/>
                </NavLink>

                <div className="product-text">
                    {this.props.product.description}
                </div>

                <div className="product-price">
                    ${this.props.product.variants[0].price}
                </div>

                <NavLink to={`/product?id=${this.props.id}`}>
                    <button className="btn btn-primary">Details</button>
                </NavLink>
            </div>           
        );
    }
}

ItemCard = withRouter(ItemCard);
export default ItemCard;

            // for(let i = 0; i<products.length; i++){
            //     let product = products[i];
            //     console.log(product.id);
            //     console.log(product.description);
            //     console.log(product.title);
            //     console.log(product.variants[0].image.src);
            //     console.log(product.variants[0].price);
            //     console.log(product.variants[0].id);
            // }