import React,{useRef} from 'react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import '@testing-library/jest-dom';
import {render, fireEvent, waitFor, screen} from '@testing-library/react';
import Reviews from '../client/src/components/reviews/Reviews';
import ReviewsList from '../client/src/components/reviews/ReviewsList';
import ReviewEntry from '../client/src/components/reviews/ReviewEntry';
import mockData from './mock/mockData.js';
import Rating from '../client/src/components/reviews/Rating';
import Product from '../client/src/components/reviews/Product';
import {reviewsSort, getCharMap, searchReviews} from '../client/src/components/reviews/helper-revs';

const server =setupServer(
  rest.get('/reviews', (req,res,ctx) => {
    return res(ctx.status(200));
  })
)

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Parent component Reviews Tests', () => {
  test('should render Rating&Reviews title', () => {
    render(<Reviews state={mockData} />)
    expect(screen.getByText('RATINGS & REVIEWS')).toBeDefined();
  });
})

describe('ReviewsList component Tests', () => {

  test('should render multiple reviews', async() => {
    const { container }= render(<ReviewsList reviews={mockData.reviews} id={mockData.product.id} newList={[]} interaction={() => {}}/>)
    expect(container.querySelector('.rev-sum')).toBeDefined();
    expect(container.querySelectorAll('li')).toHaveLength(2);

  })
  test('after click More Review button should render more reviews', async() => {
    window.HTMLElement.prototype.scrollIntoView = function() {};
    let reviews = render(<ReviewsList reviews={mockData.reviews} id={mockData.product.id} newList={[]} interaction={() => {}}/>)
    fireEvent.click(reviews.getByText("MORE REVIEWS"));
    expect(reviews.getAllByRole('reviews', {exact: false})).toHaveLength(3);
  })
  test('after click Add a review button should popup a window', async() => {
    const {baseElement, queryByText} = render(<ReviewsList reviews={mockData.reviews} id={mockData.product.id} newList={[]} interaction={() => {}} handleClick ={() => {}}/>);
    fireEvent.click(screen.getByText(/Add A REVIEW/i));
    await waitFor(() => expect(queryByText("Write Your Review")).toBeDefined());
  })
})

describe('ReviewsEntry component Tests', () => {
  test('should render one reviews', async() => {
    let review = render(<ReviewEntry review={mockData.reviews[0]}/>);
    expect(review.getAllByText('Not great!')).toBeDefined();
    let {container} = render(<ReviewEntry review={mockData.reviews[1]} />);
    expect(container.querySelector('.rev-recommend')).toBeInTheDocument();
  })
  test ('should handle click report button', async() => {
    const {baseElement, queryByText} = render(<ReviewEntry review={mockData.reviews[1]} interaction={() => {}}/>);
    fireEvent.click(screen.getByText('Report'));
    await waitFor(() => expect(queryByText("This review won't show again")).toBeDefined());
  })
  test('Find the helpfulness value', async () => {
    const review = render(<ReviewEntry review={mockData.reviews[1]} />);
    expect(review.getByText("(1)")).toBeInTheDocument();
  })
  test('if review donot have image should return null', () => {
    const {container}= render(<ReviewEntry review={mockData.reviews[0]}/>)
    expect(container.querySelector('.rev-photo')).toBeNull;

  })
  test("otherwise if review contain images should find the classname", () => {
    const {container} = render(<ReviewEntry review={mockData.reviews[1]}/>);
    expect(container.querySelector('.rev-photo')).toBeInTheDocument();
  })
})

describe('Rating breakdown & Product breakdown', () => {
  test('Rating breakdown should render 5 stars', () => {
    const {container} = render(<Rating rating={mockData.rating} reviews={mockData.reviews} reviewsMeta={mockData.reviewsMeta} toggle={[false, false, false, false, false]}/>);
    expect(container.querySelectorAll('.rat-chart')).toHaveLength(5);
  })
  test ('Product breakdown should render 4 factors', () => {
    const {container} = render(<Product chars={mockData.reviewsMeta.characteristics}/>)
    expect(container.querySelectorAll('.pod-progress')).toHaveLength(4);
    expect(screen.getByText("Fit")).toBeDefined();
  })
})

describe('Test all the helpers', () => {
  test('should handle reviews sort by different rating', () => {
    expect(reviewsSort(mockData.reviews, 5).length).toBe(2);
    expect(reviewsSort(mockData.reviews, 4).length).toBe(1);
  })
  test('getCharMap should return an object', () => {
    let map = getCharMap(mockData.reviewsMeta.characteristics);
    expect(typeof map).toBe("object");
  })
  test ('searchReviews function should return reviews contain key words', () => {
    expect(searchReviews(mockData.reviews, "This").length).toBe(2);
    expect(searchReviews(mockData.reviews, "test").length).toBe(2);
  })
})
