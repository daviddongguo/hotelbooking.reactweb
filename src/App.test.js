import React from 'react';
import {cleanup, render} from '@testing-library/react';
import App from './App';
import Scheduler from './scheduler/Scheduler';
import ReactDOM from 'react-dom';

//
// Note: running cleanup afterEach is done automatically for you in @testing-library/react@9.0.0 or higher
// unmount and cleanup DOM after the test is finished.
afterEach(cleanup);

//
test('renders App', () => {
	const {getByText} = render(<App />);
	const linkElement = getByText(/Hi/i);
	expect(linkElement).toBeInTheDocument();
});

it('renders Scheduler without crashing', () => {
	const div = document.createElement('div');
	ReactDOM.render(<Scheduler />, div);
	ReactDOM.unmountComponentAtNode(div);
});
