//app/search/page.jsx
'use client'
import Loader from '@/components/loader';
import Sidebar from '@/components/sidebar';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import { LuUser } from "react-icons/lu";
import { Spinner } from '@nextui-org/react';
import ApiData from '@/components/apiData';
import { useRouter } from 'next/navigation';
import AWS from 'aws-sdk';
import { collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';
import { useClerk } from "@clerk/nextjs";
import NavBar from '@/components/navbar';
const Page = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showApiData, setShowApiData] = useState(false);
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const [apiData, setApiData] = useState(null);
    const [searchParams, setSearchParams] = useState({ topic: '', outline: '', sources: '' });
    const [inputValue, setInputValue] = useState('');
    const [submittedTexts, setSubmittedTexts] = useState([]);
    const intervalRef = useRef();
    const { session } = useClerk();

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

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleKeyPress = async (e) => {
        if (e.key === 'Enter' && inputValue.trim() !== '') {
            const newParams = { topic: inputValue, outline: searchParams.outline, sources: searchParams.sources };
            await fetchApiData(newParams);
            setSubmittedTexts((prevTexts) => [...prevTexts, inputValue]);
            setInputValue('');
        }
    };

    const fetchApiData = useCallback(async (params) => {
        const fetchFromLambda = async () => {
            console.log("Lambda invoked");
            const lambda = new AWS.Lambda({
                region: 'us-west-2',
                accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
            });
            console.log(JSON.stringify(params))
            const lambdaParams = {
                FunctionName: 'arn:aws:lambda:us-west-2:986519088348:function:trychai-api',
                InvocationType: 'RequestResponse',
                Payload: JSON.stringify(params),
            };

            intervalRef.current = setInterval(() => {
                setCurrentMessageIndex((prev) => (prev + 1) % reportResponse.length);
            }, 60000);

            try {
                const response = await lambda.invoke(lambdaParams).promise();

                clearInterval(intervalRef.current);

                const data = JSON.parse(response.Payload);
                console.log(data)
                // await setDoc(doc(db, 'searchData', params.topic), {
                //     ...params,
                //     keyResponse: data,
                // });

                return data;
            } catch (error) {
                clearInterval(intervalRef.current);
                console.error('Error fetching or storing API data: ', error);
            }
            return null;
        };

        setShowApiData(false);
        let data = await fetchFromLambda();
        // let data = await fetchFromFirestore();
        // if (!data) {
        //     data = await fetchFromLambda();
        // }
        if (data) {
            setApiData(data);
            setShowApiData(true);
            localStorage.setItem('apiData', JSON.stringify(data));
        }
    }, [reportResponse]);

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
                <NavBar />
                <div className="border-2 w-3/4 border-blue-950 my-6"></div>

                <div className='w-full px-4'>
                    <div className='flex gap-5 items-center'>
                        {!showApiData ? <Spinner color='default' /> : ""}
                        <p className='text-2xl font-semibold text-white'>{searchParams.topic}</p>
                    </div>
                    <p className='text-[#9EA2A5] text-xs my-7 ml-8'>
                        {!showApiData ? reportResponse[currentMessageIndex] : ""}
                    </p>
                    {!showApiData ? <Loader /> : <ApiData apiData={apiData} />}

                    {submittedTexts.map((text, index) => (
                        <div key={index}>
                            <div className='flex gap-5 items-center'>
                                {!showApiData ? <Spinner color='default' /> : ""}
                                <p className='text-2xl font-semibold text-white'>{text}</p>
                            </div>
                            <p className='text-[#9EA2A5] text-xs my-7 ml-8'>
                                {!showApiData ? "This might take 3-4 mins to process.." : ""}
                            </p>
                            <p className='text-[#9EA2A5] text-xs my-7 ml-8'>
                                {!showApiData ? reportResponse[currentMessageIndex] : ""}
                            </p>
                            {!showApiData ? <Loader /> : <ApiData apiData={apiData} />}
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default Page;