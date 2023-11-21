import React, { useState, createRef, useEffect } from "react";
import { useRouter } from "next/router";

export const FFDate: React.FC = () => {
  const router = useRouter();
  const [latitude, setLatitude] = useState(router.query.latitude);
  const [longitude, setLongitude] = useState(router.query.longitude);
  const [date, setDate] = useState("");
  function handleConfirm() {
    router.push({
      pathname: "/findforest/crop",
      query: {
        latitude: latitude,
        longitude: longitude,
        date: date,
      },
    });
    console.log(latitude, longitude);
    console.log(router.query);
  }
  function handleDateChange(e) {
    setDate(e.target.value);
  }
  return (
    <div className="flex w-screen h-screen flex-col pt-[5rem] items-center  ">
      <h1 className="text-[1.5rem]">Find Forest</h1>
      <div className="flex flex-row gap-4">
        <p>Latitude: {latitude}</p>
        <p>Longtitude: {longitude}</p>
      </div>
      <input type="date" onChange={handleDateChange}></input>
      <div className="flex w-1/2 flex-col justify-center items-center">
        <p>Enter your date of interest</p>

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

export default FFDate;
