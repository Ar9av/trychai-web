'use client'
import React, { useEffect, useState } from 'react'
import Sources from './sources'
import { db } from '@/config'
import { addDoc, collection } from 'firebase/firestore'

const ApiData = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const keyResponse = [
    {
      id: 1,
      data: `Market Growth: The India tyre market is experiencing robust growth, with a compound annual growth rate (CAGR) of 8.71% during the forecast period 2023-2030. It is projected to reach USD 25.50 billion by FY2031 from USD 13.11 billion in FY2023, driven by the rapidly growing automotive industry in the country.`
    },
    {
      id: 2,
      data: `Demand Factors: The surge in demand for tyres is attributed to the rising disposable income, growing middle-class population, and government initiatives such as "Make in India". Infrastructure development and the push for electric vehicles have also contributed to market growth.`
    },
    {
      id: 3,
      data: `Market Growth: The India tyre market is experiencing robust growth, with a compound annual growth rate (CAGR) of 8.71% during the forecast period 2023-2030. It is projected to reach USD 25.50 billion by FY2031 from USD 13.11 billion in FY2023, driven by the rapidly growing automotive industry in the country.`
    },
    {
      id: 4,
      data: `Demand Factors: The surge in demand for tyres is attributed to the rising disposable income, growing middle-class population, and government initiatives such as "Make in India". Infrastructure development and the push for electric vehicles have also contributed to market growth.`
    }
  ];

  const addDataToFirestore = async () => {
    try {
      const docRef = await addDoc(collection(db, "searchData"), {
        keyResponse: keyResponse
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  useEffect(() => {
    addDataToFirestore();
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className='relative flex w-full' style={{ height: '100vh' }}>
      <div className={`transition-all duration-500 ${isCollapsed ? 'w-full' : 'w-[60%]'} overflow-y-auto h-full p-4`}>
        <p className='text-xm'>
          The Indian tyre industry is a significant part of the country&apos;s automotive sector, playing a
          crucial role in ensuring vehicle safety and performance. It is characterized by a highly
          competitive market with key players such as MRF Tyres, Apollo Tyres, CEAT, JK Tyre, and
          Bridgestone India Private Limited. These companies are expanding their production capacities
          and establishing new manufacturing facilities to meet the growing demand for tyres in India.
          The market is segmented into passenger, commercial, and off-the-road (OTR) tyres, with radial
          tyres being the dominant type. The industry is also seeing a shift towards environmentally
          friendly and fuel-efficient tyres to align with the government&apos;s sustainability goals.
        </p>
        <div className='mt-6 '>
          <h2 className='text-xl font-medium'>Key Points to Consider:</h2>
          <ul>
            {keyResponse.map((item, index) => (
              <li key={index} className='my-5 list-disc ml-5'>{item.data}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className={`transition-all duration-500 ${isCollapsed ? 'w-0' : 'w-[40%] ml-8'}`}>
        {!isCollapsed && <Sources />}
      </div>

      <button 
        onClick={toggleCollapse} 
        className='absolute top-1/2 transform -translate-y-1/2 right-0 p-2 bg-blue-500 text-white rounded-l flex items-center justify-center'>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          className={`w-6 h-6 transition-transform ${isCollapsed ? 'rotate-180' : 'rotate-0'}`}>
          <path strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d={isCollapsed ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
        </svg>
      </button>
    </div>
  )
}

export default ApiData