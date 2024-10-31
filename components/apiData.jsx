// components/apiData.jsx
'use client'
import React, { useEffect, useState } from 'react';
import Sources from './sources';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import 'github-markdown-css';

const ApiData = ({ apiData }) => {
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 768);

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
  const components = {
    // Headers
    ch1: ({node, ...props}) => <h1 className="font-mono text-3xl mb-4 text-center" {...props} />,
    h1: ({node, ...props}) => <h1 className="font-mono text-3xl mb-4" {...props} />,
    h2: ({node, ...props}) => <h2 className="font-sans text-2xl mb-3 pl-4" {...props} />,
    h3: ({node, ...props}) => <h3 className="font-sans text-xl mb-2 pl-6" {...props} />,
    
    // Paragraphs
    p: ({node, ...props}) => <p className="font-sans mb-4" {...props} />,
    
    // Lists
    ul: ({node, ...props}) => <ul className="font-sans list-disc ml-6 mb-4" {...props} />,
    ol: ({node, ...props}) => <ol className="font-sans list-decimal ml-6 mb-4" {...props} />,
    
    // Inline elements
    strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
    em: ({node, ...props}) => <em className="italic" {...props} />,
    
    // Code blocks
    code: ({node, inline, ...props}) => 
      inline ? 
        <code className="font-mono bg-gray-100 px-1 rounded" {...props} /> :
        <code className="font-mono block bg-gray-100 p-4 rounded mb-4" {...props} />
  };

  return (
    <div className='relative flex w-full' style={{ height: '100vh' }}>
      <div className={`transition-all duration-500 w-full overflow-y-auto h-full ${window.innerWidth >= 768 ? 'p-4' : ''}`}>
        <ReactMarkdown
          className='markdown-body'
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={components}
        >
          {(() => {
            try {
              const parsedBody = JSON.parse(apiData.body);
              return `${parsedBody.summary || apiData.body}`;
            } catch (error) {
              return `${apiData.body}`;
            }
          })()}
          
        </ReactMarkdown>
      <div className='my-64'>
        <hr />
        <hr />
        <hr />
        <hr />
        <hr />
        
      </div>
      </div>

      {/* <div className={`transition-all duration-500 ${isCollapsed ? 'w-0' : 'w-[30%]'} overflow-y-auto h-full`}>
        {!isCollapsed && apiData.sources && <Sources data={apiData.sources} />}
      </div> */}

      {/* <button
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
      </button> */}
    </div>
  );
};

export default ApiData;