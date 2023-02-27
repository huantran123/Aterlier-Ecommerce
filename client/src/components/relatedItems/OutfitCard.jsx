import axios from 'axios';
import React from 'react';
import {MdClear} from 'react-icons/md';
import './singleCard.scss';
import Star from '../Star/Star.jsx';
import {calculateRating, roundNearQtr} from '../../helpers.js';

const OutfitCard = (props) => {
  return (
      <div className="card" >
        <a>
        <img className='card-image' alt="outfitImage" src={props.product.thumbnail_url} />
        </a>
        <MdClear className='clear-icon' onClick={() => {props.deleteItem(Number(props.product.id))}}/>
        <div className='cardbody'>
        <p className='category'>{props.product.category}</p>
        <p className='name'>{props.product.name}</p>
        <p className='price'>${props.product.default_price}</p>
        <Star rating={roundNearQtr(props.rating)} />
        </div>
      </div>
  )
}

export default OutfitCard;
