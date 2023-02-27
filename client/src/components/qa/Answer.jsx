import React, { useState } from 'react';
import { format, formatDistance, formatRelative, subDays } from 'date-fns';
import axios from 'axios';

class Answer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      helpfulness: this.props.answer.helpfulness,
      className: "not-helpful",
      classNameReport: "",
      showOrHide: "modal trans-bg display-none",
      url: ""
    }
  }

  handleYesClick () {
    console.log('clicked!');
    if (this.state.className === "not-helpful") {
      axios.put(`/qa/answers/${this.props.answer.answer_id}/helpful`)
      .then((response) => {
        console.log('Success marking helpful');
        this.setState({ className: "helpful", helpfulness: this.state.helpfulness + 1 });
      })
      .catch(err => { console.error(err) })
    } else {
      console.log('Already marked!');
    }
  }

  handleReportClick () {
    if (this.state.classNameReport === "") {
      axios.put(`/qa/answers/${this.props.answer.answer_id}/report`)
      .then((response) => {
        console.log("Success Reporting");
        this.setState({ classNameReport: "reported" })
      })
    } else {
      console.log('Already reported!');
    }
  }

  hideModal () {
    this.setState({ showOrHide: "modal trans-bg display-none" });
  }

  makeLarge (e) {
    this.setState({ showOrHide: "modal trans-bg dispaly-block", url: e.target.src });
  }

  render () {
    var date = new Date(this.props.answer.date).toDateString().slice(4);
    let day = ' ' + date.split(' ')[1] + ', ';
    date = date.split(' ')[0] + day + date.split(' ')[2];

    return (
      <div className="answer-section">
        {this.props.first? <p className="questionBody"> A: </p>: <p className="fake"> a </p>}
        {this.state.classNameReport === ""
          ? <div className="answer">
              <div className={this.state.showOrHide} >
                <div className="modal-img" style={{"--url": this.state.url}}>
                  <span className="close" onClick={() => this.setState({showOrHide: "modal trans-bg display-none"})}>
                    &times;
                  </span>
                  <img className="qa-photo-large" alt="qa-img" src={this.state.url} />
                </div>
              </div>
              <div className="answer-body">
                <p className="answer-text">{this.props.answer.body}</p>
                {this.props.answer.photos.length? <br></br>: null}
                {this.props.answer.photos.map(p => (<img key={p.id} src={p.url} alt="qa-img" className="qa-photo" onClick={(e) => this.makeLarge.bind(this)(e)}/>))}
              </div>
              <div className="answer-bottom">
                <p className="answer-additional"> by {this.props.answer.answerer_name === "Seller"? <b>{this.props.answer.answerer_name}</b>: this.props.answer.answerer_name}, {date} </p>
                <p className="answer-additional left-border"> Helpful? &nbsp; <u className={this.state.className} onClick={this.handleYesClick.bind(this)}>Yes</u>  ({this.state.helpfulness}) </p>
                <p className="answer-additional left-border"> <u className="report-text" onClick={this.handleReportClick.bind(this)}>Report</u> </p>
              </div>
            </div>
          : <div className="answer-reported"> This answer won't show again </div>
         }
      </div>
    )
  }
}

export default Answer;
