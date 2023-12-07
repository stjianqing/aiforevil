import React, { useState, useEffect} from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import html2pdf from 'html2pdf.js';
const defaultSrc = "/compare.jpg";

export const FCResults: React.FC = () => {
  const router = useRouter();
  const [latitude, setLatitude] = useState(router.query.latitude);
  const [longitude, setLongitude] = useState(router.query.longitude);
  const [date1, setDate1] = useState(router.query.date1);
  const [date2, setDate2] = useState(router.query.date2);
  const [image, setImage] = useState('');

  async function getImg(){
    // const res = await fetch(`http://127.0.0.1:5000/api/get-segment`,{
    //   method: 'GET',
    // })
    //   .then(res => res.json())
    //   .then(data => {setImage(data.url)})
    setImage(defaultSrc)
  }

  function handleBack() {
    router.push({
        pathname: "/compareforestchange/crop",
        query: { latitude: latitude, longitude: longitude, date1: date1, date2: date2},
      })
  };

  function handleHome() {
    router.push({
        pathname: "/"
      })
  };
  const DownloadButton = ({ fileUrl }) => {
    const handleDownload = () => {
      const a = document.createElement('a');
      a.href = fileUrl;
      a.download = fileUrl.split('/').pop();
      a.click();
    };
  
    return (
      <button className="mt-[1rem] border border-black rounded-xl p-2 px-[3rem]" onClick={handleDownload}>
        Download
      </button>
    );
  };

  useEffect(() => {
    getImg();
  }, []);

  return (
    <div className="flex w-screen h-screen flex-col pt-[2rem] items-center  ">
      <h1 className="text-black text-6xl justify-center flex font-semibold p-3">
        Forest Change
      </h1>
      <div className = "flex flex-row w-full px-3">
      <svg height="6" viewBox="0 0 423 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-pink w-1/4 m-[1rem]">
            <path d="M422.8 0.808594H7.77557L0.0341797 5.72677H415.059L422.8 0.808594Z"/>
          </svg>

          <svg height="6" viewBox="0 0 423 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-pink w-1/4 m-[1rem] ">
          <path d="M422.8 0.808594H7.77557L0.0341797 5.72677H415.059L422.8 0.808594Z"/>
        </svg>
        <svg height="6" viewBox="0 0 423 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-pink w-1/4 m-[1rem] ">
          <path d="M422.8 0.808594H7.77557L0.0341797 5.72677H415.059L422.8 0.808594Z"/>
        </svg>

        <svg height="6" viewBox="0 0 423 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-pink w-1/4 m-[1rem]">
          <path d="M422.8 0.808594H7.77557L0.0341797 5.72677H415.059L422.8 0.808594Z"/>
        </svg>
      </div>
        <div className="flex p-1 flex-wrap justify-around w-full">
          <div className = "flex items-start">
            <div className="flex flex-col">
              <p className= "flex flex-row font-semibold text-lg">Latitude: </p>
              <p className = "flex flex-row w-fit font-semibold text-lg">Longtitude:</p>
              <p className = "flex flex-row w-fit font-semibold text-lg">Date 1:</p>
              <p className = "flex flex-row w-fit font-semibold text-lg">Date 2:</p>
            </div>
            <div className="flex flex-col w-fit ml-[1rem]">
              <p className= "flex flex-row w-fit text-lg"> {latitude}</p>
              <p className = "flex flex-row w-fit text-lg"> {longitude}</p>
              <p className = "flex flex-row w-fit text-lg"> {date1}</p>
              <p className = "flex flex-row w-fit text-lg"> {date2}</p>
            </div>
          </div>
          <div className = "flex flex-col ml-[1rem] items-center">
            <p className="text-xl text-black p-[1rem]">
            Your Forest
            </p>
            {image && 
              <Image src={image} alt="Cropped image" width={350} height={350}></Image>
            }
          </div>

          <div>
            <DownloadButton fileUrl={'https://storage.googleapis.com/aiforevil/output.shp.zip'}/>
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
          onClick={handleHome}
          className="mt-[5rem] font-medium text-xl text-white bg-purple rounded-xl px-[1rem] p-2 mr-[3rem]"
        >
          Home
        </button>
      </div>
    </div>
  );
};

export default FCResults;
