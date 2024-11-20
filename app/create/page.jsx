"use client";
import Sidebar from '@/components/sidebar';
import React, { useEffect, useState } from 'react';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from '@/components/navbar';
import { useClerk } from "@clerk/nextjs";
import { Snackbar, Switch, Button, TextField, Box, Tooltip } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import darkTheme from '../../theme';
import { BackgroundBeams } from "@/components/ui/background";
import { Lock, PlusCircle } from 'lucide-react';

const Page = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAdvancedOptionsOn, setIsAdvancedOptionsOn] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [outline, setOutline] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [totalCredits, setTotalCredits] = useState(0);
  const router = useRouter();
  const { session } = useClerk();

  useEffect(() => {
    if (session) {
      fetchCredits();
    }
  }, [session]);

  const fetchCredits = async () => {
    try {
      const response = await fetch(`/api/credits?userId=${session.user.id}`);
      const data = await response.json();
      if (response.ok) {
        setTotalCredits(data.totalCredits);
      }
    } catch (error) {
      console.error('Error fetching credits:', error);
    }
  };

  const handleSearchClick = async () => {
    if (!session) {
      toast.error("Please log in to continue");
      return;
    }

    if (totalCredits <= 0) {
      toast.error("You need credits to generate a report. Please purchase credits to continue.");
      router.push('/credits');
      return;
    }

    const currentSearch = searchText.trim();
    if (currentSearch) {
      try {
        // Deduct one credit
        const debitResponse = await fetch('/api/credits', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: session.user.id,
            type: 'debit',
            description: `Report generated: ${currentSearch}`,
            value: 1
          })
        });

        if (!debitResponse.ok) {
          throw new Error('Failed to deduct credit');
        }

        let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
        if (!history.includes(currentSearch)) {
          history.push(currentSearch);
          localStorage.setItem('searchHistory', JSON.stringify(history));
        }
        const searchParams = JSON.stringify({ topic: searchText, outline });
        localStorage.setItem('searchParams', searchParams);

        await fetchCredits();
        router.push("/search");
      } catch (error) {
        console.error('Error processing request:', error);
        toast.error('Failed to process request. Please try again.');
      }
    }
  };

  const handleExampleClick = (text) => {
    setSearchText(text);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <div className="min-h-screen bg-black flex flex-col">
        <NavBar showNewReport={false} onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <div className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          {typeof window !== 'undefined' && window.innerWidth > 768 && (
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`fixed top-16 left-4 p-2 text-white rounded-full shadow-md transition-transform duration-300 ease-in-out z-50 sm:top-1/2 sm:-translate-y-1/2 ${
                isSidebarOpen ? 'sm:left-[260px]' : 'sm:left-4'
              }`}
            >
              {isSidebarOpen ? <IoIosArrowBack size={24} /> : <IoIosArrowForward size={24} />}
            </button>
          )}

          <div className="flex flex-col items-center text-center w-full max-w-3xl">
            <h1 className="text-4xl font-light tracking-tighter mx-auto md:text-6xl bg-gradient-to-b from-foreground to-foreground/70 text-transparent bg-clip-text text-pretty mb-2">
              <span className="bg-gradient-to-t from-light to-foreground text-transparent bg-clip-text border-none">
                TrychAI
              </span>
            </h1>
            <h4 className="text-xl sm:text-2xl font-light tracking-tighter mx-auto bg-gradient-to-b from-foreground to-foreground/70 text-transparent bg-clip-text text-pretty mb-4">
              AI Agented Market Research
            </h4>

              <div className="relative w-full">
                <TextField
                  placeholder="Type the industry in which you want the report to be..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  variant="outlined"
                  multiline
                  rows={4}
                  fullWidth
                  sx={{ borderColor: '#7083cf', border: '1px solid #7083cf', mb: 2 }}
                />
                
                  <div 
                    onClick={totalCredits > 0 ? handleSearchClick : undefined}
                    className="absolute cursor-pointer bottom-6 right-4 p-2 rounded-full hover:bg-zinc-800 transition-colors"
                  >
                    {totalCredits <= 0 ? (
                      <Tooltip title={totalCredits <= 0 ? "You need credits to generate a report" : "Generate report (1 credit)"} placement="top">
                      <Lock className="h-5 w-5 text-[#7083cf]" />
                      </Tooltip>
                    ) : (
                      <IoIosArrowForward className="h-5 w-5 text-[#7083cf]" />
                    )}
                  </div>
                </div>
                

            <div className='flex items-center justify-start gap-3 mt-4 w-full'>
              <p className="text-zinc-400">Advanced Options</p>
              <Switch
                checked={isAdvancedOptionsOn}
                onChange={() => setIsAdvancedOptionsOn(!isAdvancedOptionsOn)}
                color="primary"
              />
            </div>

            {isAdvancedOptionsOn && (
              <Box className='mt-8 flex flex-col gap-6 w-full'>
                <TextField
                  label="Report Outline"
                  value={outline}
                  onChange={(e) => setOutline(e.target.value)}
                  multiline
                  rows={4}
                  placeholder="Create a report outline to fit in the way your report needs to be generated..."
                  fullWidth
                />
              </Box>
            )}

            <Box className='mt-8 flex flex-wrap gap-4 w-full justify-center'>
              {['2024 Smart Home IOT devices market in US', "Germany's Beer Industry", 'Augmented and Virtual Reality Industry'].map((example) => (
                <Button
                  key={example}
                  variant="contained"
                  onClick={() => handleExampleClick(example)}
                  className="text-xs"
                  sx={{ backgroundColor: 'rgb(173, 216, 230)' }}
                >
                  {example}
                </Button>
              ))}
            </Box>
          </div>
        </div>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          message="Please enter a valid domain."
        />
        <ToastContainer />
        <BackgroundBeams className="absolute inset-0 z-0 pointer-events-none" />
      </div>
    </ThemeProvider>
  );
};

export default Page;