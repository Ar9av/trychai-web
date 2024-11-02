"use client";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/navbar";
import { Link } from "@nextui-org/link";
// import { Button } from "@nextui-org/button";
import {Button} from "@mui/material"
import { useState, useEffect } from 'react';
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  UserButton,
  useSession // Ensure this is imported
} from "@clerk/nextjs";

export default function NavBar({ showNewReport = false, onToggleSidebar }) {
  const { session } = useSession();
  const isBrowser = typeof window !== 'undefined'; // Check if running in the browser

  // State to track window width for responsive behavior
  const [windowWidth, setWindowWidth] = useState(isBrowser ? window.innerWidth : 0);

  // Effect to handle window resize
  useEffect(() => {
    if (isBrowser) {
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [isBrowser]);

  // Only show the toggle button if running in the browser and on mobile
  const toggleButton = windowWidth <= 768 && session && (
    <div className="absolute left-0 ml-3">
      <button onClick={onToggleSidebar} className="flex flex-col items-center justify-center">
        <span className="block w-6 h-0.5 bg-white mb-1"></span>
        <span className="block w-6 h-0.5 bg-white mb-1"></span>
        <span className="block w-6 h-0.5 bg-white"></span>
        <span className="sr-only">Toggle navigation</span>
      </button>
    </div>
  );

  return (
    <Navbar isBlurred maxWidth="xl">
      {toggleButton}
      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand className="pl-10"> {/* Adjust this class to add padding */}
          <span className="font-light tracking-tighter text-inherit text-lg">
            TrychAI
          </span>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="hidden sm:flex gap-5" justify="center">
        <NavbarBrand>
          <Link href="/" className="font-light tracking-tighter text-2xl flex gap-3 justify-center items-center">
            <span className="bg-gradient-to-t from-light to-foreground text-transparent bg-clip-text border-none">
              TrychAI
            </span>
          </Link>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden sm:flex items-center gap-2">
          <SignedOut>
            <Button
              component={Link}
              color="primary"
              href="/sign-in"
              variant="outlined"
              className="hidden sm:flex"
            >
              Sign In
            </Button>
            <Button
              component={Link}
              color="primary"
              href="/sign-up"
              variant="outlined"
              className="hidden sm:flex"
            >
              Sign Up
            </Button>
          </SignedOut>
          <SignedIn>
            {showNewReport && (
              <Button
                as={Link}
                color="primary"
                href="/create"
                variant="solid"
                className="hidden sm:flex bg-gradient-to-r from-blue-500 to-purple-500 text-white"
              >
                New Report
              </Button>
            )}
            <UserButton className="hidden sm:flex bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-md p-2" />
          </SignedIn>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}