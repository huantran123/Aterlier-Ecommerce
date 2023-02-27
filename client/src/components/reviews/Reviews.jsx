import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./reviews.scss";
import ReviewsList from './ReviewsList.jsx';
import Rating from './Rating.jsx';
import Product from './Product.jsx';
import {reviewsSort}from './helper-revs.js';
import SearchBar from './SearchBar.jsx';
import { searchReviews } from './helper-revs.js';

const Reviews = (props) => {
  const [reviews, setReviews] = useState([]);
  const [newList, setList] = useState([]);
  const initToggle = {5: false, 4: false, 3: false, 2: false, 1: false};
  const [toggle, setToggle] = useState(initToggle);
  
  //handle 5 rating star been clicked
  const handleStarClick = (reviews, num) => {
    props.interaction(`${num} Star Rating`, 'reviews');

    if (toggle[num] === false) {
      let newRev = newList.concat(reviewsSort(reviews, num))
        setList(newRev);
    } else if (toggle[num]===true){
      let deleteRev = newList.filter((item) => {
        if (item.rating !== parseInt(num)) {
          return item;
        }
      });
      setList(deleteRev);
    }
    setToggle({...toggle, [num]:!toggle[num]});
  }
  
  useEffect(() => {
    if (newList.length) {
      setReviews(newList);
    } else {
      setReviews(props.state.reviews);
    }
  }, [props.state.reviews, newList])

  // clear all the filter
  const [clear, setClear] = useState(false);
  
  const clearFilter =  () => {
    setToggle(initToggle);
    setReviews(props.state.reviews);
    setClear(true);
    setList([]);
    setKeyWords('');
  }
  
  // handle the search input change
  const [keyWords, setKeyWords] = useState('');
  
  const handleSearch = (word) => {
    setKeyWords(word);
  }

  // if input more than 3 charactors show the filtered reviews
  useEffect(() => {
    let searchList;
    if (newList.length) {
      searchList = keyWords.length >= 3 ? searchReviews(newList, keyWords) : newList;
      setReviews(searchList);
    } else if (!newList.length && keyWords.length){
      searchList = keyWords.length >= 3 ? searchReviews(props.state.reviews, keyWords) : props.state.reviews;
      setReviews(searchList);
    }
  },[keyWords, newList])

  return  (
    <div ref={props.scrollToReviews} className="widget">
      <p className="small_font">RATINGS &#38; REVIEWS</p>
      <div className="revs">
        <div className="revs-left">
          <Rating interaction={props.interaction} rating={props.state.rating} reviews={props.state.reviews} reviewsMeta={props.state.reviewsMeta} handleStarClick={handleStarClick} toggle={toggle}  clear={clearFilter}/>
          <Product chars={props.state.reviewsMeta.characteristics}/>
        </div>
        <div className="revs-right">
          <SearchBar reviews={props.state.reviews} keyWords={keyWords} handleSearch={handleSearch}/>
          <ReviewsList clear={clear} interaction={props.interaction} length={props.state.reviewsLength} reviews={reviews} id={props.state.product.id} handleClick={props.handleClick} clear={clearFilter}/>
        </div>
      </div>
    </div>
  )
}

export default Reviews;
