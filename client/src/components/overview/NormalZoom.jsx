import React from 'react';
import { HiArrowNarrowLeft, HiArrowNarrowRight } from 'react-icons/hi';

class NormalZoom extends React.Component {
  constructor(props) {
    super(props);
  }

  next() {
    var nextIndex = this.props.selectedPhotoIndex + 1;
    this.props.photoChange(nextIndex);
    this.props.interaction('Next arrow in expanded big picture section', 'Overview')
  }

  previous() {
    var prevIndex = this.props.selectedPhotoIndex - 1;
    this.props.photoChange(prevIndex);
    this.props.interaction('Previous arrow in expanded big picture section', 'Overview')
  }

  render() {
    var currentPhoto = this.props.photos[this.props.selectedPhotoIndex];
    return (
      <div className='default-view' role='big-picture'>
        <HiArrowNarrowLeft className={this.props.selectedPhotoIndex !== 0 ? 'arrow-icon-white' : 'arrow-icon-white invisible'} onClick={this.previous.bind(this)} />
        {currentPhoto !== null
          ? <div className='big-picture plus-cursor'style={{backgroundImage:`url(${currentPhoto})`}} onClick={this.props.toggleZoom} data-testid={currentPhoto}></div>
          : <div className='big-picture no-thumbnail' ></div>
        }
        <HiArrowNarrowRight className={this.props.selectedPhotoIndex !== this.props.photos.length - 1 ? 'arrow-icon-white' : 'arrow-icon-white invisible'} onClick={this.next.bind(this)} role='next-arrow' />
      </div>
    )
  }
}

export default NormalZoom;
