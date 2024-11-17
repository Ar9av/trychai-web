"use client";

import React from "react";
import { InfiniteMovingCards } from "./ui/infinite-moving-cards";

export function InfiniteMovingCardsDemo() {
  return (
    (<div
      className="h-[10rem] rounded-md flex flex-col antialiased bg-transparent dark:bg-transparent items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards items={reports} direction="right" speed="slow" />
    </div>)
  );
}

const reports = [
  {
    md5: "1820e44b3710bd0f4445e05d6370f3ea",
    title: "P & G Hygiene market",
  },
  {
    md5: "eefea2d6e136c2e02a7622c1fcf91898",
    title: "Indian Edtech Industry",
  },
  {
    md5: "6b9ea996cd8dbf3f892d63ed74d664fd",
    title: "Consumer Goods & FMCG of India",
  },
  {
    md5: "ba92d1eadc4a9504eb8d7acacdfd2ef7",
    title: "Edtech space in India",
  },
  {
    md5: "85651a558a2d4847236817d83c764e4b",
    title: "Downfall of Byjus",
  },
  {
    md5: "02da73a0cecd8926fd7abc572607284d",
    title: "Mental Health Space in India",
  },
  {
    md5: "d8e2687cef37e9cac565405ad968c5f5",
    title: "Defence Industry of India",
  },
  {
    md5: "0a45f928ca919c0092d9c39aee0c2977",
    title: "Downfall of Snapdeal",
  },
  {
    md5: "d84e39673cb344bb9353ed5c9ee9dd11",
    title: "AR VR in India",
  },
  {
    md5: "5470502ede9db1fd574b66853c188b33",
    title: "Real Estate in India",
  },
  {
    md5: "596a6397bd593ef1133a1d346ec69e0a",
    title: "Data Center Industry in India",
  },
];