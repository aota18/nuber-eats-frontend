import { gql, useQuery } from '@apollo/client';
import React, {useState} from 'react';
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import { Restaurant } from '../../components/restaurant';
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from '../../fragments';
import { restaurantsPageQuery, restaurantsPageQueryVariables } from '../../__generated__/restaurantsPageQuery';


const RESTAURANTS_QUERY = gql`
    query restaurantsPageQuery($input: RestaurantsInput!) {
        allCategories {
            ok
            error
            results {
               ...CategoryParts
            }
        }

        restaurants(input: $input) {
            ok
            error
            totalPages
            totalResults
            results {
                ...RestaurantParts
            }
        }
    }
    ${RESTAURANT_FRAGMENT}
    ${CATEGORY_FRAGMENT}
`

interface IFormProps {
    searchTerm: string;
}

export const Restaurants = () => {

    const [page, setPage] = useState(1);

    const {data, loading } = useQuery<
        restaurantsPageQuery, 
        restaurantsPageQueryVariables>(RESTAURANTS_QUERY, {
            variables: {
                input: {
                    page
                }
            }
        })

    console.log(data);

    const onNextPageClick = () => setPage(current => current+1)
    const onPrevPageClick = () => setPage(current => current-1)
    

    const {register, handleSubmit, getValues} = useForm<IFormProps>();
    const history = useHistory();
    const onSearchSubmit = () => {
        const {searchTerm} = getValues();

        history.push({
            pathname: "/search",
            search: `?term=${searchTerm}`

        })
    }

    return (
        <div>
            <Helmet>
                <title>Restaurants | Nuber Eats </title>
            </Helmet>
            <form
                onSubmit={handleSubmit(onSearchSubmit)}
                className="bg-gray-800 w-full py-40 flex items-center justify-center">
                <input
                    ref={register({ required: true, min:3})} 
                    name="searchTerm"
                    className="input rounded-md border-0 w-3/4 md:w-3/12" 
                    type="Search" 
                    placeholder="Search Restaurants...." />
            </form>

            {!loading && 
                <div className="max-w-screen-2xl mx-auto mt-8">
                    <div className="flex justify-around max-w-screen-lg mx-auto">
                        {data?.allCategories.results?.map((category) =>
                            <Link to={`/category/${category.slug}`}>
                                <div className="flex flex-col items-center cursor-pointer">
                                    <div 
                                        className="w-14 h-14  bg-cover hover:bg-gray-200 rounded-full"
                                        style= {{backgroundImage: `url(${category.coverImg})`}}>
                                    </div>
                                    <span className="mt-1 text-sm text-center font-medium">{category.name}</span>
                                </div>
                            </Link>
                        )}
                    </div>
                        <div className="grid mt-10 md:grid-cols-3 gap-x-5 gap-y-10">
                            {data?.restaurants.results?.map( restaurant => 
                            <Restaurant
                                key={restaurant.id}
                                id={restaurant.id +""}
                                coverImg={restaurant.coverImg}
                                name={restaurant.name}
                                categoryName={restaurant.category?.name}
                            />
                            )}
                        </div>
                    <div className="flex justify-center items-center mt-10 pb-20 ">
                        {page > 1 &&  <button onClick={onPrevPageClick} className=" focus:outline-none font-medium text-2xl">&larr;</button>}
                        <span className="mx-5">
                            Page {page} of {data?.restaurants.totalPages}
                        </span>
                        {page !== data?.restaurants.totalPages && 
                            

                            <button onClick={onNextPageClick} className=" focus:outline-none font-medium text-2xl">&rarr;</button>
                           
                        }
                    </div>
                </div>
            }
            
        </div>
    )
}