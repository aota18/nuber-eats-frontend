import { render } from '@testing-library/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { NotFound } from '../404';

describe('<NotFound />', (() => {

    it('render OK', () => {
        const {getByText} = render(
            <Router>
                <NotFound />
            </Router>
        );
        
        getByText("Oops! Page Not Found!");
    })
}))