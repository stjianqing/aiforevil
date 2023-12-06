import React, { useState, createRef, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { FaRegCircleQuestion, FaX } from "react-icons/fa6";

import Image from "next/image";
import github from "public/github.svg";

export const Home: React.FC = () => {
  const router = useRouter();

  function handleFindForest() {
    router.push("/findforest/coordinates");
  }

  function handleForestChange() {
    router.push("/compareforestchange/coordinates");
  }

  function handleTimeSeries() {
    router.push("/timeseries/coordinates");
  }
  function handleGithub() {
    router.push("https://github.com/stjianqing/aiforevil");
  }

  const [FFInfo, setFFInfo] = useState(false);
  const [FCInfo, setFCInfo] = useState(false);
  const [TSInfo, setTSInfo] = useState(false);
  const [dark, setDark] = useState(false);

  function toggleFindForestModal() {
    if (FFInfo === false) {
      setFFInfo(true);
      setDark(true);
    } else {
      setFFInfo(false);
      setDark(false);
    }
  }

  function toggleForestChangeModal() {
    if (FCInfo === false) {
      setFCInfo(true);
      setDark(true);
    } else {
      setFCInfo(false);
      setDark(false);
    }
  }

  function toggleTimeSeriesModal() {
    if (TSInfo === false) {
      setTSInfo(true);
      setDark(true);
    } else {
      setDark(false);
      setTSInfo(false);
    }
  }

  return (
    <>
      {dark ? (
        <div className="w-screen h-screen flex justify-center items-center  absolute">
          <div className="bg-black h-screen w-screen absolute z-10 opacity-70 "></div>
          <div className="h-1/2 w-5/6 sm:w-1/2 bg-white absolute rounded-lg z-20">
            <div className="h-fit w-full justify-end flex p-2">
              <button onClick={toggleFindForestModal}>
                <FaX></FaX>
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <div className="flex w-screen h-screen flex-col sm:justify-center  items-center sm:pt-[1rem] pt-[2rem]  overflow-scroll">
        <h1 className="text-2xl sm:text-7xl p-3 ">ForestFind</h1>
        <p className=" w-5/6 sm:w-4/6 text-sm sm:text-xl p-3">
          Whether you're an environmental enthusiast, a conservationist, a
          forestry professional, or just a curious nature lover, ForestFind
          allows you to track and compare forest boundaries over time.
        </p>
        <div className="flex flex-row flex-wrap justify-center p-3 w-full h-[13rem] sm:h-1/3 ">
          <div className="sm:w-[14rem] w-[10rem] flex justify-center items-center h-fit sm:h-full  flex-col m-3">
            <button
              onClick={handleFindForest}
              className="border-4 border-green w-full h-[10rem]  sm:h-[14rem] p-3 rounded-2xl focus:bg-slate-300 hover:bg-slate-300"
            ></button>
            <div className="flex h-[2rem]  items-center m-3  gap-2 flex-row w-full justify-center">
              <p className="flex justify-center text-lg sm:text-xl font-medium ">
                Find Forest
              </p>
              <button onClick={toggleFindForestModal}>
                <FaRegCircleQuestion className="sm:h-[1.5rem] sm:w-[1.5rem]"></FaRegCircleQuestion>
              </button>
            </div>
          </div>
          <div className="sm:w-[14rem] w-[10rem] flex justify-center items-center h-fit sm:h-full  flex-col m-3">
            <button
              onClick={handleForestChange}
              className="border-4 border-pink w-full h-[10rem]  sm:h-[14rem] p-3 rounded-2xl focus:bg-slate-300 hover:bg-slate-300"
            ></button>
            <div className="flex  h-[2rem]  items-center m-3  gap-2 flex-row w-full justify-center">
              <p className="flex justify-center  text-lg sm:text-xl font-medium ">
                Forest Change
              </p>
              <button onClick={toggleForestChangeModal}>
                <FaRegCircleQuestion className="sm:h-[1.5rem] sm:w-[1.5rem]"></FaRegCircleQuestion>
              </button>
            </div>
          </div>
          <div className="sm:w-[14rem] w-[10rem] flex justify-center items-center h-fit sm:h-full  flex-col m-3">
            <button
              onClick={handleForestChange}
              className="border-4  border-purple w-full h-[10rem]  sm:h-[14rem] p-3 rounded-2xl focus:bg-slate-300 hover:bg-slate-300"
            ></button>
            <div className="flex h-[2rem]  items-center m-3  gap-2 flex-row w-full justify-center">
              <p className="flex justify-center  text-lg sm:text-xl font-medium ">
                Forest Change
              </p>
              <button onClick={toggleTimeSeriesModal}>
                <FaRegCircleQuestion className="sm:h-[1.5rem] sm:w-[1.5rem]"></FaRegCircleQuestion>
              </button>
            </div>
          </div>
        </div>
      </div>
      <a
        href="https://github.com/stjianqing/aiforevil"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          src={github}
          alt="github icon"
          width={10}
          height={10}
          className="sm:w-[2rem] sm:h-[2rem] w-[1.5rem] h-[1.5rem] bottom-0 right-0 absolute m-2 "
        ></Image>
      </a>
    </>
  );
};

export default Home;
