import { gql, useQuery } from '@apollo/client';
import React, {useState} from 'react';
import {useParams } from 'react-router-dom';
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from '../../fragments';
import { category, categoryVariables } from '../../__generated__/category';


const CATEGORY_QUERY = gql`
    query category ($input: CategoryInput!){
        category(input: $input){
            ok
            error
            totalPages
            totalResults
            restaurants {
                ...RestaurantParts
            }
            category{
                ...CategoryParts
            }
        }
    }
    ${RESTAURANT_FRAGMENT}
    ${CATEGORY_FRAGMENT}
`

interface ICategoryParams {
    slug: string
}


export const Category = () => {

    const [page, setPage] = useState(1);

    const params = useParams<ICategoryParams>();

    const {data, loading} = useQuery<category, categoryVariables>(CATEGORY_QUERY, {
        variables: {
            input: {
                page,
                slug: params.slug
            }
        }
    });

    return (
        <div>
            <h1>Category</h1>
        </div>
    )
}