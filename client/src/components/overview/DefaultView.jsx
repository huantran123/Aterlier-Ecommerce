import React from 'react';
import { HiArrowNarrowLeft, HiArrowNarrowRight } from 'react-icons/hi';

class DefaultView extends React.Component {
  constructor(props) {
    super(props);
  }

  next() {
    var nextIndex = this.props.selectedPhotoIndex + 1;
    this.props.photoChange(nextIndex);
    this.props.interaction('Next arrow in default big picture section', 'Overview')
  }

  previous() {
    var prevIndex = this.props.selectedPhotoIndex - 1;
    this.props.photoChange(prevIndex);
    this.props.interaction('Previous arrow in default big picture section', 'Overview')
  }

  render() {
    var currentPhoto = this.props.photos[this.props.selectedPhotoIndex];
    return (
      <div className='default-view' role='big-picture'>
        <HiArrowNarrowLeft className={this.props.selectedPhotoIndex !== 0 ? 'arrow-icon' : 'arrow-icon invisible'} onClick={this.previous.bind(this)} />
        {currentPhoto !== null
          ? <div className='big-picture magnify-cursor'style={{backgroundImage:`url(${currentPhoto})`}} onClick={this.props.toggleExpandedView} data-testid={currentPhoto} ></div>
          : <div className='big-picture magnify-cursor no-thumbnail' onClick={this.props.toggleExpandedView} ></div>
        }
        <HiArrowNarrowRight className={this.props.selectedPhotoIndex !== this.props.photos.length - 1 ? 'arrow-icon' : 'arrow-icon invisible'} onClick={this.next.bind(this)} />
      </div>
    )
  }
}

export default DefaultView;
