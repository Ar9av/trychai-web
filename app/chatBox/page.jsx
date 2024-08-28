'use client'
import Sidebar from '@/components/sidebar';
import React, { useEffect, useState } from 'react';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import { Input, Textarea, Switch } from '@nextui-org/react';
import { FaArrowRight } from 'react-icons/fa'; // Import the arrow icon
import Link from 'next/link';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import app from '@/config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Page = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isAdvancedOptionsOn, setIsAdvancedOptionsOn] = useState(false); // State for the switch
    const [searchText, setSearchText] = useState(''); // State to store the search text
    const [savedText,setSavedText] = useState('')
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
            router.push('/login'); // Redirect to the login page if the user is not logged in
        }
    };

    return (
        <div className="relative min-h-screen bg-black flex flex-col items-center justify-center">
            <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
            <button
                onClick={toggleSidebar}
                className={`absolute top-1/2 transform -translate-y-1/2 p-2 text-white rounded-full shadow-md transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'left-[260px]' : 'left-4'}`}
            >
                {isSidebarOpen ? <IoIosArrowBack size={24} /> : <IoIosArrowForward size={24} />}
            </button>
            <div onClick={handleSignInClick} className='absolute cursor-pointer right-10 top-10'>
                <p>{user ? user.displayName : "SignIn"}</p>
            </div>
            <div className="flex flex-col items-center text-center">
                {/* <h1 className="text-7xl font-bold mb-5 -tracking-tighter text-white">TrychAI</h1> */}
                <h1 className="text-4xl font-ligt tracking-tighter mx-auto md:text-6xl bg-gradient-to-b from-foreground to-foreground/70 text-transparent bg-clip-text text-pretty">
           {" "}
            <span className="bg-gradient-to-t from-light to-foreground text-transparent bg-clip-text border-none">
              TrychAI
            </span>{" "}
          </h1>
                <h4 className="text-2xl font-ligt tracking-tighter mx-auto bg-gradient-to-b from-foreground to-foreground/70 text-transparent bg-clip-text text-pretty">AI Agented Market Research</h4>
                <div className="relative flex w-full flex-wrap md:flex-nowrap gap-4">
                    <div className="relative ">
                        <Textarea
                            placeholder="Type the industry in which you want the report to be..."
                            value={searchText} // Bind textarea to state
                            onChange={(e) => setSearchText(e.target.value)} // Update state on change
                            style={{ height: '100px', width: '600px' }}
                            className="w-full border-5 rounded-lg border-[#7083cf]"
                        />
                        <FaArrowRight
                            className="absolute cursor-pointer bottom-2 right-2 text-[#7083cf]"
                            size={20}
                            onClick={handleSearchClick} // Save text on click
                        />
                    </div>
                </div>
            </div>
            <div className='flex items-start justify-start gap-3 mt-2 w-[41%]'>
                <p>Advanced Options</p>
                <Switch defaultSelected={false} size='sm' color='default' onChange={toggleAdvancedOptions} />
            </div>
            {isAdvancedOptionsOn && (
                <div className='mt-8 flex flex-col gap-6 w-[41%] flex-wrap'>
                    <div className='w-[70%] flex gap-6'>
                        <p>Persona</p>
                        <Textarea
                            placeholder="Persona for which the report needs to be generated..."
                            style={{ height: '20px', width: '500px' }}
                            className="w-full border-5 rounded-lg border-[#7083cf]"
                        />
                    </div>
                    <div className='flex justify-between w-full'>
                        <div>
                            <p>Outline</p>
                            <Textarea
                                placeholder="Create a report Outline to fit in the way your report needs to be generated..."
                                style={{ height: '80px', width: '250px' }}
                                className="w-full border-5 rounded-lg border-[#7083cf]"
                            />
                        </div>
                        <div>
                            <p>Sources</p>
                            <Textarea
                                placeholder="Enter the sources/links in new lines..."
                                style={{ height: '80px', width: '250px' }}
                                className="w-full border-5 rounded-lg border-[#7083cf]"
                            />
                        </div>
                    </div>
                </div>
            )}
            <div className='mt-8 flex gap-6 w-[50%] justify-center flex-wrap'>
                <div onClick={() => { }} className='bg-gray-500 text-xs cursor-pointer px-4 py-2 rounded-md'>
                    <p>2024 Smart Home IOT devices market in US </p>
                </div>
                <div onClick={() => { }} className='bg-gray-500 text-xs cursor-pointer px-4 py-2 rounded-md'>
                    <p>Germany’s Beer Industry</p>
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
