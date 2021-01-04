import {render, waitFor } from '@testing-library/react';
import React from 'react';
import { Header } from '../components/header';
import {MockedProvider} from '@apollo/client/testing';
import { BrowserRouter as Router } from 'react-router-dom';
import { ME_QUERY} from '../hooks/useMe';

describe('<Header />', ()=> {
    it('render without verify banner', async () => {

        await waitFor(async () => {
            
            const mocks = [
                {
                    request:{
                        query: ME_QUERY
                    },
                    result: {
                        data: {
                            me: {
                                id:1,
                                email: "",
                                role: "",
                                verified: true
                            }
                        }
                    }
                }
            ]
            const headerProps = {
                email: "email"
            }
            const {queryByText} = render(
                <MockedProvider mocks={mocks}>
                    <Router>
                        <Header {...headerProps}/>
                    </Router>
                </MockedProvider>
            );
    
            await new Promise(resolve => setTimeout(resolve, 0));
            expect(queryByText("Please verify your email")).toBeNull();
        })
    });

    it('render verify banner', async () => {

        await waitFor(async () => {
           
            const mocks = [
                {
                    request:{
                        query: ME_QUERY
                    },
                    result: {
                        data: {
                            me: {
                                id:1,
                                email: "",
                                role: "",
                                verified: true
                            }
                        }
                    }
                }
            ]
            const headerProps = {
                email: "email"
            }
            const {getByText} = render(
                <MockedProvider>
                    <Router>
                        <Header {...headerProps}/>
                    </Router>
                </MockedProvider>
            );
    
            await new Promise(resolve => setTimeout(resolve, 0));
            getByText('Please verify your email')
        })
    })
})