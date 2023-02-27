import React from 'react';
import { FaChevronRight } from 'react-icons/fa';

import StyleCircle from './StyleCircle.jsx';

class StylesSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStyleId: this.props.selectedStyle.style_id,
      selectedStyleName: this.props.selectedStyle.name
    }
  }

  changeStyle(selectedStyle) {
    this.setState({
      selectedStyleId: selectedStyle.style_id,
      selectedStyleName: selectedStyle.name
    })
  }

  //Getting the new style list after the new product is passed to props
  componentDidUpdate(prevProps, prevState) {
    if (this.props.selectedStyle.style_id !== this.state.selectedStyleId && this.props.selectedStyle.name !== this.state.selectedStyleName) {
      this.setState({
        selectedStyleId: this.props.selectedStyle.style_id,
        selectedStyleName: this.props.selectedStyle.name
      })
    }
  }

  render() {
    console.log('Selected style: ', this.props.selectedStyle)
    return(
      <div className='styles-container'>
        <div className='closest-flex'>
          <span className='bold-text'>STYLE</span>
          <FaChevronRight />
          <span className='style-name'>{this.state.selectedStyleName.toUpperCase()}</span>
        </div>
        <div className='style-list'>
          {this.props.styles.map(style => (
            <StyleCircle key={style.style_id}
              style={style}
              selectStyle={this.props.selectStyle}
              changeStyle={this.changeStyle.bind(this)}
              selected={this.state.selectedStyleId === style.style_id ? true : false}
              selectSizeMessageOff={this.props.selectSizeMessageOff}
              interaction={this.props.interaction} />
          ))}
        </div>
      </div>
    )
  }
}

export default StylesSection;
