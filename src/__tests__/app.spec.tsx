
import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { isLoggedInVar } from '../apollo';
import { App } from '../components/app';

jest.mock("../routers/logged-out-router", () => {
    return {
        LoggedOutRouter: () => <span>Logged-out</span>
    }
})

jest.mock("../routers/logged-in-router", () => {
    return {
        LoggedInRouter: () => <span>Logged-in</span>
    }
})

describe("<App />", () => {
    it('renders LoggedOutRouter', () => {
        const {  getByText}  = render(<App />);
        getByText("Logged-out");
    });

    it('renders LoggedInRouter', async () => {
        const { getByText, debug}  = render(<App />);
        await waitFor(() => {
            isLoggedInVar(true);
        });
        debug();
        getByText("Logged-in");
    })
})