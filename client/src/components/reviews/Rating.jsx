import React, { useState, useEffect } from 'react';
import Star from '../Star/Star.jsx';
import {calculateRating, roundNearQtr} from '../../helpers.js';
import { recommend } from './helper-revs.js';

const Rating = (props) => {
  const [rating, setRating] = useState(props.rating);

  if (rating !== props.rating) {
    setRating(props.rating);
  }
  
  const [reviewsMeta, setMeta] = useState(props.reviewsMeta);
  
  if (reviewsMeta !== props.reviewsMeta) {
    setMeta(props.reviewsMeta);
  }
  
  const recData = recommend(reviewsMeta.recommended);
  
  const totalRating = Object.values(reviewsMeta.ratings).reduce((acc, n) => {
    return acc = acc + parseInt(n);
  }, 0)
  
  const calculate = (key) => {
    if (reviewsMeta.ratings[key] === undefined) {
      return 0;
    }
    return parseInt(reviewsMeta.ratings[key]) / totalRating;
  }

  return (
    <div className="breakdown">
      <div className="rat-header">
        <div className="xxl_font">{rating}</div>
        <div className="stars"><Star rating={roundNearQtr(rating)}/></div>
      </div>
      <div className="xs_font">{recData}% of reviews recommend this product</div>
      {Object.values(props.toggle).indexOf(true) >= 0 &&
       <div className="sm-btn"
        onClick={()=>{
          props.interaction('clear filter', 'reviews');
          props.clear();
          }
        }>REMOVE ALL FILTER</div>
      }
      <div className="rat-body xs_font">
        {[5,4,3,2,1].map(key =>
            <div className="rat-chart" key={key}>
              <div className={!props.toggle[key] ? "rat-stars" : "rat-stars display-change"}>
                <span className="underline" onClick={() => {
                  if (reviewsMeta.ratings[key]) {
                    props.handleStarClick(props.reviews, key)
                  }

                  }}>{key} stars</span>
                <span className="rat-progress" style={{"--stars": calculate(key)}}></span>
              </div>
            </div>
        )}
      </div>
    </div>
  )
}

export default Rating;
