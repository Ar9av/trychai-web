"use client";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Link } from "@nextui-org/link";
import { Button } from "@nextui-org/button";
import React, { useEffect, useState } from 'react';
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";


export default function NavBar({ showNewReport = false }) { // Added parameter
  const menuItems = ["docs", "features", "pricing", "blog"];
  return (
    <Navbar isBlurred maxWidth="xl">
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle />
      </NavbarContent>
      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
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
            {/* TrychAI */}
          </Link>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent justify="end">
      <NavbarItem className="hidden sm:flex items-center gap-2">
          <SignedOut>
            <Button
              as={Link}
              color="primary"
              href="/sign-in"
              variant="solid"
              className="hidden sm:flex bg-gradient-to-r from-blue-500 to-purple-500 text-white"
            >
              Sign In
            </Button>
            <Button
              as={Link}
              color="primary"
              href="/sign-up"
              variant="solid"
              className="hidden sm:flex bg-gradient-to-r from-blue-500 to-purple-500 text-white"
            >
              Sign Up
            </Button>
          </SignedOut>
          <SignedIn>
            {showNewReport && ( // Conditional rendering based on the parameter
              <Button
                as={Link}
                color="primary"
                href="/chatBox"
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
      {/* <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link className="w-full" href="#" size="lg" color="foreground">
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu> */}
    </Navbar>
  );
}