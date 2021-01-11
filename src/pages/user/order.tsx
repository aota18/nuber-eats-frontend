import { gql, useQuery, useSubscription } from '@apollo/client';
import React, {useEffect} from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { FULL_ORDER_FRAGMENT } from '../../fragments';
import { useMe } from '../../hooks/useMe';
import { getOrder, getOrderVariables } from '../../__generated__/getOrder';
import { orderUpdates, orderUpdatesVariables } from '../../__generated__/orderUpdates';

const GET_ORDER = gql`
    query getOrder(
        $input: GetOrderInput!
    ){
        getOrder(input: $input){
            ok
            error
            order {
                ...FullOrderParts
            }
        }
    }
    ${FULL_ORDER_FRAGMENT}
`
const ORDER_SUBSCRIPTION = gql`
    subscription  orderUpdates($input: OrderUpdatesInput!){
        orderUpdates(input: $input){
            ...FullOrderParts
        }
    }
    ${FULL_ORDER_FRAGMENT}
`
interface IParams {
    id: string;
}

export const Order = () => {
    const params = useParams<IParams>();
    const {data:userData} = useMe();

    const {data, subscribeToMore} =useQuery<
        getOrder, 
        getOrderVariables
    >(GET_ORDER, {
        variables :{
            input: {
                id: +params.id
            }
        }
    });

    useEffect(() => {
        if(data?.getOrder.ok){
            subscribeToMore({
                document: ORDER_SUBSCRIPTION,
                variables: {
                    input: {
                        id: +params.id
                    }
                },
                updateQuery: (prev, {subscriptionData : {data}} : {subscriptionData: {data:orderUpdates}}) => {
                    if(!data) return prev;
                    return {
                        getOrder: {
                            ...prev.getOrder,
                            order: {
                                ...data.orderUpdates
                            }
                        }
                    }
                }
            })
        }
    }, [data])

    const {data:subscriptionData} = useSubscription<orderUpdates, orderUpdatesVariables>(ORDER_SUBSCRIPTION, {
        variables : {
            input: {
                id: +params.id,
            }
        }
    });

    console.log(subscriptionData);

    return (
        <div className="mt-32 container flex justify-center">
            <Helmet>
                <title> Orrder #{params.id} | Nuber Eats</title>
            </Helmet>
            {userData?.me.role==="Client" && (
                <span className="text-center mt-5 mb-3 text-2xl text-lime-600">
                    Status: {data?.getOrder.order?.status}
                </span>
            )}
            {userData?.me.role === "Owner" && (
                <>
                    {data?.getOrder.order?.status === "Pending" && 
                        <button className="btn">Accept Order</button>
                    }
                    {data?.getOrder.order?.status === "Cooking" && 
                        <button className="btn">Order Cooked</button>
                    }
                </>
            )}
        </div>
    )
}