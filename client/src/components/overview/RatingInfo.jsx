import React from 'react';
import Star from '../Star/Star.jsx';

import {roundNearQtr} from '../../helpers.js'

const RatingInfo = ({rating, handleScrollToReviews, interaction}) => {
  const click = () => {
    handleScrollToReviews();
    interaction('Read all reviews link', 'Overview');
  }
  
  return (
    <div className='close-flex'>
      {rating !== 0 && <Star rating={roundNearQtr(rating)} />}
      <p className='read-all-reviews' onClick={click}>Read all reviews</p>
    </div>
  )
}

export default RatingInfo;
