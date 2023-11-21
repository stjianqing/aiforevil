import React, { useState, createRef, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

export const FFDate: React.FC = () => {
  const router = useRouter();
  const [latitude, setLatitude] = useState(router.query.latitude);
  const [longitude, setLongitude] = useState(router.query.longitude);
  const [date, setDate] = useState(router.query.date);
  const [cropData, setCropData] = useState(router.query.cropData);
  function handleConfirm() {
    router.push("/findforest/crop");
  }

  return (
    <div className="flex w-screen h-screen flex-col pt-[5rem] items-center  ">
      <h1 className="text-[1.5rem]">Find Forest</h1>
      <div className="flex flex-row gap-4">
        <p>Latitude: {latitude}</p>
        <p>Longtitude: {longitude}</p>
        <p>Date: {date}</p>
      </div>
      <div className="flex w-1/2 flex-col justify-center items-center">
        <Image
          src={cropData}
          alt="Cropped image"
          width={500}
          height={500}
        ></Image>
      </div>
    </div>
  );
};

export default FFDate;
