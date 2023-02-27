import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

class StyleCircle extends React.Component {
  constructor(props) {
    super(props);
  }

  select() {
    this.props.selectSizeMessageOff();
    this.props.selectStyle(this.props.style);
    this.props.changeStyle(
      {
        style_id: this.props.style.style_id,
        name: this.props.style.name
      }
    )
    this.props.interaction('Style selector', 'Overview')
  }

  render() {
    return (
      <div className='style-container' role='style'>
        {this.props.selected && <FaCheckCircle className='check-icon' />}
        {this.props.style.photos[0].thumbnail_url !== null
          ? <div onClick={this.select.bind(this)} className={this.props.selected ? 'style-circle selected-style' : 'style-circle'} style={{backgroundImage:`url(${this.props.style.photos[0].thumbnail_url})`}} ></div>
          : <div onClick={this.select.bind(this)} className={this.props.selected ? 'style-circle selected-style no-thumbnail' : 'style-circle no-thumbnail'} ></div>
        }
      </div>
    )
  }
}

export default StyleCircle;
