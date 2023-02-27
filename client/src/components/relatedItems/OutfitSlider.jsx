import React, {useState, useEffect, useRef} from "react";
import './Slider.scss';
import {MdChevronLeft, MdChevronRight} from 'react-icons/md';
import  AddCard  from "./AddCard.jsx";
import OutfitCard from "./OutfitCard.jsx";
import {extractLocalStorage} from '../../helpers.js'

const OutfitSlider = (props) => {
  const [items, setItems] = useState(props.outfit);
  console.log('items//////', items)

  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const outfitSlideLeft = () => {
    var slider = document.getElementById('outfitSlider');
    slider.scrollLeft -=  150;
    setShowRight(true);
    if(slider.scrollLeft <= 50) {
      setShowLeft(false);
    }
  }
  
  useEffect(() => {
    var products = extractLocalStorage(localStorage);
    setItems(products);
  }, [props.outfit]);

  const slideRight = () => {
    var slider = document.getElementById('outfitSlider');
    slider.scrollLeft +=  150;
    setShowLeft(true);
    console.log("outfotSlider/////", slider.scrollLeft);
    console.log("outfotSlider???", slider.clientWidth);
    console.log('outfitslide&&&', slider.scrollWidth);
    if(slider.scrollLeft >= (slider.scrollWidth - slider.clientWidth -100)) {
      setShowRight(false);
    }
  }

  return (
    <div id="main-slider-container" >
      <MdChevronLeft size={38} className={showLeft ? "outfit-slider-icon-left" : "slider-icon-invisible"}  onClick={outfitSlideLeft} />
      <div id='outfitSlider'>
        <AddCard currentProduct={props.currentProduct} addItem={props.add} id={props.product}/>
        {Object.keys(items).map((item, index) => {
          return (
            <OutfitCard product={items[item]} key={index} deleteItem={props.delete} />
          )
        })}
      </div>
      <MdChevronRight size={38} className={showRight ? "outfit-slider-icon-right" : "slider-icon-invisible"} onClick={slideRight} />
    </div>
  )
}

export default OutfitSlider;
