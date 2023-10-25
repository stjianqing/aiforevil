import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useState, useMemo } from "react";
import small from "public/small.jpg";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [date, setDate] = useState(0);

  function handleLatitudeChange(e) {
    setLatitude(e.target.value);
  }
  function handleLongitudeChange(e) {
    setLongitude(e.target.value);
  }

  function handleDateChange(e) {
    setDate(e.target.value);
  }

  function handleImage() {
    //call api here to get the satellite image
  }

  return (
    <div className="flex w-screen h-screen flex-col ">
      <div className="flex flex-row w-full flex-wrap ">
        <div className="flex flex-col m-5">
          <p>Latitude</p>
          <input
            type="text"
            className="border-black border"
            onChange={handleLatitudeChange}
          ></input>
        </div>
        <div className="flex flex-col m-5">
          <p>Longitude</p>
          <input
            type="text"
            className="border-black border"
            onChange={handleLongitudeChange}
          ></input>
        </div>
        <input
          type="date"
          className="h-[2rem] mt-10 border-black border"
          onChange={handleDateChange}
        ></input>
      </div>
      <button
        onClick={handleImage}
        className="w-fit border border-black p-2 m-5"
      >
        Get Image
      </button>
      <Image src={small} className="w-[25rem] h-[25rem] m-5"></Image>
    </div>
  );
}
