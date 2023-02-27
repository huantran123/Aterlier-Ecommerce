import React from 'react';
import axios from 'axios';
import { FaRegStar, FaPlus, FaHeart } from 'react-icons/fa';

import ProductInfo from './ProductInfo.jsx';
import RatingInfo from './RatingInfo.jsx';
import StylesSection from './StylesSection.jsx';
import Description from './Description.jsx';
import SizeSelector from './SizeSelector.jsx';
import QuantitySelector from './QuantitySelector.jsx';
import ImageGallery from './ImageGallery.jsx';

import {calculateRating, getTotalQuantity} from '../../helpers.js';
import "./Overview.scss";

class Overview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      salePrice: '',
      styles: [],
      selectedStyle: {},
      selectedSizeId: 'SELECT SIZE',
      quantityOfSelectedSize: 0,
      selectedQuantity: '-',
      selectSizeMessage: false
    }
  }

  getStyles() {
    return axios.get(`/products/${this.props.product.id}/styles`)
      .then(res => {
        console.log('Styles:', res.data.results)
        var selectedStyle = res.data.results[0];
        for (var style of res.data.results) {
          if (style['default?']) {
            selectedStyle = style;
            break;
          }
        }
        this.setState({
          styles: res.data.results,
          selectedStyle,
          salePrice: selectedStyle.sale_price || '',
          selectedSizeId: 'SELECT SIZE',
          quantityOfSelectedSize: 0,
          selectedQuantity: '-'
        })
      })
  }

  selectStyle(selectedStyle) {
    var salePrice = selectedStyle.sale_price || '';
    this.setState({selectedStyle, salePrice, selectedSizeId: 'SELECT SIZE', quantityOfSelectedSize: 0, selectedQuantity: '-'})
  }

  selectSize(selectedSizeId) {
    this.setState({
      selectedSizeId,
      quantityOfSelectedSize: selectedSizeId !== 'SELECT SIZE' ? this.state.selectedStyle.skus[selectedSizeId].quantity : 0,
      selectedQuantity: selectedSizeId !== 'SELECT SIZE' ? 1 : '-'
    })
  }

  selectQuantity(selectedQuantity) {
    this.setState({selectedQuantity})
  }

  addToOutfit() {
    const {id, name, category, slogan, description, default_price} = this.props.product;
    const product = {
      id,
      name,
      category,
      default_price,
      thumbnail_url: this.state.selectedStyle.photos[0].thumbnail_url,
      rating: this.props.rating
    }
    console.log('Favorite product: ', product)
    this.props.addToOutfit(product);
    this.props.interaction('Add to outfit button', 'Overview')
  }

  removeFromOutfit() {
    this.props.removeFromOutfit(this.props.product.id);
    this.props.interaction('Remove outfit button', 'Overview')
  }

  showDropdown(elementId) {
    var elem = document.getElementById('size-selector');
    if (document.createEvent) {
      var e = document.createEvent("MouseEvents");
      e.initMouseEvent("mousedown", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      elem[0].dispatchEvent(e);
    } else if (element.fireEvent) {
      elem[0].fireEvent("onmousedown");
    }
  };

  selectSizeMessageOff() {
    this.setState({selectSizeMessage: false})
  }

  addToBagClick() {
    if (this.state.selectedSizeId === 'SELECT SIZE') {
      this.showDropdown();
      this.setState({selectSizeMessage: true})
    } else {
      document.getElementById('success-message').style.display='block';
      setTimeout(() => {
        document.getElementById('success-message').style.display='none';
      }, 2000);
    }
    this.props.interaction('Add to bag button', 'Overview')
  }

  componentDidMount() {
    this.getStyles()
      .then(() => {
        const {id, name, category, slogan, description, default_price} = this.props.product;
        const product = {
          id,
          name,
          category,
          default_price,
          thumbnail_url: this.state.selectedStyle.photos[0].thumbnail_url,
          rating: this.props.rating
        }
        this.props.getAllCurrentProductInfo(product);
      })
  }

  //Getting the new style list after the new product is passed to props
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.product.id !== this.props.product.id) {
      this.selectSizeMessageOff();  //Turn off the select size message in case the message was on in previous product props
      this.getStyles()
      .then(() => {
        const {id, name, category, slogan, description, default_price} = this.props.product;
        const product = {
          id,
          name,
          category,
          default_price,
          thumbnail_url: this.state.selectedStyle.photos[0].thumbnail_url,
          rating: this.props.rating
        }
        this.props.getAllCurrentProductInfo(product);
      })
    }
  }

  render() {
    const {id, name, category, slogan, description, default_price} = this.props.product;
    if (this.state.styles.length != 0) {
      const totalQuantity = getTotalQuantity(this.state.selectedStyle.skus);
      return (
        <div className='overview-container'>
          {(this.state.selectedSizeId !== 'SELECT SIZE') &&
            <div id={'success-message'} className={'add-to-bag-success-message'}>
              <strong>Congratulation:</strong> {`${this.state.selectedQuantity} ${this.state.selectedStyle.name} ${name} (${this.state.selectedStyle.skus[this.state.selectedSizeId].size}) is added to the bag!`}
            </div>
          }
          <div className='overview-flex'>
            <ImageGallery selectedStyle={this.state.selectedStyle} styles={this.state.styles} interaction={this.props.interaction} />
            <div className='product-info'>
              <RatingInfo rating={this.props.rating} handleScrollToReviews={this.props.handleScrollToReviews} interaction={this.props.interaction} />
              <ProductInfo name={name} category={category} originalPrice={default_price} salePrice={this.state.salePrice} />
              {this.state.styles.length !== 0 && <StylesSection styles={this.state.styles} selectedStyle={this.state.selectedStyle} selectStyle={this.selectStyle.bind(this)} selectSizeMessageOff={this.selectSizeMessageOff.bind(this)} interaction={this.props.interaction} />}
              <div className='selectors-buttons-flex'>
                {this.state.selectSizeMessage && <p className='error-message'>Please select size</p>}
                <div className='buttons-flex'>
                  {this.state.styles.length !== 0 && <SizeSelector selectedStyle={this.state.selectedStyle} selectedSizeId={this.state.selectedSizeId} selectSize={this.selectSize.bind(this)} selectSizeMessageOff={this.selectSizeMessageOff.bind(this)} interaction={this.props.interaction}/>}
                  {this.state.styles.length !== 0 && <QuantitySelector quantityOfSelectedSize={totalQuantity === 0 ? 0 : this.state.quantityOfSelectedSize} selectedQuantity={this.state.selectedQuantity} selectQuantity={this.selectQuantity.bind(this)} interaction={this.props.interaction} />}
                </div>
                <div className='buttons-flex'>
                  <div className={totalQuantity===0 ? 'hidden' : 'primary-button'} onClick={this.addToBagClick.bind(this)} data-testid="add-to-bag">
                    <p>ADD TO BAG</p>
                    <FaPlus />
                  </div>
                  {this.props.outfit[id]
                      ? <div className='button' onClick={this.removeFromOutfit.bind(this)}><FaHeart className='button-icon heart-icon' /></div>
                      : <div className='button' onClick={this.addToOutfit.bind(this)}><FaRegStar className='button-icon star-favorite-icon' /></div>
                  }
                </div>
              </div>
            </div>
          </div>
          <Description slogan={slogan} description={description} />
        </div>
      )
    } else {
      return null;
    }
  }
}

export default Overview;
