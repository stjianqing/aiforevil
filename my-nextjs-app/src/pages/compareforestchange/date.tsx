import React, { useState, createRef, useEffect } from "react";
import { useRouter } from "next/router";

export const FCDate: React.FC = () => {
  const router = useRouter();
  const [latitude, setLatitude] = useState(router.query.latitude);
  const [longitude, setLongitude] = useState(router.query.longitude);
  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");
  function handleConfirm() {
    router.push("/compareforestchange/crop");
  }
  function handleDate1Change(e) {
    setDate1(e.target.value);
  }

  function handleDate2Change(e) {
    setDate2(e.target.value);
  }
  return (
    <div className="flex w-screen h-screen flex-col pt-[5rem] items-center  ">
      <h1 className="text-[1.5rem]">Compare Forest Change</h1>
      <div className="flex flex-row gap-4 mt-5">
        <p>Latitude: {latitude}</p>
        <p>Longtitude: {longitude}</p>
      </div>
      <div className="flex w-1/2 flex-col justify-center items-center m-5">
        <p>Enter your date of interest</p>
        <div className = "flex flex-row gap-4">
          <label>Date 1: </label>
          <input type="date" onChange={handleDate1Change}></input>
        </div>

        <div className = "flex flex-row gap-4">
          <p>Date 2: </p>
          <input type="date" onChange={handleDate2Change}></input>
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

export default FCDate;
