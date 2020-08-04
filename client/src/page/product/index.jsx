import React from 'react';
import { withRouter } from 'react-router-dom';
import './product.css'
import { chipFabId } from "../../productId";
import Cookie from 'js-cookie';

class Product extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            fetchedProduct: false,
            product: undefined,
        }
    }

    componentDidMount(){
        console.log(chipFabId);
        if(this.props.location.search === ""){
            this.props.history.push('/allItems'); //redirect if no ID provided
            return;
        }
        let _this = this;
        let productId = this.props.location.search.slice(4); // ?id=<id>
        this.props.shopifyClient.product.fetch(productId)
        .then((product) => {
            console.log(product);
            _this.setState({
                product: product,
                fetchedProduct: true,
                fileName: undefined,
                fileId: undefined
            });
        })
        .catch((err) => {
            console.log(err);
            //redirect to all items page if product ID is invalid
            this.props.history.push('/allItems'); 
        });
    }

    render(){
        if(this.state.fetchedProduct){
            var description = this.state.product.descriptionHtml;
        }
        const product = this.state.product;
        const desiredProductId = this.props.location.search.slice(4);
        return (
            <div className="order-container">
                <div className="shop-main-content">
                    { this.state.fetchedProduct
                    ? <div>
                        <div className="shop-left-content">
                            <div className="div-img">
                                <img src={this.state.product.variants[0].image.src}/>
                            </div>
                            { desiredProductId === chipFabId
                                ? <div className="shop-material">
                                    <h2>Process</h2>
                                    <div className="col-sm-3 col-md-3 col-lg-3" id="shop-left-align">
                                        <ul id="myTab" className="nav nav-pills nav-stacked">
                                            abcdefg
                                        </ul>
                                    </div>
                                    <div className="col-sm-9 col-md-9 col-lg-9">
                                        <div className="tab-content">
                                            <div>
                                                ITO glass is good substrate choice for optical applications. The ITO layer has 
                                                thickness of 200 nm. The glass is soda-lime glass with thickness of 0.7 nm. The 
                                                whole substrate is 4 inches in diameter.
                                            </div>
                                            <div >
                                                Paper is good substrate choice for optical applications. The ITO layer has a 
                                                thickness of 200 nm. The glass is soda-lime glass with thickness of 0.7 nm. The 
                                                whole substrate is 4 inches in diameter.
                                            </div>
                                            <div>
                                                PCB has thickness of 200 nm, which enables multiple layers of patterns. The 
                                                whole substrate is 4 inches in diameter.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                : null
                            } 
                        </div>
                        <div className="shop-right-content">
                            <div><h2>{product.title}</h2></div>
                            <div className="product-description" 
                                dangerouslySetInnerHTML={{__html: product.descriptionHtml}}>
                            </div>                       
                            { desiredProductId === chipFabId
                                ? <div className="chip-config">
                                    <h3>Item Options</h3>
                                    <div className="div-filename">{'File to be fabricated: '}
                                    file.txt
                                    </div>
                                    <div className="config-process">
                                        Process: hello
                                    </div>
                                    <div className="config-items">
                                        <input type="checkbox" />
                                        <span className="option-detail">With Cover Plate Assembled</span>
                                    </div>
                                </div>
                                : null
                            }
                            
                            <div className="div-price-quantity">
                                <div className="div-product-price">
                                    Price: ${product.variants[0].price}
                                </div>
                                <div className="div-product-quantity">
                                    Quantity:&nbsp; 
                                    <input type="number" className="input-quantity"/>
                                </div> 
                            </div>
                            <div className="cart-btn">
                                    <input type="button" value="Add to Cart" className="btn btn-primary btn-lg btn-block"></input>
                            </div>
                            <div className="tax-info">Note: Price excludes sales tax</div>                           

                        </div>
                    </div>
                    : <img className="loading-GIF" src="../../../static/img/loading80px.gif" alt=""/>
                }           
                </div>
            </div>
        );
    }
};

Product = withRouter(Product);
export default Product;
