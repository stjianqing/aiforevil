import React, { useState, createRef, useEffect } from "react";
import { useRouter } from "next/router";

export const FFCoordinate: React.FC = () => {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const router = useRouter();
  function handleLatitudeChange(e) {
    setLatitude(e.target.value);
  }
  function handleLongitudeChange(e) {
    setLongitude(e.target.value);
  }

  function handleConfirm() {
    router.push({
      pathname: "/findforest/date",
      query: { latitude: latitude, longitude: longitude },
    });
  }
  return (
    <div className="flex w-screen h-screen flex-col pt-[5rem] items-center  ">
      <h1 className="text-[1.5rem]">Find Forest</h1>

      <div className="flex w-1/2 flex-col justify-center items-center">
        <p>Enter your coordinates</p>
        <div className="flex flex-row mt-[1rem]">
          <div className="flex flex-col mr-[2rem]">
            <label className="mt-1 mb-6">Latitude:</label>
            <label className="">Longitude:</label>
          </div>
          <div className="flex flex-col">
            <input
              onChange={handleLatitudeChange}
              type="text"
              className="w-[8rem] mb-4 border border-black p-1 rounded "
            ></input>
            <input
              onChange={handleLongitudeChange}
              type="text"
              className="w-[8rem] border border-black p-1 rounded"
            ></input>
          </div>
        </div>
        <button
          onClick={handleConfirm}
          className="mt-[1rem] border border-black rounded-xl p-2"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default FFCoordinate;
