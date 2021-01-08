import { ApolloError, gql, useMutation } from '@apollo/client';
import React from 'react'
import { useForm } from 'react-hook-form'
import nuberLogo from '../images/logo.svg'
import { FormError } from '../components/form-error';
import { loginMutation, loginMutationVariables } from '../__generated__/loginMutation';
import { Button } from '../components/button';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { authToken, isLoggedInVar } from '../apollo';
import { LOCALSTORAGE_TOKEN } from '../constants';


export const LOGIN_MUTATION = gql`
    mutation loginMutation($loginInput: LoginInput!) {
        login(input: $loginInput) {
            ok
            token
            error
        }
    }
`
interface ILoginForm {
    email: string;
    password: string;
    resultError?: string;
}


export const Login = () => {

    const {register, getValues, watch, errors, handleSubmit, formState} = useForm<ILoginForm>({
        mode:  "onChange"
    });

    const onCompleted = (data: loginMutation) => {
        const { login: {error, ok, token}} = data;

        
        if(ok && token){
            localStorage.setItem(LOCALSTORAGE_TOKEN, token);
            authToken(token);
            isLoggedInVar(true);
        }
    }

    const onError = (error: ApolloError) => {

    }

    const [loginMutation, {data: loginMutationResult, loading}] = useMutation<
        loginMutation, 
        loginMutationVariables
    >(LOGIN_MUTATION, {
        onCompleted,
        onError
    });

    const onSubmit =() => {
        if(!loading){
            const {email, password} = getValues();
            loginMutation({
                variables: {
                    loginInput: {
                        email,
                        password,
                    }
                }
            })
        }
        
    }

    const onValid = () => {

    }

    return (
        <div className="h-screen flex items-center flex-col mt-10 lg:mt-28 ">
            <Helmet>
                <title> Login | Nuber Eats</title>
            </Helmet>
            <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
                <img src={nuberLogo} className="w-52 mb-10" />
                <h4 className="w-full font-medium text-left text-3xl">Welcome back</h4>
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
                  
                    <Button canClick={formState.isValid} loading={loading} actionText={"Login"}/>
                    {loginMutationResult?.login.error && <FormError errorMessage={loginMutationResult.login.error} />}
                </form>

            <div className="mt-4 font-light">
                New to Nuber? <Link to="/create-account" className="link"> Create an Account</Link>
            </div>
                </div>
        </div>
    )
}
