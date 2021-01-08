import { gql, useApolloClient, useQuery } from '@apollo/client';
import React, {useEffect} from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Restaurant } from '../../components/restaurant';
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from '../../fragments';
import { myRestaurants } from '../../__generated__/myRestaurants';

export const MY_RESTAURANTS_QUERY = gql`
    query myRestaurants {
        myRestaurants {
            ok
            error
            restaurants {
                ...RestaurantParts
            }
        }
        
    }
    ${RESTAURANT_FRAGMENT}

`
export const MyRestaurants = () => {

    const {data} = useQuery<myRestaurants>(MY_RESTAURANTS_QUERY);

    const client = useApolloClient();
    

    useEffect(() =>{
        
        const queryResult =client.readQuery({query: MY_RESTAURANTS_QUERY});
        console.log(queryResult);
    }, [])
    


    return (
        <div>
            <Helmet>
                <title> My Restaurants | Nuber Eats</title>
            </Helmet>
            <div className="container mt-32">
                <h2 className="text-4xl font-medium mb-10">My Restaurants</h2>
                {
                    data?.myRestaurants.ok && 
                    data.myRestaurants.restaurants.length === 0 ?
                    (<>
                    <h4 className="text-xl mb-5">You have no restaurants.</h4>
                    <Link className="link" to="/add-restaurant">
                        Create one &rarr;
                    </Link>
                    
                    </>
                    ) : 
                    <div className="grid mt-10 md:grid-cols-3 gap-x-5 gap-y-10">
                    {data?.myRestaurants.restaurants.map( (restaurant) => 
                        <Restaurant
                            key={restaurant.id}
                            id={restaurant.id +""}
                            coverImg={restaurant.coverImg}
                            name={restaurant.name}
                            categoryName={restaurant.category?.name}
                        />
                        )}
                    </div>
                    }
            </div>
            
        </div>
    )
}