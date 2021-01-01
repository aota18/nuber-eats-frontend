import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link } from 'react-router-dom';
import { useMe } from '../hooks/useMe';
import nuberLogo from '../images/logo.svg';

interface IHeaderProps {
    email: string
}
export const Header: React.FC<IHeaderProps> = () => {

    const {data} = useMe();

    return (
        <>
        {!data?.me.verified && (
            <div className="bg-red-500 py-3 px-3 text-center text-sm text-white">
                <span>Please verify your email</span>
            </div>
        )}
        <header className=" py-4">
             <div className="w-full px-5 xl:px-0 max-w-screen-xl mx-auto flex justify-between items-center">
            <img src={nuberLogo} className="w-24" />
            <span className="text-sm">
                <Link to="/edit-profile">
                    <FontAwesomeIcon icon={faUser} className="text-xl"/>
                </Link>
            </span>
             </div>
        </header>
        </>
    )
}