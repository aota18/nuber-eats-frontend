import { render } from '@testing-library/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Restaurant } from '../components/restaurant';

describe('<Restaurant />', () => {
    it('render OK with Props', () => {

        const restaurantProps = {
            id: "1",
            coverImg: "coverImg",
            name: "name",
            categoryName: "ctName"
        }
        const {debug, getByText, container} = render(
            <Router>
                <Restaurant {...restaurantProps}/>
            </Router>
        );

        debug();
        getByText("name");
        getByText("ctName");

        expect(container.firstChild).toHaveAttribute('href', `/restaurant/${restaurantProps.id}`)
    })
})