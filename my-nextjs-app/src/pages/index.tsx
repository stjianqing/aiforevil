import React, { useState, createRef, useEffect } from "react";
// import Cropper, { ReactCropperElement } from "react-cropper";
// import "cropperjs/dist/cropper.css";
import { useRouter } from "next/router";
import Image from "next/image";

const findForestSvg = "/public/find_forest.svg"
const findForestPng = "/public/find_forest.png"

export default function Home() {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [date, setDate] = useState(0);
  const [imgUrl, setImgUrl] = useState(0);

export const Home: React.FC = () => {
  const router = useRouter();

  function handleFindForest() {
    router.push("/findforest/coordinates");
  }

  async function handleImage() {
    // sends long and lat values to backend
    const req = await fetch('http://127.0.0.1:5000/api/location-coord',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({latitude, longitude, date})
    })

    //takes long and lat values and add it to http
    const res = await fetch(`http://127.0.0.1:5000/api/get-img`,{
      method: 'GET',
    })
    .then(res => res.json())
    .then(data => {setImgUrl(data.url)})
  function handleForestChange() {
    router.push("/compareforestchange/coordinates");
  }

  function handleTimeSeries() {
    router.push("/timeseries/coordinates");
  }
    <div className="flex w-screen h-screen flex-col justify-center items-center pt-[1rem] ">
      <h1 className="text-7xl p-3">ForestFind</h1>
      <p className="w-4/6 text-xl p-3">
        Whether you're an environmental enthusiast, a conservationist, a
        forestry professional, or just a curious nature lover, ForestFind allows
        you to track and compare forest boundaries over time.
      </p>
      <div className = "flex flex-row flex-wrap justify-center p-3 w-full h-1/3 ">
        <div className = "w-1/5 h-full flex-col m-3">
          <button
            onClick={handleFindForest}
            className="border-4 border-green w-full h-full p-3 rounded-2xl focus:bg-slate-300 hover:bg-slate-300">
          </button>
          <p className = "flex justify-center text-xl m-3 font-medium"> Find Forest</p>
        </div>
        <div className = "w-1/5 h-full flex-col m-3">
          <button
            onClick={handleForestChange}
            className="border-4 border-pink w-full h-full p-3 rounded-xl focus:bg-slate-300 hover:bg-slate-300"
          >
          </button>
          <p className = "flex justify-center text-xl m-3 font-medium ">Forest Change</p>
        </div>

        <div className = "w-1/5 h-full flex-col m-3">
          <button
            onClick={handleTimeSeries}
            className="border-4 border-purple w-full h-full p-3 rounded-2xl focus:bg-slate-300 hover:bg-slate-300"
          >
          </button>
            <p className = "flex justify-center text-xl font-medium m-3"> Time Series</p>
        </div>
          
      </div>
      <button
        onClick={handleImage}
        className="w-fit border border-black p-2 m-5"
      >
        Get Image
      </button>
      {/* <Image src={small} className="w-[25rem] h-[25rem] m-5"></Image> */}
      {/* DEBUG: is showing 0 if not passed in */}
      {imgUrl && 
        <Image
          alt="Satellite Image by given coordinates"
          src={imgUrl}
          width={100} // adjust the size
          height={100} // adjust the size
          className="w-[25rem] h-[25rem] m-5"
        />
      }

    </div>
  );
};

export default Home;
