import { gql, useQuery } from '@apollo/client';
import React from 'react';
import { isLoggedInVar } from '../apollo';
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom'
import { Restaurants } from '../pages/client/restaurants';
import {Header} from '../components/header';
import { useMe } from '../hooks/useMe';
import { NotFound } from '../pages/404';
import { ConfirmEmail } from '../pages/user/confirm-email';
import { EditProfile } from '../pages/user/edit-profile';
import { Search } from '../pages/client/search';
import { Category } from '../pages/client/category';
import { Restaurant } from '../pages/client/restaurant';
import { MyRestaurants } from '../pages/owner/my-restaurants';
import { AddRestaurants } from '../pages/owner/add-restaurants';
import { MyRestaurant } from '../pages/owner/my-restaurant';
import { AddDish } from '../pages/owner/add-dish';
import { Order } from '../pages/user/order';




const clientRoutes = [
    {
        path: "/",
        component: <Restaurants />
    },
    {
        path: "/search",
        component: <Search />
    },
    {
        path: "/category/:slug",
        component: <Category />
    },
    {
        path: "/restaurant/:id",
        component:  <Restaurant />
    }

]

const commonRoutes = [
    {
        path: "/confirm",
        component: <ConfirmEmail />
    },
    {
        path : "/edit-profile",
        component: <EditProfile />
    },
    {
        path : "/orders/:id",
        component: <Order />
    }
];

const restaurantRoutes = [
    {
        path: "/",
        component: <MyRestaurants />
    },
    {
        path: "/add-restaurant",
        component: <AddRestaurants />
    },
    {
        path: "/restaurant/:id",
        component: <MyRestaurant />
    },
    {
        path: "/restaurant/:restaurantId/add-dish",
        component: <AddDish />
    },
]

export const LoggedInRouter = () => {

    const {data, loading, error} = useMe();

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
            {commonRoutes.map(route => 
                <Route 
                key={route.path}
                path={route.path}
            >{route.component}
            </Route>
            )}

            {data.me.role === "Client" &&   
                clientRoutes.map(route => 
                    <Route
                        exact 
                        key={route.path}
                        path={route.path}
                    >{route.component}
                    </Route>) 
            }

            {data.me.role === "Owner" &&   
                restaurantRoutes.map(route => 
                    <Route
                        exact
                        key={route.path}
                        path={route.path}
                    >{route.component}
                    </Route>) 
            }

            
                <Route>
                    <NotFound />
                </Route>
        </Switch>
    </Router>

    )
}