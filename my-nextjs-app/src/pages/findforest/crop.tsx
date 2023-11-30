// export default InputCoordinates;
import React, { useState, createRef, useEffect } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { useRouter } from "next/router";
import {
  FaCheck,
  FaAngleLeft,
  FaCropSimple,
  FaArrowRotateRight,
} from "react-icons/fa6";

const defaultSrc = "/small.jpg";

export const InputCoordinates: React.FC = () => {
  const router = useRouter();
  const [image, setImage] = useState(defaultSrc);
  const [cropData, setCropData] = useState("");
  const cropperRef = createRef<ReactCropperElement>();
  const [latitude, setLatitude] = useState(router.query.latitude);
  const [longitude, setLongitude] = useState(router.query.longitude);
  const [date, setDate] = useState(router.query.date);
  const [cropped, setCropped] = useState(false);
  const [croppedCoords, setCroppedCoords] = useState({
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
  });

  function handleConfirm() {
    router.push({
      pathname: "/findforest/results",
      query: {
        latitude: latitude,
        longitude: longitude,
        date: date,
        cropData: cropData,
      },
    });
  }

  function handleBack() {
    router.push({
      pathname: "/findforest/date",
      query: { latitude: latitude, longitude: longitude },
    });
  }

  function toggleModal() {
    setCropped(false);
  }

  //x1,y1 is top right, x2,y2 is bottom left
  function getDistance() {
    const x1 = croppedCoords.x1;
    const x2 = croppedCoords.x2;
    const y1 = croppedCoords.y1;
    const y2 = croppedCoords.y2;

    const x_dist_real = (x1 - x2) * 10000;
    const y_dist_real = (y2 - y1) * 10000;
  }

  useEffect(() => {
    console.log(croppedCoords);
    getDistance();
  }, [croppedCoords]);

  const getCropData = () => {
    if (typeof cropperRef.current?.cropper !== "undefined") {
      console.log(typeof cropperRef.current?.cropper.getCanvasData());
      const coords = {
        x1:
          (cropperRef.current?.cropper.getCropBoxData().left +
            cropperRef.current?.cropper.getCropBoxData().width) /
          cropperRef.current?.cropper.getContainerData().width,
        y1:
          cropperRef.current?.cropper.getCropBoxData().top /
          cropperRef.current?.cropper.getContainerData().height,
        x2:
          cropperRef.current?.cropper.getCropBoxData().left /
          cropperRef.current?.cropper.getContainerData().width,
        y2:
          (cropperRef.current?.cropper.getCropBoxData().top +
            cropperRef.current?.cropper.getCropBoxData().height) /
          cropperRef.current?.cropper.getContainerData().height,
      };
      setCroppedCoords(coords);
      console.log(
        cropperRef.current?.cropper.getContainerData().height,
        "container height"
      );
      console.log(
        cropperRef.current?.cropper.getContainerData().width,
        "container width"
      );
      console.log(
        cropperRef.current?.cropper.getCropBoxData().height,
        "cropbox height"
      );
      console.log(
        cropperRef.current?.cropper.getCropBoxData().width,
        "cropbox width"
      );
      console.log(cropperRef.current?.cropper.getCropBoxData(), "cropbox data");
      setCropData(cropperRef.current?.cropper.getCroppedCanvas().toDataURL());
    }
    setCropped(true);
  };

  return (
    <>
      {" "}
      {cropped ? (
        <div className="w-screen h-screen bg-black opacity-70 fixed"></div>
      ) : null}
      <div className="flex w-screen h-screen flex-col pt-[2rem] ">
        <h1 className="text-black text-6xl justify-center flex font-semibold p-3 mx-[3rem]">
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
            className="fill-green w-1/4 m-[1rem] "
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
        <div>
          <div className="flex p-1 flex-wrap justify-around w-full">
            <div className="flex items-start">
              <div className="flex flex-col">
                <p className="flex flex-row font-semibold text-lg">
                  Latitude:{" "}
                </p>
                <p className="flex flex-row w-fit font-semibold text-lg">
                  Longtitude:
                </p>
                <p className="flex flex-row w-fit font-semibold text-lg">
                  Date:
                </p>
              </div>
              <div className="flex flex-col w-fit ml-[1rem]">
                <p className="flex flex-row w-fit text-lg"> {latitude}</p>
                <p className="flex flex-row w-fit text-lg"> {longitude}</p>
                <p className="flex flex-row w-fit text-lg"> {date}</p>
              </div>
            </div>
            <div className="flex flex-col mx-[1rem] items-center">
              <p className="text-2xl text-black p-[1rem] ">
                Crop to your area of interest
              </p>
              <div className="flex flex-row  ">
                <Cropper
                  ref={cropperRef}
                  className="w-[400px] h-[400px] mx-5"
                  zoomable={false}
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
              </div>
            </div>
            <div className="flex flex-col w-[8rem]"></div>
          </div>
        </div>

        <div className="flex flex-row w-full justify-between mb-[2rem] mt-[1rem]">
          <button
            onClick={handleBack}
            className=" flex h-fit w-fit flex-row justify-center items-center gap-2 font-medium text-xl text-white bg-green rounded-xl px-[1rem] p-2 ml-[3rem]"
          >
            <FaAngleLeft></FaAngleLeft>
            <p>Back</p>
          </button>

          <button
            onClick={getCropData}
            className=" font-medium items-center justify-center flex flex-row gap-2  text-xl text-white bg-purple rounded-xl px-[1rem] p-2 mx-[2rem]"
          >
            <p>Crop</p>
            <FaCropSimple></FaCropSimple>
          </button>
        </div>

        {cropped ? (
          <div className="h-full w-screen fixed flex justify-center items-center">
            <div className=" fixed bg-white flex justify-center items-center flex-col px-[2rem] mb-[2rem] mx-[1rem]">
              <h3 className="text-xl pt-[2rem]"> Area of Interest</h3>
              <img
                className="w-[25rem] h-[25rem] object-contain m-5"
                src={cropData}
                alt="cropped"
              />
              <div className="flex flex-row justify-between mb-[2rem]">
                <button
                  onClick={toggleModal}
                  className="font-medium justify-center items-center flex flex-row gap-2 text-xl text-white bg-pink rounded-xl px-[2rem] p-2 mx-[2rem]"
                >
                  <p>Redo</p>
                  <FaArrowRotateRight className="rotate-90"></FaArrowRotateRight>
                </button>
                <button
                  onClick={handleConfirm}
                  className=" flex h-fit w-fit justify-center items-center gap-2 flex-row  font-medium text-xl text-white bg-purple rounded-xl px-[1rem] p-2 mx-[2rem]"
                >
                  <p> Confirm</p>
                  <FaCheck></FaCheck>
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default InputCoordinates;
