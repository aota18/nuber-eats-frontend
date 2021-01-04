import { render } from '@testing-library/react';
import React from 'react';
import { FormError } from '../components/form-error';

describe("<FormError />", () => {
    it('renders OK with props', () => {
        const {getByText} = render(<FormError errorMessage="test" />);
        getByText("test");
    })
})