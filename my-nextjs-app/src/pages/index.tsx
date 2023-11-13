import React, { useState, createRef, useEffect } from "react";
// import Cropper, { ReactCropperElement } from "react-cropper";
// import "cropperjs/dist/cropper.css";
import { useRouter } from "next/router";

// const defaultSrc = "/small.jpg";

export const Home: React.FC = () => {
  const router = useRouter();
  function handleFindForest() {
    router.push("/findforest/coordinates");
  }

  function handleForestChange() {
    router.push("/compareforestchange/coordinates");
  }
  return (
    <div className="flex w-screen h-screen flex-col justify-center items-center  ">
      <h1 className="text-[3rem]">ForestFind</h1>
      <p className="w-1/2">
        Whether you're an environmental enthusiast, a conservationist, a
        forestry professional, or just a curious nature lover, ForestFind allows
        you to track and compare forest boundaries over time.
      </p>

      <button
        onClick={handleFindForest}
        className="border border-black w-1/2 text-[1.5rem] h-fit p-3 m-3 rounded-2xl focus:bg-slate-300 hover:bg-slate-300"
      >
        Find Forest
      </button>

      <button
        onClick={handleForestChange}
        className="border border-black w-1/2 text-[1.5rem] h-fit p-3 m-3 rounded-2xl focus:bg-slate-300 hover:bg-slate-300"
      >
        Compare Forest Change
      </button>
    </div>
  );
};

export default Home;
