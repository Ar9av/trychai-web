//components/sources.jsx
'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import sourceImg from '../assets/logo.jpg'
import { FetchingData } from './FetchingData';
const Sources = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await FetchingData();
        setData(result);
      } catch (error) {
        console.error("Error in items ", error);
      }
    };
    fetchData();
  }, []);
  console.log("Hello Data,", data.sources)
    const sourceData = [
        {
            id: 1,
            img: sourceImg,
            website: `m.economictimes.com > industry > au..`,
            title: 'Tyre exports from India recorded at Rs 23073 cr in FY24',
            description: 'The India Tyre Market is experiencing robust growth of 8.71% CAGR during the forecast period 2023-2030 and is projected to reach USD 25.50 billion by..'
        },
        {
            id: 2,
            img: sourceImg,
            website: `m.economictimes.com > industry > au..`,
            title: 'Tyre exports from India recorded at Rs 23073 cr in FY24',
            description: 'The India Tyre Market is experiencing robust growth of 8.71% CAGR during the forecast period 2023-2030 and is projected to reach USD 25.50 billion by..'
        },
        {
            id: 3,
            img: sourceImg,
            website: `m.economictimes.com > industry > au..`,
            title: 'Tyre exports from India recorded at Rs 23073 cr in FY24',
            description: 'The India Tyre Market is experiencing robust growth of 8.71% CAGR during the forecast period 2023-2030 and is projected to reach USD 25.50 billion by..'
        },
        {
            id: 4,
            img: sourceImg,
            website: `m.economictimes.com > industry > au..`,
            title: 'Tyre exports from India recorded at Rs 23073 cr in FY24',
            description: 'The India Tyre Market is experiencing robust growth of 8.71% CAGR during the forecast period 2023-2030 and is projected to reach USD 25.50 billion by..'
        },
        {
            id: 5,
            img: sourceImg,
            website: `m.economictimes.com > industry > au..`,
            title: 'Tyre exports from India recorded at Rs 23073 cr in FY24',
            description: 'The India Tyre Market is experiencing robust growth of 8.71% CAGR during the forecast period 2023-2030 and is projected to reach USD 25.50 billion by..'
        },
    ]
    return (
        <div className='h-[60%] overflow-y-auto'>
            {sourceData.map((item,index)=>(
                <div key={index} className='mb-3'>
            <div className='flex gap-2 items-center'>
                <p className='bg-gray-700 w-5 h-6 rounded-full flex justify-center items-center text-sm'>{index+1}</p>
                <Image
                    className='rounded-full'
                    src={item.img}
                    width={30}
                    height={8}
                    objectFit="cover"
                    alt="Picture of the author"
                />
                    <p className='text-[#6D7073]'>{item.website}</p>
            </div>
            <div>
                <h3 className='text-[#7497CD] text-xl w-[70%] my-2'>{item.title}</h3>
                <p className='text-sm w-[70%]'>{item.description}</p>
            </div>
            </div>
            ))}
        </div>
    )
}

export default Sources
