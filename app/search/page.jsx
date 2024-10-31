'use client'
import Loader from '@/components/loader';
import Sidebar from '@/components/sidebar';
import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import { LuUser } from "react-icons/lu";
import { Spinner } from '@nextui-org/react';
import ApiData from '@/components/apiData';
import { useRouter } from 'next/navigation';
import AWS from 'aws-sdk';
import { collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';
import { useClerk } from "@clerk/nextjs";
import NavBar from '@/components/navbar';
import { toast } from 'react-toastify';

const Page = () => {
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
    const isMobile = windowWidth <= 768;
    const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
    const [showApiData, setShowApiData] = useState(false);
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(4 * 60); // 4 mins in seconds
    const [apiData, setApiData] = useState(null);
    const [searchParams, setSearchParams] = useState({ topic: '', outline: '', sources: '' });
    const [inputValue, setInputValue] = useState('');
    const [submittedTexts, setSubmittedTexts] = useState([]);
    const intervalRef = useRef();
    const timerRef = useRef();
    const { session } = useClerk();
    const router = useRouter();

    // Update window width on resize
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, []);

    const checkScreenSize = () => {
        if (typeof window !== 'undefined' && window.innerWidth <= 768) {
            setIsSidebarOpen(false);
        }
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            checkScreenSize();
            window.addEventListener('resize', checkScreenSize);
            return () => {
                window.removeEventListener('resize', checkScreenSize);
            };
        }
    }, []);

    useEffect(() => {
        const storedParams = localStorage.getItem('searchParams');
        if (storedParams) {
            setSearchParams(JSON.parse(storedParams));
        } else {
            router.push('/');
        }
    }, [router]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedSidebarState = localStorage.getItem('isSidebarOpen');
            if (storedSidebarState !== null) {
                setIsSidebarOpen(JSON.parse(storedSidebarState));
            }
        }

        if (searchParams.topic) {
            fetchApiData(searchParams);
        }
    }, [searchParams]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('isSidebarOpen', JSON.stringify(isSidebarOpen));
        }
    }, [isSidebarOpen]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
        if (typeof window !== 'undefined') {
            localStorage.setItem('isSidebarOpen', JSON.stringify(!isSidebarOpen));
        }
    };

    const reportResponse = useMemo(() => [
        "Searching the Internet for sources and relevant content...",
        "Creating Outline for the report...",
        "Generating and Polishing the report...",
    ], []);

    const fetchApiData = useCallback(async (params) => {
        const fetchFromLambda = async () => {
            console.log("Lambda invoked");
            const lambda = new AWS.Lambda({
                region: 'us-west-2',
                accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
            });
            const lambdaParams = {
                FunctionName: 'arn:aws:lambda:us-west-2:986519088348:function:trychai-api',
                InvocationType: 'RequestResponse',
                Payload: JSON.stringify(params),
            };

            intervalRef.current = setInterval(() => {
                setCurrentMessageIndex(prev => (prev + 1) % reportResponse.length);
            }, 30000);

            // Start countdown timer
            timerRef.current = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev <= 0) {
                        clearInterval(timerRef.current);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            try {
                const response = await lambda.invoke(lambdaParams).promise();

                clearInterval(intervalRef.current);
                clearInterval(timerRef.current);

                const data = JSON.parse(response.Payload);

                return data;
            } catch (error) {
                clearInterval(intervalRef.current);
                clearInterval(timerRef.current);
                console.error('Error fetching or storing API data: ', error);
                toast.error('Error fetching report data. Please try again.');
            }
            return null;
        };

        setTimeRemaining(4 * 60); // Reset timer to 4 minutes
        setShowApiData(false);
        let data = await fetchFromLambda();
        if (data) {
            setApiData(data);
            setShowApiData(true);
            localStorage.setItem('apiData', JSON.stringify(data));
            const existingData = JSON.parse(localStorage.getItem('apiData'));
            if (!existingData.existing_entry) {
                const previousReports = JSON.parse(localStorage.getItem('previousReports')) || [];
                const newEntry = {
                    title: params.topic,
                    created_at: new Date().toISOString(),
                    payload: JSON.stringify(params)
                };
                previousReports.push(newEntry);
                localStorage.setItem('previousReports', JSON.stringify(previousReports));
            }
        }
    }, [reportResponse]);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleKeyPress = async (e) => {
        if (e.key === 'Enter' && inputValue.trim() !== '') {
            const newParams = { topic: inputValue, outline: searchParams.outline, sources: searchParams.sources };
            await fetchApiData(newParams);
            setSubmittedTexts(prevTexts => [...prevTexts, inputValue]);
            setInputValue('');
        }
    };

    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes} min ${seconds < 10 ? '0' : ''}${seconds} sec`;
    };

    return (
        <div style={{ overflow: 'hidden', height: '100vh' }} className="relative min-h-screen bg-black flex p-4 fixed w-full">
            <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
            {!isMobile && (
                <button
                    onClick={toggleSidebar}
                    className={`absolute top-1/2 transform -translate-y-1/2 p-2 text-white rounded-full shadow-md transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'left-[240px]' : 'left-4'}`}
                >
                    {isSidebarOpen ? <IoIosArrowBack size={24} /> : <IoIosArrowForward size={24} />}
                </button>
            )}
            <div
                className={`flex flex-col items-center flex-grow transition-all duration-300 ${
                    isMobile 
                    ? 'ml-0' // Always 0 margin on mobile
                    : isSidebarOpen 
                        ? 'ml-72' 
                        : 'ml-8'
                }`}
            >
                <NavBar onToggleSidebar={toggleSidebar} />
                {/* <div className="border-2 w-3/4 border-transparent my-6"></div> */}
                <div className='w-full'>
                    <div className='flex gap-5 items-center justify-center w-full'>
                        {!showApiData ? <Spinner color='default' /> : ""}
                        <p className='text-4xl font-mono text-white'>{searchParams.topic.charAt(0).toUpperCase() + searchParams.topic.slice(1)}</p>
                    </div>
                    <p className='text-[#9EA2A5] text-xs my-7'>
                        {!showApiData ? `Report will be generated in ${formatTime(timeRemaining)}` : ""}
                    </p>
                    <p className='text-[#9EA2A5] text-xs my-7'>
                        {!showApiData ? reportResponse[currentMessageIndex] : ""}
                    </p>
                    {!showApiData ? <Loader /> : <div className="w-full"><ApiData apiData={apiData} /></div>}
                    {submittedTexts.map((text, index) => (
                        <div key={index} className='w-full'>
                            <div className='flex gap-5 items-center w-full'>
                                {!showApiData ? <Spinner color='default' /> : ""}
                                <p className='text-2xl font-semibold text-white'>{text}</p>
                            </div>
                            <p className='text-[#9EA2A5] text-xs my-7'>
                                {!showApiData ? `Remaining time: ${formatTime(timeRemaining)}` : ""}
                            </p>
                            <p className='text-[#9EA2A5] text-xs my-7'>
                                {!showApiData ? reportResponse[currentMessageIndex] : ""}
                            </p>
                            {!showApiData ? <Loader /> : <div className="w-full"><ApiData apiData={apiData} /></div>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Page;