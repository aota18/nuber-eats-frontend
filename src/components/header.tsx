import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link } from 'react-router-dom';
import nuberLogo from '../images/logo.svg';

interface IHeaderProps {
    email: string
}
export const Header: React.FC<IHeaderProps> = ({email}) => {
    return (
        <header className=" py-4">
             <div className="w-full px-5 xl:px-0 max-w-screen-xl  mx-auto flex justify-between items-center">
            <img src={nuberLogo} className="w-24" />
            <span className="text-sm">
                <Link to="/my-profile">
                    <FontAwesomeIcon icon={faUser} className="text-xl"/>
                </Link>
            </span>
             </div>
        </header>
    )
}