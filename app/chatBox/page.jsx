'use client'
import Sidebar from '@/components/sidebar';
import React, { useEffect, useState } from 'react';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import { Input, Textarea, Switch } from '@nextui-org/react';
import { FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import app from '@/config';

const Page = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isAdvancedOptionsOn, setIsAdvancedOptionsOn] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [savedText, setSavedText] = useState('')
    const auth = getAuth(app);
    const router = useRouter();
    const [user, setUser] = useState(null);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const toggleAdvancedOptions = () => {
        setIsAdvancedOptionsOn(!isAdvancedOptionsOn);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } 
        });
        return () => unsubscribe();
    }, [auth, router]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push('/');
        } catch (error) {
            console.log("Error SignOut", error.message);
        }
    };

    useEffect(() => {
        const storedText = localStorage.getItem('searchText');
        if (storedText) {
            setSavedText(storedText);
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
    }, []);

    const handleSearchClick = () => {
        if (!user) {
            toast.error("Please log in to continue");
        } else {
            const currentSearch = searchText.trim();
            let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
            if (!history.includes(currentSearch)) {
                history.push(currentSearch);
                localStorage.setItem('searchHistory', JSON.stringify(history));
            }
            localStorage.setItem('searchText', currentSearch);
            router.push("/search");
        }
    };

    const handleSignInClick = () => {
        if (!user) {
            router.push('/login');
        }
    };

    return (
        <div className="relative min-h-screen bg-black flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'}`} onClick={toggleSidebar}></div>
            <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
            <button
                onClick={toggleSidebar}
                className={`absolute top-4 left-4 p-2 text-white rounded-full shadow-md transition-transform duration-300 ease-in-out z-50 sm:top-1/2 sm:-translate-y-1/2 ${isSidebarOpen ? 'sm:left-[260px]' : 'sm:left-4'}`}
            >
                {isSidebarOpen ? <IoIosArrowBack size={24} /> : <IoIosArrowForward size={24} />}
            </button>
            <div onClick={handleSignInClick} className='absolute cursor-pointer right-4 top-4 sm:right-10 sm:top-10'>
                <p>{user ? user.displayName : "SignIn"}</p>
            </div>
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
                <Switch defaultSelected={false} size='sm' color='default' onChange={toggleAdvancedOptions} />
            </div>
            {isAdvancedOptionsOn && (
                <div className='mt-8 flex flex-col gap-6 w-full max-w-3xl'>
                    <div className='w-full sm:w-[70%] flex flex-col sm:flex-row gap-6'>
                        <p className="sm:w-1/4">Persona</p>
                        <Textarea
                            placeholder="Persona for which the report needs to be generated..."
                            className="w-full border-5 rounded-lg border-[#7083cf]"
                        />
                    </div>
                    <div className='flex flex-col sm:flex-row justify-between w-full gap-6'>
                        <div className="w-full sm:w-1/2">
                            <p>Outline</p>
                            <Textarea
                                placeholder="Create a report Outline to fit in the way your report needs to be generated..."
                                className="w-full border-5 rounded-lg border-[#7083cf] h-[80px]"
                            />
                        </div>
                        <div className="w-full sm:w-1/2">
                            <p>Sources</p>
                            <Textarea
                                placeholder="Enter the sources/links in new lines..."
                                className="w-full border-5 rounded-lg border-[#7083cf] h-[80px]"
                            />
                        </div>
                    </div>
                </div>
            )}
            <div className='mt-8 flex flex-wrap gap-4 w-full max-w-3xl justify-center'>
                <div onClick={() => { }} className='bg-gray-500 text-xs cursor-pointer px-4 py-2 rounded-md'>
                    <p>2024 Smart Home IOT devices market in US </p>
                </div>
                <div onClick={() => { }} className='bg-gray-500 text-xs cursor-pointer px-4 py-2 rounded-md'>
                    <p>Germany&apos;s Beer Industry</p>
                </div>
                <div onClick={() => { }} className='bg-gray-500 text-xs cursor-pointer px-4 py-2 rounded-md'>
                    <p>Augmented and Virtual Reality Industry</p>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Page;