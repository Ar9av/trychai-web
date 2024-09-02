'use client'
import Loader from '@/components/loader';
import Sidebar from '@/components/sidebar';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import React, { useEffect, useState } from 'react';
import { LuUser } from "react-icons/lu";
import { Input, Spinner } from '@nextui-org/react';
import ApiData from '@/components/apiData';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import app from '@/config';
import { FaArrowRight } from 'react-icons/fa';

const Page = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [showApiData, setShowApiData] = useState(false);
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const auth = getAuth(app);
    const [user, setUser] = useState(null);
    const [savedText, setSavedText] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [submittedTexts, setSubmittedTexts] = useState([]); 
    const router = useRouter();

    const checkScreenSize = () => {
        if (window.innerWidth <= 768) {
            setIsSidebarOpen(false);
        }
    };

    useEffect(() => {
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => {
            window.removeEventListener('resize', checkScreenSize);
        };
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const reportResponse = [
        "Generating and Polishing the report...",
        "Creating Outline for the report...",
        "Searching the Internet for sources and relevant content..."
    ];

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowApiData(true);
        }, 4000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!showApiData) {
            const messageTimer = setInterval(() => {
                setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % reportResponse.length);
            }, 3000);

            return () => clearInterval(messageTimer);
        }
    }, [showApiData, reportResponse.length]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            }
        })
        return () => unsubscribe();
    }, [auth])

    useEffect(() => {
        const storedText = localStorage.getItem('searchText');
        if (storedText) {
            setSavedText(storedText);
        }
    }, []);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleKeyPress = async (e) => {
        if (e.key === 'Enter' && inputValue.trim() !== '') {
            await fetchAndStoreApiData(inputValue);
            setSubmittedTexts((prevTexts) => [...prevTexts, inputValue]);
            setInputValue('');
        }
    };

    const fetchAndStoreApiData = async (topic) => {
        try {
            const response = await fetch(`https://91e2nq3dy2.execute-api.us-east-2.amazonaws.com/dev/fast?topic=${encodeURIComponent(topic)}`);
            const data = await response.json();
            localStorage.setItem('apiData', JSON.stringify(data));
            console.log("API Data stored: ", data);
        } catch (error) {
            console.error("Error fetching or storing API data: ", error);
        }
    };

    return (
        <div className="relative min-h-screen bg-black flex">
            <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
            <button
                onClick={toggleSidebar}
                className={`absolute top-1/2 transform -translate-y-1/2 p-2 text-white rounded-full shadow-md transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'left-[240px]' : 'left-4'}`}
            >
                {isSidebarOpen ? <IoIosArrowBack size={24} /> : <IoIosArrowForward size={24} />}
            </button>
            <div className={`flex flex-col items-center flex-grow transition-all duration-300 ${isSidebarOpen ? 'ml-72' : 'ml-8'}`}>
                <div className="w-full flex justify-between p-4">
                    <h1 className="text-2xl font-semibold tracking-wide text-white">TrychAI</h1>
                    <div className="flex gap-2 items-center text-white">
                        <LuUser size={25} />
                        <p>{user ? user.displayName : "SignIn"}</p>
                    </div>
                </div>
                <div className="border-2 w-3/4 border-blue-950 my-6"></div>

                <div className='w-full px-4'>
                    <div className='flex gap-5 items-center'>
                        {!showApiData ? <Spinner color='default' /> : ""}
                        <p className='text-2xl font-semibold text-white'>{savedText}</p>
                    </div>
                    <p className='text-[#9EA2A5] text-xs my-7 ml-8'>{!showApiData ? reportResponse[currentMessageIndex] : ""}</p>
                    {!showApiData ? <Loader /> : <ApiData />}

                    {submittedTexts.map((text, index) => (
                        <div key={index}>
                            <div className='flex gap-5 items-center'>
                                {!showApiData ? <Spinner color='default' /> : ""}
                                <p className='text-2xl font-semibold text-white'>{text}</p>
                            </div>
                            <p className='text-[#9EA2A5] text-xs my-7 ml-8'>{!showApiData ? reportResponse[currentMessageIndex] : ""}</p>
                            {!showApiData ? <Loader /> : <ApiData />}
                        </div>
                    ))}
                </div>
                <div className="relative flex justify-center w-full mt-4">
                    <input
                        className='fixed bottom-3 w-[40%] max-w-lg bg-[#1e1e1e] text-white p-2 rounded-full pl-4 pr-10 outline-none'
                        style={{
                            border: '1px solid #7083cf',
                        }}
                        placeholder="Ask a follow-up question..."
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                    />
                </div>
            </div>
        </div>
    );
};

export default Page;