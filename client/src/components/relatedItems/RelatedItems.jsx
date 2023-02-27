import React, { Component } from 'react';
import SingleCard from './RelatedItemCard.jsx';
import RelatedItemSlider from './RelatedItemSlider.jsx';
import axios from 'axios';

class RelatedItems extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    }
  }

  componentDidMount() {
    axios.get(`/products/${this.props.product.id}/related`)
    .then((response) => {
      this.setState({
        items: response.data
      })
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.product != this.props.product) {
      axios.get(`/products/${this.props.product.id}/related`)
      .then((response) => {
        console.log('response',  response.data);
        this.setState({
          items: response.data
        })
      })
    }
  }

  selectProduct() {
    this.props.selectProduct(this.props.product2);
  }

  render() {
    return (
      <div className='widget'>
        <h4>Related Products</h4>
        <RelatedItemSlider products={this.state.items} curProduct={this.props.product} selectProduct={this.props.selectProduct} handleScrollToTop={this.props.handleScrollToTop} rating={this.props.rating} />
      </div>
    )
  }
}

export default RelatedItems;
