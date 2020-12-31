import { ApolloError, gql, useMutation } from '@apollo/client';
import React from 'react'
import { useForm } from 'react-hook-form'
import { FormError } from '../components/form-error';
import { loginMutation, loginMutationVariables } from '../__generated__/loginMutation';


const LOGIN_MUTATION = gql`
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


export default function Login() {

    const {register, getValues, watch, errors, handleSubmit} = useForm<ILoginForm>();

    const onCompleted = (data: loginMutation) => {
        const { login: {error, ok, token}} = data;
        if(ok){
            console.log(token);
        }else {
            if(error){

            }
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
        <div className="h-screen flex items-center justify-center bg-gray-800">
            <div className="bg-white w-full max-w-lg pt-5 pb-7 rounded-lg text-center">
                <h3 className="text-2xl font-bold  text-gray-800">
                    Log In
                </h3>

                <form className="grid gap-3 mt-5 px-5" onSubmit ={handleSubmit(onSubmit)}>
                    <input 
                        ref={register({ 
                            required: "Email is required"
                        })} 
                        placeholder="Email" 
                        name="email"
                        type="email"
                        className="input mb-3"
                    />
                    {errors.email?.message && 
                        <FormError errorMessage={errors.email?.message} />
                    }
                    <input 
                        ref={register({ 
                            required: "Password is required",
                            minLength: 10
                        })} 
                        placeholder="Password" 
                        name="password"
                        type="password"
                        className="input" 
                    />
                    {errors.password?.message && 
                        <FormError errorMessage={errors.password?.message} />
                    }
                    {errors.password?.type === 'minLength' && 
                        <FormError errorMessage={"Password should be longer than 10"} />
                    }
                    <button className="mt-3 btn ">
                        {loading ? "Loading ..." : "Log In"}
                    </button>
                    {loginMutationResult?.login.error && <FormError errorMessage={loginMutationResult.login.error} />}
                </form>
            </div>
        </div>
    )
}
