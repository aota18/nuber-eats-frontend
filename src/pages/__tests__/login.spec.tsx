import { ApolloProvider } from '@apollo/client';
import { createMockClient, MockApolloClient } from 'mock-apollo-client';
import { render, RenderResult, waitFor } from '@testing-library/react';
import {BrowserRouter as Router} from 'react-router-dom';
import React from 'react';
import { Login, LOGIN_MUTATION } from '../login';
import userEvent from '@testing-library/user-event';

describe('<Login />', () => {
    let renderResult: RenderResult;
    let mockClient: MockApolloClient;

    beforeEach( async () => {
        await waitFor(() => {
            mockClient = createMockClient();

           
            renderResult= render(
                    <Router>
                        <ApolloProvider client={mockClient}>
                            <Login />
                        </ApolloProvider>
                    </Router>
                    
            );

            

        })
    });

    it('should render OK', async () => {
        await waitFor(() => {
            expect(document.title).toBe("Login | Nuber Eats");
        })
    });

    it("displays email validation errors", async () => {
        const { getByPlaceholderText, debug , getByRole} = renderResult;
        /* Regex Expression i means lowerCase uppercase both are allowed */
        const email = getByPlaceholderText(/email/i);

        await waitFor(() => {
            userEvent.type(email, "this@wont");
        });

        let errorMessage = getByRole("alert");
        expect(errorMessage).toHaveTextContent(/Please enter a valid email/i);

        await waitFor(() => {
            userEvent.clear(email);
        });

    });

    it("displays password required errors", async () => {
        const { getByPlaceholderText, debug , getByRole} = renderResult;
        /* Regex Expression i means lowerCase uppercase both are allowed */
        const email = getByPlaceholderText(/email/i);
        const submitBtn = getByRole("button");
        await waitFor(() => {
            userEvent.type(email, "this@naver.com");
            userEvent.click(submitBtn);
        });

        let errorMessage = getByRole("alert");
        expect(errorMessage).toHaveTextContent(/password is required/i);

    });

    it("submits form and calls mutation", async () => {
        const { getByPlaceholderText, debug , getByRole} = renderResult;
        const email = getByPlaceholderText(/email/i);
        const password = getByPlaceholderText(/password/i);
        const submitBtn = getByRole("button")
        const formData = {
            email: "real@test.com",
            password: "123"
        }

        

        const mockedMutationResponse =jest.fn().mockResolvedValue({
            data: {
                login : {
                    ok: true,
                    token: "XXX",
                    error: null
                }
            }
        });
        mockClient.setRequestHandler(LOGIN_MUTATION, mockedMutationResponse);

        await waitFor(() => {
            userEvent.type(email, formData.email);
            userEvent.type(password, formData.password);
            userEvent.click(submitBtn);
        });

        expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
        expect(mockedMutationResponse).toHaveBeenCalledWith({
            loginInput: {
                email: formData.email,
                password: formData.password
            }
        })

       

        
    })

})