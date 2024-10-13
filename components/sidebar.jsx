'use client'
import React, { useEffect, useState } from 'react';
import { IoIosClose } from "react-icons/io";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { LuUser } from "react-icons/lu";
import { Button } from '@nextui-org/react';
import { BiChat } from "react-icons/bi";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useClerk } from '@clerk/clerk-react';
import { usePathname } from 'next/navigation'

const Sidebar = ({ isOpen, onClose }) => {
  const [previousReports, setPreviousReports] = useState([]);
  const router = useRouter();
  const { session } = useClerk();
  const pathname = usePathname();

  useEffect(() => {
    const fetchHashes = async () => {
      if (session) {
        const user_email = session.user.emailAddresses[0].emailAddress;
        try {
          const response = await fetch(`/api/getUserHashes?email=${encodeURIComponent(user_email)}`);
          const data = await response.json();
          setPreviousReports(data);
        } catch (error) {
          console.error('Failed to fetch data:', error);
        }
      }
    };

    fetchHashes();
  }, [session]);

  const handleHistoryClick = (text) => {
    localStorage.setItem('searchParams', text);
    if (pathname === '/search') {
      window.location.reload();
    } else {
      router.push('/search');
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const timeDiff = now - new Date(timestamp);

    const minutes = Math.floor(timeDiff / (1000 * 60));
    if (minutes < 60) {
      return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
    }

    const days = Math.floor(hours / 24);
    if (days < 7) {
      return days === 1 ? '1 day ago' : `${days} days ago`;
    }

    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full w-[250px] bg-black text-white shadow-lg transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out z-50`}
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <div className='flex gap-3 items-center justify-center'>
          <HiOutlineClipboardDocumentList size={30} />
          <h2 className="text-lg font-semibold">Reports</h2>
        </div>
        <button onClick={onClose} className="hover:bg-gray-700 rounded-full p-1 transition-colors duration-200">
          <IoIosClose size={24} />
        </button>
      </div>
      <div className='flex justify-center items-center mt-4 mb-6'>
        <Link href='/chatBox' className='w-[90%]'>
          <Button className='w-full' variant="bordered" startContent={<BiChat size={20} />}>
            New Report
          </Button>
        </Link>
      </div>
      <div className="overflow-y-auto h-full" style={{ maxHeight: 'calc(100vh - 200px)' }}>
        {previousReports.map((item, index) => (
          <div
            key={index}
            className='mt-2 mx-2 px-4 py-3 rounded-md bg-[#27282A] cursor-pointer hover:bg-[#323335] transition-colors duration-200'
            onClick={() => handleHistoryClick(item.payload)}
            title={item.title}
          >
            <p className='text-sm truncate'>{item.title}</p>
            <p className='text-xs text-gray-400'>{formatTimestamp(item.created_at)}</p>
          </div>
        ))}
      </div>
      {/* <div className='absolute bottom-5 left-0 right-0 flex items-center justify-start px-4 py-2 bg-[#1c1c1e]'>
        <LuUser size={24} className="mr-4" />
        <h1 className="text-sm font-medium">Report History</h1>
      </div> */}
    </div>
  );
};

export default Sidebar;