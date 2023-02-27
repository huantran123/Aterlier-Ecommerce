import React from 'react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import '@testing-library/jest-dom';
import {render, fireEvent, waitFor, screen} from '@testing-library/react';
import mockData from './mock/mockData.js';

import QA from '../client/src/components/qa/QA.jsx';
import QuestionBar from '../client/src/components/qa/QA.jsx';
import QAList from '../client/src/components/qa/QA.jsx';
import Add from '../client/src/components/qa/QA.jsx';


const server = setupServer(
  rest.get('/qa/questions/:question_id', (req, res, ctx) => {
    return res(ctx.status(200));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('QA Component Test', () => {
  test('Should render Widget Title', () => {
    render(<QA product={mockData.product} />);
    expect(screen.getByText("QUESTIONS & ANSWERS")).toBeDefined();
  });
});
