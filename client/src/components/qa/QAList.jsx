import React from 'react';
import QAEntry from './QAEntry.jsx';

const QAList = (props) => {
  const scrollOrNot = props.questions.length >= 4 ? "qa-list-section-scroll" : "qa-list-section";
  return (
    <div className={scrollOrNot}>
      {props.questions.map(question => <QAEntry product={props.product} qa={question} key={question.question_id}/>)}
    </div>
  )
}

export default QAList;
