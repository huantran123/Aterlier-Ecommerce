import React, { useState } from 'react';
import { format, parseJSON } from 'date-fns';
import Star from '../Star/Star.jsx';
import {roundNearQtr} from '../../helpers.js'
import axios from 'axios';
import AlertMessage from './addReview/AlertMessage.jsx';

const ReviewEntry = (props) => {
  const [helpful, setHelp] = useState(props.review.helpfulness);
  const [clicked, setClick] = useState(false);
  const [showMore, setShowMore] = useState(true);
  const [showBig, setBig] = useState({show: false, url: ''});
  const showOrhide = !showBig.show ? "modal trans-bg display-none" : "modal trans-bg dispaly-block";
  const [showReview, setShowReview] = useState(true);
  const [helpClick, setHelpClick] = useState(false);
  const grayOrNot = !showReview ? "rev-gray" : "rev";
  
  const sendToServer = (review_id) => {
    return axios.put(`/reviews/${review_id}/helpful`)
      .then(() => {setClick(true)})
  }
  
  const sendReport = (review_id) => {
    return axios.put(`/reviews/${review_id}/report`)
     .then(() => {
      setShowReview(false);
     })
  }
  
  return (
    <li>
      <div className={grayOrNot} role="reviews">
        <div className="rev-header">
           {showReview && <Star rating={roundNearQtr(props.review.rating)} />}
          <div className="date xs_font">{props.review.reviewer_name}, {format(parseJSON(props.review.date), "MMMM/dd/yyyy")}</div>
        </div>
        {/* render review's body*/}
        {!showReview && <div className="l_font">This review won't show again</div>}
        <div className="rev-body">
          <div className="rev-summary">{props.review.summary}</div>
          {props.review.body.length <= 250 ? <div className="review small_font">{props.review.body}</div>
          : (<div className="review small_font">
              {props.review.body.slice(0, 250)}
              {(showMore || !showReview)? null : <a className="more-summary">{props.review.body.slice(250)}</a>}
              <br/>
             {showReview &&
              <button
              className="sm-btn"
              value={showMore ? "SHOW MORE" : "FOLD BACK" }
              onClick={(e) => {
                props.interaction(e.target.value, 'reviews')
                setShowMore(!showMore)
              }}>{showMore ? "SHOW MORE" : "FOLD BACK" }</button>}
            </div>)
          }

          {props.review.recommend && <div className="rev-recommend small_font">&#10003; I recommend this product</div>}
          {props.review.response &&
          (<div className="rep-Meg">
            <div className="rep-title">Response:</div>
            <div className="rep-body small_font">{props.review.response}</div>
          </div>)
          }
          {(!props.review.photos.length || !showReview) ? null :
           (<div>
              <div className={showOrhide} >
                <div className="modal-img" style={{"--url": showBig.url}}>
                  <span className="close" onClick={() => setBig({show: !showBig.show, url:''})}>
                    &times;
                  </span>
                  <img className="bigImg" alt="revies-img" src={showBig.url} />
                </div>
              </div>
              {props.review.photos.map(photo =>
                <img key={photo.id} className="rev-photo" alt="reviws-img" src={photo.url} onClick={(e) => {
                  props.interaction(e.target.className, 'reviews');
                  setBig({show: !showBig.show, url: e.target.src});
                  }}/>
                )
              }
           </div>)
          }
        </div>
        {helpClick && <AlertMessage message="You already Clicked." className='red-error'/>}
        <div className="rev-footer xs_font">

          <div>Helpful?
            <span className="underline rev-helpful"
            onClick={() => {
              props.interaction('helpful', 'reviews');
              if (!clicked) {
                setHelp(helpful + 1);
                sendToServer(props.review.review_id);
              } else {
                setHelpClick(true);
                setTimeout(() => {setHelpClick(false)}, 2000);
              }
            }
            }>
              Yes
            </span>
            <span className="rev-helpdata">({helpful})</span>
            |
            <span className="underline rev-helpful" value="report" onClick={() => {
              props.interaction('report', 'reviews');
              sendReport(props.review.review_id);
            }}> Report </span>
          </div>
          <hr/>
        </div>
      </div>
    </li>
  )
}

export default ReviewEntry;
