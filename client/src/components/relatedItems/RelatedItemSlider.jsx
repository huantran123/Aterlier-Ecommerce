import React, {useState, useEffect} from "react";
import './Slider.scss';
import RelatedItemCard from './RelatedItemCard.jsx';
import {MdChevronLeft, MdChevronRight} from 'react-icons/md';

const RelatedItemSlider = (props) => {
  const slider = document.getElementById('slider');
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const slideLeft = () => {
    var slider = document.getElementById('slider');
    slider.scrollLeft -=  100;
    console.log('slider///', slider.scrollLeft);
    setShowRight(true);
    if(slider.scrollLeft <= 50) {
      setShowLeft(false);
    }
   }

  const slideRight = () => {
    var slider = document.getElementById('slider');
    slider.scrollLeft +=  150;
    setShowLeft(true);
    if(slider.scrollLeft >= (slider.scrollWidth - slider.clientWidth)) {
      setShowRight(false);
    }
  }

  const uniqeRelatedProducts = (products) => {
    var objOfProducts = {};
    for(var i = 0; i < products.length; i++) {
      if (products[i] !== props.curProduct.id && !objOfProducts[products[i]]) {
        objOfProducts[products[i]] = i;
      } 
    }
      return Object.keys(objOfProducts);
  }

  const [relatedItems, setRelatedItems] = useState([]);

  useEffect(() => {
    setRelatedItems(uniqeRelatedProducts(props.products));
  }, [props.products]);

  return (
    <div id="main-slider-container">
      <MdChevronLeft size={38} className={showLeft ? "slider-icon-left" : "slider-icon-invisible"}  onClick={slideLeft} />  
      <div id='slider'>
        {relatedItems.map((item, index) => {
          return (
            <RelatedItemCard product={item} key={index} mainProduct={props.curProduct}  mainRating={props.rating} selectProduct={props.selectProduct} handleScrollToTop={props.handleScrollToTop} />
          )
        })}
      </div>
      <MdChevronRight size={38} className={showRight ? "slider-icon-right" : "slider-icon-invisible"}  onClick={slideRight} />
    </div>
  )
}

export default RelatedItemSlider;
