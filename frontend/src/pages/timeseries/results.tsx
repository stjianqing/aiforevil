import React, { useState, createRef, useEffect, useRef} from "react";
import { useRouter } from "next/router";
const defaultSrc = "/small.jpg";
import Image from "next/image";
import html2pdf from 'html2pdf.js';

export const TSResults: React.FC = () => {
  const router = useRouter();
  const [latitude, setLatitude] = useState(router.query.latitude);
  const [longitude, setLongitude] = useState(router.query.longitude);
  const [date, setDate] = useState(router.query.date);
  const [period, setPeriod] = useState(router.query.period);
  const [image, setImage] = useState('');
  const fileName: string = "report.pdf"
  const [isVisible, setIsVisible] = useState(false);

  async function getImg(){
    const res = await fetch(`http://127.0.0.1:5000/api/get-segment`,{
      method: 'GET',
    })
      .then(res => res.json())
      .then(data => {setImage(data.url)})
  }

  const htmlContent = `
    <div>
      <h2 style="font-size: 2rem; text-align:center; font-family:system-ui; ">Satellite Image in ${date} for ${period}</h2>
      <p style="font-size: 1.5rem; text-align:center; font-familt: system-ui;">Location: ${latitude}, ${longitude}</p>
      <Image style="display: block; margin-left: auto;margin-right: auto; width: 70%; alignment:center; margin-top: 1.5rem" src="${image}" alt="Cropped image" width={500} height={500} justify: center></Image>
    </div>`;

  const DownloadPDFButton = ({}) => {
    const containerRef = useRef(null);
    const handleDownload = () => {
      const element = containerRef.current;
      const opt =  {
        margin: 10,
        filename: "Report.pdf",
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      }
      html2pdf().set(opt).from(htmlContent).save();
    };

    return (
      <div>
        <button 
          onClick={handleDownload}
          className="mt-[1rem] border border-black rounded-xl p-2">Download</button>

      </div>
    )
  };

  function handleBack() {
    router.push({
        pathname: "/timeseries/crop",
        query: { latitude: latitude, longitude: longitude, date: date, period: period},
      })
  };

  function handleHome() {
    router.push({
        pathname: "/"
      })
  };

  useEffect(() => {
    getImg();
  }, []);

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
      <div className="flex p-1 flex-wrap justify-around w-full">
          <div className = "flex items-start">
            <div className="flex flex-col">
              <p className= "flex flex-row font-semibold text-lg">Latitude: </p>
              <p className = "flex flex-row w-fit font-semibold text-lg">Longtitude:</p>
              <p className = "flex flex-row w-fit font-semibold text-lg">Date:</p>
              <p className = "flex flex-row w-fit font-semibold text-lg">Time Period:</p>
            </div>
            <div className="flex flex-col w-fit ml-[1rem]">
              <p className= "flex flex-row w-fit text-lg"> {latitude}</p>
              <p className = "flex flex-row w-fit text-lg"> {longitude}</p>
              <p className = "flex flex-row w-fit text-lg"> {date}</p>
              <p className = "flex flex-row w-fit text-lg"> {period}</p>
            </div>
          </div>
          <div className = "flex flex-col ml-[1rem] items-center">
            <p className="text-xl text-black p-[1rem]">Your Forest</p>
            <div className="flex flex-row m-[4rem]">
              <Image className = "p-[1rem]" src = {image} alt = "Cropped image" width={200} height={200}></Image>
              <Image className = "p-[1rem]" src = {image} alt = "Cropped image" width={200} height={200}></Image>
              <Image className = "p-[1rem]" src = {image} alt = "Cropped image" width={200} height={200}></Image>
              <Image className = "p-[1rem]" src = {image} alt = "Cropped image" width={200} height={200}></Image>
            </div>
          </div>

          <div>
            <DownloadPDFButton />
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



export default TSResults;
