"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'; // Updated import
import Link from "next/link";
import Head from 'next/head';
import { CircularProgress, Typography } from '@mui/material';
import NavBar from '@/components/navbar';
import Sidebar from '@/components/sidebar';
import ApiData from '@/components/apiData';
import Loader from '@/components/loader';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useClerk } from "@clerk/nextjs";

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const Report = ({ params }) => {
    const { hash } = params;
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState(null);
    const [apiData, setApiData] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const { session } = useClerk();

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const res = await fetch(`/api/report?hash=${hash}`);
                const data = await res.json();
                setTitle(data.title);
                const jsonData = { "body": JSON.stringify(data) };
                setApiData(jsonData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching report:", error);
                setLoading(false);
            }
        };

        if (hash) {
            fetchReport();
        }
    }, [hash]);

    const isUserLoggedIn = () => {
        return session;
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <NavBar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <Head>
                <title>{title || 'Loading...'}</title>
            </Head>
            <div style={{ height: '100vh', padding: typeof window !== 'undefined' && window.innerWidth > 768 ? '20px' : '9px' }} className="relative min-h-screen bg-black flex fixed w-full justify-start">
                {/* <Sidebar isOpen={false} onClose={() => {}} /> */}
                {/* <div className="flex flex-col items-center flex-grow transition-all duration-300 ml-8 overflow-auto"> */}
                <div>
                    {/* <NavBar onToggleSidebar={() => {}} /> */}
                    <div className='w-full'>
                        <div className={`flex items-center justify-center w-full ${loading ? 'h-20' : 'h-auto'}`}>
                            {loading ? <Loader /> : <Typography variant='h4' component='h1'>{title}</Typography>}
                        </div>
                        <div className='w-full'>
                            {loading ? <Loader /> : <ApiData apiData={apiData} />}
                        </div>
                    </div>
                    {!loading && (
                        !isUserLoggedIn() ? (
                            <Typography variant='h6' className='text-center'>
                                Create your first free report, <Link href="https://trychai.io" className='text-blue-500'>sign up</Link> for Trych AI.
                            </Typography>
                        ) : (
                            <ApiData apiData={apiData} />
                        )
                    )}
                </div>
            </div>
        </ThemeProvider>
    );
};

export default Report;