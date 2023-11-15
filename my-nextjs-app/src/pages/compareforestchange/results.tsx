import React, { useState, createRef, useEffect } from "react";
import { useRouter } from "next/router";
const defaultSrc = "/small.jpg";
import Image from "next/image";

export const FCResults: React.FC = () => {
  const router = useRouter();
  const [latitude, setLatitude] = useState(router.query.latitude);
  const [longitude, setLongitude] = useState(router.query.longitude);
  const [date1, setDate1] = useState(router.query.date1);
  const [date2, setDate2] = useState(router.query.date2);

  function handleConfirm() {
    router.push("/index");
  }

  return (
    <div className="flex w-screen h-screen flex-col pt-[5rem] items-center ">
      <h1 className="text-[1.5rem]">Compare Forest Change</h1>
      <div className = "flex flex-col justify-center">
        <Image src = {defaultSrc} alt = "Cropped image" width={500} height={500}></Image>
        <div className="flex flex-row gap-4 mt-5">
          <p>Latitude: {latitude}</p>
          <p>Longtitude: {longitude}</p>
        </div>
        <div className="flex flex-row gap-4 mt-5">
          <p>Date 1: {date1}</p>
          <p>Date 2: {date2}</p>
        </div>
      </div>
      
    </div>
  );
};

export default FCResults;
