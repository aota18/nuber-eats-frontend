import React from 'react';
import { Link } from 'react-router-dom';

interface IRestaurantProps{
    id: string;
    coverImg: string;
    name: string;
    categoryName?: string;
}

export const Restaurant: React.FC<IRestaurantProps> = ({id, coverImg, name, categoryName}) => {
     
    return (
        <Link to={`/restaurant/${id}`}>
            <div className="flex flex-col">
                <div
                    style={{backgroundImage: `url(${coverImg})`}} 
                    className="bg-red-500 bg-cover bg-center mb-3 py-28"> 
                </div>
                <h3 className="text-xl font-medium">{name}</h3>
                <span className="border-t mt-4 py-2 text-xs border-gray-200">
                        {categoryName}
                </span>
            </div>
        </Link>
    )
}