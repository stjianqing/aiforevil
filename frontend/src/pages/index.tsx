import React, { useState, createRef, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { FaRegCircleQuestion, FaX } from "react-icons/fa6";
import Image from "next/image";
import github from "public/github.svg";
import FF from "public/findforest.svg";
import FC from "public/compare.svg";
import TS from "public/series.svg";
import FF_gif from "public/findForest.gif";

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
          <div className="h-1/2 w-5/6 sm:w-1/2 bg-white absolute rounded-lg z-20  items-center flex flex-col overflow-scroll">
            <div className="h-fit w-full justify-end flex p-2">
              <button onClick={toggleFindForestModal}>
                <FaX></FaX>
              </button>
            </div>
            {FFInfo ? (
              <div className="w-11/12 flex-col flex gap-2 mb-[1rem]">
                <p className="text-2xl">Forest Find</p>
                <p>
                  Forest Find is a tool to help you find the boundaries of your
                  forest.
                </p>
                <div className="flex flex-row w-full justify-center">
                  <Image
                    src={FF_gif}
                    alt="find forest"
                    width={20}
                    height={20}
                    className="w-[20rem] h-full border-2 border-black"
                  ></Image>
                </div>
                <p>
                  <b>Give us:</b>
                  <ul>
                    <li>(1) coordinates of your forest</li>
                    <li> (2) a date of interest</li>
                  </ul>
                </p>
                <p>
                  <b> We will return you:</b>
                  <ul>
                    <li>(1) image of your forest boundary</li>{" "}
                    <li>(2) shape (.SHP) file</li>
                  </ul>
                </p>
              </div>
            ) : null}
            {FCInfo ? (
              <div className="w-11/12 flex-col flex gap-2 mb-[1rem]">
                <p className="text-2xl">Forest Change</p>
                <p>
                  Forest Change is a tool to help you compare the changes in in
                  the boundaries of your forest across two separate dates
                </p>
                <div className="flex flex-row w-full justify-center">
                  <Image
                    src={FF_gif}
                    alt="find forest"
                    width={20}
                    height={20}
                    className="w-[20rem] h-full border-2 border-black"
                  ></Image>
                </div>
                <p>
                  <b>Give us:</b>
                  <ul>
                    <li>(1) coordinates of your forest</li>
                    <li> (2) two dates of interest</li>
                  </ul>
                </p>
                <p>
                  <b> We will return you:</b>
                  <ul>
                    <li>(1) images of your forest boundary</li>{" "}
                    <li>(2) shape (.SHP) files</li>
                    <li>(3) boundary change data</li>
                  </ul>
                </p>
              </div>
            ) : null}
            {TSInfo ? (
              <div className="w-11/12 flex-col flex gap-2 mb-[1rem]">
                <p className="text-2xl">Forest Series</p>
                <p>
                  Forest Series is a tool to help you compare a series of
                  changes over a time period.
                </p>
                <div className="flex flex-row w-full justify-center">
                  <Image
                    src={FF_gif}
                    alt="find forest"
                    width={20}
                    height={20}
                    className="w-[20rem] h-full border-2 border-black"
                  ></Image>
                </div>
                <p>
                  <b>Give us:</b>
                  <ul>
                    <li>(1) coordinates of your forest</li>
                    <li> (2) ending date of interest</li>
                    <li> (3) time period of interest</li>
                  </ul>
                </p>
                <p>
                  <b> We will return you:</b>
                  <ul>
                    <li>(1) images of your forest boundary</li>{" "}
                    <li>(2) shape (.SHP) files</li>
                    <li>(3) boundary change data</li>
                  </ul>
                </p>
              </div>
            ) : null}
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
        <div className="flex flex-row flex-wrap justify-center items-center w-10/12 h-[14rem]  ">
          <div className="flex justify-center items-center h-fit sm:h-full  flex-col m-3">
            <button
              onClick={handleFindForest}
              className="border-4 border-green flex justify-center items-center w-[9rem] h-[9rem]  sm:w-[12rem]  sm:h-[12rem] p-3 rounded-2xl "
            >
              <Image
                src={FF}
                alt="find forest"
                width={20}
                height={20}
                className="w-full h-full"
              ></Image>
            </button>
            <div className="flex h-[2rem]  items-center m-3  gap-2 flex-row w-full justify-center">
              <p className="flex justify-center text-lg sm:text-xl font-medium ">
                Find Forest
              </p>
              <button onClick={toggleFindForestModal}>
                <FaRegCircleQuestion className="sm:h-[1.5rem] sm:w-[1.5rem]"></FaRegCircleQuestion>
              </button>
            </div>
          </div>
          <div className=" flex justify-center items-center h-fit sm:h-full  flex-col m-3">
            <button
              onClick={handleForestChange}
              className="border-4 border-pink flex justify-center items-center w-[9rem] h-[9rem]  sm:w-[12rem]  sm:h-[12rem]  p-3 rounded-2xl "
            >
              <Image
                src={FC}
                alt="find forest"
                width={20}
                height={20}
                className="w-full h-full"
              ></Image>
            </button>
            <div className="flex  h-[2rem]  items-center m-3  gap-2 flex-row w-full justify-center">
              <p className="flex justify-center  text-lg sm:text-xl font-medium ">
                Forest Change
              </p>
              <button onClick={toggleForestChangeModal}>
                <FaRegCircleQuestion className="sm:h-[1.5rem] sm:w-[1.5rem]"></FaRegCircleQuestion>
              </button>
            </div>
          </div>
          <div className="flex justify-center items-center h-fit sm:h-full  flex-col m-3">
            <button
              onClick={handleForestChange}
              disabled
              className="border-4   flex justify-center items-center border-purple  w-[9rem] h-[9rem]  sm:w-[12rem]  sm:h-[12rem]  p-3 rounded-2xl "
            >
              <Image
                src={TS}
                alt="find forest"
                width={20}
                height={20}
                className="w-full h-full"
              ></Image>
            </button>
            <div className="flex h-[2rem]  items-center m-3  gap-2 flex-row w-full justify-center">
              <p className="flex justify-center  text-lg sm:text-xl font-medium ">
                Forest Series
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
