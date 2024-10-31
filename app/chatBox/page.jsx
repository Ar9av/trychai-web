"use client";
import Sidebar from '@/components/sidebar';
import React, { useEffect, useState } from 'react';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import { Textarea, Switch } from '@nextui-org/react';
import { FaArrowRight } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from '@/components/navbar';
import { useClerk } from "@clerk/nextjs";

const Page = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Default to false
  const [isAdvancedOptionsOn, setIsAdvancedOptionsOn] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [outline, setOutline] = useState('');
  const [sources, setSources] = useState('');
  const router = useRouter();
  const { session } = useClerk();

  // Logging user information
  useEffect(() => {
    const logUserInfo = async () => {
      if (session) {
        const user = session.user.emailAddresses[0].emailAddress;
        console.log("User information:", user);
      }
    };
    logUserInfo();
  }, [session]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleAdvancedOptions = () => {
    setIsAdvancedOptionsOn(!isAdvancedOptionsOn);
  };

  const handleSearchClick = async () => {
    if (!session) {
      toast.error("Please log in to continue");
    } else {
      const currentSearch = searchText.trim();
      if (currentSearch) {
        let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
        if (!history.includes(currentSearch)) {
          history.push(currentSearch);
          localStorage.setItem('searchHistory', JSON.stringify(history));
        }
        const searchParams = JSON.stringify({ topic: searchText, outline, sources });
        localStorage.setItem('searchParams', searchParams);

        router.push("/search");
      }
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedText = localStorage.getItem('searchText');
      if (storedText) {
        setSearchText(storedText);
      }

      const mediaQuery = window.matchMedia('(max-width: 768px)');
      if (mediaQuery.matches) {
        setIsSidebarOpen(false);
      }

      const handleResize = () => {
        if (window.innerWidth <= 768) {
          setIsSidebarOpen(false);
        }
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const handleExampleClick = (text) => {
    setSearchText(text);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <NavBar showNewReport={false} onToggleSidebar={toggleSidebar} />

      <div className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'}`} onClick={toggleSidebar}></div>
        <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
        {typeof window !== 'undefined' && window.innerWidth > 768 && (
          <div>
            <button
              onClick={toggleSidebar}
              className={`fixed top-16 left-4 p-2 text-white rounded-full shadow-md transition-transform duration-300 ease-in-out z-50 sm:top-1/2 sm:-translate-y-1/2 ${isSidebarOpen ? 'sm:left-[260px]' : 'sm:left-4'}`}
            >
              {isSidebarOpen ? <IoIosArrowBack size={24} /> : <IoIosArrowForward size={24} />}
            </button>
          </div>
        )}
        <div className="flex flex-col items-center text-center w-full max-w-3xl">
          <h1 className="text-4xl font-light tracking-tighter mx-auto md:text-6xl bg-gradient-to-b from-foreground to-foreground/70 text-transparent bg-clip-text text-pretty mb-2">
            <span className="bg-gradient-to-t from-light to-foreground text-transparent bg-clip-text border-none">
              TrychAI
            </span>
          </h1>
          <h4 className="text-xl sm:text-2xl font-light tracking-tighter mx-auto bg-gradient-to-b from-foreground to-foreground/70 text-transparent bg-clip-text text-pretty mb-4">AI Agented Market Research</h4>
          <div className="relative w-full">
            <Textarea
              placeholder="Type the industry in which you want the report to be..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full h-[100px] border-5 rounded-lg border-[#7083cf] p-2 mb-4"
            />
            <FaArrowRight
              className="absolute cursor-pointer bottom-6 right-2 text-[#7083cf]"
              size={20}
              onClick={handleSearchClick}
            />
          </div>
        </div>
        <div className='flex items-center justify-start gap-3 mt-2 w-full max-w-3xl'>
          <p>Advanced Options</p>
          <Switch defaultSelected={false} size='sm' color='blue' onChange={toggleAdvancedOptions} />
        </div>
        {isAdvancedOptionsOn && (
          <div className='mt-8 flex flex-col gap-6 w-full max-w-3xl'>
            <div className="flex w-full gap-4">
              <div className="w-1/2">
                <p>Outline</p>
                <Textarea
                  value={outline}
                  onChange={e => setOutline(e.target.value)}
                  placeholder="Create a report Outline to fit in the way your report needs to be generated..."
                  className="w-full border-5 rounded-lg border-[#7083cf] h-[80px]"
                />
              </div>
              <div className="w-1/2">
                <p>Sources</p>
                <Textarea
                  value={sources}
                  onChange={e => setSources(e.target.value)}
                  placeholder="Enter the sources/links in new lines..."
                  className="w-full border-5 rounded-lg border-[#7083cf] h-[80px]"
                />
              </div>
            </div>
          </div>
        )}
        <div className='mt-8 flex flex-wrap gap-4 w-full max-w-3xl justify-center'>
          <div onClick={() => handleExampleClick("2024 Smart Home IOT devices market in US")} className='bg-gray-500 text-xs cursor-pointer px-4 py-2 rounded-md'>
            <p>2024 Smart Home IOT devices market in US</p>
          </div>
          <div onClick={() => handleExampleClick("Germany's Beer Industry")} className='bg-gray-500 text-xs cursor-pointer px-4 py-2 rounded-md'>
            <p>Germany&apos;s Beer Industry</p>
          </div>
          <div onClick={() => handleExampleClick("Augmented and Virtual Reality Industry")} className='bg-gray-500 text-xs cursor-pointer px-4 py-2 rounded-md'>
            <p>Augmented and Virtual Reality Industry</p>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Page;