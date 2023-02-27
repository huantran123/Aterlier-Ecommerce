import React, { useState } from 'react';
import './qa-modal.scss';
import UploadPics from './UploadPics.jsx';

const AddAnswer = (props) => {
 const [body, setBody] = useState('');
 const [name, setName] = useState('');
 const [email, setEmail] = useState('');
 const [photos, setPhotos] = useState([]);
 const [questionCharactersRemaining, setQuestionCharactersRemaining] = useState(1000);

 const questionChange = (e) => {
   setBody(e.target.value);
   setQuestionCharactersRemaining(1000 - body.length);
 }

 const nameChange = (e) => {
   setName(e.target.value);
 }

 const emailChange = (e) => {
   setEmail(e.target.value);
 }

 const submit = () => {
   if (!body.length) {
     alert("You must enter an answer!")
   } else if (!name.length) {
     alert("You must enter a nickname!")
   } else if (!email.length) {
     alert("You must enter an email!")
   } else if (!email.includes('@')) {
     alert("Must use a valid email!")
   } else {
     props.closeModal();
     props.handleAddAnswer({ body, name, email, photos });
   }
 }

 const [uploadPics, setUploadPics] = useState(false);

 const closePicsModal = () => {
   setUploadPics(false);
 }

 const handleUpload = (urls) => {
   setPhotos(urls);
 }

 return (
   <div className="modal">
     <div className="modal_content">
       <span className="close" onClick={props.closeModal}>
         &times;
       </span>
       <div className="title"> Submit Your Answer </div>
       <div className="subTitle add-entry"> {props.product.name}: <span>{props.question.question_body}</span> </div>
       <div className="add-q-entry add-entry"> Your Answer <textarea className="modal-entry" type="text" rows="5" maxLength="1000" placeholder="your question here" onChange={questionChange}/> </div>
       <div className="characters-remaining"> <span className="placeholder">placeholder</span> {questionCharactersRemaining} characters remaining </div>
       <div className = "characters-remaining"> <span className="placeholder">placeholder</span> <button className="upload-btn" onClick={() => setUploadPics(true)}> Upload Pics </button> {uploadPics? <UploadPics handleUpload = {handleUpload} close = {closePicsModal}/>: null} </div>
       <div className="add-q-entry add-entry"> Nick Name <input className="modal-entry" type="text" maxLength="60" placeholder="Example: jackson11!" onChange={nameChange} required/> </div>
       <div className="add-q-entry"> For privacy reasons, do not use your full name or email address </div>
       <div className="add-q-entry add-entry"> Your Email <input className="modal-entry" type="email" maxLength="60" placeholder="xxx@gmail.com" onChange={emailChange} required/> </div>
       <div className="add-q-entry"> For authentication reasons, you will not be emailed </div>
       <input className="btn" type="submit" value="Submit" onClick={submit}/>
     </div>
   </div>
 )
};

export default AddAnswer;
