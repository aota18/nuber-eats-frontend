import { on } from 'process';
import React from 'react';
import { useForm } from 'react-hook-form';
import { isLoggedInVar } from '../apollo';

export const LoggedOutRouter = () => {

    const {register, watch, handleSubmit } = useForm();
    
    const onSubmit = () => {
        console.log(watch("email"));
    }

    const onInvalid = () => {
        console.log("Can't create account");
    }

    const onClick = () => {
        isLoggedInVar(true);
    }
    return (
    <div>
        <h1> Logged Out </h1>
        <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
            <div>
                <input
                    ref={
                        register({
                            required: true,
                            validate: (email: string) => email.includes("gmail.com")
                        })
                    } 
                    name="email" 
                    type="email" 
                    required 
                    placeholder="email" />
            </div>
            <div>
                <input
                    ref={register} 
                    name="password" 
                    type="password" 
                    required 
                    placeholder="email"
                />
            </div>
            <button className="bg-yellow-300 text-white" type="submit" >Login</button>
        </form>
       
        
    </div>
    )
}