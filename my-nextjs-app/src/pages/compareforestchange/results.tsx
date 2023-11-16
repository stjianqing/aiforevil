import React, { useState, createRef, useEffect, useRef} from "react";
import { useRouter } from "next/router";
const defaultSrc = "/small.jpg";
import Image from "next/image";
import html2pdf from 'html2pdf.js';

export const FCResults: React.FC = () => {
  const router = useRouter();
  const [latitude, setLatitude] = useState(router.query.latitude);
  const [longitude, setLongitude] = useState(router.query.longitude);
  const [date1, setDate1] = useState(router.query.date1);
  const [date2, setDate2] = useState(router.query.date2);
  const fileName: string = "report.pdf"
  const [isVisible, setIsVisible] = useState(false);

  const htmlContent = `
    <div>
      <h2 style="font-size: 2rem; text-align:center; font-family:system-ui; ">Satellite Image in ${date1} and ${date2}</h2>
      <p style="font-size: 1.5rem; text-align:center; font-familt: system-ui;">Location: ${latitude}, ${longitude}</p>
      <Image style="display: block; margin-left: auto;margin-right: auto; width: 70%; alignment:center; margin-top: 1.5rem" src="${defaultSrc}" alt="Cropped image" width={500} height={500} justify: center></Image>
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
        <div>
          <DownloadPDFButton />
        </div> 
      </div>
    </div>
  );
};

export default FCResults;
