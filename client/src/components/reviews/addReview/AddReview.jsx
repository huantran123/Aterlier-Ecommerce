import React, {useState, useEffect} from 'react';
import UploadPics from './UploadPics.jsx';
import StarRating from './StarRating.jsx';
import ProductFactor from './ProductFactor.jsx';
import { getCharMap } from '../helper-revs.js';
import AlertMessage from './AlertMessage.jsx';

const AddReview = (props) => {
  let emptyRev = {
    product_id: props.product.id,
    rating: 0,
    summary: "",
    body: "",
    recommend: "",
    name: "",
    email: "",
    photos: [],
    characteristics: {}
  };
  
  const [newRev, setRev] = useState(emptyRev)
  
  if (newRev.product_id !== props.product.id) {
    setRev({...newRev, product_id: props.product.id})
  }
  
  const [uploadShow, setUploadShow] = useState(false);
  const showOrHide = props.show ? "modal trans-bg display-block" : "modal trans-bg display-none";
  
  const toggleUpload= () => {
    setUploadShow(!uploadShow);
  }
  
  const handleUpload = (urls =>{
    setRev({...newRev, photos: urls});
  })
  
  const getRating = (newRating) => {
    setRev({...newRev, rating: newRating});
  }
  
  const [newFactors, setFactors] = useState({});
  
  let originMap = getCharMap(props.chars);
  
  const [factorMap, setMap] = useState({map: originMap});

  const getFactor = (newFactor) => {
    if (factorMap.map[newFactor.name] === undefined) {
      let name = newFactor.name
      let array = Object.values(factorMap.map);
      let lastId = typeof array[array.length - 1] === "string" ? parseInt(array[array.length-1]) : array[array.length-1];
      factorMap.map[name] = lastId + 1;
      setMap({map: factorMap.map});
    }
    let property = factorMap.map[newFactor.name];
    setFactors({...newFactors, [property]: newFactor.value})
  }

  useEffect(() => {
    setRev({...newRev, characteristics: newFactors});
  }, [newFactors])
  
  const [message, setMessage] = useState({message: '', className: ''});

  if (message.message !== '') {
    setTimeout(()=>{setMessage({message: '', className: ''});}, 3000);
  }
  
  const toggleMessage = () => {
    setMessage({message:'', className: ''});
  }
  
  const handleSubmit = (newReview)=> {
    let stopSubmit = false;
    let errMessage = ''
    const mandatory = ['rating', 'recommend', 'characteristics','body', 'name', 'email']
    for (let i = 0; i < mandatory.length; i++) {
      if (!newReview[mandatory[i]] && mandatory[i] !== 'characteristics') {
        errMessage = ` You must enter the ${mandatory[i].toUpperCase()}!`;
        setMessage({message: errMessage, className: 'red-error'})
        stopSubmit = true;
        return;
      }
      if (mandatory[i] === 'characteristics' && JSON.stringify(newReview[mandatory[i]])==='{}') {
        errMessage = ` You must enter the characteristics!`;
        setMessage({message: errMessage, className: 'red-error'})
        stopSubmit = true;
        return;
      }
    }

    let otherLimit = false;
    if (!stopSubmit) {
      if (newReview.body.length < 50){
        errMessage ='Failed! Review must longer than 50 characters!';
        setMessage({message: errMessage, className: 'red-error'})
        otherLimit = true;
      } else if (newReview.email.indexOf('@') === -1) {
        errMessage ='Invalid Email address!';
        setMessage({message: errMessage, className: 'red-error'})
        otherLimit = true;
      }
    }

    if (!stopSubmit && !otherLimit) {
      return props.addReview(newReview)
      .then(() => {
        setMessage({message: 'Submit successfully!', className: 'green-success'});
        setRev(emptyRev);
        setTimeout(props.handleClick, 2000);
      });
    }
  }

  return (
    <div className={showOrHide}>
      <div className="rev-modal_content">
        <span className="close" onClick={props.handleClick}>
          &times;
        </span>
        {!message.message.length ? null : <AlertMessage message={message.message} className={message.className} toggle={toggleMessage}/>}
        <form >
          <div className="rev-title">Write Your Review</div>
          <div className="rev-subTitle">About the {props.product.name}</div>
          <div>
            <label>How would you rate this?*
              <StarRating getRating={getRating}/>
            </label>
          </div>
          <div>Recommend?*
            <label><input type="radio" value="yes" onChange={(e) => {setRev({...newRev, recommend: e.target.value})}} checked={newRev.recommend === "yes"} />Yes</label>
            <label><input type="radio" value="no" onChange={(e) => {setRev({...newRev, recommend: e.target.value})}} checked={newRev.recommend === "no"} />No</label>
          </div>
          <div>
            <label>Characteristics:*</label>
            <ProductFactor getFactor={getFactor} rev={newRev}/>
          </div>
          <div>
            <label>
              Review Summary:<br/>
              <input
                className="input-sum"
                type="text"
                placeholder="Example: Best purchase ever!"
                value={newRev.summary}
                onChange={(e) => setRev({...newRev, summary: e.target.value})}/></label>
          </div>
          <div>
            <label>Review Body*:<br/>
              <textarea
                className="input-body"
                placeholder="Why did you like the product or not?"
                value={newRev.body}
                onChange={(e) => setRev({...newRev, body: e.target.value})}
              />
              <br/>
              <span className="small_font">{newRev.body.length >= 50 ? "Minimum reached" : `Minimum required characters left: ${50 - newRev.body.length}` }</span>
            </label>
          </div>
          <div>
            <UploadPics show={uploadShow} toggleUpload={toggleUpload} handleUpload={handleUpload} />
            <button onClick={(e) => {
              props.interaction('upload pics', 'reviews');
              e.preventDefault();
              setUploadShow(!uploadShow);
              }}>Upload your photos</button>
          </div>
          <div>
            <label>Nick Name*:
              <input className="addRev-input" type="text" placeholder="Example: jackson11!" value={newRev.nane} onChange={(e) => {setRev({...newRev, name: e.target.value})}} />
            </label>
            <br/>
            <label>
              Your Email* :
              <input className="addRev-input" type="email" placeholder="Example: jackson11@email.com" value={newRev.email} onChange={(e) => {setRev({...newRev, email: e.target.value})}}/>
              <div className="xs_font">For authentication reasons, you will not be emailed</div></label>
          </div>
          <div>
            <input className="center-btn" type="submit" onClick={(e) => {
              props.interaction('submit', 'reviews');
              e.preventDefault();
              handleSubmit(newRev);
              }} value="Submit"/>
          </div>
        </form>
      </div>
    </div>
  )
}


export default AddReview;
