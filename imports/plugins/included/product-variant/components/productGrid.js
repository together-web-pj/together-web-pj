import React, { Component } from "react";
import PropTypes from "prop-types";
import { Translation } from "@reactioncommerce/reaction-ui";
import ProductGridItemsContainer from "../containers/productGridItemsContainer";
import { DragDropProvider } from "/imports/plugins/core/ui/client/providers";
import { Reaction} from "/client/api";
import { Shops} from "/lib/collections";
import { handleAddProduct } from "/imports/plugins/core/dashboard/client/containers/toolbarContainer"

class ProductGrid extends Component {
  static propTypes = {
    products: PropTypes.array
  }
  handleAdd = (event) => {

    console.log("Add product>>>>");
    const shopid = Reaction.getShopId();
    const shop = Shops.findOne({_id:shopid});
    console.log(shopid);
    const hasOwner =  Roles.userIsInRole( Meteor.userId(),"createProduct", shopid);
    if(hasOwner){
        //Reaction.Router.go("/reaction/wizard/wizardAddProduct");
	    handleAddProduct();
    }
  }
  hasPermission(permissions){
     let userId = Meteor.userId();
     const shopId = Reaction.getShopId();
     return Reaction.hasPermission(permissions, userId, shopId);
  }
  renderAddProduct()
  {
	if(this.hasPermission(["createProduct","owner"])) {
    return  ( 
		<li className="product-grid-item">
          <a className="product-grid-item-images" data-event-action="add-product">
            <div className="product-primary-images">
              <div className="prodcut-grid-overlay"></div>
                <div className="rui badge-container" onClick={this.handleAdd}>
                  <i className="fa fa-plus fa-5x" style={{ textAlign:"center" }}><h3>Add New Product</h3></i>
                </div>
              </div>
          </a>
        </li>
		);
	}
  }
  renderProductGridItems = (products) => {
    if (Array.isArray(products)) {
      return products.map((product, index) => {
        return (
          <ProductGridItemsContainer
            {...this.props}
            product={product} key={index} index={index}
          />
        );
      });
    }
	if(this.hasPermission(["createProduct","owner"])){
	}
	else{
    return (
      <div className="row">
        <div className="text-center">
          <h3>
            <Translation defaultValue="No Products Found" i18nKey="app.noProductsFound" />
          </h3>
        </div>
      </div>
    );
   }
  }

  render() {
    return (
      <div className="container-main">
        <div className="product-grid">
          <DragDropProvider>
            <ul className="product-grid-list list-unstyled" id="product-grid-list">
              {this.renderProductGridItems(this.props.products)}
              {this.renderAddProduct()}
            </ul>
          </DragDropProvider>
        </div>
      </div>
    );
  }
}

export default ProductGrid;
