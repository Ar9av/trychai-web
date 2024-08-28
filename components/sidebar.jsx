'use client'
import React, { useEffect, useState } from 'react';
import { IoIosClose } from "react-icons/io";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { LuUser } from "react-icons/lu";
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/config';
import { FetchingData } from './FetchingData';
import { Button } from '@nextui-org/react';
import { BiChat } from "react-icons/bi";
import Link from 'next/link';


const Sidebar = ({ isOpen, onClose }) => {
  const [previousReports, setPreviousReports] = useState([]);

  useEffect(() => {
    // Retrieve search history from local storage
    const storedReports = JSON.parse(localStorage.getItem('searchHistory')) || [];
    setPreviousReports(storedReports);
  }, []);

  const handleHistoryClick = (text) => {
    // Set search text in local storage and navigate to the search page
    localStorage.setItem('searchText', text);
    window.location.href = '/search'; // Navigate to the search page
  };
  // const [fetchingData, setFetchingData] = useState();
  // const previousReports = [
  //   {
  //     id: 1,
  //     asked: '2024 Smart Home IOT devices market in US'
  //   },
  //   {
  //     id: 2,
  //     asked: 'Indian Tyre Market'
  //   },
  //   {
  //     id: 3,
  //     asked: 'Frontier Tech 2024'
  //   },
  //   {
  //     id: 4,
  //     asked: 'Augmented and Virtual Reality Industry'
  //   },
  // ]

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const querySnapshot = await getDocs(collection(db, "searchData"));
  //     const dataArray = querySnapshot.docs.map(doc => ({
  //       id: doc.id,
  //       ...doc.data()
  //     }));
  //     setFetchingData(dataArray);
  //   };

  //   fetchData();

  // }, []);

  // console.log(fetchingData)


  return (
    <div
      className={`fixed top-0 left-0 h-full bg-black text-white shadow-lg transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}
      style={{ width: '250px' }}
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <div className='flex gap-3 items-center justify-center'>
          <HiOutlineClipboardDocumentList size={30} />
          <h2 className="text-lg font-semibold">Reports</h2>
        </div>
        <button onClick={onClose}>
          <IoIosClose size={24} />
        </button>
      </div>
      <div className='flex justify-center items-center mt-2'>
        <Link href='chatBox'>
      <Button className='w-[90%]' variant="bordered" startContent={<BiChat size={25} />}>
        New Chat
      </Button>
        </Link>
      </div>
      <div>
        {previousReports.map((item, index) => (
          <div
            key={index}
            className='mt-4 mx-2 px-4 py-2 rounded-md bg-[#27282A] cursor-pointer'
            onClick={() => handleHistoryClick(item)}
          >
            <p className='text-sm truncate'>{item}</p>
          </div>
        ))}
      </div>

      {/* <div>
        {fetchingData &&
          fetchingData.map((item, index) => (

            <div key={index} className='mt-4 mx-2 px-4 py-2 rounded-md bg-[#27282A] cursor-pointer'>
              {item.keyResponse &&
                item.keyResponse.map((itemnew, index) => (
                  <p key={index} className='text-sm truncate'>{itemnew.data}</p>

                ))
              }
            </div>
          ))
        }
      </div> */}
      <div className='flex bottom-5 fixed items-center mx-2 gap-4'>
        <LuUser size={30} />
        <h1>Report Histroy</h1>
      </div>
    </div>
  );
};

export default Sidebar;
