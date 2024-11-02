"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
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

const isUserLoggedIn = () => {
    const { session } = useClerk();
    console.log(session)
    return session;
};

const Report = ({ params }) => {
    const hash = params.hash;
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState(null);
    const [apiData, setApiData] = useState(null);

    useEffect(() => {
        const fetchReport = async () => {
            console.log("fun")
            const res = await fetch(`/api/report?hash=${hash}`);
            const data = await res.json();
            const jsonData = {"body": JSON.stringify(data)};
            console.log(data)
            setTitle(data.title)
            setApiData(jsonData);
            setLoading(false);
        };

        if (hash) {
            fetchReport();
        }
    }, [hash]);

    return (
        <ThemeProvider theme={darkTheme}>
        <div style={{ height: '100vh' }} className="relative min-h-screen bg-black flex p-4 fixed w-full">
            <Sidebar isOpen={false} onClose={() => {}} />
            <div className={`flex flex-col items-center flex-grow transition-all duration-300 ml-8 overflow-auto`}>
                <NavBar onToggleSidebar={() => {}} />
                <div className='w-full'>
                    <div className='flex gap-5 items-center justify-center w-full'>
                        {loading ? <Loader /> : <Typography variant='h4' component='h1'>{title}</Typography>}
                    </div>
                    <div className='w-full'>                        
                        {loading ? <CircularProgress color='default' /> : <ApiData apiData={apiData} />}
                    </div>
                </div>
            { !loading && (
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


export async function getStaticPaths() {
    return {
        paths: [],
        fallback: 'blocking',
    };
}

export default Report;