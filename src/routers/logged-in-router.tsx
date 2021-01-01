import { gql, useQuery } from '@apollo/client';
import React from 'react';
import { isLoggedInVar } from '../apollo';
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom'
import { Restaurants } from '../pages/client/restaurants';
import {Header} from '../components/header';
import { useMe } from '../hooks/useMe';


const ClientRoutes = [
    
      
            <Route path="/" exact>
                <Restaurants />
            </Route>
       
    
]


export const LoggedInRouter = () => {

    const {data, loading, error} = useMe();


    console.log(data);

    if(!data || error || loading){
        return (
        <div className="h-screen flex justify-center items-center">
            <span className="font-medium text-xl">Loading...</span>
        </div>
        )
    }

    const onClick = () => {
        isLoggedInVar(false);
    }
    return (
    <Router>
        <Header email={data.me.email}/>
        <Switch>
            {data.me.role === "Client" && ClientRoutes }
                <Redirect to="/" />
        </Switch>
    </Router>

    )
}