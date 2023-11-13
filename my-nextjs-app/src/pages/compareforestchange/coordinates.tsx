import React, { useState, createRef, useEffect } from "react";
// import Cropper, { ReactCropperElement } from "react-cropper";
// import "cropperjs/dist/cropper.css";
import Image from "next/image";
import Link from "next/link";

// const defaultSrc = "/small.jpg";

export const Home: React.FC = () => {
  function handleFindForest() {}

  function handleForestChange() {}
  return (
    <div className="flex w-screen h-screen flex-col justify-center items-center  ">
      <h1 className="text-[3rem]">ForestFind</h1>
      <p className="w-1/2">
        Whether you're an environmental enthusiast, a conservationist, a
        forestry professional, or just a curious nature lover, ForestFind allows
        you to track and compare forest boundaries over time.
      </p>

      <button className="border border-black w-1/2 text-[1.5rem] h-fit p-3 m-3 rounded-2xl focus:bg-slate-300 hover:bg-slate-300">
        <Link href="/coordinates">Find Forest</Link>
      </button>

      <button className="border border-black w-1/2 text-[1.5rem] h-fit p-3 m-3 rounded-2xl focus:bg-slate-300 hover:bg-slate-300">
        <Link href="/coordinates">Compare Forest Change</Link>
      </button>
    </div>
  );
};

export default Home;
