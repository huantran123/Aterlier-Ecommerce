import React from 'react';
import axios from 'axios';

import Question from './Question.jsx';
import Answer from './Answer.jsx';

class QAEntry extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      shownAnswers: [],
      loadMore: false,
      all: [],
      collapse: false
    }
  }

  componentDidMount () {
    this.getAnswers()
    .then(() => {
      this.setAnswers();
    })
  }

  getAnswers () {
    return (
      axios.get(`/qa/questions/${this.props.qa.question_id}/answers`)
      .then((response) => {
        this.setState( { all: response.data.results } );
      })
      .catch(err => { console.error(err) })
    )
  }

  setAnswers () {
    let ans = this.state.all;
    ans.sort((a1, a2) => a1.helpfulness < a2.helpfulness ? 1 : a1.helpfulness > a2.helpfulness ? -1 : 0 )
    ans.sort((a1, a2) => a1.answerer_name !== "Seller" && a2.answerer_name === "Seller" ? 1 : a1.answerer_name === "Seller" && a2.answerer_name !== "Seller" ? -1 : 0 )

    let i = -1;
    ans = ans.map(a => {
      i++;
      return (<Answer answer={a} key={a.answer_id} first={!i?true:false}/>)
    });

    if (ans.length > 2) {
      this.setState({
        shownAnswers: ans.slice(0, 2),
        loadMore: true,
        all: ans
      })
    } else {
      this.setState({ shownAnswers: ans, all: ans })
    }
  }

  handleLoadMore () {
    this.setState({
      shownAnswers: this.state.all,
      loadMore: false,
      collapse: true
    });
  }

  collapseAnswers () {
    this.setState({ shownAnswers: this.state.all.slice(0, 2), collapse: false, loadMore: true});
  }

  handleAddAnswer (answerData) {
    axios.post(`/qa/questions/${this.props.qa.question_id}/answers`, answerData)
    .then(response => {
      console.log('Success posting new answer: ', answerData, 'response: ', response);
      this.getAnswers()
      .then(() => {
        this.setAnswers();
      })
    })
    .catch(err => { console.error(err) })
  }

  render () {
    const scrollOrNot = this.state.shownAnswers.length >= 4? "qa-entry-scroll": "qa-entry"
    return (
      <div className={scrollOrNot}>
        <Question product={this.props.product} question={this.props.qa} handleAddAnswer={this.handleAddAnswer.bind(this)}/>
        {this.state.shownAnswers}
        {this.state.loadMore ? <p className="load-collapse" onClick={this.handleLoadMore.bind(this)}> <u>Load More</u> </p> : null}
        {this.state.collapse ? <p className="load-collapse" onClick={this.collapseAnswers.bind(this)}> <u>Collapse</u> </p> : null}
      </div>
    )
  }
}

export default QAEntry;
