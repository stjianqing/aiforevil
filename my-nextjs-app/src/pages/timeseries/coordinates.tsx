import React, { useState, createRef, useEffect } from "react";
import { useRouter } from "next/router";
import SearchBoc from "@/components/searchbox";
import dynamic from "next/dynamic";

export const TSCoordinate: React.FC = () => {
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [token, setToken] = useState("");
  const router = useRouter();
  const [cropData, setCropData] = useState(router.query.cropData);
  
  function handleLatitudeChange(e) {
    setLatitude(e.target.value);
  }
  function handleLongitudeChange(e) {
    setLongitude(e.target.value);
  }

  const updateCoordinates = (newLatitude, newLongitude) => {
    setLatitude(newLatitude);
    setLongitude(newLongitude);
    console.log(latitude, longitude)
  };


  function handleConfirm() {
    router.push({
      pathname: "/timeseries/date",
      query: { latitude: latitude, longitude: longitude },
    });
  }

  function handleBack() {
    router.push({
        pathname: "/",
      })
  };

  return (
    <div className="flex w-screen h-screen flex-col pt-[2rem] ">
      <h1 className="text-black text-6xl justify-center flex font-semibold p-3 mx-[3rem]">
        Time Series
      </h1>
      <div className = "flex flex-row w-full px-3">
      <svg height="6" viewBox="0 0 423 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-green w-1/4 m-[1rem]">
            <path d="M422.8 0.808594H7.77557L0.0341797 5.72677H415.059L422.8 0.808594Z"/>
          </svg>

          <svg height="6" viewBox="0 0 423 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-green w-1/4 m-[1rem] ">
          <path d="M422.8 0.808594H7.77557L0.0341797 5.72677H415.059L422.8 0.808594Z"/>
        </svg>
        <svg height="6" viewBox="0 0 423 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-gray w-1/4 m-[1rem] ">
          <path d="M422.8 0.808594H7.77557L0.0341797 5.72677H415.059L422.8 0.808594Z"/>
        </svg>

        <svg height="6" viewBox="0 0 423 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-gray w-1/4 m-[1rem]">
          <path d="M422.8 0.808594H7.77557L0.0341797 5.72677H415.059L422.8 0.808594Z"/>
        </svg>
      </div>
      
      <p className="flex flex-row justify-center m-[1rem] text-2xl">Search for your forest or enter coordinates manually</p>
      <div className="flex flex-row w-5/6 flex-wrap justify-between p-[1rem]">
        <div className = "flex flex-col px-[2rem]">
          <SearchBoc
          updateCoordinates={updateCoordinates} />
        </div>
        <div className="flex justify-center flex-col px-[1rem] pt-[2rem]">
          <div className="flex flex-row">
            <div className="flex flex-col mx-[1rem]">
              <label className="text-3xl my-[1rem] ">Latitude:</label>
              <label className="text-3xl my-[1rem] ">Longitude:</label>
            </div>
          <div className="flex flex-col mx-[1rem]">
            <input
              onChange={handleLatitudeChange}
              type="text"
              defaultValue={latitude}
              className="w-[8rem] text-2xl my-[1rem] border border-black p-1 rounded "
            ></input>
            <input
              onChange={handleLongitudeChange}
              type="text"
              defaultValue={longitude}
              className="w-[8rem] border text-2xl my-[1rem] border-black p-1 rounded"
            ></input>
          </div>
        </div>
      </div>
    </div>
    <div className = "flex flex-row w-full justify-between mb-[3rem]">
          <button
            onClick={handleBack}
            className="mt-[5rem] font-medium text-xl text-white bg-green rounded-xl px-[1rem] p-2 ml-[3rem]"
          >
            Back
          </button>
          <button
            onClick={handleConfirm}
            className="mt-[5rem] font-medium text-xl text-white bg-purple rounded-xl px-[1rem] p-2 mr-[3rem]"
          >
            Confirm
          </button>
      </div>
  </div>
  );
};

export default TSCoordinate;