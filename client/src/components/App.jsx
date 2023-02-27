import React from 'react';
import { FaSistrix } from "react-icons/fa";
import Overview from './overview/Overview.jsx';
import RelatedItems from './relatedItems/RelatedItems.jsx';
import Outfit from './relatedItems/Outfit.jsx';
import QA from './qa/QA.jsx';
import Reviews from './reviews/Reviews.jsx';
import axios from 'axios';
import Star from './Star/Star.jsx';
import AddReview from './reviews/addReview/AddReview.jsx';
import {calculateRating, reviewsCount, extractLocalStorage} from '../helpers.js'
import OutfitCard from './relatedItems/OutfitCard.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      product: {},
      currentProduct: {},
      rating: 0,
      reviewsMeta: {},
      reviews:[],
      reviewsLength:0,
      addReview: false,
      keyword:'',
      outfit: extractLocalStorage(localStorage)
    }
    this.topRef = React.createRef();
    this.reviewsRef = React.createRef();
    this.interaction = this.interaction.bind(this);
  }

  // Handle unique url code(replace these code from line33-54)
  init(id) {
    this.getProduct(id)
      .then(()=> {
        return this.getReviewsMeta();
      })
      .then(() => {
        this.getReviews({count: this.state.reviewsLength});
      })
  }

  componentDidMount() {
    let path = location.pathname;
    if (path === '/') {
      this.init(71697);
    } else {
      var productId  = path.split('/')[1];
      this.init(productId);
    }
  }

  // Get info of current product
  getProduct(productId) {
    return axios.get(`/products/${productId}`)
      .then(res => {
        return this.setState({
          product: res.data
        }, () => {
          console.log('Product: ', this.state.product);
        })
      })
  }

  // Get Review meta for current product
  getReviewsMeta() {
    return axios.get(`/reviews/meta/${this.state.product.id}`)
      .then((res) => {
        console.log('Review Meta: ', res.data)
        return this.setState({
          reviewsMeta: res.data,
          rating: calculateRating(res.data.ratings),
          reviewsLength: reviewsCount(res.data.ratings)
        });
      })
  }

  // Get reviews of current product
  getReviews({count}) {
    axios.post(`/reviews/${this.state.product.id}`, {count})
    .then((res) => {
      console.log('Reviews: ', res.data.results)
      this.setState({
        reviews: res.data.results
      });
    })
  }

  selectProduct(product) {
    location.pathname = ('/' + product.id.toString());
    this.init(product.id);
  }

  // Open add review popup
  togglePop(){
    console.log('add review clicked!');
    this.setState({
      addReview: !this.state.addReview
    })
  }

  // Add new review
  addReview(review) {
    console.log('start adding new Reviews: ', review);
    review.recommend = review.recommend === "yes";
    return axios.post('/addReview', {review})
  }

  // Scroll to review section
  handleScrollToReviews(event) {
    window.scrollTo(0, this.reviewsRef.current.offsetTop);
  }

  // Scroll to top
  handleScrollToTop(event) {
    window.scrollTo(0, this.topRef.current.offsetTop);
  }

  // Handle search in navbar for future development
  handleSearchChange(e){
    this.setState({
      keyword: e.target.value
    })
  }

  // onClick function for logo to go back to first product in the list
  backToDefaultProduct() {
    location.pathname = ('/');
    this.init(71697);
  }

  getAllCurrentProductInfo(product) {
    this.setState({currentProduct: product})
  }

  // Add the product id to the outfit list if product hasn't been added yet
  addToOutfit(product) {
    console.log(localStorage);
    var outfit = {...this.state.outfit};
    if (outfit[product.id] || localStorage[product.id]) {
      alert('Product Already Added To Outfit!')
    } else {
      outfit[product.id] = product;
    this.setState({outfit}, () => {
      console.log('Current Outfit after adding: ', this.state.outfit);
      localStorage.setItem(`${product.id}`, JSON.stringify(product));
      console.log('Local storage after adding: ', localStorage);
    });
    }
  }

  // Remove the product id from the outfit list if the list already includes the product
  removeFromOutfit(productId) {
    var outfit = {...this.state.outfit};
    delete outfit[productId]
    this.setState({outfit}, () => {
      console.log('Current Outfit after removing: ', this.state.outfit);
      localStorage.removeItem(`${productId}`);
      console.log('Local storage after removing: ', localStorage);
    });
  }

  // Track the interaction of clickable elements
  interaction(element, widget) {
    let time = new Date();
    axios.post('/interactions', {element, widget, time})
  }

  render() {
    if (JSON.stringify(this.state.product) !=='{}' && JSON.stringify(this.state.reviewsMeta) !=='{}') {
      return (
        <div>
          <div className="header" ref={this.topRef}>
            <span className="logo pointer-cursor"  onClick={this.backToDefaultProduct.bind(this)}>ATELIER</span>
              <span className="search">
                <input type="text" aira-label="Search" onChange={this.handleSearchChange.bind(this)} value={this.state.keyword}/>
                <FaSistrix />
              </span>
          </div>
          <div className='container'>
            <AddReview show={this.state.addReview} product={this.state.product} handleClick={this.togglePop.bind(this)} addReview={this.addReview.bind(this)} chars={this.state.reviewsMeta.characteristics} interaction={this.interaction}/>
            <Overview product={this.state.product} handleScrollToReviews={this.handleScrollToReviews.bind(this)} rating={this.state.rating} outfit={this.state.outfit} addToOutfit={this.addToOutfit.bind(this)} removeFromOutfit={this.removeFromOutfit.bind(this)} interaction={this.interaction} getAllCurrentProductInfo={this.getAllCurrentProductInfo.bind(this)} />
            <RelatedItems product={this.state.product} selectProduct={this.selectProduct.bind(this)} handleScrollToTop={this.handleScrollToTop.bind(this)} interaction={this.interaction} rating={this.state.rating}/>
            <Outfit product={this.state.product} currentProduct={this.state.currentProduct} outfit={this.state.outfit}  addToOutfit={this.addToOutfit.bind(this)} removeFromOutfit={this.removeFromOutfit.bind(this)} interaction={this.interaction}/>
            <QA product={this.state.product} interaction={this.interaction}/>
            <Reviews state={this.state} scrollToReviews={this.reviewsRef} handleClick={this.togglePop.bind(this)} interaction={this.interaction}/>
          </div>
        </div>
      )
    } else {
      return null;
    }
  }
}

export default App;



