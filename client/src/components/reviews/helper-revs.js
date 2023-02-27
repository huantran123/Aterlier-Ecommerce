export const reviewsSort = (reviews, key) => {
  let reviewsMap = {};
  reviews.forEach(review => {
    if (!reviewsMap[review.rating]) {
      reviewsMap[review.rating] = [];
    }
    reviewsMap[review.rating].push(review);
  })
  return reviewsMap[key];
}

export const getCharMap = (charsObj) => {
  let factMap = {};
  Object.keys(charsObj).forEach((item) => {
   factMap[item] = charsObj[item].id;
  })
  return factMap;
}

export const searchReviews = (reviewsArr, keyWords) => {
  keyWords = keyWords.toLowerCase();
  return reviewsArr.filter((review) => {
    review.body = review.body.toLowerCase();
    review.summary = review.summary.toLowerCase();
    if (review.body.indexOf(keyWords) >= 0 || review.summary.indexOf(keyWords)>=0) {
      return review;
    }
  })
}

export const sortedReview = (reviewsList, method) => {
  let copy = reviewsList.slice();
  if (method === 'helpful') {
    copy.sort((a, b) => {
      if (a.helpfulness >= b.helpfulness) {
        return -1;
      } else {
        return 1;
      }
    })
  }
  if (method === 'newest') {
    copy.sort((a,b) => {
      let keyA = new Date(a.date);
      let keyB = new Date(b.date);
      if (keyA > keyB) {
        return -1;
      } else {
        return 1;
      }
    })
  }
  if (method === 'relevance') {
    copy.sort((a, b) => {
      let keyA = new Date(a.date);
      let keyB = new Date(b.date);
      return b.helpfulness - a.helpfulness || keyA - keyB;
    })
  }
  return copy;
}

export const recommend = (recommendData) => {
  if (recommendData['true'] === undefined) {
    return 0;
  }
  if (recommendData['false'] === undefined) {
    return 100;
  }
  let temp = parseInt(recommendData['true']) / (parseInt(recommendData['true']) + parseInt(recommendData['false']));
  return Math.round(temp * 100);
}
