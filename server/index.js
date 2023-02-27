require('dotenv').config();
const path = require('path');
const axios = require('axios');
const express = require('express');
const compression = require('compression');
const Promise = require("bluebird");
const cloudinary = require("cloudinary").v2;

const app = express();
app.use(compression());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended: true, limit: '50mb'}));
app.use(express.static(path.join(__dirname, '../client/dist')));

const headers = {headers: {authorization: process.env.TOKEN}};
const root = 'http://app-hrsei-api.herokuapp.com/api/fec2/hr-rpp'

/* --------------------------------------- Product Info --------------------------------------- */

// get all products
app.get('/products', async (req, res) => {
  let url = `${root}/products?count=20`;
  axios.get(url, headers)
    .then((products) => {
      res.status(200).json(products.data);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(err);
    })
})

// get a product
app.get('/products/:product_id', (req, res) => {
  let url = `${root}/products/${req.params.product_id}`;
  return axios.get(url, headers)
    .then(result => {
      res.status(200).json(result.data)})
    .catch(err => {
      console.log(err);
      res.status(500).json(err);})
});

// get product styles
app.get('/products/:product_id/styles', async (req, res) => {
  let url = `${root}/products/${req.params.product_id}/styles`;
  const styles = await axios.get(url, headers);
  res.status(200).json(styles.data);
})

/* --------------------------------------- Q&A --------------------------------------- */

// get questions
app.get('/qa/questions/:product_id', (req, res) => {
  let url = `${root}/qa/questions/?product_id=${req.params.product_id}&count=50`;
  axios.get(url, headers)
  .then((response) => res.status(200).json(response.data))
  .catch((err) => console.error(err))
})

// get answers
app.get('/qa/questions/:question_id/answers', (req, res) => {
  let url = `${root}/qa/questions/${req.params.question_id}/answers?count=50`;
  axios.get(url, headers)
  .then((response) => res.status(200).json(response.data))
  .catch((err) => console.error(err))
})

// post a question
app.post('/qa/questions', (req, res) => {
  let url = `${root}/qa/questions`;
  axios.post(url, req.body, headers)
  .then((response) => {
    console.log('Success Creating Question');
    console.log('Response', response);
    res.status(201).json(response.data)
  })
  .catch((err) => { console.error(err) })
})

// post an answer
app.post('/qa/questions/:question_id/answers', (req, res) => {
  let url = `${root}/qa/questions/${req.params.question_id}/answers`;
  axios.post(url, req.body, headers)
  .then((response) => {
    console.log('Success Creating Answer');
    res.status(201).json(response.data)
  })
  .catch((err) => { console.error(err) })
})

// mark question helpful
app.put('/qa/questions/:question_id/helpful', (req, res) => {
  let url = `${root}/qa/questions/${req.params.question_id}/helpful`;
  axios.put(url, {}, headers)
  .then((response) => res.status(204).json(response.data))
  .catch((err) => console.error(err))
})

// mark answer helpful
app.put('/qa/answers/:answer_id/helpful', (req, res) => {
  let url = `${root}/qa/answers/${req.params.answer_id}/helpful`;
  axios.put(url, {}, headers)
  .then((response) => res.status(204).json(response.data))
  .catch((err) => console.error(err))
})

// report question
app.put('/qa/questions/:question_id/report', (req, res) => {
  let url = `${root}/qa/questions/${req.params.question_id}/helpful`;
  axios.put(url, {}, headers)
  .then((response) => res.status(204).json(response.data))
  .catch((err) => console.error(err))
})

// report answer
app.put('/qa/answers/:answer_id/report', (req, res) => {
  let url = `${root}/qa/answers/${req.params.answer_id}/report`;
  axios.put(url, {}, headers)
  .then((response) => res.status(204).json(response.data))
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  })
})

/* --------------------------------------- Reviews --------------------------------------- */

// get product reviews
app.post('/reviews/:product_id', (req, res) => {
  let url = `${root}/reviews/?product_id=${req.params.product_id}&count=${req.body.count}`;
  return axios.get(url, headers)
    .then((results) => {
      res.status(200).json(results.data);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    })
})

// update review helpful & report
app.put('/reviews/:review_id/helpful', (req, res) => {
  let url = `${root}/reviews/${req.params.review_id}/helpful`;
  return axios.put(url,{}, headers)
   .then(() => {
    res.status(200).json('just updated helpful');
   })
   .catch(err => {
    console.log(err);
    res.status(500).json(err);
  })
})

// report a review
app.put('/reviews/:review_id/report', (req, res) => {
  let url =`${root}/reviews/${req.params.review_id}/report`;
  return axios.put(url, {}, headers)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    })
})

// post a review
app.post('/addReview', (req, res) => {
  let url = `${root}/reviews`;
  const {review} = req.body;
  console.log('new Review in server: ', review);
  for (let key in review.characteristics) {
    review.characteristics[key] = parseInt(review.characteristics[key]);
  }
  console.log("after: ", review);
  return axios.post(url, req.body.review, headers)
    .then(() => {
      res.status(201).json('added!');
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    })
})

// upload pics to image hosting
app.post('/upload', (req, res) => {
  let promises = []
  req.body.images.forEach((image) => {
    promises.push(cloudinary.uploader.upload(image))
  })
  Promise.all(promises)
    .then((results) => {
      res.status(201).json(results);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    })
})

// get product reviews meta
app.get('/reviews/meta/:product_id', (req, res) => {
  let url = `${root}/reviews/meta?product_id=${req.params.product_id}`;
  return axios.get(url, headers)
    .then((results) => {
      res.status(200).json(results.data);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    })
})

/* --------------------------------------- Related Products --------------------------------------- */

// get related products
app.get('/products/:product_id/related', async (req, res) => {
  let url = `${root}/products/${req.params.product_id}/related`;
  axios.get(url, headers)
  .then((items) => {
    res.status(200).json(items.data);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  })
})

/* --------------------------------------- Other Interactions --------------------------------------- */

// send interactions detail to API
app.post('/interactions', (req, res) => {
  let url = `${root}/interactions`;
  const {element, widget, time} = req.body;
  console.log('interactions====> ', req.body);
  return axios.post(url, {element, widget, time}, headers)
    .then((result) => {
      console.log('interactions message: ', result.statusText);
      res.status(result.status).json('just created')
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    })
})

// update url with current product id
app.get('/:productId', (req, res) => {
  res.sendFile('index.html', { root: path.join(__dirname, '../client/dist') }, (err) => {
    if(err) {
      res.status(500).json(err);
    } else {
      console.log('Chang id');
    }
  })
})

let PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening at Port: ${PORT}`));
