import React, { useState } from 'react';
import AddQuestion from './AddQuestion.jsx'

const Add = (props) => {
  const [addQuestion, setAddQuestion] = useState(false);

  const closeModal = () => {
    setAddQuestion(false);
  }

  return (
    <div className="addSection">
      {props.loadMore? <button className="sm-btn" onClick={props.handleMoreQuestions}> MORE ANSWERED QUESTIONS </button>: null}
      {props.collapse? <button className="sm-btn" onClick={props.handleCollapse}> COLLAPSE </button>: null}
      <button className="sm-btn" onClick={() => setAddQuestion(true)}> ADD A QUESTION + </button>
      {addQuestion? <AddQuestion product={props.product} handleAddQuestion={props.handleAddQuestion} closeModal={closeModal}/>: null}
    </div>
  )
}

export default Add;
