
import React, {useState, useEffect} from 'react';
import './modal.scss';
import {MdDone} from 'react-icons/md';

 const Modal = (props) => {
  const mainRating = props.mainRating;
  const showHideClassName = props.show ? " modal display-block" : "modal display-none";
  const [curProduct, setCurProduct] = useState(props.mainProduct)
  const [comparedProduct, setComparedProduct] = useState(props.product);
  const [comRating, setComRating] = useState(props.comRating);
  const [result, setResult] = useState([]);

  useEffect(() => {
    setComRating(props.comRating);
    setComparedProduct(props.product);
    setResult(comparedValue(curProduct, props.product, mainRating, props.comRating));
  }, [props.product, props.comRating]);

  const comparedValue = (curProduct, comparedProduct, mainRating, comRating) => {
    var result = [];
    var result1 = comparedPrice(curProduct, comparedProduct);
    result.push(result1);
    var result2 = compareFabric(curProduct, comparedProduct);
    result.push(result2);
    var result3 = comparedRating(mainRating, comRating);
    result.push(result3);
    return result;
  }

  const comparedPrice = (curProduct, comparedProduct) => {
    var result = {};
    result.value = 'Cheaper';
    if(Number(curProduct.default_price) < Number(comparedProduct.default_price)) {
      result.a = true;
      result.b = false;
    } 
     if (Number(curProduct.default_price) > Number(comparedProduct.default_price)) {
      result.a = false;
      result.b = true;
    } 
    return result;
  }

  const compareFabric = (curProduct, comparedProduct) => {
   var result = {};
   result.value = 'Cotton';
   if (comparedProduct.length !== 0  && comparedProduct.features.length !== 0) {
    if (curProduct.features[0].value === '100% Cotton') {
      result.a = true;
    }
    if (curProduct.features[0].value !== '100% Cotton') {
      result.a = false;
    }
    if (comparedProduct.features[0].value === '100% Cotton') {
      result.b = true;
    }
    if (comparedProduct.features[0].value !== '100% Cotton') {
      result.b = false;
    }
    if (comparedProduct.length !== 0 && comparedProduct.features.length === 0) {
      result.b = false;
    }
   }
   return result;
  }

  const comparedRating = (mainRating, comRating) => {
   var result = {};
   result.value = 'Better Rating';
   
   if(mainRating > comRating) {
      result.a = true;
      result.b = false;
    } 
    if (mainRating < comRating) {
      result.a = false;
      result.b = true;
    } 
    if (mainRating === comRating){
      result.a = false;
      result.b = false;
    }
    
   return result;
  }

  return (
    <div className={showHideClassName} onClick={props.hideModal}>
      <section className='modal-main' >
        <h2>Comparing</h2>
        <table id="comparions">
          <thead>
            <tr>
            <th>{curProduct.name}</th>
            <th id="features">Features</th>
            <th>{comparedProduct.name}</th>
            </tr>
          </thead>
         {result.map((item, index) => {
            return (
              <thead key={index}>
               <tr>
               <th>{item.a ? <MdDone /> : null} </th>
               <th id="features">{item.value}</th>
               <th>{item.b ? <MdDone /> : null}</th>
               </tr>
             </thead>
            )
          })}
        </table>
      </section>
    </div>
  );
};

export default Modal;
