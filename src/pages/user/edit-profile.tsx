import { gql, useApolloClient, useMutation } from '@apollo/client';
import React from 'react';
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import { Button } from '../../components/button';
import { useMe } from '../../hooks/useMe';
import { editProfile, editProfileVariables } from '../../__generated__/editProfile';


const EDIT_PROFILE_MUTATION = gql`
    mutation editProfile($input:EditProfileInput!) {
        editProfile(input: $input){
            ok
            error
        }
    }
`
interface IFormProps {
    email?: string;
    password?: string;
}



export const EditProfile = () => {

    const {data: userData} = useMe();

    const client = useApolloClient();

    const onCompleted = (data: editProfile) => {
        const {editProfile: {ok}} = data;
    
        /* Update Cache */
        if( ok && userData) {
            const {me: {email: prevEmail, id}} = userData;
            const {email: newEmail} = getValues();

            if(prevEmail !== newEmail){
                client.writeFragment({
                    id: `User:${id}`,
                    fragment: gql`
                     fragment EditedUser on User {
                         verified
                         email
                     }
                    `,
                    data: {
                        email: newEmail,
                        verified: true,
                    }
                })
            }
        }    
    }

    const [editProfile, {loading}] = useMutation<
        editProfile, 
        editProfileVariables
    >(EDIT_PROFILE_MUTATION);

    const {register, handleSubmit, getValues, formState} = useForm<IFormProps>({
        mode: "onChange",
        defaultValues: {
            email: userData?.me.email,
            password: ""
        }
    });

    const onSubmit = () => {
        const {email, password} = getValues();

        editProfile({
            variables: {
                input: {
                    email,
                    ...(password !== "" && {password})
                }
            }
        })
    }
    return <div className="mt-52 flex flex-col justify-center items-center">
        <Helmet>
                <title>Confirm Email | Nuber Eats</title>
            </Helmet>
        <h4 className="font-semibold text-2xl mb-3">Edit Profile</h4>

        <form className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5" onSubmit={handleSubmit(onSubmit)}>
            <input
                ref={register({
                    pattern:  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                })}
                name="email" 
                type="email"
                className="input"
                placeholder="Email"
            />
            <input 
                ref={register}
                name="password"
                type="password"
                className="input"
                placeholder="Password"
            />
            <Button loading={false} canClick={formState.isValid} actionText="Save Profile" />
        </form>
    </div>
}