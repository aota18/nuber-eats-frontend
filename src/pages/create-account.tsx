import { ApolloError, gql, useMutation } from '@apollo/client'
import React from 'react'
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import { Button } from '../components/button';
import { FormError } from '../components/form-error';
import nuberLogo from '../images/logo.svg';
import { createAccountMutation, createAccountMutationVariables } from '../__generated__/createAccountMutation';
import { UserRole } from '../__generated__/globalTypes';




const CREATE_ACCOUNT_MUTATION = gql`
    mutation createAccountMutation($createAccountInput: CreateAccountInput!) {
        createAccount(input: $createAccountInput) {
            ok
            error
        }
    }
`
interface ICreateAccountForm {
    email: string;
    password: string;
    role: UserRole

}

export default function CreateAccount() {

    const {register, getValues, watch, errors, handleSubmit, formState} = useForm<ICreateAccountForm>({
        mode:  "onChange",
        defaultValues: {
            role: UserRole.Client,
        }
    });


    const onError = (error: ApolloError) => {

    }
    const history = useHistory();

    const onCompleted = (data: createAccountMutation) => {
        const {createAccount: {ok, error}} = data;

        if(ok){
            //redirect to login page
            alert('Account Created! Log in now!')
            history.push('/')
        }
    }

    const [createAccountMutation, {data: createAccountMutationResult, loading}] = useMutation<
        createAccountMutation,
        createAccountMutationVariables
    >(CREATE_ACCOUNT_MUTATION, {
        onCompleted
    });

    const onSubmit =() => {

        console.log(watch());

        if(!loading){
            const {email, password, role} = getValues();
            createAccountMutation({
                variables: {
                    createAccountInput: {
                        email,
                        password,
                        role
                    }
                }
            })
        }
        
    }

    const onValid = () => {

    }

    return (
        <div>
             <div className="h-screen flex items-center flex-col mt-10 lg:mt-28 ">
            <Helmet>
                <title> Login | Nuber Eats</title>
            </Helmet>
            <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
                <img src={nuberLogo} className="w-52 mb-10" />
                <h4 className="w-full font-medium text-left text-3xl">Let's get started</h4>
                <form className="grid gap-3 mt-5  w-full" onSubmit ={handleSubmit(onSubmit)}>
                    <input 
                        ref={register({ 
                            required: "Email is required",
                            pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                        })} 
                        placeholder="Email" 
                        name="email"
                        type="email"
                        className="input mb-3"
                    />
                    {errors.email?.message && 
                        <FormError errorMessage={errors.email?.message} />
                    }
                    {errors.email?.type === 'pattern' && 
                        <FormError errorMessage={"Please enter a valid email"} />
                    }
                    <input 
                        ref={register({ 
                            required: "Password is required",
      
                        })} 
                        placeholder="Password" 
                        name="password"
                        type="password"
                        className="input" 
                    />
                    {errors.password?.message && 
                        <FormError errorMessage={errors.password?.message} />
                    }

                    <select name="role" ref={register({required: true})} className="input">
                        {Object.keys(UserRole).map((role,  index) => <option key={index}>{role}</option>)}
                    </select>
                    <Button canClick={formState.isValid} loading={loading} actionText={"Create Account"}/>
                    {createAccountMutationResult?.createAccount.error && 
                        <FormError errorMessage={createAccountMutationResult.createAccount.error} />}
                </form>

            <div className="mt-4 font-light">
                Already have an account? <Link to="/" className="link"> Log in now</Link>
            </div>
                </div>
        </div>
        </div>
    )
}
