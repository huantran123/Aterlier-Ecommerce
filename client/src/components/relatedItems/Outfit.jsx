import React from 'react';
import OutfitSlider from './OutfitSlider.jsx';
import axios from 'axios';

class Outfit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      outfit: this.props.outfit
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if(JSON.stringify(prevProps.outfit) !== JSON.stringify(this.props.outfit)) {
      this.setState({
        outfit: this.props.outfit
      })
    }
  }

  render() {
    return (
      <div className='widget'>
        <h4>Your Outfit</h4>
        <OutfitSlider product={this.props.product} currentProduct={this.props.currentProduct} outfit={this.state.outfit} add={this.props.addToOutfit} delete={this.props.removeFromOutfit}/>
      </div>
    )
  }
}

export default Outfit;
