'use client'
import React from "react";
import { Card, Skeleton } from "@nextui-org/react";

export default function Loader() {

  return (
    <div>
      <div className='flex flex-col gap-5'>
        <Skeleton className="w-[20%] rounded-lg">
          <div className="h-5 w-4/5 rounded-lg bg-default-200"></div>
        </Skeleton>
        <Skeleton className="w-[20%] rounded-lg">
          <div className="h-5 w-4/5 rounded-lg bg-default-200"></div>
        </Skeleton>
        <Skeleton className="w-[20%] rounded-lg">
          <div className="h-5 w-4/5 rounded-lg bg-default-200"></div>
        </Skeleton>
      </div>
      <div className='flex flex-col gap-5 mt-10'>
        <Skeleton className="w-[60%] rounded-lg">
          <div className="h-5 w-4/5 rounded-lg bg-default-200"></div>
        </Skeleton>
        <Skeleton className="w-[60%] rounded-lg">
          <div className="h-5 w-4/5 rounded-lg bg-default-200"></div>
        </Skeleton>
        <Skeleton className="w-[60%] rounded-lg">
          <div className="h-5 w-4/5 rounded-lg bg-default-200"></div>
        </Skeleton>
      </div>
      <div className='flex flex-col gap-5 mt-10'>
        <Skeleton className="w-[20%] rounded-lg">
          <div className="h-5 w-4/5 rounded-lg bg-default-200"></div>
        </Skeleton>
        <Skeleton className="w-[20%] rounded-lg">
          <div className="h-5 w-4/5 rounded-lg bg-default-200"></div>
        </Skeleton>
        <Skeleton className="w-[20%] rounded-lg">
          <div className="h-5 w-4/5 rounded-lg bg-default-200"></div>
        </Skeleton>
      </div>
    </div>

  );
}
