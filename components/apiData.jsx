// components/apiData.jsx
'use client'
import React, { useEffect, useState } from 'react';
import Sources from './sources';
import { db } from '@/config';
import { addDoc, collection } from 'firebase/firestore';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import 'github-markdown-css'; // Import GitHub markdown CSS

const ApiData = () => {
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 768);

  useEffect(() => {
    const addDataToFirestore = async () => {
      try {
        const keyResponse = JSON.parse(localStorage.getItem('apiData')) || [];
        let dataToStore;
        if (keyResponse.body && keyResponse.body.summary) {
          dataToStore = keyResponse.body.summary;
        } else if (keyResponse.body) {
          dataToStore = keyResponse.body;
        } else {
          dataToStore = keyResponse;
        }
        const docRef = await addDoc(collection(db, "searchData"), {
          keyResponse: dataToStore
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    };
    addDataToFirestore();
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const apiData = JSON.parse(localStorage.getItem('apiData')) || [];

  return (
    <div className='relative flex w-full' style={{ height: '100vh' }}>
      <div className={`transition-all duration-500 ${isCollapsed ? 'w-full' : 'w-[70%]'} overflow-y-auto h-full p-4`}>
        <ReactMarkdown 
          className='markdown-body' // Apply GitHub markdown CSS class
          remarkPlugins={[remarkGfm]} 
          rehypePlugins={[rehypeRaw]}
        >
          {apiData.summary}
        </ReactMarkdown>
      </div> 

      <div className={`transition-all duration-500 ${isCollapsed ? 'w-0' : 'w-[30%]'} overflow-y-auto h-full`}>
        {!isCollapsed && apiData.sources && <Sources data={apiData.sources} />}
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
  );
};

export default ApiData;