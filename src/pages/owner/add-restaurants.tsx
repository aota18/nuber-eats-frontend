import { gql, useApolloClient, useMutation, useQuery } from '@apollo/client';
import { data } from 'cypress/types/jquery';
import React ,{useState}from 'react';
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { Button } from '../../components/button';
import { FormError } from '../../components/form-error';
import { createRestaurant, createRestaurantVariables } from '../../__generated__/createRestaurant';
import { MY_RESTAURANTS_QUERY } from './my-restaurants';

const CREATE_RESTAURANT_MUTATION =gql`
    mutation createRestaurant($input: CreateRestaurantInput!){
        createRestaurant(input: $input){
            ok
            error
            restaurantId
        }
    }
`

interface IFormProps {
    name: string;
    address: string;
    categoryName: string;
    file: FileList
}

export const AddRestaurants = () => {

    const client = useApolloClient();
    const [imageUrl, setImageUrl] = useState('');
    const history = useHistory();

    const onCompleted = (data: createRestaurant) => {
        const {createRestaurant: {ok, restaurantId}} = data;
        if(ok){
            const {file, name, categoryName, address} = getValues();

            setUploading(false);

            const queryResult =client.readQuery({query: MY_RESTAURANTS_QUERY});
            console.log(queryResult);
      
            // client.writeQuery({
            //     query: MY_RESTAURANTS_QUERY,
            //     data: {
            //         myRestaurants: {
            //           ...queryResult.myRestaurants,
            //         restaurants: [
            //             {
            //                 address,
            //                 category: {
            //                     name: categoryName,
            //                     __typename: "Category",
            //                 },
            //                 coverImg: imageUrl,
            //                 id: restaurantId,
            //                 isPromoted: false,
            //                 name,
            //                 __typename: "Restaurant"
            //             },
            //             ...queryResult.myRestaurants.restaurants,
            //             ] 
            //         }
                    
            //     }
            // });


            history.push("/");
        }
    }

    const [createRestaurantMutation, {data}] = useMutation<
        createRestaurant, 
        createRestaurantVariables
    >(CREATE_RESTAURANT_MUTATION, {
        onCompleted,
    });

    const {register, getValues, formState, errors, handleSubmit} = useForm<IFormProps>({
        mode: "onChange"
    });

    const [uploading, setUploading] = useState(false);

    const onSubmit = async () => {
       

        
        
        try{
            setUploading(true);
            const {file, name, categoryName, address} = getValues();
            const actualFile = file[0];

            const formBody = new FormData();
            formBody.append("file", actualFile);

            const {url: coverImg} = await (
                await fetch("http://localhost:4000/uploads/", {
                    method: "POST",
                    body: formBody
                })
            ).json();

            setImageUrl(coverImg);

            createRestaurantMutation({
                variables: {
                    input: {
                        name,
                        categoryName, 
                        address, 
                        coverImg
                    }
                }
            })

        }catch(e){
            console.log(e);
        }
        
       
      

    }
    
    return (
        <div className="container flex flex-col items-center mt-52">
            <Helmet>
                <title>Add Restaurant | Nuber Eats</title>
            </Helmet>
            <h4 className="font-semibold text-2xl mb-3">Add Restaurant</h4>
            <form
                className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5" 
                onSubmit={handleSubmit(onSubmit)}>
                <input className="input" type="text" name="name" placeholder="Name" ref={register({required: "is required."})}/>
                <input className="input" type="text" name="address" placeholder="Address" ref={register({required: "is required."})}/>
                <input className="input" type="text" name="categoryName" placeholder="Category Name" ref={register({required: "is required."})}/>
                <input type="file" name="file" accept="image/*" ref={register({required:true})}/>
                
                <Button loading={uploading} canClick={formState.isValid} actionText="Create Restaurant"/>
                {data?.createRestaurant?.error && <FormError errorMessage={data.createRestaurant.error} />}
            </form>

        </div>
    )
}


