import React, { useState, createRef } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import Image from "next/image";
import small from "public/small.jpg";

const defaultSrc = "/small.jpg";

export const Home: React.FC = () => {
  const [image, setImage] = useState(defaultSrc);
  const [cropData, setCropData] = useState("#");
  const cropperRef = createRef<ReactCropperElement>();
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [date, setDate] = useState(0);
  const [cropped, setCropped] = useState(false);

  function handleLatitudeChange(e) {
    setLatitude(e.target.value);
  }
  function handleLongitudeChange(e) {
    setLongitude(e.target.value);
  }

  function handleDateChange(e) {
    setDate(e.target.value);
  }

  const getCropData = () => {
    if (typeof cropperRef.current?.cropper !== "undefined") {
      setCropData(cropperRef.current?.cropper.getCroppedCanvas().toDataURL());
    }
    setCropped(true);
  };

  return (
    <div className="flex w-screen h-screen flex-col ">
      <div className="flex flex-row w-full flex-wrap ">
        <div className="flex flex-col m-5">
          <p>Latitude</p>
          <input
            type="text"
            className="border-black border"
            onChange={handleLatitudeChange}
          ></input>
        </div>
        <div className="flex flex-col m-5">
          <p>Longitude</p>
          <input
            type="text"
            className="border-black border"
            onChange={handleLongitudeChange}
          ></input>
        </div>
        <input
          type="date"
          className="h-[2rem] mt-10 border-black border"
          onChange={handleDateChange}
        ></input>
      </div>
      <button
        // onClick={handleImage}
        onClick={getCropData}
        className="w-fit border border-black p-2 m-5"
      >
        Crop
      </button>

      <div className="flex flex-row w-screen">
        <Cropper
          ref={cropperRef}
          // style={{ height: "10rem", width: "10rem" }}
          className="w-[25rem] h-[25rem] m-5"
          zoomTo={0.05}
          initialAspectRatio={1}
          preview=".img-preview"
          src={image}
          viewMode={1}
          minCropBoxHeight={2}
          minCropBoxWidth={2}
          background={false}
          responsive={true}
          autoCropArea={0.5}
          checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
          guides={true}
        />
        {cropped ? (
          <img
            className="w-[25rem] h-[25rem] object-contain m-5"
            src={cropData}
            alt="cropped"
          />
        ) : null}
      </div>
    </div>
  );
};

export default Home;

// async function handleImage() {
//   // Read the JP2 image from the file system.
//   const jp2ImageBuffer = await fs.readFile("images/test.jp2");

//   // Convert the JP2 image to a JPEG image.
//   const jpgImageBuffer = await sharp(jp2ImageBuffer)
//     .toFormat("jpeg")
//     .toBuffer();

//   // Write the JPEG image to the file system.
//   await fs.writeFile("images/test.jpg", jpgImageBuffer);
// }
