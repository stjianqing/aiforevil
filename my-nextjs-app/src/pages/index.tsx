import React, { useState, createRef, useEffect } from "react";
// import Cropper, { ReactCropperElement } from "react-cropper";
// import "cropperjs/dist/cropper.css";
import { useRouter } from "next/router";

// const defaultSrc = "/small.jpg";

export const Home: React.FC = () => {
  const router = useRouter();
  function handleFindForest() {
    router.push("/findforest/coordinates");
  }

  function handleForestChange() {
    router.push("/compareforestchange/coordinates");
  }
  return (
    <div className="flex w-screen h-screen flex-col justify-center items-center  ">
      <h1 className="text-[3rem]">ForestFind</h1>
      <p className="w-1/2">
        Whether you're an environmental enthusiast, a conservationist, a
        forestry professional, or just a curious nature lover, ForestFind allows
        you to track and compare forest boundaries over time.
      </p>

      <button
        onClick={handleFindForest}
        className="border border-black w-1/2 text-[1.5rem] h-fit p-3 m-3 rounded-2xl focus:bg-slate-300 hover:bg-slate-300"
      >
        Find Forest
      </button>

      <button
        onClick={handleForestChange}
        className="border border-black w-1/2 text-[1.5rem] h-fit p-3 m-3 rounded-2xl focus:bg-slate-300 hover:bg-slate-300"
      >
        Compare Forest Change
      </button>
    </div>
  );
};

export default Home;

// const [image, setImage] = useState(defaultSrc);
// const [cropData, setCropData] = useState("#");
// const cropperRef = createRef<ReactCropperElement>();
// const [latitude, setLatitude] = useState(0);
// const [longitude, setLongitude] = useState(0);
// const [date, setDate] = useState(0);
// const [cropped, setCropped] = useState(false);
// const [croppedCoords, setCroppedCoords] = useState({
//   x1: 0,
//   y1: 0,
//   x2: 0,
//   y2: 0,
// });

// function handleLatitudeChange(e) {
//   setLatitude(e.target.value);
// }
// function handleLongitudeChange(e) {
//   setLongitude(e.target.value);
// }

// function handleDateChange(e) {
//   setDate(e.target.value);
// }

// //x1,y1 is top right, x2,y2 is bottom left
// function getDistance() {
//   const x1 = croppedCoords.x1;
//   const x2 = croppedCoords.x2;
//   const y1 = croppedCoords.y1;
//   const y2 = croppedCoords.y2;

//   const x_dist_real = (x1 - x2) * 10000;
//   const y_dist_real = (y2 - y1) * 10000;
// }

// useEffect(() => {
//   console.log(croppedCoords);
//   getDistance();
// }, [croppedCoords]);

// const getCropData = () => {
//   if (typeof cropperRef.current?.cropper !== "undefined") {
//     console.log(typeof cropperRef.current?.cropper.getCanvasData());
//     const coords = {
//       x1:
//         (cropperRef.current?.cropper.getCropBoxData().left +
//           cropperRef.current?.cropper.getCropBoxData().width) /
//         cropperRef.current?.cropper.getContainerData().width,
//       y1:
//         cropperRef.current?.cropper.getCropBoxData().top /
//         cropperRef.current?.cropper.getContainerData().height,
//       x2:
//         cropperRef.current?.cropper.getCropBoxData().left /
//         cropperRef.current?.cropper.getContainerData().width,
//       y2:
//         (cropperRef.current?.cropper.getCropBoxData().top +
//           cropperRef.current?.cropper.getCropBoxData().height) /
//         cropperRef.current?.cropper.getContainerData().height,
//     };
//     setCroppedCoords(coords);
//     console.log(
//       cropperRef.current?.cropper.getContainerData().height,
//       "container height"
//     );
//     console.log(
//       cropperRef.current?.cropper.getContainerData().width,
//       "container width"
//     );
//     console.log(
//       cropperRef.current?.cropper.getCropBoxData().height,
//       "cropbox height"
//     );
//     console.log(
//       cropperRef.current?.cropper.getCropBoxData().width,
//       "cropbox width"
//     );
//     console.log(cropperRef.current?.cropper.getCropBoxData(), "cropbox data");
//     setCropData(cropperRef.current?.cropper.getCroppedCanvas().toDataURL());
//   }
//   setCropped(true);
// };
