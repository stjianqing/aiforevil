import React, { useState, createRef, useEffect } from "react";
import { useRouter } from "next/router";
import { FaCheck } from "react-icons/fa6";
import { FaAngleLeft } from "react-icons/fa6";

export const FFDate: React.FC = () => {
  const router = useRouter();
  const [latitude, setLatitude] = useState(router.query.latitude);
  const [longitude, setLongitude] = useState(router.query.longitude);
  const [date, setDate] = useState("");

  async function handleConfirm() {
    const req = await fetch("http://127.0.0.1:5000/api/location-coord", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ latitude, longitude, date }),
    });

    router.push({
      pathname: "/findforest/crop",
      query: {
        latitude: latitude,
        longitude: longitude,
        date: date,
      },
    });
  }

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    setDate(e.target.value);
  }

  function handleBack() {
    router.push({
      pathname: "/findforest/coordinates",
    });
  }

  return (
    <div className="flex w-screen h-screen flex-col pt-[2rem] ">
      <h1 className="text-black sm:text-5xl text-2xl justify-center flex font-semibold p-3 mx-[3rem]">
        Find Forest
      </h1>
      <div className="flex flex-row w-full px-3">
        <svg
          height="6"
          viewBox="0 0 423 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="fill-green w-1/4 m-[1rem]"
        >
          <path d="M422.8 0.808594H7.77557L0.0341797 5.72677H415.059L422.8 0.808594Z" />
        </svg>

        <svg
          height="6"
          viewBox="0 0 423 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="fill-green w-1/4 m-[1rem] "
        >
          <path d="M422.8 0.808594H7.77557L0.0341797 5.72677H415.059L422.8 0.808594Z" />
        </svg>
        <svg
          height="6"
          viewBox="0 0 423 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="fill-gray w-1/4 m-[1rem] "
        >
          <path d="M422.8 0.808594H7.77557L0.0341797 5.72677H415.059L422.8 0.808594Z" />
        </svg>

        <svg
          height="6"
          viewBox="0 0 423 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="fill-gray w-1/4 m-[1rem]"
        >
          <path d="M422.8 0.808594H7.77557L0.0341797 5.72677H415.059L422.8 0.808594Z" />
        </svg>
      </div>
      <div className="flex justify-left ml-[2.5rem] p-3">
        <div className="flex flex-col">
          <p className="flex flex-row font-semibold text-md sm:text-lg">
            Latitude:
          </p>
          <p className="flex flex-row w-fit font-semibold text-md sm:text-lg">
            Longtitude:
          </p>
        </div>
        <div className="flex flex-col w-fit ml-[1rem]">
          <p className="flex flex-row w-fit text-md sm:text-lg"> {latitude}</p>
          <p className="flex flex-row w-fit text-md sm:text-lg"> {longitude}</p>
        </div>
      </div>

      <p className=" text-lg sm:text-2xl text-black flex justify-center w-full">
        Select your date of interest
      </p>

      <div className="flex flex-row flex-wrap justify-center mt-[1rem]">
        <div className="flex flex-col mx-[5rem] ">
          <label className=" text-lg sm:text-3xl font-medium">Date: </label>
          <input
            className="my-[1rem]  text-lg sm:text-xl border-black border rounded-lg p-[0.5rem]"
            type="date"
            onChange={handleDateChange}
          ></input>
        </div>
      </div>

      <div className="h-full"></div>

      <div className="flex flex-row w-full justify-between mt-[1rem] mb-[3rem]">
        <button
          onClick={handleBack}
          className="mt-[5rem] flex h-fit w-fit flex-row justify-center items-center gap-2 font-medium text-xl text-white bg-green rounded-xl px-[1rem] p-2 ml-[3rem]"
        >
          <FaAngleLeft></FaAngleLeft>
          <p>Back</p>
        </button>
        <button
          onClick={handleConfirm}
          className="mt-[5rem] flex h-fit w-fit justify-center items-center gap-2 flex-row  font-medium text-xl text-white bg-purple rounded-xl px-[1rem] p-2 mr-[3rem]"
        >
          <p>Confirm</p>
          <FaCheck></FaCheck>
        </button>
      </div>
    </div>
  );
};

export default FFDate;
