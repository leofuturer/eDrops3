import React from 'react';
import { NavLink } from 'react-router-dom';

class ItemCard extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    console.log(this.props.id);
    this.props.history.push(`/product?id=${this.props.id}`);
  }

  render() {
    return (
      <div className="border-md shadow-box p-4 flex flex-col items-center space-y-2">
        <NavLink to={`/product?id=${this.props.id}`} className="text-center w-2/3">
            <h4 className="text-2xl text-primary_light hover:text-primary">{this.props.product.title}</h4>
        </NavLink>
        <NavLink to={`/product?id=${this.props.id}`}>
          <img
            alt={this.props.product.title}
            className="w-full aspect-square pointer-events-none"
            src={this.props.product.variants[0].image.src}
          />
        </NavLink>
        <p className="line-clamp-4 text-lg">
          {this.props.product.description}
        </p>
        <p className="product-price">
          ${this.props.product.variants[0].price}
        </p>
        <NavLink to={`/product?id=${this.props.id}`}>
          <button type="button" className="bg-primary_light text-white px-4 py-2 rounded-md hover:bg-primary">Details</button>
        </NavLink>
      </div>
    );
  }
}

export default ItemCard;
