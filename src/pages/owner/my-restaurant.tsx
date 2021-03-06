import { gql, useQuery, useSubscription } from '@apollo/client';
import React, {useEffect} from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Dish } from '../../components/dish';
import { DISH_FRAGMENT, FULL_ORDER_FRAGMENT, ORDERS_FRAGMENT, RESTAURANT_FRAGMENT } from '../../fragments';
import { myRestaurant, myRestaurantVariables } from '../../__generated__/myRestaurant';
import { MY_RESTAURANTS_QUERY } from './my-restaurants';

import {VictoryAxis, VictoryChart, VictoryLine, VictoryVoronoiContainer, VictoryTheme} from 'victory';
import { pendingOrders } from '../../__generated__/pendingOrders';


export const PENDING_ORDERS_SUBSCRIPTION = gql`
    subscription pendingOrders{
        pendingOrders{
            ...FullOrderParts
        }
    }
    ${FULL_ORDER_FRAGMENT}
`;



interface IParams {
    id: string;
}


export const MY_RESTAURANT_QUERY = gql`
    query myRestaurant($input: MyRestaurantInput!){
        myRestaurant(input: $input){
            ok
            error
            restaurant {
                ...RestaurantParts
                menu{
                    ...DishParts
                }
                orders{
                    ...OrderParts
                }
            }
        }
    }
    ${RESTAURANT_FRAGMENT}
    ${DISH_FRAGMENT}
    ${ORDERS_FRAGMENT}
`

export const MyRestaurant= () => {

    const {id} = useParams<IParams>();

    const {data} = useQuery<myRestaurant, myRestaurantVariables>(MY_RESTAURANT_QUERY, {
        variables: {
            input: {
                id: +id,
            }
        }
    });

    const chartData = [
        {x:1, y: 3000},
        {x:2, y: 1500},
        {x:3, y: 4250},
        {x:4, y: 2850},
        {x:5, y: 2300},
        {x:6, y: 7150},
        {x:7, y: 6830},
    ]

    const {data: subscriptionData} = useSubscription<pendingOrders>(PENDING_ORDERS_SUBSCRIPTION);

    console.log(subscriptionData);
    
    const history = useHistory();

    useEffect(() => {
        if(subscriptionData?.pendingOrders.id){
            history.push(`/orders/${subscriptionData?.pendingOrders.id}`)
        }
    }, [subscriptionData]);

    return (
        <div>
            <div className=" bg-gray-700 py-28 bg-center bg-cover"
            style={{backgroundImage: `url(${data?.myRestaurant.restaurant?.coverImg})`}}
            >
            </div>
            <div className="container mt-10">
                <h2 className="text-4xl font-medium mb-10">
                    {data?.myRestaurant.restaurant?.name || "Loading..."}
                </h2>
                <Link to={`/restaurant/${id}/add-dish`} className="mr-8 text-white bg-gray-800 py-3 px-10">
                    Add Dish &rarr;
                </Link>
                <Link to={``} className=" text-white bg-lime-700 py-3 px-10">
                    Buy Promotion &rarr;
                </Link>
            </div>
            <div className="mt-10">
                
                 {data?.myRestaurant.restaurant?.menu.length === 0 ? (<h4>Please upload a dish</h4> ) 
                :
                <div className="grid mt-10 md:grid-cols-3 gap-x-5 gap-y-10">
                    {data?.myRestaurant.restaurant?.menu.map((dish: any, index) => (
                        <Dish
                            key={index} 
                            name={dish.name} 
                            description={dish.description}
                            price={dish.price}
                        />
                    ))}
                </div>
                } 

                <div className="mt-3">
                    <h4 className="text-center text-2xl font-medium">Sales</h4>
                    <div className=" mx-auto">
                        <VictoryChart
                            height={500}
                            theme={VictoryTheme.material}
                            domainPadding={50}
                            width={window.innerWidth}
                            containerComponent={<VictoryVoronoiContainer />}>
                            <VictoryLine
                                style={{
                                    data: {
                                        strokeWidth: 5,
                                    }
                                }} 
                                data={
                                    data?.myRestaurant.restaurant?.orders.map((order) => ({
                                        x: order.createdAt,
                                        y: order.total
                                    }))
                                }
                            />
                            <VictoryAxis
                            style={{tickLabels: {fontSize: 20, color: "#4D7C0F"} as any}}
                                dependentAxis 
                                tickFormat={(tick) => `$${tick}`}
                            />
                            <VictoryAxis 
                                style={{tickLabels: {fontSize: 20} as any}}
                                tickFormat={(tick) => new Date(tick).toLocaleDateString("ko")}
                            />
                        </VictoryChart>
                    </div>
                </div> 
            </div>
        </div>
    )
}